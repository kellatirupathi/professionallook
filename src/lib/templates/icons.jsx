// Inline SVG icon library — refined product-style pictograms.
// Solid filled shapes (not thin line-art) so they read as "product photos"
// rather than animation icons.

const baseLine = {
  fill: "none",
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

// ── Hairstyles (realistic head + hair silhouettes) ────────────────────────
function HeadFrame({ children, w = 96, h = 100 }) {
  return (
    <svg viewBox="0 0 96 100" width={w} height={h}>
      {/* Skin tone face oval */}
      <ellipse cx="48" cy="58" rx="24" ry="30" fill="#e8c8a8" stroke="#9a7a5a" strokeWidth="0.8" />
      {/* Neck */}
      <path d="M36 84 L36 96 L60 96 L60 84 Z" fill="#d8b89a" />
      {/* Eyes */}
      <ellipse cx="40" cy="58" rx="2" ry="1.4" fill="#2a1a0a" />
      <ellipse cx="56" cy="58" rx="2" ry="1.4" fill="#2a1a0a" />
      {/* Nose */}
      <path d="M48 62 L46 70 L50 70 Z" fill="none" stroke="#9a7a5a" strokeWidth="0.6" />
      {/* Mouth */}
      <path d="M44 76 Q48 78 52 76" stroke="#7a3a3a" strokeWidth="1" {...baseLine} fill="none" />
      {children}
    </svg>
  );
}

export const HairClassicSidePart = (p) => (
  <HeadFrame {...p}>
    {/* Hair: side part, swept */}
    <path d="M28 38 Q30 22 48 22 Q66 22 70 36 L70 50 Q66 38 56 36 Q48 36 44 40 Q38 42 28 50 Z"
          fill="#1a0f08" />
    <path d="M40 36 Q48 32 66 36" stroke="#3a1f08" strokeWidth="0.8" {...baseLine} fill="none" />
  </HeadFrame>
);

export const HairTexturedQuiff = (p) => (
  <HeadFrame {...p}>
    {/* Hair: tall quiff with texture */}
    <path d="M28 40 Q30 8 48 6 Q66 8 70 38 Q66 28 60 26 Q56 32 50 28 Q46 34 38 30 Q32 36 28 40 Z"
          fill="#1a0f08" />
  </HeadFrame>
);

export const HairBrushBack = (p) => (
  <HeadFrame {...p}>
    {/* Hair: brushed back, smooth volume */}
    <path d="M28 42 Q28 24 48 22 Q68 24 70 42 Q60 36 48 36 Q36 36 28 42 Z"
          fill="#1a0f08" />
    <path d="M30 36 L66 32 M32 40 L66 36" stroke="#3a1f08" strokeWidth="0.6" {...baseLine} fill="none" />
  </HeadFrame>
);

export const HairMessy = (p) => (
  <HeadFrame {...p}>
    {/* Hair: messy uneven */}
    <path d="M26 42 Q26 18 32 22 Q34 10 40 18 Q44 6 48 16 Q52 6 56 18 Q60 10 64 22 Q70 18 70 42 Q60 38 48 38 Q36 38 26 42 Z"
          fill="#1a0f08" />
  </HeadFrame>
);

export const HairFlat = (p) => (
  <HeadFrame {...p}>
    {/* Hair: flat, no volume */}
    <path d="M28 42 Q30 36 48 36 Q66 36 70 42 L70 36 Q66 32 48 32 Q30 32 28 36 Z"
          fill="#1a0f08" />
  </HeadFrame>
);

export const HairOverlySpiked = (p) => (
  <HeadFrame {...p}>
    {/* Hair: dramatic spikes */}
    <path d="M28 42 L32 18 L36 38 L40 14 L44 38 L48 12 L52 38 L56 14 L60 38 L64 18 L68 42 Q56 46 28 42 Z"
          fill="#1a0f08" />
  </HeadFrame>
);

// ── Glasses (solid black frames matching reference) ───────────────────────
function GlassesSvg({ children, w = 110, h = 36 }) {
  return (
    <svg viewBox="0 0 110 36" width={w} height={h}>
      {children}
    </svg>
  );
}

export const GlassesRectangular = (p) => (
  <GlassesSvg {...p}>
    <rect x="6" y="6" width="42" height="22" rx="3" fill="#0a0a0a" />
    <rect x="9" y="9" width="36" height="16" rx="1" fill="#fbf7ee" />
    <rect x="62" y="6" width="42" height="22" rx="3" fill="#0a0a0a" />
    <rect x="65" y="9" width="36" height="16" rx="1" fill="#fbf7ee" />
    <rect x="48" y="14" width="14" height="3" fill="#0a0a0a" />
  </GlassesSvg>
);

export const GlassesWayfarer = (p) => (
  <GlassesSvg {...p}>
    <path d="M6 12 Q6 28 22 28 Q44 28 48 18 Q50 10 30 8 Q10 8 6 12 Z" fill="#0a0a0a" />
    <path d="M9 14 Q9 25 22 25 Q40 25 44 18 Q44 12 30 11 Q12 11 9 14 Z" fill="#fbf7ee" />
    <path d="M104 12 Q104 28 88 28 Q66 28 62 18 Q60 10 80 8 Q100 8 104 12 Z" fill="#0a0a0a" />
    <path d="M101 14 Q101 25 88 25 Q70 25 66 18 Q66 12 80 11 Q98 11 101 14 Z" fill="#fbf7ee" />
    <rect x="48" y="14" width="14" height="3" fill="#0a0a0a" />
  </GlassesSvg>
);

export const GlassesRoundedRect = (p) => (
  <GlassesSvg {...p}>
    <rect x="6" y="6" width="42" height="22" rx="9" fill="#0a0a0a" />
    <rect x="9" y="9" width="36" height="16" rx="7" fill="#fbf7ee" />
    <rect x="62" y="6" width="42" height="22" rx="9" fill="#0a0a0a" />
    <rect x="65" y="9" width="36" height="16" rx="7" fill="#fbf7ee" />
    <rect x="48" y="14" width="14" height="3" fill="#0a0a0a" />
  </GlassesSvg>
);

export const GlassesRound = (p) => (
  <GlassesSvg {...p}>
    <circle cx="22" cy="18" r="14" fill="#0a0a0a" />
    <circle cx="22" cy="18" r="11" fill="#fbf7ee" />
    <circle cx="88" cy="18" r="14" fill="#0a0a0a" />
    <circle cx="88" cy="18" r="11" fill="#fbf7ee" />
    <rect x="36" y="16" width="38" height="3" fill="#0a0a0a" />
  </GlassesSvg>
);

export const GlassesSmall = (p) => (
  <GlassesSvg {...p}>
    <rect x="20" y="11" width="22" height="14" rx="2" fill="#0a0a0a" />
    <rect x="22" y="13" width="18" height="10" rx="1" fill="#fbf7ee" />
    <rect x="68" y="11" width="22" height="14" rx="2" fill="#0a0a0a" />
    <rect x="70" y="13" width="18" height="10" rx="1" fill="#fbf7ee" />
    <rect x="42" y="16" width="26" height="3" fill="#0a0a0a" />
  </GlassesSvg>
);

export const GlassesOversized = (p) => (
  <GlassesSvg {...p}>
    <rect x="2" y="2" width="50" height="30" rx="4" fill="#0a0a0a" />
    <rect x="5" y="5" width="44" height="24" rx="2" fill="#fbf7ee" />
    <rect x="58" y="2" width="50" height="30" rx="4" fill="#0a0a0a" />
    <rect x="61" y="5" width="44" height="24" rx="2" fill="#fbf7ee" />
    <rect x="52" y="14" width="6" height="3" fill="#0a0a0a" />
  </GlassesSvg>
);

// ── Face shape diagram ────────────────────────────────────────────────────
export const FaceInvertedTriangle = ({ w = 110, h = 130 }) => (
  <svg viewBox="0 0 110 130" width={w} height={h}>
    <ellipse cx="55" cy="55" rx="38" ry="44" fill="#f0e0c8" stroke="#9a7a5a" strokeWidth="1" />
    <path d="M14 28 L96 28 L55 122 Z"
          stroke="#0a1f3d" strokeWidth="2" strokeDasharray="5 4" {...baseLine} fill="none" />
    <ellipse cx="44" cy="56" rx="2.4" ry="1.6" fill="#2a1a0a" />
    <ellipse cx="66" cy="56" rx="2.4" ry="1.6" fill="#2a1a0a" />
    <path d="M48 78 Q55 80 62 78" stroke="#7a3a3a" strokeWidth="1.2" {...baseLine} fill="none" />
  </svg>
);

// ── Beard styles (face oval + beard pattern) ──────────────────────────────
function BeardFace({ children, w = 96, h = 100 }) {
  return (
    <svg viewBox="0 0 96 100" width={w} height={h}>
      <ellipse cx="48" cy="50" rx="24" ry="32" fill="#e8c8a8" stroke="#9a7a5a" strokeWidth="0.8" />
      {/* Hair */}
      <path d="M26 38 Q26 18 48 16 Q70 18 70 38 Q60 30 48 30 Q36 30 26 38 Z" fill="#1a0f08" />
      {/* Eyes */}
      <ellipse cx="40" cy="48" rx="2" ry="1.4" fill="#2a1a0a" />
      <ellipse cx="56" cy="48" rx="2" ry="1.4" fill="#2a1a0a" />
      {/* Mouth */}
      <path d="M44 70 Q48 72 52 70" stroke="#7a3a3a" strokeWidth="1" {...baseLine} fill="none" />
      {children}
    </svg>
  );
}

export const BeardShortBoxed = (p) => (
  <BeardFace {...p}>
    <path d="M28 64 Q28 80 48 82 Q68 80 68 64 Q68 60 64 60 L62 64 Q56 66 48 66 Q40 66 34 64 L32 60 Q28 60 28 64 Z"
          fill="#1a0f08" />
    {/* Mustache */}
    <path d="M40 64 Q48 62 56 64" stroke="#1a0f08" strokeWidth="3" {...baseLine} fill="none" />
  </BeardFace>
);

export const BeardMediumStubble = (p) => (
  <BeardFace {...p}>
    {/* stubble dots */}
    {[
      [38, 64], [44, 66], [50, 64], [56, 66], [62, 64],
      [40, 70], [46, 72], [52, 70], [58, 72],
      [42, 76], [48, 78], [54, 76],
      [44, 82], [50, 82],
    ].map(([x, y], i) => (
      <circle key={i} cx={x} cy={y} r="0.9" fill="#1a0f08" />
    ))}
  </BeardFace>
);

export const BeardDefinedLight = (p) => (
  <BeardFace {...p}>
    <path d="M30 64 Q32 78 48 80 Q64 78 66 64 Q60 66 48 66 Q36 66 30 64 Z"
          fill="#1a0f08" fillOpacity="0.85" />
    <path d="M40 64 Q48 62 56 64" stroke="#1a0f08" strokeWidth="2" {...baseLine} fill="none" />
  </BeardFace>
);

export const BeardPatchy = (p) => (
  <BeardFace {...p}>
    <ellipse cx="34" cy="68" rx="4" ry="3" fill="#1a0f08" fillOpacity="0.6" />
    <ellipse cx="48" cy="74" rx="5" ry="4" fill="#1a0f08" fillOpacity="0.7" />
    <ellipse cx="62" cy="68" rx="4" ry="3" fill="#1a0f08" fillOpacity="0.6" />
    <circle cx="42" cy="78" r="1.2" fill="#1a0f08" />
    <circle cx="54" cy="80" r="1.2" fill="#1a0f08" />
  </BeardFace>
);

export const BeardOvergrown = (p) => (
  <BeardFace {...p}>
    <path d="M22 56 Q18 96 48 98 Q78 96 74 56 Q60 64 48 64 Q36 64 22 56 Z" fill="#1a0f08" />
    <path d="M40 64 Q48 62 56 64" stroke="#1a0f08" strokeWidth="3" {...baseLine} fill="none" />
  </BeardFace>
);

export const BeardUndefinedNeck = (p) => (
  <BeardFace {...p}>
    <path d="M28 60 Q22 92 48 94 Q74 92 68 60 Q60 64 48 64 Q36 64 28 60 Z"
          fill="#1a0f08" fillOpacity="0.7" />
  </BeardFace>
);

// ── Outfit silhouettes (suit/shirt with realistic shading) ───────────────
function OutfitFrame({ jacket, shirt, tie, w = 80, h = 110 }) {
  return (
    <svg viewBox="0 0 80 110" width={w} height={h}>
      {/* Head */}
      <ellipse cx="40" cy="14" rx="9" ry="11" fill="#e8c8a8" stroke="#9a7a5a" strokeWidth="0.6" />
      {/* Hair on top */}
      <path d="M31 11 Q31 4 40 4 Q49 4 49 11 Q44 9 40 9 Q36 9 31 11 Z" fill="#1a0f08" />
      {/* Neck */}
      <path d="M36 24 L44 24 L44 32 L36 32 Z" fill="#d8b89a" />
      {/* Jacket */}
      <path d="M14 32 L26 28 L40 36 L54 28 L66 32 L72 108 L8 108 Z" fill={jacket} stroke="#0a0a0a" strokeWidth="0.8" />
      {/* Shirt */}
      <path d="M26 28 L40 36 L54 28 L48 60 L32 60 Z" fill={shirt} stroke="#7a7a7a" strokeWidth="0.5" />
      {/* Tie */}
      {tie ? (
        <path d="M37 36 L43 36 L44 50 L40 70 L36 50 Z" fill={tie} stroke="#0a0a0a" strokeWidth="0.4" />
      ) : null}
      {/* Lapels */}
      <path d="M14 32 L40 60 L26 28 Z" fill="#000" fillOpacity="0.18" />
      <path d="M66 32 L40 60 L54 28 Z" fill="#000" fillOpacity="0.18" />
      {/* Buttons */}
      {tie ? null : (
        <>
          <circle cx="40" cy="62" r="1" fill="#0a0a0a" />
          <circle cx="40" cy="76" r="1" fill="#0a0a0a" />
        </>
      )}
    </svg>
  );
}

export const OutfitNavySuit = (p) => <OutfitFrame {...p} jacket="#1a2942" shirt="#fbfbfb" tie="#1a2942" />;
export const OutfitCharcoalSuit = (p) => <OutfitFrame {...p} jacket="#2a2a2a" shirt="#cfe0f0" tie="#3a3a3a" />;
export const OutfitWhiteShirtNavyTrousers = (p) => <OutfitFrame {...p} jacket="#1a2942" shirt="#fbfbfb" tie={null} />;
export const OutfitLightBlueShirtGrey = (p) => <OutfitFrame {...p} jacket="#6a6a6a" shirt="#cfe0f0" tie={null} />;
export const OutfitBlackShirtCharcoal = (p) => <OutfitFrame {...p} jacket="#1a1a1a" shirt="#1a1a1a" tie={null} />;

export const OutfitTightFit = (p) => (
  <svg viewBox="0 0 80 110" width={p.w ?? 80} height={p.h ?? 110}>
    <ellipse cx="40" cy="14" rx="9" ry="11" fill="#e8c8a8" stroke="#9a7a5a" strokeWidth="0.6" />
    <path d="M31 11 Q31 4 40 4 Q49 4 49 11 Q44 9 40 9 Q36 9 31 11 Z" fill="#1a0f08" />
    <path d="M28 32 L52 32 L58 108 L22 108 Z" fill="#5a5a5a" stroke="#0a0a0a" strokeWidth="0.8" />
    <path d="M34 32 L46 32 L46 60 L34 60 Z" fill="#cfcfcf" />
  </svg>
);

export const OutfitLoudPrints = (p) => (
  <svg viewBox="0 0 80 110" width={p.w ?? 80} height={p.h ?? 110}>
    <ellipse cx="40" cy="14" rx="9" ry="11" fill="#e8c8a8" stroke="#9a7a5a" strokeWidth="0.6" />
    <path d="M31 11 Q31 4 40 4 Q49 4 49 11 Q44 9 40 9 Q36 9 31 11 Z" fill="#1a0f08" />
    <path d="M14 32 L26 28 L40 36 L54 28 L66 32 L72 108 L8 108 Z" fill="#7a1a2a" stroke="#0a0a0a" strokeWidth="0.8" />
    <circle cx="22" cy="48" r="2.5" fill="#fff" />
    <circle cx="32" cy="60" r="2.5" fill="#fff" />
    <circle cx="48" cy="56" r="2.5" fill="#fff" />
    <circle cx="58" cy="68" r="2.5" fill="#fff" />
    <circle cx="26" cy="80" r="2.5" fill="#fff" />
    <circle cx="44" cy="84" r="2.5" fill="#fff" />
    <circle cx="56" cy="92" r="2.5" fill="#fff" />
  </svg>
);

export const OutfitWrinkled = (p) => (
  <svg viewBox="0 0 80 110" width={p.w ?? 80} height={p.h ?? 110}>
    <ellipse cx="40" cy="14" rx="9" ry="11" fill="#e8c8a8" stroke="#9a7a5a" strokeWidth="0.6" />
    <path d="M31 11 Q31 4 40 4 Q49 4 49 11 Q44 9 40 9 Q36 9 31 11 Z" fill="#1a0f08" />
    <path d="M14 32 L26 28 L40 36 L54 28 L66 32 L72 108 L8 108 Z" fill="#a0a0a0" stroke="#0a0a0a" strokeWidth="0.8" />
    <path d="M14 50 Q26 46 40 52 Q54 47 66 53 M12 72 Q26 68 40 74 Q54 69 68 75 M12 92 Q26 88 40 94 Q54 89 68 95"
          stroke="#5a5a5a" strokeWidth="0.8" {...baseLine} fill="none" />
  </svg>
);

export const OutfitTShirt = (p) => (
  <svg viewBox="0 0 80 110" width={p.w ?? 80} height={p.h ?? 110}>
    <ellipse cx="40" cy="14" rx="9" ry="11" fill="#e8c8a8" stroke="#9a7a5a" strokeWidth="0.6" />
    <path d="M31 11 Q31 4 40 4 Q49 4 49 11 Q44 9 40 9 Q36 9 31 11 Z" fill="#1a0f08" />
    <path d="M22 28 L34 26 L40 32 L46 26 L58 28 L70 40 L60 44 L60 108 L20 108 L20 44 L10 40 Z"
          fill="#3a3a3a" stroke="#0a0a0a" strokeWidth="0.8" />
  </svg>
);

// ── Accessories ───────────────────────────────────────────────────────────
export const AccWatch = ({ w = 80, h = 80 }) => (
  <svg viewBox="0 0 80 80" width={w} height={h}>
    <rect x="22" y="6" width="36" height="14" fill="#5a3a1a" stroke="#3a2a0a" strokeWidth="0.6" rx="2" />
    <rect x="22" y="60" width="36" height="14" fill="#5a3a1a" stroke="#3a2a0a" strokeWidth="0.6" rx="2" />
    <circle cx="40" cy="40" r="22" fill="#0a0a0a" stroke="#2a2a2a" strokeWidth="1" />
    <circle cx="40" cy="40" r="19" fill="url(#watchFace)" stroke="#0a0a0a" strokeWidth="0.6" />
    <defs>
      <radialGradient id="watchFace" cx="50%" cy="40%">
        <stop offset="0%" stopColor="#fbfbfb" />
        <stop offset="100%" stopColor="#d4af37" />
      </radialGradient>
    </defs>
    <circle cx="40" cy="40" r="2" fill="#0a0a0a" />
    <line x1="40" y1="40" x2="40" y2="26" stroke="#0a0a0a" strokeWidth="2" {...baseLine} />
    <line x1="40" y1="40" x2="52" y2="40" stroke="#0a0a0a" strokeWidth="2" {...baseLine} />
    {[0, 1, 2, 3].map((i) => (
      <line key={i}
            x1={40 + 16 * Math.cos(i * Math.PI / 2)}
            y1={40 + 16 * Math.sin(i * Math.PI / 2)}
            x2={40 + 18 * Math.cos(i * Math.PI / 2)}
            y2={40 + 18 * Math.sin(i * Math.PI / 2)}
            stroke="#0a0a0a" strokeWidth="1.2" />
    ))}
  </svg>
);

export const AccPocketSquare = ({ w = 80, h = 80 }) => (
  <svg viewBox="0 0 80 80" width={w} height={h}>
    <rect x="14" y="14" width="52" height="52" fill="#1a2942" stroke="#0a0a0a" strokeWidth="0.8" />
    <path d="M14 14 L66 14 L52 30 L28 30 Z" fill="#2a3952" />
    <path d="M28 30 L52 30 L66 66 L14 66 Z" fill="#152033" />
    <path d="M30 32 L50 32" stroke="#3a4a64" strokeWidth="0.6" />
  </svg>
);

export const AccTieBar = ({ w = 90, h = 30 }) => (
  <svg viewBox="0 0 90 30" width={w} height={h}>
    <rect x="6" y="11" width="78" height="8" rx="4" fill="url(#tieBarGrad)" stroke="#5a5a5a" strokeWidth="0.8" />
    <defs>
      <linearGradient id="tieBarGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#e8e8e8" />
        <stop offset="50%" stopColor="#fbfbfb" />
        <stop offset="100%" stopColor="#a0a0a0" />
      </linearGradient>
    </defs>
    <circle cx="14" cy="15" r="2" fill="#5a5a5a" />
    <circle cx="76" cy="15" r="2" fill="#5a5a5a" />
  </svg>
);

export const AccBelt = ({ w = 100, h = 50 }) => (
  <svg viewBox="0 0 100 50" width={w} height={h}>
    <rect x="4" y="18" width="92" height="14" fill="#1a0f08" stroke="#0a0a0a" strokeWidth="0.8" />
    <rect x="4" y="22" width="92" height="2" fill="#3a2a18" />
    <rect x="4" y="26" width="92" height="2" fill="#0a0a0a" />
    <rect x="38" y="12" width="24" height="26" fill="none" stroke="#c8b890" strokeWidth="3" rx="1" />
    <rect x="50" y="22" width="2" height="6" fill="#c8b890" />
  </svg>
);

export const AccCufflinks = ({ w = 80, h = 40 }) => (
  <svg viewBox="0 0 80 40" width={w} height={h}>
    <circle cx="20" cy="20" r="10" fill="url(#cuffGrad)" stroke="#5a5a5a" strokeWidth="0.8" />
    <circle cx="20" cy="20" r="4" fill="#5a5a5a" />
    <circle cx="60" cy="20" r="10" fill="url(#cuffGrad)" stroke="#5a5a5a" strokeWidth="0.8" />
    <circle cx="60" cy="20" r="4" fill="#5a5a5a" />
    <defs>
      <radialGradient id="cuffGrad" cx="35%" cy="35%">
        <stop offset="0%" stopColor="#fbfbfb" />
        <stop offset="100%" stopColor="#a0a0a0" />
      </radialGradient>
    </defs>
  </svg>
);

export const AccCardHolder = ({ w = 100, h = 60 }) => (
  <svg viewBox="0 0 100 60" width={w} height={h}>
    <rect x="6" y="10" width="88" height="40" rx="3" fill="#1a0f08" stroke="#0a0a0a" strokeWidth="0.8" />
    <rect x="6" y="28" width="88" height="2" fill="#3a2a18" />
    <rect x="14" y="38" width="34" height="6" fill="#3a2a18" rx="1" />
  </svg>
);

export const AccPen = ({ w = 100, h = 24 }) => (
  <svg viewBox="0 0 100 24" width={w} height={h}>
    <rect x="8" y="8" width="64" height="8" fill="url(#penGrad)" stroke="#5a5a5a" strokeWidth="0.6" />
    <polygon points="72,6 90,12 72,18" fill="#5a5a5a" />
    <rect x="14" y="8" width="10" height="8" fill="#0a0a0a" />
    <rect x="6" y="10" width="3" height="4" fill="#c8c8c8" />
    <defs>
      <linearGradient id="penGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#e8e8e8" />
        <stop offset="50%" stopColor="#fbfbfb" />
        <stop offset="100%" stopColor="#a0a0a0" />
      </linearGradient>
    </defs>
  </svg>
);

export const AccChain = ({ w = 100, h = 50 }) => (
  <svg viewBox="0 0 100 50" width={w} height={h}>
    {[0, 1, 2, 3, 4, 5, 6].map((i) => (
      <ellipse key={i} cx={10 + i * 13} cy="25" rx="6" ry="4.5"
               fill="none" stroke="#c8b890" strokeWidth="2.2" />
    ))}
    <ellipse cx="50" cy="38" rx="8" ry="6" fill="#c8b890" stroke="#5a5a5a" strokeWidth="0.8" />
  </svg>
);

export const AccRing = ({ w = 60, h = 60 }) => (
  <svg viewBox="0 0 60 60" width={w} height={h}>
    <circle cx="30" cy="36" r="14" fill="none" stroke="url(#ringGrad)" strokeWidth="3.5" />
    <polygon points="30,10 36,22 24,22" fill="#9ad0ff" stroke="#5a5a5a" strokeWidth="0.8" />
    <polygon points="30,10 36,22 30,16" fill="#cfe9ff" />
    <defs>
      <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fbfbfb" />
        <stop offset="100%" stopColor="#a0a0a0" />
      </linearGradient>
    </defs>
  </svg>
);

export const AccBracelet = ({ w = 100, h = 40 }) => (
  <svg viewBox="0 0 100 40" width={w} height={h}>
    {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
      <circle key={i} cx={10 + i * 10} cy="20" r="4" fill="url(#braceletGrad)" stroke="#5a5a5a" strokeWidth="0.6" />
    ))}
    <defs>
      <radialGradient id="braceletGrad" cx="35%" cy="35%">
        <stop offset="0%" stopColor="#fbfbfb" />
        <stop offset="100%" stopColor="#a0a0a0" />
      </radialGradient>
    </defs>
  </svg>
);

export const AccOversizedWatch = ({ w = 80, h = 80 }) => (
  <svg viewBox="0 0 80 80" width={w} height={h}>
    <rect x="18" y="4" width="44" height="10" fill="#5a3a1a" rx="2" />
    <rect x="18" y="66" width="44" height="10" fill="#5a3a1a" rx="2" />
    <circle cx="40" cy="40" r="28" fill="#0a0a0a" stroke="#2a2a2a" strokeWidth="1" />
    <circle cx="40" cy="40" r="24" fill="#fbfbfb" />
    <circle cx="40" cy="40" r="2" fill="#0a0a0a" />
    <line x1="40" y1="40" x2="40" y2="22" stroke="#0a0a0a" strokeWidth="2.5" {...baseLine} />
    <line x1="40" y1="40" x2="56" y2="40" stroke="#0a0a0a" strokeWidth="2.5" {...baseLine} />
    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => {
      const angle = i * Math.PI / 6;
      return (
        <line key={i}
              x1={40 + 20 * Math.cos(angle)}
              y1={40 + 20 * Math.sin(angle)}
              x2={40 + 23 * Math.cos(angle)}
              y2={40 + 23 * Math.sin(angle)}
              stroke="#0a0a0a" strokeWidth="1.4" />
      );
    })}
  </svg>
);

// ── Footwear (realistic side-profile shoes) ──────────────────────────────
export const ShoeOxford = ({ w = 130, h = 60 }) => (
  <svg viewBox="0 0 130 60" width={w} height={h}>
    <path d="M10 44 Q10 30 32 24 Q60 20 90 24 Q108 28 116 38 Q118 44 116 50 L18 50 Q10 50 10 44 Z"
          fill="#0a0a0a" stroke="#000" strokeWidth="0.8" />
    <path d="M10 44 L116 44" stroke="#3a3a3a" strokeWidth="0.6" />
    <rect x="10" y="48" width="106" height="6" fill="#1a1a1a" />
    {/* Lace eyelets */}
    <line x1="50" y1="32" x2="50" y2="42" stroke="#fbfbfb" strokeWidth="0.6" />
    <line x1="60" y1="30" x2="60" y2="42" stroke="#fbfbfb" strokeWidth="0.6" />
    <circle cx="50" cy="33" r="0.8" fill="#fbfbfb" />
    <circle cx="50" cy="38" r="0.8" fill="#fbfbfb" />
    <circle cx="60" cy="32" r="0.8" fill="#fbfbfb" />
    <circle cx="60" cy="38" r="0.8" fill="#fbfbfb" />
    {/* Toe cap shine */}
    <path d="M86 28 Q98 26 110 30" stroke="#3a3a3a" strokeWidth="0.6" fill="none" />
  </svg>
);

export const ShoeDerby = ({ w = 130, h = 60 }) => (
  <svg viewBox="0 0 130 60" width={w} height={h}>
    <path d="M10 44 Q10 30 32 24 Q60 20 90 24 Q108 28 116 38 Q118 44 116 50 L18 50 Q10 50 10 44 Z"
          fill="#5a3a1a" stroke="#3a2008" strokeWidth="0.8" />
    <rect x="10" y="48" width="106" height="6" fill="#3a2008" />
    <path d="M44 30 L70 30 L66 44 L48 44 Z" fill="none" stroke="#3a2008" strokeWidth="0.8" />
    <line x1="56" y1="32" x2="56" y2="42" stroke="#fbfbfb" strokeWidth="0.6" />
    <circle cx="56" cy="35" r="0.8" fill="#fbfbfb" />
    <circle cx="56" cy="40" r="0.8" fill="#fbfbfb" />
    <path d="M86 28 Q98 26 110 30" stroke="#7a4a1a" strokeWidth="0.6" fill="none" />
  </svg>
);

export const ShoeMonkStrap = ({ w = 130, h = 60 }) => (
  <svg viewBox="0 0 130 60" width={w} height={h}>
    <path d="M10 44 Q10 30 32 24 Q60 20 90 24 Q108 28 116 38 Q118 44 116 50 L18 50 Q10 50 10 44 Z"
          fill="#7a4a1a" stroke="#5a3a08" strokeWidth="0.8" />
    <rect x="10" y="48" width="106" height="6" fill="#3a2008" />
    <rect x="42" y="28" width="38" height="6" fill="#5a3a08" />
    <rect x="42" y="36" width="38" height="6" fill="#5a3a08" />
    <rect x="74" y="30" width="6" height="10" fill="#c8b890" />
    <rect x="74" y="32" width="2" height="2" fill="#5a3a08" />
    <rect x="74" y="38" width="2" height="2" fill="#5a3a08" />
  </svg>
);

export const ShoeChelsea = ({ w = 130, h = 80 }) => (
  <svg viewBox="0 0 130 80" width={w} height={h}>
    <path d="M14 64 Q14 28 32 22 L72 22 L72 8 L92 8 L92 30 Q108 32 116 50 Q118 60 116 66 L20 66 Q14 66 14 64 Z"
          fill="#0a0a0a" stroke="#000" strokeWidth="0.8" />
    <rect x="14" y="64" width="102" height="6" fill="#1a1a1a" />
    <ellipse cx="80" cy="32" rx="10" ry="4" fill="#3a3a3a" />
    <line x1="32" y1="22" x2="92" y2="22" stroke="#1a1a1a" strokeWidth="0.6" />
  </svg>
);

export const ShoeSneaker = ({ w = 130, h = 60 }) => (
  <svg viewBox="0 0 130 60" width={w} height={h}>
    <path d="M10 44 Q10 28 32 22 Q56 18 84 22 Q104 26 116 38 Q118 44 116 50 L18 50 Q10 50 10 44 Z"
          fill="#fbfbfb" stroke="#0a0a0a" strokeWidth="0.8" />
    <rect x="10" y="44" width="106" height="6" fill="#0a0a0a" />
    <path d="M30 36 L100 32" stroke="#a0a0a0" strokeWidth="2" />
    <line x1="44" y1="28" x2="44" y2="42" stroke="#a0a0a0" strokeWidth="0.6" />
    <line x1="56" y1="26" x2="56" y2="42" stroke="#a0a0a0" strokeWidth="0.6" />
    <line x1="68" y1="26" x2="68" y2="42" stroke="#a0a0a0" strokeWidth="0.6" />
    <circle cx="32" cy="32" r="2" fill="#a0a0a0" />
    <path d="M82 26 Q92 28 100 32" stroke="#0a0a0a" strokeWidth="0.6" fill="none" />
  </svg>
);

export const ShoeChunky = ({ w = 130, h = 70 }) => (
  <svg viewBox="0 0 130 70" width={w} height={h}>
    <path d="M6 50 Q6 24 32 18 Q70 12 100 22 Q116 28 118 44 L118 56 L6 56 Z"
          fill="#fbfbfb" stroke="#0a0a0a" strokeWidth="0.8" />
    <rect x="6" y="48" width="112" height="14" fill="#1a1a1a" />
    <rect x="6" y="60" width="112" height="3" fill="#0a0a0a" />
    <line x1="48" y1="22" x2="48" y2="48" stroke="#a0a0a0" strokeWidth="0.6" />
    <line x1="60" y1="20" x2="60" y2="48" stroke="#a0a0a0" strokeWidth="0.6" />
    <line x1="72" y1="20" x2="72" y2="48" stroke="#a0a0a0" strokeWidth="0.6" />
  </svg>
);

export const ShoeSandal = ({ w = 130, h = 60 }) => (
  <svg viewBox="0 0 130 60" width={w} height={h}>
    <ellipse cx="65" cy="46" rx="56" ry="8" fill="#3a2a1a" />
    <ellipse cx="65" cy="44" rx="54" ry="6" fill="#5a3a1a" />
    <path d="M30 36 L65 24 L100 36" stroke="#3a2a1a" strokeWidth="5" {...baseLine} fill="none" />
    <path d="M52 38 L65 28 L78 38" stroke="#5a3a1a" strokeWidth="3" {...baseLine} fill="none" />
  </svg>
);

export const ShoeWornOut = ({ w = 130, h = 60 }) => (
  <svg viewBox="0 0 130 60" width={w} height={h}>
    <path d="M10 44 Q10 30 32 24 Q60 20 90 24 Q108 28 116 38 Q118 44 116 50 L18 50 Q10 50 10 44 Z"
          fill="#7a4a2a" stroke="#3a1a08" strokeWidth="0.8" />
    <rect x="10" y="48" width="106" height="6" fill="#3a1a08" />
    <path d="M14 28 Q24 36 36 28 Q48 36 60 28 Q72 36 84 28 Q96 36 108 30"
          stroke="#3a1a08" strokeWidth="0.8" fill="none" {...baseLine} />
    <path d="M30 38 L36 34 M50 40 L56 36 M70 40 L76 36 M90 38 L96 34"
          stroke="#3a1a08" strokeWidth="0.8" fill="none" />
    <circle cx="42" cy="44" r="1" fill="#3a1a08" />
    <circle cx="80" cy="42" r="1" fill="#3a1a08" />
  </svg>
);

// ── Footer category icons ─────────────────────────────────────────────────
export const IconLightbulb = ({ size = 22, stroke = "#fff" }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={stroke} strokeWidth="1.8" {...baseLine}>
    <path d="M9 18h6" />
    <path d="M10 22h4" />
    <path d="M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.3 1 2.1V18h6v-1.2c0-.8.4-1.6 1-2.1A7 7 0 0 0 12 2z" />
  </svg>
);

export const IconGlasses = ({ size = 22, stroke = "#fff" }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={stroke} strokeWidth="1.8" {...baseLine}>
    <circle cx="6" cy="14" r="4" />
    <circle cx="18" cy="14" r="4" />
    <line x1="10" y1="14" x2="14" y2="14" />
  </svg>
);

export const IconScissors = ({ size = 22, stroke = "#fff" }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={stroke} strokeWidth="1.8" {...baseLine}>
    <circle cx="6" cy="6" r="3" />
    <circle cx="6" cy="18" r="3" />
    <line x1="9" y1="9" x2="20" y2="20" />
    <line x1="9" y1="15" x2="20" y2="4" />
  </svg>
);

export const IconBeard = ({ size = 22, stroke = "#fff" }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={stroke} strokeWidth="1.8" {...baseLine}>
    <path d="M5 10 Q5 18 12 21 Q19 18 19 10" />
    <line x1="9" y1="6" x2="15" y2="6" />
  </svg>
);

export const IconPalette = ({ size = 22, stroke = "#fff" }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={stroke} strokeWidth="1.8" {...baseLine}>
    <path d="M12 3a9 9 0 1 0 0 18c1 0 1.5-.5 1.5-1.2 0-1-.7-1.6-.7-2.3 0-.7.5-1.2 1.2-1.2H17a4 4 0 0 0 4-4c0-5-4-9-9-9z" />
    <circle cx="7.5" cy="10.5" r="1" fill={stroke} stroke="none" />
    <circle cx="11" cy="7" r="1" fill={stroke} stroke="none" />
    <circle cx="15.5" cy="8.5" r="1" fill={stroke} stroke="none" />
    <circle cx="17.5" cy="12.5" r="1" fill={stroke} stroke="none" />
  </svg>
);

export const IconTie = ({ size = 22, stroke = "#fff" }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={stroke} strokeWidth="1.8" {...baseLine}>
    <path d="M9 3 L15 3 L13 8 L16 20 L12 22 L8 20 L11 8 Z" />
  </svg>
);

export const IconStar = ({ size = 22, stroke = "#fff" }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={stroke} strokeWidth="1.8" {...baseLine}>
    <polygon points="12 2 15 9 22 9 17 14 19 22 12 18 5 22 7 14 2 9 9 9" />
  </svg>
);

export const IconShoe = ({ size = 22, stroke = "#fff" }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={stroke} strokeWidth="1.8" {...baseLine}>
    <path d="M3 16 Q3 11 8 10 Q14 9 18 11 Q22 12 22 16 L22 19 L3 19 Z" />
  </svg>
);

export const IconFace = ({ size = 22, stroke = "#fff" }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={stroke} strokeWidth="1.8" {...baseLine}>
    <ellipse cx="12" cy="12" rx="7" ry="9" />
    <line x1="9" y1="11" x2="9.5" y2="11" />
    <line x1="15" y1="11" x2="15.5" y2="11" />
    <path d="M10 16 Q12 17 14 16" />
  </svg>
);
