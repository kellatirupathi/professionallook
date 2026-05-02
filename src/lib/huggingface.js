import { createHFPrompt } from "./reporting";

const HF_BASE_URL = "https://api-inference.huggingface.co/models";

function getHFToken() {
  const token = import.meta.env.VITE_HF_TOKEN;
  if (!token || token === "your_token_here") {
    throw new Error("Missing VITE_HF_TOKEN. Add a Hugging Face read token in .env.");
  }
  return token;
}

function blobToDataUrl(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Failed to read generated image."));
    reader.readAsDataURL(blob);
  });
}

async function callHFInference({ model, prompt, parameters = {} }) {
  const response = await fetch(`${HF_BASE_URL}/${model}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getHFToken()}`,
      "Content-Type": "application/json",
      Accept: "image/png",
      // Block until a cold model finishes loading (instead of returning 503).
      "x-wait-for-model": "true",
      "x-use-cache": "false",
    },
    body: JSON.stringify({
      inputs: prompt,
      parameters: {
        guidance_scale: 7.5,
        num_inference_steps: 25,
        ...parameters,
      },
    }),
  });

  if (!response.ok) {
    let detail = "";
    try {
      const err = await response.json();
      detail = err?.error || err?.message || "";
      if (response.status === 503 && err?.estimated_time) {
        detail = `Model is warming up (~${Math.round(err.estimated_time)}s). Please retry.`;
      }
    } catch {
      try {
        detail = (await response.text()).slice(0, 200);
      } catch {
        detail = "";
      }
    }
    throw new Error(detail || `Hugging Face request failed (${response.status}).`);
  }

  const contentType = response.headers.get("content-type") || "";
  if (!contentType.startsWith("image/")) {
    // Some failures return JSON with 200 — guard against it.
    let payload = "";
    try {
      payload = JSON.stringify(await response.json()).slice(0, 200);
    } catch {
      payload = "";
    }
    throw new Error(`Unexpected response from Hugging Face: ${payload || contentType}`);
  }

  const blob = await response.blob();
  return blobToDataUrl(blob);
}

export async function generateWithHuggingFace({ reportType, analysis, model }) {
  const prompt = createHFPrompt({ reportType, analysis });
  const dataUrl = await callHFInference({
    model,
    prompt,
    parameters: { guidance_scale: 7.5, num_inference_steps: 28 },
  });
  return { imageUrl: dataUrl, revisedPrompt: prompt };
}
