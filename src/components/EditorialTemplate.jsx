// Renders one editorial report poster. Sized 1024 × 1536 to match the AI hero.
// Plain inline styles (no Tailwind) so html2canvas captures it deterministically.

const TEMPLATE_W = 1536;
const TEMPLATE_H = 1024;

function CheckIcon({ size = 18, color = "#10b981" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={3}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function CrossIcon({ size = 18, color = "#dc2626" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={3}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

export default function EditorialTemplate({ heroImageUrl, content, onHeroLoad }) {
  const { number, title, subtitle, accent, recommended, tips, avoid, footer, palette } =
    content;

  return (
    <div
      style={{
        width: `${TEMPLATE_W}px`,
        height: `${TEMPLATE_H}px`,
        background: "#fbf7f1",
        fontFamily:
          "'Helvetica Neue', Helvetica, Arial, 'Segoe UI', system-ui, sans-serif",
        color: "#1a1a1a",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        boxSizing: "border-box",
      }}
    >
      {/* ── Title bar ────────────────────────────────────────────────────── */}
      <div
        style={{
          background: accent.bar,
          padding: "28px 36px",
          display: "flex",
          alignItems: "baseline",
          gap: "20px",
        }}
      >
        <p
          style={{
            color: accent.text,
            fontSize: "44px",
            fontWeight: 800,
            letterSpacing: "0.02em",
            margin: 0,
            lineHeight: 1,
          }}
        >
          {number}. {title}
        </p>
        <p
          style={{
            color: "#f5f1e8",
            fontSize: "18px",
            fontWeight: 400,
            margin: 0,
            letterSpacing: "0.06em",
          }}
        >
          {subtitle}
        </p>
      </div>

      {/* ── Body ─────────────────────────────────────────────────────────── */}
      <div
        style={{
          flex: 1,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "0",
          padding: "0",
        }}
      >
        {/* Hero image (left) */}
        <div
          style={{
            position: "relative",
            background: "#1a1a1a",
            overflow: "hidden",
          }}
        >
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

        {/* Content (right) */}
        <div
          style={{
            padding: "36px 36px 24px 36px",
            display: "flex",
            flexDirection: "column",
            gap: "24px",
            overflow: "hidden",
          }}
        >
          {/* Recommended block */}
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "12px",
              }}
            >
              <CheckIcon size={20} />
              <span
                style={{
                  fontSize: "14px",
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  color: "#10b981",
                }}
              >
                RECOMMENDED
              </span>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr",
                gap: "8px",
              }}
            >
              {recommended.slice(0, 5).map((item) => (
                <div
                  key={item.label}
                  style={{
                    border: "1px solid #d8d2c4",
                    background: "#ffffff",
                    borderRadius: "8px",
                    padding: "10px 14px",
                  }}
                >
                  <p
                    style={{
                      fontSize: "16px",
                      fontWeight: 600,
                      margin: 0,
                      color: "#1a1a1a",
                    }}
                  >
                    {item.label}
                  </p>
                  <p
                    style={{
                      fontSize: "13px",
                      margin: "2px 0 0 0",
                      color: "#6b6b6b",
                    }}
                  >
                    {item.sub}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Tips block */}
          <div>
            <p
              style={{
                fontSize: "14px",
                fontWeight: 700,
                letterSpacing: "0.12em",
                color: accent.bar,
                margin: "0 0 10px 0",
              }}
            >
              TIPS
            </p>
            <ul
              style={{
                margin: 0,
                paddingLeft: "20px",
                fontSize: "14px",
                lineHeight: 1.55,
                color: "#2a2a2a",
              }}
            >
              {tips.map((t, i) => (
                <li key={i} style={{ marginBottom: "4px" }}>
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* ── Avoid panel (below the split) ────────────────────────────────── */}
      <div
        style={{
          background: "#ffffff",
          borderTop: "1px solid #d8d2c4",
          padding: "20px 36px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "12px",
          }}
        >
          <CrossIcon size={18} />
          <span
            style={{
              fontSize: "14px",
              fontWeight: 700,
              letterSpacing: "0.12em",
              color: "#dc2626",
            }}
          >
            AVOID
          </span>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${Math.min(avoid.length, 4)}, 1fr)`,
            gap: "10px",
          }}
        >
          {avoid.map((item) => (
            <div
              key={item.label}
              style={{
                border: "1px solid #f3c8c8",
                background: "#fef5f5",
                borderRadius: "8px",
                padding: "10px 12px",
              }}
            >
              <p
                style={{
                  fontSize: "14px",
                  fontWeight: 600,
                  margin: 0,
                  color: "#1a1a1a",
                }}
              >
                {item.label}
              </p>
              <p
                style={{
                  fontSize: "12px",
                  margin: "2px 0 0 0",
                  color: "#7a7a7a",
                }}
              >
                {item.sub}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Optional palette (Colour Analysis only) ──────────────────────── */}
      {palette ? (
        <div
          style={{
            background: "#fbf7f1",
            padding: "16px 36px",
            display: "flex",
            gap: "8px",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <span
            style={{
              fontSize: "12px",
              fontWeight: 700,
              letterSpacing: "0.12em",
              color: accent.bar,
              marginRight: "6px",
            }}
          >
            BEST COLOURS
          </span>
          {palette.map((hex, i) => (
            <span
              key={i}
              style={{
                width: "26px",
                height: "26px",
                borderRadius: "50%",
                background: hex,
                border: "1px solid #d8d2c4",
                display: "inline-block",
              }}
            />
          ))}
        </div>
      ) : null}

      {/* ── Footer bar ───────────────────────────────────────────────────── */}
      <div
        style={{
          background: accent.bar,
          padding: "16px 36px",
          color: "#f5f1e8",
          fontSize: "13px",
          fontWeight: 600,
          letterSpacing: "0.08em",
          textAlign: "center",
        }}
      >
        {footer}
      </div>
    </div>
  );
}

EditorialTemplate.dimensions = { width: TEMPLATE_W, height: TEMPLATE_H };
