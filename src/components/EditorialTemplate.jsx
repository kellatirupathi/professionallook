// Per-category editorial poster, matching the reference design.
// Dimensions: 1536×1024 (landscape 3:2). Inline styles for html2canvas.

const TEMPLATE_W = 1536;
const TEMPLATE_H = 1024;

const FONT =
  "'Helvetica Neue', Helvetica, Arial, 'Segoe UI', system-ui, sans-serif";

function CheckBadge({ label, color = "#10b981" }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
      <span
        style={{
          width: "22px",
          height: "22px",
          borderRadius: "4px",
          background: color,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff"
             strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </span>
      <span style={{
        fontSize: "14px",
        fontWeight: 800,
        letterSpacing: "0.16em",
        color,
      }}>
        {label}
      </span>
    </div>
  );
}

function CrossBadge({ label }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
      <span
        style={{
          width: "22px",
          height: "22px",
          borderRadius: "999px",
          background: "#dc2626",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff"
             strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 6 6 18" />
          <path d="m6 6 12 12" />
        </svg>
      </span>
      <span style={{
        fontSize: "14px",
        fontWeight: 800,
        letterSpacing: "0.16em",
        color: "#dc2626",
      }}>
        {label}
      </span>
    </div>
  );
}

function IconCard({ Icon, label, sub, w = 110, h = 110 }) {
  return (
    <div style={{
      border: "1px solid #d8d2c4",
      background: "#fbf7ee",
      borderRadius: "8px",
      padding: "10px 8px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "flex-start",
      gap: "6px",
      width: `${w}px`,
      minHeight: `${h}px`,
    }}>
      <div style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "60px",
      }}>
        {Icon ? <Icon /> : null}
      </div>
      <p style={{
        fontSize: "11px",
        fontWeight: 700,
        margin: 0,
        textAlign: "center",
        color: "#1a1a1a",
        lineHeight: 1.2,
      }}>
        {label}
      </p>
      {sub ? (
        <p style={{
          fontSize: "9px",
          margin: 0,
          textAlign: "center",
          color: "#6b6b6b",
        }}>
          {sub}
        </p>
      ) : null}
    </div>
  );
}

function TipsBox({ header, tips, accentColour }) {
  return (
    <div style={{
      background: "#fbf3e0",
      border: "1px solid #e6d8b0",
      borderRadius: "8px",
      padding: "16px 18px",
    }}>
      <p style={{
        fontSize: "13px",
        fontWeight: 800,
        letterSpacing: "0.16em",
        margin: "0 0 10px 0",
        color: accentColour,
      }}>
        {header}
      </p>
      <ul style={{ margin: 0, paddingLeft: "18px", listStyle: "disc" }}>
        {tips.map((t, i) => (
          <li key={i} style={{
            fontSize: "13px",
            lineHeight: 1.55,
            color: "#1a1a1a",
            marginBottom: "2px",
          }}>{t}</li>
        ))}
      </ul>
    </div>
  );
}

function ColourSwatchGrid({ colours, perRow = 6 }) {
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: `repeat(${perRow}, 1fr)`,
      gap: "8px",
    }}>
      {colours.map((hex, i) => (
        <span key={i} style={{
          width: "100%",
          aspectRatio: "1 / 1",
          borderRadius: "999px",
          background: hex,
          border: "1px solid #d8d2c4",
          display: "block",
        }} />
      ))}
    </div>
  );
}

// ── Colour Analysis layout (specialised) ──────────────────────────────────
function ColourAnalysisBody({ content }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
      <div style={{ textAlign: "center" }}>
        <p style={{ fontSize: "13px", fontWeight: 800, letterSpacing: "0.16em",
                    color: content.accent.bar, margin: 0 }}>
          YOUR SEASON
        </p>
        <p style={{ fontSize: "26px", fontWeight: 800, color: "#1a1a1a", margin: "4px 0 4px 0" }}>
          {content.season}
        </p>
        <p style={{ fontSize: "12px", color: "#6b6b6b", margin: 0 }}>
          {content.seasonSubtitle}
        </p>
      </div>

      <div>
        <p style={{ fontSize: "12px", fontWeight: 800, letterSpacing: "0.18em",
                    color: content.accent.bar, margin: "0 0 8px 0", textAlign: "center" }}>
          BEST COLOURS FOR YOU
        </p>
        <ColourSwatchGrid colours={content.bestColours} perRow={6} />
      </div>

      <div>
        <p style={{ fontSize: "12px", fontWeight: 800, letterSpacing: "0.18em",
                    color: content.accent.bar, margin: "0 0 8px 0", textAlign: "center" }}>
          NEUTRALS
        </p>
        <ColourSwatchGrid colours={content.neutrals} perRow={8} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
        <div style={{ background: "#eef9f1", border: "1px solid #c5e8d2",
                      borderRadius: "8px", padding: "12px 14px" }}>
          <CheckBadge label="WEAR" />
          <p style={{ fontSize: "12px", lineHeight: 1.55, color: "#1a1a1a", margin: 0 }}>
            {content.wear.join(", ")}
          </p>
        </div>
        <div style={{ background: "#fef5f5", border: "1px solid #f3c8c8",
                      borderRadius: "8px", padding: "12px 14px" }}>
          <CrossBadge label="AVOID" />
          <p style={{ fontSize: "12px", lineHeight: 1.55, color: "#1a1a1a", margin: 0 }}>
            {content.avoid.join(", ")}
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Generic right column (Hair / Spectacles / Beard) ──────────────────────
function StandardRightColumn({ content }) {
  const { recommendedHeader, recommended, tipsHeader, tips, avoid, accent } = content;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <div>
        <CheckBadge label={recommendedHeader} />
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          {recommended.map((item, i) => (
            <IconCard key={i} Icon={item.Icon} label={item.label} sub={item.sub} w={132} h={120} />
          ))}
        </div>
      </div>

      <TipsBox header={tipsHeader} tips={tips} accentColour={accent.bar} />

      <div>
        <CrossBadge label="AVOID" />
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          {avoid.map((item, i) => (
            <IconCard key={i} Icon={item.Icon} label={item.label} w={132} h={120} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Face Shape Guide (specialised) ────────────────────────────────────────
function FaceShapeBody({ content }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "20px",
                    alignItems: "center" }}>
        <div>
          <p style={{ fontSize: "13px", fontWeight: 800, letterSpacing: "0.16em",
                      color: content.accent.bar, margin: 0 }}>
            YOUR FACE SHAPE
          </p>
          <p style={{ fontSize: "32px", fontWeight: 800, color: "#1a1a1a",
                      margin: "6px 0 14px 0", letterSpacing: "0.04em" }}>
            INVERTED TRIANGLE
          </p>
          <ul style={{ margin: 0, paddingLeft: "18px", fontSize: "14px",
                       lineHeight: 1.6, color: "#1a1a1a" }}>
            {content.tips.map((t, i) => <li key={i}>{t}</li>)}
          </ul>
        </div>
        <div>{(() => {
          const Diag = content.recommended[0]?.Icon;
          return Diag ? <Diag /> : null;
        })()}</div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
        <div>
          <CheckBadge label="WHAT WORKS BEST" />
          <ul style={{ margin: 0, paddingLeft: "18px", fontSize: "13px",
                       lineHeight: 1.6, color: "#1a1a1a" }}>
            {content.whatWorks.map((w, i) => <li key={i}>{w}</li>)}
          </ul>
        </div>
        <div>
          <CrossBadge label="AVOID" />
          <ul style={{ margin: 0, paddingLeft: "18px", fontSize: "13px",
                       lineHeight: 1.6, color: "#1a1a1a" }}>
            {content.avoid.map((a, i) => <li key={i}>{a.label}</li>)}
          </ul>
        </div>
      </div>
    </div>
  );
}

// ── Footwear (specialised — has colour row too) ──────────────────────────
function FootwearBody({ content }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <div>
        <CheckBadge label={content.recommendedHeader} />
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          {content.recommended.map((item, i) => (
            <IconCard key={i} Icon={item.Icon} label={item.label} sub={item.sub} w={150} h={130} />
          ))}
        </div>
      </div>

      <div>
        <p style={{ fontSize: "12px", fontWeight: 800, letterSpacing: "0.18em",
                    color: content.accent.bar, margin: "0 0 8px 0" }}>
          BEST COLOURS
        </p>
        <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
          {content.bestColours.map((hex, i) => (
            <div key={i} style={{ display: "flex", flexDirection: "column",
                                  alignItems: "center", gap: "4px" }}>
              <span style={{ width: "32px", height: "32px", borderRadius: "999px",
                              background: hex, border: "1px solid #d8d2c4" }} />
              <span style={{ fontSize: "10px", color: "#1a1a1a" }}>
                {content.bestColoursLabels[i]}
              </span>
            </div>
          ))}
        </div>
      </div>

      <TipsBox header={content.tipsHeader} tips={content.tips} accentColour={content.accent.bar} />

      <div>
        <CrossBadge label="AVOID" />
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          {content.avoid.map((item, i) => (
            <IconCard key={i} Icon={item.Icon} label={item.label} w={150} h={120} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Accessories (with extras row) ────────────────────────────────────────
function AccessoriesBody({ content }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
      <div>
        <CheckBadge label={content.recommendedHeader} />
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          {content.recommended.map((item, i) => (
            <IconCard key={i} Icon={item.Icon} label={item.label} sub={item.sub} w={130} h={120} />
          ))}
        </div>
      </div>

      <div>
        <p style={{ fontSize: "12px", fontWeight: 800, letterSpacing: "0.18em",
                    color: content.accent.bar, margin: "0 0 8px 0" }}>
          {content.tipsHeader}
        </p>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          {content.extras.map((item, i) => (
            <IconCard key={i} Icon={item.Icon} label={item.label} sub={item.sub} w={130} h={110} />
          ))}
        </div>
      </div>

      <div>
        <CrossBadge label="AVOID" />
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          {content.avoid.map((item, i) => (
            <IconCard key={i} Icon={item.Icon} label={item.label} w={130} h={110} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Dress (5 outfits + tips beside, 5 avoid) ─────────────────────────────
function DressBody({ content }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <div>
        <p style={{ fontSize: "13px", fontWeight: 800, letterSpacing: "0.16em",
                    color: content.accent.bar, margin: "0 0 10px 0" }}>
          {content.recommendedHeader}
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "16px" }}>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            {content.recommended.map((item, i) => (
              <IconCard key={i} Icon={item.Icon} label={item.label} sub={item.sub} w={120} h={140} />
            ))}
          </div>
          <div style={{ width: "180px" }}>
            <TipsBox header={content.tipsHeader} tips={content.tips} accentColour={content.accent.bar} />
          </div>
        </div>
      </div>

      <div>
        <CrossBadge label="AVOID" />
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          {content.avoid.map((item, i) => (
            <IconCard key={i} Icon={item.Icon} label={item.label} w={130} h={140} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Body switch ───────────────────────────────────────────────────────────
function Body({ content }) {
  if (content.isColourPalette) return <ColourAnalysisBody content={content} />;
  if (content.title === "FACE SHAPE GUIDE") return <FaceShapeBody content={content} />;
  if (content.title === "FOOTWEAR GUIDE") return <FootwearBody content={content} />;
  if (content.title === "ACCESSORIES GUIDE") return <AccessoriesBody content={content} />;
  if (content.title === "DRESS GUIDE") return <DressBody content={content} />;
  return <StandardRightColumn content={content} />;
}

// ── Main template ────────────────────────────────────────────────────────
export default function EditorialTemplate({ heroImageUrl, content, onHeroLoad }) {
  const FooterIcon = content.footerIcon;

  return (
    <div style={{
      width: `${TEMPLATE_W}px`,
      height: `${TEMPLATE_H}px`,
      background: "#fbf7ee",
      fontFamily: FONT,
      color: "#1a1a1a",
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
      boxSizing: "border-box",
    }}>
      {/* ── Title bar ───────────────────────────────────────────────────── */}
      <div style={{
        background: content.accent.bar,
        padding: "22px 36px",
        display: "flex",
        alignItems: "baseline",
        gap: "20px",
      }}>
        <p style={{
          color: content.accent.text,
          fontSize: "44px",
          fontWeight: 800,
          letterSpacing: "0.02em",
          margin: 0,
          lineHeight: 1,
        }}>
          {content.number}. {content.title}
        </p>
        <p style={{
          color: "#f5f1e8",
          fontSize: "16px",
          fontWeight: 400,
          margin: 0,
          letterSpacing: "0.06em",
        }}>
          {content.subtitle}
        </p>
      </div>

      {/* ── Body ────────────────────────────────────────────────────────── */}
      <div style={{
        flex: 1,
        display: "grid",
        gridTemplateColumns: "560px 1fr",
        minHeight: 0,
      }}>
        {/* Hero (left) */}
        <div style={{
          background: "#1a1a1a",
          overflow: "hidden",
          position: "relative",
        }}>
          {heroImageUrl ? (
            <img
              src={heroImageUrl}
              alt="Editorial portrait"
              crossOrigin="anonymous"
              onLoad={onHeroLoad}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center top",
                display: "block",
              }}
            />
          ) : null}
        </div>

        {/* Right content */}
        <div style={{
          padding: "24px 32px",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}>
          <Body content={content} />
        </div>
      </div>

      {/* ── Footer ──────────────────────────────────────────────────────── */}
      <div style={{
        background: content.accent.bar,
        padding: "16px 36px",
        display: "flex",
        alignItems: "center",
        gap: "14px",
        color: "#f5f1e8",
        fontSize: "13px",
        fontWeight: 600,
        letterSpacing: "0.08em",
      }}>
        {FooterIcon ? <FooterIcon size={22} stroke="#f5f1e8" /> : null}
        {content.footerLabel ? (
          <span style={{ fontWeight: 800, letterSpacing: "0.14em" }}>
            {content.footerLabel}:
          </span>
        ) : null}
        <span style={{ flex: 1 }}>{content.footerText}</span>
      </div>
    </div>
  );
}

EditorialTemplate.dimensions = { width: TEMPLATE_W, height: TEMPLATE_H };
