export const REPORT_GROUPS = {
  withBeard: [
    "Hair Guide",
    "Spectacles Guide",
    "Face Shape Guide",
    "Beard Guide",
    "Colour Analysis",
    "Dress Guide",
    "Accessories Guide",
    "Footwear Guide",
  ],
  withoutBeard: [
    "Hair Guide",
    "Spectacles Guide",
    "Face Shape Guide",
    "Colour Analysis",
    "Dress Guide",
    "Accessories Guide",
    "Footwear Guide",
  ],
};

const REPORT_TERMS = {
  "Hair Guide": ["hair", "hairstyle", "grooming", "headshot"],
  "Spectacles Guide": ["spectacles", "eyewear", "glasses", "face_shape"],
  "Face Shape Guide": ["face_shape", "face", "headshot"],
  "Beard Guide": ["beard", "facial_hair", "grooming"],
  "Colour Analysis": ["color", "colour", "palette", "skin", "headshot"],
  "Dress Guide": ["workwear", "shirt", "trouser", "kurti", "saree", "body_shape", "tailoring", "fit"],
  "Accessories Guide": ["accessories", "bag", "watch", "earring", "necklace"],
  "Footwear Guide": ["footwear", "shoes", "loafer", "heel"],
};

export function getReportPool(beardApplicable) {
  return beardApplicable ? REPORT_GROUPS.withBeard : REPORT_GROUPS.withoutBeard;
}

export function normalizeRelevantReports(relevantReports, beardApplicable) {
  const allowed = getReportPool(beardApplicable);
  const picked = Array.isArray(relevantReports)
    ? relevantReports.filter((item) => allowed.includes(item))
    : [];

  return picked.length ? picked : allowed;
}

function searchKnowledge(node, searchTerms, path = [], matches = []) {
  if (matches.length >= 8 || node === null || node === undefined) {
    return matches;
  }

  if (Array.isArray(node)) {
    node.forEach((item, index) => searchKnowledge(item, searchTerms, [...path, index], matches));
    return matches;
  }

  if (typeof node !== "object") {
    return matches;
  }

  for (const [key, value] of Object.entries(node)) {
    const normalizedKey = key.toLowerCase();
    if (searchTerms.some((term) => normalizedKey.includes(term))) {
      matches.push({ path: [...path, key].join("."), value });
      if (matches.length >= 8) {
        return matches;
      }
    }
    searchKnowledge(value, searchTerms, [...path, key], matches);
    if (matches.length >= 8) {
      return matches;
    }
  }

  return matches;
}

export function buildKnowledgeContext({ knowledge, reportType, presentation }) {
  if (!knowledge || typeof knowledge !== "object") {
    return "";
  }

  const presentationSection =
    presentation === "male-presenting"
      ? knowledge.men
      : presentation === "female-presenting"
        ? knowledge.women
        : null;

  const baseContext = {
    language_safety_rules: knowledge.language_safety_rules,
    headshot_photo_guidance: knowledge.headshot_photo_guidance,
    posture_body_language: knowledge.posture_body_language,
    instructor_specific_contexts: knowledge.instructor_specific_contexts,
  };

  const reportTerms = REPORT_TERMS[reportType] ?? [];
  const presentationMatches = presentationSection
    ? searchKnowledge(presentationSection, reportTerms)
    : [];
  const sharedMatches = searchKnowledge(knowledge, reportTerms)
    .filter((item) => !item.path.startsWith("women.") && !item.path.startsWith("men."))
    .slice(0, 6);

  return JSON.stringify(
    {
      baseContext,
      presentation,
      reportType,
      presentationMatches,
      sharedMatches,
    },
    null,
    2,
  );
}

export function createAnalysisPrompt({ instructions, knowledgeText }) {
  return `
Read the instruction markdown and knowledge base before analyzing.

INSTRUCTIONS MARKDOWN:
${instructions}

KNOWLEDGE BASE JSON:
${knowledgeText}

Return valid JSON only with this shape:
{
  "imageQuality": "clear" | "unclear",
  "qualityReason": "string",
  "presentation": "male-presenting" | "female-presenting" | "uncertain",
  "beardApplicable": true | false,
  "visibleFeatures": ["string"],
  "relevantReports": ["Hair Guide", "Spectacles Guide", "Face Shape Guide", "Beard Guide", "Colour Analysis", "Dress Guide", "Accessories Guide", "Footwear Guide"],
  "styleFocus": "string",
  "generationGuardrails": ["string"]
}

Rules:
- Show only relevant reports.
- Never include Beard Guide when beard is not applicable.
- If the image is unclear, set imageQuality to "unclear" and explain why.
- Base relevance on visible features only.
- Do not include markdown fences.
`.trim();
}

// Hard caps to keep total prompt well under gpt-image-1's 32_000-char limit.
const MAX_INSTRUCTIONS_CHARS = 12000;
const MAX_KNOWLEDGE_CHARS = 12000;

export function createGenerationPrompt({
  instructions,
  knowledgeContext,
  reportType,
  analysis,
}) {
  const safeInstructions =
    typeof instructions === "string" && instructions.length > MAX_INSTRUCTIONS_CHARS
      ? instructions.slice(0, MAX_INSTRUCTIONS_CHARS)
      : instructions ?? "";

  const safeKnowledge =
    typeof knowledgeContext === "string" && knowledgeContext.length > MAX_KNOWLEDGE_CHARS
      ? knowledgeContext.slice(0, MAX_KNOWLEDGE_CHARS)
      : knowledgeContext ?? "";

  return `
Read the full instructions first. Then apply the extracted knowledge base context as primary styling guidance.

FULL INSTRUCTIONS:
${safeInstructions}

RELEVANT KNOWLEDGE CONTEXT:
${safeKnowledge}

SELECTED REPORT:
${reportType}

IMAGE ANALYSIS:
${JSON.stringify(analysis, null, 2)}

Generate one premium professional editorial fashion report image for "${reportType}" only.

Hard requirements:
- One selected report only. Never combine multiple report categories.
- Reuse the same uploaded face and keep identity realistic.
- The subject must remain the same person.
- The image must be visual-first, clean, minimal, premium, and workplace-professional.
- Use direct on-person styling examples, recommended looks, avoid looks, and comparison cues.
- Use minimal labels only when essential.
- Respect all forbidden clothing and grooming items from the instruction file.
- Never recommend skirts, dresses, jeans, leggings, or leg-exposing outfits except inside an avoid comparison.
- Keep the composition as a single-category fashion report, not a collage of different reports.
- Emphasize credibility, refinement, authority, and structured styling.
- Preserve professional realism suitable for academic, consultant, and executive presentation.
`.trim();
}

// Compact prompt for Hugging Face diffusion models (SDXL / SD-1.5 / FLUX).
// HF models perform best with concise descriptive prompts under ~500 chars.
export function createHFPrompt({ reportType, analysis }) {
  const features = Array.isArray(analysis?.visibleFeatures)
    ? analysis.visibleFeatures.slice(0, 5).join(", ")
    : "";
  const presentation = analysis?.presentation ?? "professional person";
  const styleFocus = analysis?.styleFocus ?? "premium professional appearance";

  return `Professional editorial fashion portrait, "${reportType}" guide, ${presentation}, ${features}.
Premium business attire: collared shirt, tailored trousers, structured jacket, refined accessories, polished closed-toe footwear.
${styleFocus}.
Clean studio lighting, sharp focus, magazine-quality, portrait orientation.
Negative: jeans, leggings, distressed denim, neon colours, oversized sunglasses, skirts, dresses, sandals, casual graphic tees.`;
}

// ── Per-category edit instructions ─────────────────────────────────────────
// These tell gpt-image-1's /edits endpoint how to restyle the portrait
// without changing the person's identity.
const EDIT_INSTRUCTIONS = {
  "Hair Guide":
    "Show the SAME PERSON with a clean, structured professional men's hairstyle: low/mid taper sides, natural volume on top (2-4 inches), kept off the forehead. Studio headshot, clean neutral background.",
  "Spectacles Guide":
    "Add tasteful professional rectangular or wayfarer spectacles in dark/tortoise frames to the SAME PERSON. Keep face, expression and skin tone unchanged. Studio headshot.",
  "Face Shape Guide":
    "Editorial studio portrait of the SAME PERSON, neutral expression, clean background, soft front lighting. Show clearly defined face structure. Do not alter facial features.",
  "Beard Guide":
    "Show the SAME PERSON with a well-groomed defined-light beard, clean neckline two fingers above Adam's apple, even length (3-5 mm stubble). Studio headshot.",
  "Colour Analysis":
    "Studio portrait of the SAME PERSON wearing a deep-jewel-tone shirt (navy, burgundy or deep green) that flatters their skin tone. Clean neutral background, soft lighting. Identity must be preserved.",
  "Dress Guide":
    "Show the SAME PERSON in premium tailored business attire: navy or charcoal blazer, crisp white or light-blue shirt, dark tie, sharp shoulders, structured fit. Editorial studio shot.",
  "Accessories Guide":
    "Show the SAME PERSON in formal attire wearing a classic metal-strap watch, subtle pocket square and leather belt. Refined, minimal accessories. Editorial studio shot.",
  "Footwear Guide":
    "Editorial composition of the SAME PERSON in a tailored business suit, full-length or three-quarter shot, with polished black or dark-brown oxford or derby shoes clearly visible.",
};

export function createEditPrompt({ reportType, analysis }) {
  const instruction = EDIT_INSTRUCTIONS[reportType] ?? EDIT_INSTRUCTIONS["Dress Guide"];
  const presentation = analysis?.presentation ?? "professional adult";

  return `Edit this portrait to produce a premium editorial professional headshot for a "${reportType}".

CRITICAL — IDENTITY PRESERVATION:
- The face, eyes, nose, mouth, jawline, skin tone and hair colour of the person in the source image MUST be preserved exactly.
- Do not change their age, gender or ethnicity.
- The result must be unmistakably the same person.

EDIT INSTRUCTION:
${instruction}

STYLE:
- High-end editorial photography, clean studio lighting, neutral background.
- Premium, workplace-professional, refined.
- Subject: ${presentation}.

STRICTLY AVOID:
- Cartoon, illustrated, painterly or stylised looks.
- Different person, distorted features, age changes.
- Casual jeans, t-shirts, sandals, neon colours, oversized sunglasses.`;
}

// Compact prompt for dall-e-3 (4_000-char hard limit).
export function createDalle3Prompt({ reportType, analysis }) {
  const features = Array.isArray(analysis?.visibleFeatures)
    ? analysis.visibleFeatures.join(", ")
    : "";
  const presentation = analysis?.presentation ?? "professional person";
  const styleFocus = analysis?.styleFocus ?? "premium professional appearance";

  const prompt = `Premium editorial fashion report image: "${reportType}" guide.
Subject: ${presentation}. Visible: ${features}.
Style focus: ${styleFocus}.
Single-category visual report (not a collage). Clean, minimal, workplace-professional editorial styling.
Show on-person recommended looks for ${reportType.toLowerCase()} only — collared shirts, tailored trousers, structured jackets, refined accessories, polished footwear as appropriate.
Strictly avoid: jeans, leggings, distressed denim, graphic tees, neon colours, oversized sunglasses, flashy chains, skirts, dresses, sandals.
High-end editorial photography quality. Portrait orientation. Realistic, identity-preserving, business-credible.`;

  return prompt.length > 3900 ? prompt.slice(0, 3900) : prompt;
}
