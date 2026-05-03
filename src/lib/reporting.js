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

  // Aggressive identity preservation — repeat the constraint multiple times so
  // it dominates over the styling instruction.
  return `IDENTITY-LOCK PORTRAIT EDIT.

The source image shows a specific real person. Your job is to keep this exact person and only change the styling described below.

ABSOLUTE RULES — DO NOT VIOLATE:
1. The face must be the SAME PERSON. Same eyes, same eye colour, same eyebrow shape, same nose, same lips, same chin, same jawline, same cheekbones, same ears.
2. Skin tone, skin texture and skin undertone must match the source EXACTLY.
3. Age must match the source. Do not make them younger or older.
4. Ethnicity must match the source. Do not change facial features toward a different ethnicity.
5. Gender presentation must match the source.
6. Natural hair colour must match the source unless explicitly told otherwise.
7. Make MINIMAL changes to the face. Treat the face as a fixed reference — only the styling around it changes.

WHAT TO CHANGE (and ONLY this):
${instruction}

OUTPUT STYLE:
- Photographic, real, editorial studio quality.
- Clean studio lighting, neutral grey or off-white background.
- Sharp focus on the face. Premium magazine headshot.
- Subject: ${presentation}.

WHAT NOT TO DO:
- Do NOT generate a different person.
- Do NOT smooth, slim, alter, beautify or "improve" the face.
- Do NOT change the eye shape, eye spacing, nose width or jaw width.
- Do NOT shift skin tone lighter or darker.
- No cartoon, anime, painted or stylised rendering.
- No oversized sunglasses, casual jeans, t-shirts, sandals, neon colours.

Verify the result: a person who knows the source-image subject must immediately recognise them in the output.`;
}

// ── Full poster prompts (single-call mode) ────────────────────────────────
// Used when VITE_GENERATION_MODE=fullposter. Asks gpt-image-1 to render the
// ENTIRE editorial poster (hero + recommended thumbnails + tips + avoid +
// footer) as one image. Likely produces some text/layout artifacts — quality
// is inherently less reliable than the composite mode.
const FULL_POSTER_PROMPTS = {
  "Hair Guide": `Create a premium editorial magazine poster (landscape, 3:2). Layout:
TOP BAR (dark navy blue): large gold text "1. HAIR GUIDE", smaller white subtitle "Clean • Structured • Professional".
LEFT HALF: hero studio headshot of THIS PERSON from the source image. Suit, tie, neutral background.
RIGHT TOP: green check badge + green text "RECOMMENDED STYLES". Below, 3 small square photo cards in a row, each with THIS SAME PERSON's face restyled with a different professional hairstyle, captioned: "Classic Side Part", "Textured Quiff", "Brush Back".
RIGHT MIDDLE: beige cream rounded box "HAIR TIPS" with 5 bullet points: "Keep sides clean with low/mid taper", "Maintain natural volume on top", "Use matte styling product", "Avoid excessive height", "Keep hair off forehead slightly".
RIGHT BOTTOM: red X badge + red text "AVOID". Below, 3 small square photo cards of THIS SAME PERSON with bad hairstyles, captioned: "Messy & Puffy", "Flat & Lifeless", "Overly Spiked".
BOTTOM BAR (dark navy): "BEST HAIR LENGTH ON TOP: 2-4 INCHES   ·   SIDES: TAPERED (0.5-1.5)" in white.
CRITICAL: All 7 face photos must be UNMISTAKABLY THE SAME PERSON from the source image. Same skin tone, eyes, nose, jaw, age, ethnicity. Premium editorial photography style.`,

  "Spectacles Guide": `Create a premium editorial magazine poster (landscape, 3:2). Layout:
TOP BAR (dark navy blue): gold "2. SPECTACLES GUIDE", white subtitle "Smart Frames. Strong Impression."
LEFT HALF: hero studio headshot of THIS PERSON wearing professional rectangular dark frame glasses. Suit, tie.
RIGHT TOP: green check + "RECOMMENDED FRAMES". 3 product photo cards of black-framed glasses: "Rectangular", "Wayfarer", "Slightly Rounded Rectangle".
RIGHT MIDDLE: beige box "FRAME TIPS" with bullets: "Medium-size frames suit your face best", "Dark colors add definition", "Avoid overly round or tiny frames", "Keep frame width proportional to face".
RIGHT BOTTOM: red X + "AVOID". 3 product photo cards: "Round Frames", "Small Frames", "Oversized Frames".
BOTTOM BAR (dark navy): "BEST COLORS: Black | Gunmetal | Dark Brown | Tortoise" in white.
CRITICAL: hero face MUST be the same person from the source image. Premium editorial photography.`,

  "Face Shape Guide": `Create a premium editorial magazine poster (landscape, 3:2). Layout:
TOP BAR (dark navy blue): gold "3. FACE SHAPE GUIDE", white subtitle "Defined • Balanced • Strong".
LEFT HALF: hero studio headshot of THIS PERSON with subtle dashed white triangle overlay outlining the inverted-triangle face shape (wider at top, narrow at jaw).
RIGHT TOP: bold heading "YOUR FACE SHAPE — INVERTED TRIANGLE" + bullet traits: "Wider forehead & temples", "Tapered jawline", "Sharp & defined features". Small face-outline diagram beside.
RIGHT MIDDLE: two columns — "✓ WHAT WORKS BEST" (green) with: "Slight volume on top", "Sides tidy", "Angular frames", "Well-groomed beard", "Structured collars" — and "❌ AVOID" (red) with: "Heavy straight fringe", "Excessive height on top", "Round frames", "Patchy beard".
BOTTOM BAR (dark navy): "YOUR STRENGTHS: Strong Jawline · Defined Cheekbones · Sharp Features · Natural Masculinity".
CRITICAL: hero face MUST be the same person from the source image.`,

  "Beard Guide": `Create a premium editorial magazine poster (landscape, 3:2). Layout:
TOP BAR (dark navy blue): gold "4. BEARD GUIDE", white subtitle "Well-Groomed. Defined. Professional."
LEFT HALF: hero studio headshot of THIS PERSON with a clean defined beard. Suit, tie.
RIGHT TOP: green check + "RECOMMENDED STYLES". 3 photo cards of THIS SAME PERSON with different beard styles: "Short Boxed (Beardstache)", "Medium Stubble (3-5mm)", "Defined Light Beard".
RIGHT MIDDLE: beige box "BEARD TIPS" with bullets: "Keep beard lines clean and connected", "Maintain even length", "Neckline: 2 fingers above Adam's apple", "Cheek line: natural, don't overline".
RIGHT BOTTOM: red X + "AVOID". 3 photo cards of THIS SAME PERSON with bad beards: "Patchy Beard", "Overgrown Beard", "Undefined Neckline".
BOTTOM BAR (dark navy): "BEARD MAINTENANCE: Trim every 7-10 days · Use beard oil daily".
CRITICAL: All 7 face photos must be the same person from the source image. Editorial photography.`,

  "Colour Analysis": `Create a premium editorial magazine poster (landscape, 3:2). Layout:
TOP BAR (burgundy red): gold "5. COLOUR ANALYSIS", white subtitle "Deep • Rich • Balanced".
LEFT HALF: hero studio headshot of THIS PERSON in a deep navy or burgundy shirt that flatters their skin tone.
RIGHT TOP: heading "YOUR SEASON: DEEP WINTER", subtitle "You look best in deep, rich, cool tones."
RIGHT MIDDLE: heading "BEST COLOURS FOR YOU" — grid of 12 color swatch circles in deep tones: navy, black, charcoal, deep green, burgundy, royal blue, deep purple, etc. Below: "NEUTRALS" — row of 8 neutral swatches.
RIGHT BOTTOM: two columns — green "✓ WEAR" listing "Navy, Black, Charcoal, Deep Green, Burgundy, Royal Blue, White, Cool Gray" and red "❌ AVOID" listing "Mustard, Beige, Camel, Bright pastels, Neon, Warm orange, Faded tones".
BOTTOM BAR (burgundy): "HIGH CONTRAST LOOKS BEST ON YOU. KEEP IT DEEP, SHARP & SOPHISTICATED."
CRITICAL: hero face MUST be the same person from the source.`,

  "Dress Guide": `Create a premium editorial magazine poster (landscape, 3:2). Layout:
TOP BAR (dark navy blue): gold "6. DRESS GUIDE", white subtitle "Sharp • Tailored • Timeless".
LEFT HALF: hero studio full-bust shot of THIS PERSON in a navy suit, white shirt, navy tie.
RIGHT TOP: "WORKWEAR ESSENTIALS" — 5 photo cards of THIS SAME PERSON in different professional outfits: "Navy Suit · White Shirt · Navy Tie", "Charcoal Suit · Light Blue Shirt", "White Shirt · Navy Trousers (No Tie)", "Light Blue Shirt · Grey Trousers", "Black Shirt · Charcoal Trousers".
RIGHT MIDDLE: beige box "DRESS TIPS" with bullets: "Fit is everything", "Keep it tailored", "Solid or subtle patterns only", "Tuck in your shirt", "Ironed and neat".
RIGHT BOTTOM: red X + "AVOID". 4 photo cards of THIS SAME PERSON in bad outfits: "Tight Fit", "Loud Prints", "Wrinkled Shirt", "T-Shirt".
BOTTOM BAR (dark navy): "TAILORED FIT + SOLID COLOURS = CONFIDENCE & AUTHORITY".
CRITICAL: All face photos must be the same person from the source image.`,

  "Accessories Guide": `Create a premium editorial magazine poster (landscape, 3:2). Layout:
TOP BAR (dark navy blue): gold "7. ACCESSORIES GUIDE", white subtitle "Minimal. Refined. Purposeful."
LEFT HALF: hero shot of THIS PERSON in a tailored navy suit, wearing a classic metal-strap watch and subtle pocket square.
RIGHT TOP: green check + "RECOMMENDED" — 4 product photo cards: "Classic Watch (metal/leather)", "Pocket Square (subtle navy)", "Tie Bar (silver)", "Leather Belt (black/brown)".
RIGHT MIDDLE: "OTHER GOOD ADDITIONS" — 3 product cards: "Cufflinks (simple)", "Leather Card Holder (thin)", "Pen (metal)".
RIGHT BOTTOM: red X + "AVOID" — 4 product cards: "Chains", "Bracelets", "Flashy Rings", "Oversized Watch".
BOTTOM BAR (dark navy): "LESS IS MORE. QUALITY SPEAKS LOUDER THAN QUANTITY."
CRITICAL: hero face must be the same person from the source.`,

  "Footwear Guide": `Create a premium editorial magazine poster (landscape, 3:2). Layout:
TOP BAR (dark navy blue): gold "8. FOOTWEAR GUIDE", white subtitle "Polished Shoes. Powerful Presence."
LEFT HALF: hero shot of THIS PERSON in tailored business attire, full-length or three-quarter, polished black oxford shoes visible.
RIGHT TOP: green check + "RECOMMENDED" — 4 product photo cards of dress shoes: "Oxford (Black)", "Derby (Brown)", "Monk Strap (Brown)", "Chelsea Boots (Black)".
RIGHT MIDDLE: "BEST COLOURS" row — 4 large color swatch circles labeled: Black, Dark Brown, Tan, Burgundy.
RIGHT BOTTOM: red X + "AVOID" — 4 product photo cards: "Sports Shoes", "Chunky Sneakers", "Sandals/Slippers", "Worn Out Shoes". Plus small beige "FOOTWEAR TIPS" box: "Keep shoes clean and polished", "Match belt color to shoes", "Leather > Everything", "Invest in quality".
BOTTOM BAR (dark navy): "GOOD SHOES TAKE YOU TO GOOD PLACES."
CRITICAL: hero face must be the same person from the source image.`,
};

export function createFullPosterPrompt({ reportType, analysis }) {
  const presentation = analysis?.presentation ?? "professional adult";
  const base = FULL_POSTER_PROMPTS[reportType] ?? FULL_POSTER_PROMPTS["Hair Guide"];

  return `${base}

GLOBAL RULES:
- Premium editorial magazine quality. Crisp typography, clean layout, balanced composition.
- Subject is ${presentation}.
- Identity preservation is critical: every face shown must be unmistakably the SAME PERSON from the source portrait — same skin tone, eyes, nose, jaw, age, ethnicity, hair colour. Different styling, but same person.
- Real photographic style — NOT cartoon, NOT illustration, NOT painted.
- Professional studio lighting and neutral backgrounds for all sub-photos.`;
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
