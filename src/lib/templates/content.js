import {
  HairClassicSidePart,
  HairTexturedQuiff,
  HairBrushBack,
  HairMessy,
  HairFlat,
  HairOverlySpiked,
  GlassesRectangular,
  GlassesWayfarer,
  GlassesRoundedRect,
  GlassesRound,
  GlassesSmall,
  GlassesOversized,
  FaceInvertedTriangle,
  BeardShortBoxed,
  BeardMediumStubble,
  BeardDefinedLight,
  BeardPatchy,
  BeardOvergrown,
  BeardUndefinedNeck,
  OutfitNavySuit,
  OutfitCharcoalSuit,
  OutfitWhiteShirtNavyTrousers,
  OutfitLightBlueShirtGrey,
  OutfitBlackShirtCharcoal,
  OutfitTightFit,
  OutfitLoudPrints,
  OutfitWrinkled,
  OutfitTShirt,
  AccWatch,
  AccPocketSquare,
  AccTieBar,
  AccBelt,
  AccCufflinks,
  AccCardHolder,
  AccPen,
  AccChain,
  AccRing,
  AccBracelet,
  AccOversizedWatch,
  ShoeOxford,
  ShoeDerby,
  ShoeMonkStrap,
  ShoeChelsea,
  ShoeSneaker,
  ShoeChunky,
  ShoeSandal,
  ShoeWornOut,
  IconLightbulb,
  IconGlasses,
  IconScissors,
  IconBeard,
  IconPalette,
  IconTie,
  IconStar,
  IconShoe,
  IconFace,
} from "./icons.jsx";

const ACCENT = {
  navy: { bar: "#0a1f3d", text: "#e6b94d" },
  burgundy: { bar: "#3d0a14", text: "#e6b94d" },
};

const ORDER = [
  "Hair Guide",
  "Spectacles Guide",
  "Face Shape Guide",
  "Beard Guide",
  "Colour Analysis",
  "Dress Guide",
  "Accessories Guide",
  "Footwear Guide",
];

function num(reportType) {
  const idx = ORDER.indexOf(reportType);
  return idx >= 0 ? idx + 1 : 1;
}

const HAIR = {
  subtitle: "Clean • Structured • Professional.",
  accent: ACCENT.navy,
  recommendedHeader: "RECOMMENDED STYLES",
  recommended: [
    { Icon: HairClassicSidePart, label: "Classic Side Part" },
    { Icon: HairTexturedQuiff, label: "Textured Quiff" },
    { Icon: HairBrushBack, label: "Natural Volume" },
  ],
  tipsHeader: "STYLE TIPS",
  tips: [
    "Keep sides clean with a low/mid taper",
    "Maintain natural volume on top",
    "Use matte styling product",
    "Avoid excessive height",
    "Keep hair off the forehead slightly",
  ],
  avoid: [
    { Icon: HairMessy, label: "Messy & Puffy" },
    { Icon: HairFlat, label: "Flat & Lifeless" },
    { Icon: HairOverlySpiked, label: "Overly Spiked" },
  ],
  footerIcon: IconLightbulb,
  footerLabel: "KEY",
  footerText: "Structure on sides, natural volume on top, clean hairline, no falling strands.",
};

const SPECTACLES = {
  subtitle: "Smart Frames. Strong Impression.",
  accent: ACCENT.navy,
  recommendedHeader: "RECOMMENDED FRAMES",
  recommended: [
    { Icon: GlassesRectangular, label: "Rectangular" },
    { Icon: GlassesWayfarer, label: "Wayfarer" },
    { Icon: GlassesRoundedRect, label: "Slightly Rounded Rectangle" },
  ],
  tipsHeader: "FRAME TIPS",
  tips: [
    "Medium-size frames suit your face best",
    "Dark colors add definition",
    "Avoid overly round or tiny frames",
    "Keep frame width proportional to face",
  ],
  avoid: [
    { Icon: GlassesRound, label: "Round Frames" },
    { Icon: GlassesSmall, label: "Small Frames" },
    { Icon: GlassesOversized, label: "Oversized Frames" },
  ],
  footerIcon: IconGlasses,
  footerLabel: "BEST COLORS",
  footerText: "Black  |  Gunmetal  |  Dark Brown  |  Tortoise",
};

const FACE_SHAPE = {
  subtitle: "Defined • Balanced • Strong",
  accent: ACCENT.navy,
  recommendedHeader: "YOUR FACE SHAPE",
  recommended: [
    { Icon: FaceInvertedTriangle, label: "INVERTED TRIANGLE", isHero: true },
  ],
  tipsHeader: "TRAITS",
  tips: [
    "Wider forehead & temples",
    "Tapered jawline",
    "Sharp & defined features",
  ],
  whatWorks: [
    "Slight volume on top",
    "Keep sides tidy (not too high)",
    "Angular frames",
    "Well-groomed beard",
    "Structured collars",
  ],
  avoid: [
    { Icon: null, label: "Heavy Straight Fringe" },
    { Icon: null, label: "Excessive Height On Top" },
    { Icon: null, label: "Round Frames" },
    { Icon: null, label: "Patchy Beard" },
  ],
  footerIcon: IconFace,
  footerLabel: "YOUR STRENGTHS",
  footerText: "Strong Jawline  ·  Defined Cheekbones  ·  Sharp Features  ·  Natural Masculinity",
};

const BEARD = {
  subtitle: "Well-Groomed. Defined. Professional.",
  accent: ACCENT.navy,
  recommendedHeader: "RECOMMENDED STYLES",
  recommended: [
    { Icon: BeardShortBoxed, label: "Short Boxed (Beardstache)" },
    { Icon: BeardMediumStubble, label: "Medium Stubble (3–5 mm)" },
    { Icon: BeardDefinedLight, label: "Defined Light Beard" },
  ],
  tipsHeader: "BEARD TIPS",
  tips: [
    "Keep beard lines clean and connected",
    "Maintain even length",
    "Neckline: 2 fingers above Adam's apple",
    "Cheek line: Natural, don't overline",
  ],
  avoid: [
    { Icon: BeardPatchy, label: "Patchy Beard" },
    { Icon: BeardOvergrown, label: "Overgrown Beard" },
    { Icon: BeardUndefinedNeck, label: "Undefined Neckline" },
  ],
  footerIcon: IconBeard,
  footerLabel: "KEEP IT",
  footerText: "Clean  |  Even  |  Natural  |  Well-Defined",
};

const COLOUR = {
  subtitle: "Deep • Rich • Balanced",
  accent: ACCENT.navy,
  recommendedHeader: "BEST COLOURS FOR YOU",
  isColourPalette: true,
  season: "DEEP WINTER",
  seasonSubtitle: "You look best in deep, rich, cool tones.",
  bestColours: [
    "#0a1f3d", "#0a0a0a", "#3a3a3a", "#0a3a1a",
    "#3d0a14", "#1a3a6e", "#5a5a5a", "#7a3a8a",
    "#3a6e3a", "#5a1a2a", "#6a3a1a", "#5a5a8a",
  ],
  neutrals: ["#0a0a0a", "#3a3a3a", "#7a7a7a", "#1a2942", "#fbfbfb", "#d8d2c4", "#9a8060", "#c9b89a"],
  wear: ["Navy", "Black", "Charcoal", "Deep Green", "Burgundy", "Royal Blue", "White", "Cool Gray"],
  avoid: ["Mustard", "Beige", "Camel", "Bright pastels", "Neon", "Warm orange", "Faded tones"],
  avoidColours: ["#c9a039", "#d8c8a9", "#c8a880", "#f0c8e0", "#ff5f3a", "#e09a39", "#d8c9b0"],
  footerIcon: IconPalette,
  footerLabel: "CONTRAST IS YOUR STRENGTH",
  footerText: "DEEP COLOURS ELEVATE YOU.",
};

const DRESS = {
  subtitle: "Sharp • Tailored • Timeless",
  accent: ACCENT.navy,
  recommendedHeader: "WORKWEAR ESSENTIALS",
  recommended: [
    { Icon: OutfitNavySuit, label: "Navy Suit", sub: "White Shirt · Navy Tie" },
    { Icon: OutfitCharcoalSuit, label: "Charcoal Suit", sub: "Light Blue Shirt · Solid Tie" },
    { Icon: OutfitWhiteShirtNavyTrousers, label: "White Shirt", sub: "Navy Trousers (No Tie)" },
    { Icon: OutfitLightBlueShirtGrey, label: "Light Blue Shirt", sub: "Grey Trousers · Smart Casual" },
    { Icon: OutfitBlackShirtCharcoal, label: "Black Shirt", sub: "Charcoal · Evening Smart" },
  ],
  tipsHeader: "DRESS TIPS",
  tips: [
    "Fit is everything",
    "Keep it tailored",
    "Solid or subtle patterns only",
    "Tuck in your shirt",
    "Ironed & neat",
  ],
  avoid: [
    { Icon: OutfitTightFit, label: "Tight Fit" },
    { Icon: OutfitLoudPrints, label: "Loud Prints" },
    { Icon: OutfitWrinkled, label: "Wrinkled Shirt" },
    { Icon: OutfitTShirt, label: "T-Shirt" },
  ],
  footerIcon: IconTie,
  footerLabel: "TAILORED FIT + SOLID COLOURS",
  footerText: "= CONFIDENCE & AUTHORITY",
};

const ACCESSORIES = {
  subtitle: "Minimal. Refined. Purposeful.",
  accent: ACCENT.navy,
  recommendedHeader: "RECOMMENDED",
  recommended: [
    { Icon: AccWatch, label: "Classic Watch", sub: "Metal / Leather" },
    { Icon: AccPocketSquare, label: "Pocket Square", sub: "Subtle" },
    { Icon: AccTieBar, label: "Tie Bar", sub: "Silver" },
    { Icon: AccBelt, label: "Leather Belt", sub: "Black / Brown" },
  ],
  tipsHeader: "OTHER GOOD ADDITIONS",
  extras: [
    { Icon: AccCufflinks, label: "Cufflinks", sub: "Simple" },
    { Icon: AccCardHolder, label: "Card Holder", sub: "Thin" },
    { Icon: AccPen, label: "Pen", sub: "Metal" },
  ],
  tips: [
    "Fit is everything",
    "Keep it tailored",
    "Solid or subtle patterns only",
    "Tuck in your shirt",
    "Ironed & neat",
  ],
  avoid: [
    { Icon: AccChain, label: "Chains" },
    { Icon: AccBracelet, label: "Bracelets" },
    { Icon: AccRing, label: "Flashy Rings" },
    { Icon: AccOversizedWatch, label: "Oversized Watch" },
  ],
  footerIcon: IconStar,
  footerLabel: "LESS IS MORE",
  footerText: "QUALITY SPEAKS LOUDER THAN QUANTITY.",
};

const FOOTWEAR = {
  subtitle: "Polished Shoes. Powerful Presence.",
  accent: ACCENT.navy,
  recommendedHeader: "RECOMMENDED",
  recommended: [
    { Icon: ShoeOxford, label: "Oxford", sub: "(Black)" },
    { Icon: ShoeDerby, label: "Derby", sub: "(Brown)" },
    { Icon: ShoeMonkStrap, label: "Monk Strap", sub: "(Brown)" },
    { Icon: ShoeChelsea, label: "Chelsea Boots", sub: "(Black)" },
  ],
  tipsHeader: "FOOTWEAR TIPS",
  tips: [
    "Keep shoes clean & polished",
    "Match belt colour with shoes",
    "Leather shoes > Everything",
    "Invest in quality",
  ],
  bestColours: ["#0a0a0a", "#3a1a08", "#9a4a18", "#5a1a1a"],
  bestColoursLabels: ["Black", "Dark Brown", "Tan", "Burgundy"],
  avoid: [
    { Icon: ShoeSneaker, label: "Sports Shoes" },
    { Icon: ShoeChunky, label: "Chunky Sneakers" },
    { Icon: ShoeSandal, label: "Sandals/Slippers" },
    { Icon: ShoeWornOut, label: "Worn Out Shoes" },
  ],
  footerIcon: IconShoe,
  footerLabel: "GOOD SHOES",
  footerText: "TAKE YOU TO GOOD PLACES.",
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
  return { ...base, number: num(reportType), title: reportType.toUpperCase(), analysis };
}
