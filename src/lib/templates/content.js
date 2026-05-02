// Returns { title, subtitle, accent, recommended[], tips[], avoid[], footer, palette? }
// for the editorial template, derived from the report type + analysis.

const ACCENT = {
  navy: { bar: "#0a1f3d", chip: "#0a1f3d", text: "#e6b94d" },
  burgundy: { bar: "#3d0a14", chip: "#3d0a14", text: "#e6b94d" },
  forest: { bar: "#0a2e1a", chip: "#0a2e1a", text: "#e6b94d" },
  graphite: { bar: "#1a1a1a", chip: "#1a1a1a", text: "#e6b94d" },
};

function getReportNumber(reportType) {
  const order = [
    "Hair Guide",
    "Spectacles Guide",
    "Face Shape Guide",
    "Beard Guide",
    "Colour Analysis",
    "Dress Guide",
    "Accessories Guide",
    "Footwear Guide",
  ];
  const idx = order.indexOf(reportType);
  return idx >= 0 ? idx + 1 : 1;
}

// ── per-category content blocks ────────────────────────────────────────────
const HAIR = {
  subtitle: "Clean • Structured • Professional",
  accent: ACCENT.navy,
  recommended: [
    { label: "Classic Side Part", sub: "Timeless, executive" },
    { label: "Textured Quiff", sub: "Volume on top" },
    { label: "Brush Back", sub: "Polished, formal" },
  ],
  tips: [
    "Keep sides clean with a low/mid taper",
    "Maintain natural volume on top (2-4 inches)",
    "Use matte styling product, never glossy gel",
    "Avoid excessive height or messy texture",
    "Keep hair off the forehead slightly",
  ],
  avoid: [
    { label: "Messy & Puffy", sub: "Unkempt, uneven" },
    { label: "Overly Voluminous", sub: "Distracting height" },
    { label: "Fringe Forward", sub: "Hides forehead" },
  ],
  footer: "BEST HAIR LENGTH ON TOP: 2–4 INCHES   ·   SIDES: TAPERED (0.5–1.5)",
};

const SPECTACLES = {
  subtitle: "Smart Frames. Strong Impression.",
  accent: ACCENT.navy,
  recommended: [
    { label: "Rectangular", sub: "Defines features" },
    { label: "Wayfarer", sub: "Versatile classic" },
    { label: "Slightly Rounded Rectangle", sub: "Softens angles" },
  ],
  tips: [
    "Medium-size frames suit your face best",
    "Dark colours add definition and depth",
    "Avoid overly round or tiny frames",
    "Keep frame width proportional to face",
    "Match frame tone to hair colour",
  ],
  avoid: [
    { label: "Round Frames", sub: "Lacks definition" },
    { label: "Small Frames", sub: "Disappears on face" },
    { label: "Oversized Frames", sub: "Overwhelms features" },
  ],
  footer: "BEST COLOURS:  Black   ·   Gunmetal   ·   Dark Brown   ·   Tortoise",
};

const FACE_SHAPE = {
  subtitle: "Defined • Balanced • Strong",
  accent: ACCENT.navy,
  recommended: [
    { label: "Slight volume on top", sub: "Balances jawline" },
    { label: "Sides tidy (not too high)", sub: "Maintain proportion" },
    { label: "Angular frames", sub: "Mirror your structure" },
    { label: "Well-groomed beard", sub: "Defines lower face" },
    { label: "Structured collars", sub: "Frames the face" },
  ],
  tips: [
    "Wider forehead and temples — keep volume modest",
    "Tapered jawline — emphasise it with a defined beard",
    "Sharp, defined features — let them lead the look",
  ],
  avoid: [
    { label: "Heavy Straight Fringe", sub: "Flattens forehead" },
    { label: "Excessive Height", sub: "Lengthens face" },
    { label: "Round Frames", sub: "Conflict with structure" },
    { label: "Patchy Beard", sub: "Weakens jaw" },
  ],
  footer: "YOUR STRENGTHS:  Strong Jawline   ·   Defined Cheekbones   ·   Sharp Features   ·   Natural Masculinity",
};

const BEARD = {
  subtitle: "Well-Groomed. Defined. Professional.",
  accent: ACCENT.navy,
  recommended: [
    { label: "Short Boxed", sub: "(Beardstache)" },
    { label: "Medium Stubble", sub: "(3–5 mm)" },
    { label: "Defined Light Beard", sub: "Clean lines" },
  ],
  tips: [
    "Keep beard lines clean and connected",
    "Maintain even length throughout",
    "Neckline: 2 fingers above Adam's apple",
    "Cheek line: keep natural, do not overline",
    "Use beard oil daily for softness",
  ],
  avoid: [
    { label: "Patchy Beard", sub: "Uneven coverage" },
    { label: "Overgrown Beard", sub: "Unkempt look" },
    { label: "Undefined Neckline", sub: "Weak jaw" },
  ],
  footer: "BEARD MAINTENANCE:  Trim every 7–10 days   ·   Use beard oil daily",
};

const COLOUR = {
  subtitle: "Deep • Rich • Balanced",
  accent: ACCENT.burgundy,
  recommended: [
    { label: "Navy", sub: "Authority" },
    { label: "Charcoal", sub: "Refined" },
    { label: "Deep Green", sub: "Distinctive" },
    { label: "Burgundy", sub: "Power" },
    { label: "Royal Blue", sub: "Confident" },
  ],
  tips: [
    "Your season: DEEP WINTER — deep, rich, cool tones",
    "High contrast looks best on you",
    "Keep palettes deep, sharp and sophisticated",
    "Wear navy, black, charcoal, deep green, burgundy",
    "Avoid mustard, beige, camel, faded warm tones",
  ],
  avoid: [
    { label: "Mustard", sub: "Washes you out" },
    { label: "Beige / Camel", sub: "Too warm" },
    { label: "Bright Pastels", sub: "Lacks contrast" },
    { label: "Faded Tones", sub: "Drains presence" },
  ],
  footer: "HIGH CONTRAST LOOKS BEST ON YOU.   KEEP IT DEEP, SHARP & SOPHISTICATED.",
  palette: [
    "#0a1f3d", "#0a0a0a", "#3a3a3a", "#0a3a1a", "#3d0a14",
    "#1a3a6e", "#5a5a5a", "#7a3a8a", "#3a6e3a", "#5a1a2a",
  ],
};

const DRESS = {
  subtitle: "Sharp • Tailored • Timeless",
  accent: ACCENT.navy,
  recommended: [
    { label: "Navy Suit", sub: "White Shirt · Navy Tie" },
    { label: "Charcoal Suit", sub: "Light Blue Shirt · Solid Tie" },
    { label: "White Shirt", sub: "Navy Trousers (no tie)" },
    { label: "Light Blue Shirt", sub: "Grey Trousers · Smart Casual" },
    { label: "Black Shirt", sub: "Charcoal Trousers · Evening" },
  ],
  tips: [
    "Fit is everything — get every garment tailored",
    "Solid or subtle patterns only",
    "Tuck in your shirt always",
    "Iron and steam — never wear wrinkled",
    "Spread or semi-spread collar; sleeve just above wrist bone",
  ],
  avoid: [
    { label: "Tight Fit", sub: "Restricts presence" },
    { label: "Loud Prints", sub: "Distracts" },
    { label: "Wrinkled Shirt", sub: "Unprofessional" },
    { label: "T-Shirt", sub: "Too casual" },
  ],
  footer: "COLLAR: SPREAD OR SEMI-SPREAD   ·   SLEEVE: JUST ABOVE THE WRIST BONE",
};

const ACCESSORIES = {
  subtitle: "Minimal. Refined. Purposeful.",
  accent: ACCENT.navy,
  recommended: [
    { label: "Classic Watch", sub: "Metal / Leather strap" },
    { label: "Pocket Square", sub: "Subtle, folded clean" },
    { label: "Tie Bar", sub: "Silver, slim" },
    { label: "Leather Belt", sub: "Black or Brown" },
    { label: "Cufflinks", sub: "Simple, classic" },
    { label: "Leather Card Holder", sub: "Thin, premium" },
    { label: "Quality Pen", sub: "Metal, weighted" },
  ],
  tips: [
    "Fit is everything",
    "Keep it tailored to the look",
    "Solid or subtle patterns only",
    "Tuck in your shirt",
    "Ironed and neat — always",
  ],
  avoid: [
    { label: "Chains", sub: "Too flashy" },
    { label: "Bracelets", sub: "Too casual" },
    { label: "Flashy Rings", sub: "Distracting" },
    { label: "Oversized Watch", sub: "Out of proportion" },
  ],
  footer: "LESS IS MORE.   QUALITY OVER QUANTITY.   ALWAYS.",
};

const FOOTWEAR = {
  subtitle: "Polished Shoes. Powerful Presence.",
  accent: ACCENT.navy,
  recommended: [
    { label: "Oxford", sub: "Black — formal" },
    { label: "Derby", sub: "Brown — versatile" },
    { label: "Monk Strap", sub: "Distinctive" },
    { label: "Chelsea Boots", sub: "Sharp, modern" },
  ],
  tips: [
    "Keep shoes clean and polished",
    "Match belt colour to shoe colour",
    "Leather shoes over everything else",
    "Invest in quality — they last years",
    "Replace heels and soles before they wear through",
  ],
  avoid: [
    { label: "Sports Shoes", sub: "Too casual" },
    { label: "Chunky Sneakers", sub: "Streetwear, not work" },
    { label: "Sandals / Slippers", sub: "Never in office" },
    { label: "Worn-Out Shoes", sub: "Undermines presence" },
  ],
  footer: "BEST COLOURS:  Black   ·   Dark Brown   ·   Tan   ·   Burgundy",
};

const REPORT_CONTENT = {
  "Hair Guide": HAIR,
  "Spectacles Guide": SPECTACLES,
  "Face Shape Guide": FACE_SHAPE,
  "Beard Guide": BEARD,
  "Colour Analysis": COLOUR,
  "Dress Guide": DRESS,
  "Accessories Guide": ACCESSORIES,
  "Footwear Guide": FOOTWEAR,
};

export function getReportContent(reportType, analysis) {
  const base = REPORT_CONTENT[reportType] ?? HAIR;
  const number = getReportNumber(reportType);
  const styleFocus = analysis?.styleFocus ?? "";

  return {
    number,
    title: reportType.toUpperCase(),
    subtitle: base.subtitle,
    accent: base.accent,
    recommended: base.recommended,
    tips: base.tips,
    avoid: base.avoid,
    footer: base.footer,
    palette: base.palette ?? null,
    styleFocus,
  };
}
