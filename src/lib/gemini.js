import {
  createAnalysisPrompt,
  createEditPrompt,
  createFullPosterPrompt,
} from "./reporting";

const GEMINI_BASE = "https://generativelanguage.googleapis.com/v1beta/models";

const ANALYSIS_MODEL =
  import.meta.env.VITE_GEMINI_ANALYSIS_MODEL || "gemini-2.5-flash";
const IMAGE_MODEL =
  import.meta.env.VITE_GEMINI_IMAGE_MODEL || "gemini-2.5-flash-image";
const CHAT_MODEL =
  import.meta.env.VITE_GEMINI_CHAT_MODEL || ANALYSIS_MODEL;

// Fallback chain — if the primary model 404s (model name changed / regional
// availability), try these in order before giving up.
const IMAGE_MODEL_FALLBACKS = [
  "gemini-2.5-flash-image",
  "gemini-2.5-flash-image-preview",
  "gemini-2.0-flash-exp-image-generation",
];

function getApiKey() {
  const key = import.meta.env.VITE_GEMINI_API_KEY;
  if (!key || key === "your_gemini_key_here") {
    throw new Error(
      "Missing VITE_GEMINI_API_KEY. Get a free key at https://aistudio.google.com/app/apikey and add it to .env.",
    );
  }
  return key;
}

function dataUrlToInlineData(dataUrl) {
  const [header, data] = dataUrl.split(",");
  const mimeMatch = header?.match(/data:([^;]+);/);
  return {
    mimeType: mimeMatch?.[1] || "image/jpeg",
    data,
  };
}

function safeJsonParse(value) {
  try {
    return JSON.parse(value);
  } catch {
    const match = value.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("The Gemini analysis response could not be parsed.");
    return JSON.parse(match[0]);
  }
}

function extractInlineImage(payload) {
  const parts = payload?.candidates?.[0]?.content?.parts ?? [];
  for (const p of parts) {
    const data = p.inline_data ?? p.inlineData;
    if (data?.data) {
      const mime = data.mime_type ?? data.mimeType ?? "image/png";
      return { base64: data.data, mime };
    }
  }
  return null;
}

function extractText(payload) {
  const parts = payload?.candidates?.[0]?.content?.parts ?? [];
  return parts
    .filter((p) => typeof p.text === "string")
    .map((p) => p.text)
    .join("\n")
    .trim();
}

// ── Portrait analysis (vision → strict JSON) ─────────────────────────────
export async function analyzeImageWithGemini({
  imageDataUrl,
  instructions,
  knowledgeText,
}) {
  const inline = dataUrlToInlineData(imageDataUrl);
  const promptText = createAnalysisPrompt({ instructions, knowledgeText });

  const body = {
    contents: [
      {
        role: "user",
        parts: [
          { text: promptText },
          {
            text: "Analyze the uploaded portrait for relevant professional fashion report categories. Return ONLY valid JSON, no prose, no markdown fences.",
          },
          { inline_data: { mime_type: inline.mimeType, data: inline.data } },
        ],
      },
    ],
    generationConfig: {
      temperature: 0.2,
      responseMimeType: "application/json",
    },
  };

  const url = `${GEMINI_BASE}/${ANALYSIS_MODEL}:generateContent?key=${encodeURIComponent(
    getApiKey(),
  )}`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const payload = await response.json();
  if (!response.ok) {
    const message = payload?.error?.message ?? "Gemini analysis request failed.";
    throw new Error(message);
  }

  const text = extractText(payload);
  if (!text) throw new Error("Gemini returned no analysis text.");
  return safeJsonParse(text);
}

// ── Image generation / face-preserving edit ──────────────────────────────
// Gemini 2.5 Flash Image (Nano Banana) natively preserves face identity when
// the source portrait is supplied as inline_data alongside the prompt.
export async function generateImageWithGemini({
  reportType,
  analysis,
  imageDataUrl,
  mode,
}) {
  const promptText =
    mode === "fullposter"
      ? createFullPosterPrompt({ reportType, analysis })
      : createEditPrompt({ reportType, analysis });

  const parts = [{ text: promptText }];
  if (imageDataUrl) {
    const inline = dataUrlToInlineData(imageDataUrl);
    parts.push({
      inline_data: { mime_type: inline.mimeType, data: inline.data },
    });
  }

  const body = {
    contents: [{ role: "user", parts }],
    generationConfig: {
      responseModalities: ["TEXT", "IMAGE"],
    },
  };

  // Try the configured model first, then fall back if the name 404s.
  const tried = new Set();
  const candidates = [IMAGE_MODEL, ...IMAGE_MODEL_FALLBACKS].filter((m) => {
    if (!m || tried.has(m)) return false;
    tried.add(m);
    return true;
  });

  let lastError;
  for (const model of candidates) {
    const url = `${GEMINI_BASE}/${model}:generateContent?key=${encodeURIComponent(
      getApiKey(),
    )}`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const payload = await response.json();

    if (!response.ok) {
      const message = payload?.error?.message ?? "Gemini image request failed.";
      // Only fall through to the next candidate on "model not found" errors.
      if (response.status === 404 || /not found|not supported/i.test(message)) {
        lastError = new Error(`${model}: ${message}`);
        continue;
      }
      throw new Error(message);
    }

    const blocked = payload?.promptFeedback?.blockReason;
    if (blocked) {
      throw new Error(`Gemini blocked the prompt: ${blocked}`);
    }

    const img = extractInlineImage(payload);
    if (!img) {
      const text = extractText(payload);
      throw new Error(
        text
          ? `Gemini returned text instead of an image: ${text.slice(0, 160)}`
          : "Gemini returned no image data.",
      );
    }

    return {
      imageUrl: `data:${img.mime};base64,${img.base64}`,
      revisedPrompt: "",
    };
  }

  throw lastError ?? new Error("No Gemini image model available.");
}

// ── Streaming chat ────────────────────────────────────────────────────────
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

export async function chatStreamWithGemini({ userMessage, history = [], onChunk }) {
  const recentHistory = history
    .filter((m) => m && typeof m.content === "string" && m.content.trim() && !m.type)
    .slice(-10)
    .map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

  const body = {
    systemInstruction: { parts: [{ text: CHAT_SYSTEM_PROMPT }] },
    contents: [
      ...recentHistory,
      { role: "user", parts: [{ text: userMessage }] },
    ],
  };

  const url = `${GEMINI_BASE}/${CHAT_MODEL}:streamGenerateContent?alt=sse&key=${encodeURIComponent(
    getApiKey(),
  )}`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err?.error?.message ?? `Gemini chat failed (${response.status})`);
  }
  if (!response.body) {
    throw new Error("Gemini streaming response body unavailable.");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let full = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    const events = buffer.split("\n\n");
    buffer = events.pop() ?? "";

    for (const evt of events) {
      const dataLine = evt.split("\n").find((l) => l.startsWith("data:"));
      if (!dataLine) continue;
      const data = dataLine.slice(5).trim();
      if (!data || data === "[DONE]") continue;
      try {
        const parsed = JSON.parse(data);
        const delta = (parsed?.candidates?.[0]?.content?.parts ?? [])
          .map((p) => p.text)
          .filter((t) => typeof t === "string")
          .join("");
        if (delta) {
          full += delta;
          onChunk?.(delta);
        }
      } catch {
        // ignore non-JSON keepalives
      }
    }
  }

  return full;
}
