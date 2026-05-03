import {
  createAnalysisPrompt,
  createDalle3Prompt,
  createEditPrompt,
  createFullPosterPrompt,
} from "./reporting";
import { generateWithHuggingFace } from "./huggingface";
import {
  analyzeImageWithGemini,
  generateImageWithGemini,
  chatStreamWithGemini,
} from "./gemini";

const OPENAI_BASE_URL = "https://api.openai.com/v1";

// ── Provider + models from .env (with safe defaults) ───────────────────────
// VITE_IMAGE_PROVIDER:    "gemini" | "openai" | "huggingface"
// VITE_ANALYSIS_PROVIDER: "gemini" | "openai"   (default: gemini)
// VITE_CHAT_PROVIDER:     "gemini" | "openai"   (default: gemini)
const IMAGE_PROVIDER = (import.meta.env.VITE_IMAGE_PROVIDER || "gemini")
  .toLowerCase()
  .trim();
const ANALYSIS_PROVIDER = (import.meta.env.VITE_ANALYSIS_PROVIDER || "gemini")
  .toLowerCase()
  .trim();
const CHAT_PROVIDER = (import.meta.env.VITE_CHAT_PROVIDER || "gemini")
  .toLowerCase()
  .trim();
// "fullposter" → AI generates the entire editorial poster in one call (faces +
// thumbnails + text + footer). "composite" → AI generates only the hero face,
// html2canvas wraps it in a designed template.
export const GENERATION_MODE = (import.meta.env.VITE_GENERATION_MODE || "fullposter")
  .toLowerCase()
  .trim();
const ANALYSIS_MODEL = import.meta.env.VITE_OPENAI_ANALYSIS_MODEL || "gpt-4.1-mini";
const OPENAI_IMAGE_MODEL =
  import.meta.env.VITE_OPENAI_IMAGE_MODEL ||
  import.meta.env.VITE_OPENAI_IMAGE_FALLBACK_MODEL ||
  "gpt-image-1-mini";
const HF_MODEL =
  import.meta.env.VITE_HF_MODEL ||
  import.meta.env.VITE_HF_PRIMARY_MODEL ||
  "stabilityai/stable-diffusion-xl-base-1.0";

function getApiKey() {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  if (!apiKey || apiKey === "your_key_here") {
    throw new Error("Missing VITE_OPENAI_API_KEY. Add a valid OpenAI API key in .env.");
  }
  return apiKey;
}

function extractOutputText(payload) {
  if (typeof payload.output_text === "string" && payload.output_text.trim()) {
    return payload.output_text.trim();
  }
  if (!Array.isArray(payload.output)) return "";
  return payload.output
    .flatMap((item) => item.content ?? [])
    .filter((item) => item.type === "output_text" && item.text)
    .map((item) => item.text)
    .join("\n")
    .trim();
}

function safeJsonParse(value) {
  try {
    return JSON.parse(value);
  } catch {
    const match = value.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("The analysis response could not be parsed.");
    return JSON.parse(match[0]);
  }
}

async function requestJson(endpoint, body) {
  const response = await fetch(`${OPENAI_BASE_URL}${endpoint}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getApiKey()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const payload = await response.json();
  if (!response.ok) {
    const message = payload?.error?.message ?? "OpenAI request failed.";
    throw new Error(message);
  }
  return payload;
}

export async function analyzeImage({ imageDataUrl, instructions, knowledgeText }) {
  if (ANALYSIS_PROVIDER === "gemini") {
    return analyzeImageWithGemini({ imageDataUrl, instructions, knowledgeText });
  }
  const payload = await requestJson("/responses", {
    model: ANALYSIS_MODEL,
    input: [
      {
        role: "system",
        content: [
          { type: "input_text", text: createAnalysisPrompt({ instructions, knowledgeText }) },
        ],
      },
      {
        role: "user",
        content: [
          {
            type: "input_text",
            text: "Analyze the uploaded portrait for relevant professional fashion report categories.",
          },
          { type: "input_image", image_url: imageDataUrl, detail: "high" },
        ],
      },
    ],
  });
  return safeJsonParse(extractOutputText(payload));
}

// ── OpenAI text-to-image (no source image) ────────────────────────────────
// Used as fallback when no portrait is supplied.
async function generateWithOpenAI({ reportType, analysis }) {
  const isGptImage = OPENAI_IMAGE_MODEL.startsWith("gpt-image");

  const body = {
    model: OPENAI_IMAGE_MODEL,
    prompt: createDalle3Prompt({ reportType, analysis }),
    n: 1,
    size: isGptImage ? "1024x1536" : "1024x1792",
  };

  if (isGptImage) {
    body.quality = "medium";
  } else {
    body.quality = "standard";
    body.response_format = "b64_json";
  }

  const payload = await requestJson("/images/generations", body);
  const imageBase64 = payload?.data?.[0]?.b64_json;
  if (!imageBase64) {
    throw new Error(`No image data returned from ${OPENAI_IMAGE_MODEL}.`);
  }
  return {
    imageUrl: `data:image/png;base64,${imageBase64}`,
    revisedPrompt: payload?.data?.[0]?.revised_prompt ?? "",
  };
}

// ── OpenAI image edit (FACE-PRESERVING) ───────────────────────────────────
// Sends the user's uploaded portrait as the source and edits it per report.
// This is what keeps the same face across all 8 categories.
async function dataUrlToBlob(dataUrl) {
  const res = await fetch(dataUrl);
  return await res.blob();
}

async function generateWithOpenAIEdit({ reportType, analysis, imageDataUrl }) {
  if (!imageDataUrl) {
    throw new Error("No portrait supplied for face-preserving edit.");
  }

  const blob = await dataUrlToBlob(imageDataUrl);
  // The /edits endpoint requires a PNG. The user upload may be JPEG/WebP,
  // so we pass it with a .png filename — the API treats input as raster.
  const file = new File([blob], "portrait.png", { type: "image/png" });

  const prompt =
    GENERATION_MODE === "fullposter"
      ? createFullPosterPrompt({ reportType, analysis })
      : createEditPrompt({ reportType, analysis });

  const form = new FormData();
  form.append("model", OPENAI_IMAGE_MODEL);
  form.append("image", file);
  form.append("prompt", prompt);
  form.append("n", "1");
  form.append("size", "1536x1024");
  form.append("quality", "high");

  const response = await fetch(`${OPENAI_BASE_URL}/images/edits`, {
    method: "POST",
    headers: { Authorization: `Bearer ${getApiKey()}` },
    body: form,
  });

  const payload = await response.json();
  if (!response.ok) {
    const message = payload?.error?.message ?? "OpenAI edit request failed.";
    throw new Error(message);
  }

  const imageBase64 = payload?.data?.[0]?.b64_json;
  if (!imageBase64) {
    throw new Error(`No image data returned from ${OPENAI_IMAGE_MODEL} (edit).`);
  }
  return {
    imageUrl: `data:image/png;base64,${imageBase64}`,
    revisedPrompt: payload?.data?.[0]?.revised_prompt ?? "",
  };
}

// ── Free-text chat with token streaming (Responses API + SSE) ──
const CHAT_SYSTEM_PROMPT = `You are a professional fashion and styling assistant inside a portrait-analysis app.

You help users with: face shape, hairstyle, colour analysis, body shape, professional dress codes, accessories, footwear, and ethnic / Western styling for academic, executive, and consultant settings.

The app's main feature: users upload a portrait via the + button, then receive personalised report images (Hair Guide, Spectacles Guide, Face Shape Guide, Beard Guide, Colour Analysis, Dress Guide, Accessories Guide, Footwear Guide). Each selected report is generated as a separate styled image.

Style rules you must follow:
- Recommend collared shirts, tailored trousers, structured jackets, refined accessories, polished closed-toe footwear.
- For ethnic wear: solid kurtis with pants, cotton or linen sarees in muted palettes.
- Hair: clean centre or slight side part, fully tucked-back open hair, OR low bun / tied ponytail.
- Avoid jeans, leggings, distressed denim, graphic tees, neon colours, oversized sunglasses, flashy chains, sandals, skirts and dresses.

Tone: concise (2-5 sentences), professional, helpful, friendly. Use line breaks between thoughts. Never use markdown headers, bullet bullets are fine sparingly.

If a question genuinely needs the user's portrait (e.g. "what colour suits me?", "what hairstyle for my face?"), warmly suggest uploading one with the + button.`;

export async function chatStream({ userMessage, history = [], onChunk }) {
  if (CHAT_PROVIDER === "gemini") {
    return chatStreamWithGemini({ userMessage, history, onChunk });
  }
  const recentHistory = history
    .filter((m) => m && typeof m.content === "string" && m.content.trim() && !m.type)
    .slice(-10)
    .map((m) => {
      const isAssistant = m.role === "assistant";
      return {
        role: isAssistant ? "assistant" : "user",
        content: [
          {
            // Responses API: assistant turns use output_text, user turns use input_text.
            type: isAssistant ? "output_text" : "input_text",
            text: m.content,
          },
        ],
      };
    });

  const response = await fetch(`${OPENAI_BASE_URL}/responses`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getApiKey()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: ANALYSIS_MODEL,
      stream: true,
      input: [
        { role: "system", content: [{ type: "input_text", text: CHAT_SYSTEM_PROMPT }] },
        ...recentHistory,
        { role: "user", content: [{ type: "input_text", text: userMessage }] },
      ],
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err?.error?.message ?? `Chat request failed (${response.status})`);
  }
  if (!response.body) {
    throw new Error("Streaming response body unavailable.");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let full = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    // SSE events are separated by a blank line.
    const events = buffer.split("\n\n");
    buffer = events.pop() ?? "";

    for (const evt of events) {
      const dataLine = evt.split("\n").find((l) => l.startsWith("data:"));
      if (!dataLine) continue;
      const data = dataLine.slice(5).trim();
      if (!data || data === "[DONE]") continue;
      try {
        const parsed = JSON.parse(data);
        if (parsed?.type === "response.output_text.delta" && typeof parsed.delta === "string") {
          full += parsed.delta;
          onChunk?.(parsed.delta);
        }
      } catch {
        // ignore keepalives / non-JSON frames
      }
    }
  }

  return full;
}

// Single provider chosen by VITE_IMAGE_PROVIDER in .env.
// Switch providers by editing .env only — no code change.
//
// When `imageDataUrl` is supplied AND provider=openai, uses the /edits
// endpoint with the user's portrait → same face across all categories.
export async function generateReportImage({ reportType, analysis, imageDataUrl }) {
  if (IMAGE_PROVIDER === "gemini") {
    try {
      const result = await generateImageWithGemini({
        reportType,
        analysis,
        imageDataUrl,
        mode: GENERATION_MODE,
      });
      return { ...result, provider: "gemini" };
    } catch (err) {
      throw new Error(`Gemini image generation failed: ${err.message}`);
    }
  }

  if (IMAGE_PROVIDER === "huggingface" || IMAGE_PROVIDER === "hf") {
    try {
      const result = await generateWithHuggingFace({
        reportType,
        analysis,
        model: HF_MODEL,
      });
      return { ...result, provider: `huggingface:${HF_MODEL}` };
    } catch (err) {
      throw new Error(`HuggingFace (${HF_MODEL}) failed: ${err.message}`);
    }
  }

  // OpenAI — prefer /edits (face-preserving) when a portrait is supplied.
  if (imageDataUrl) {
    try {
      const result = await generateWithOpenAIEdit({
        reportType,
        analysis,
        imageDataUrl,
      });
      return { ...result, provider: `openai-edit:${OPENAI_IMAGE_MODEL}` };
    } catch (err) {
      // Fallback to text-to-image if /edits fails (rare).
      console.warn("[generateReportImage] /edits failed, falling back:", err.message);
    }
  }

  try {
    const result = await generateWithOpenAI({ reportType, analysis });
    return { ...result, provider: `openai:${OPENAI_IMAGE_MODEL}` };
  } catch (err) {
    throw new Error(`OpenAI (${OPENAI_IMAGE_MODEL}) failed: ${err.message}`);
  }
}
