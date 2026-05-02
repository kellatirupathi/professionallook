import { useEffect, useRef, useState } from "react";
import Loader from "./Loader";

const STATUS_STYLES = {
  queued: "bg-zinc-100 text-zinc-500",
  generating: "bg-blue-50 text-blue-600",
  complete: "bg-emerald-50 text-emerald-700",
  error: "bg-red-50 text-red-600",
};

function StatusTag({ status }) {
  return (
    <span
      className={`rounded-md px-2 py-0.5 text-[10px] font-semibold capitalize ${STATUS_STYLES[status] ?? STATUS_STYLES.queued}`}
    >
      {status}
    </span>
  );
}

const ZOOM_MIN = 1;
const ZOOM_MAX = 6;
const ZOOM_STEP = 0.25;

function Lightbox({ image, onClose }) {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const dragRef = useRef({ active: false, startX: 0, startY: 0, panX: 0, panY: 0 });

  // Reset transform whenever a new image opens.
  useEffect(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, [image?.imageUrl]);

  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") onClose();
      if (e.key === "+" || e.key === "=") setZoom((z) => Math.min(ZOOM_MAX, z + ZOOM_STEP));
      if (e.key === "-" || e.key === "_") setZoom((z) => Math.max(ZOOM_MIN, z - ZOOM_STEP));
      if (e.key === "0") {
        setZoom(1);
        setPan({ x: 0, y: 0 });
      }
    }
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  if (!image) return null;

  const downloadName = `${image.report.toLowerCase().replace(/\s+/g, "-")}.png`;

  function zoomIn() {
    setZoom((z) => Math.min(ZOOM_MAX, +(z + ZOOM_STEP).toFixed(2)));
  }
  function zoomOut() {
    setZoom((z) => {
      const next = Math.max(ZOOM_MIN, +(z - ZOOM_STEP).toFixed(2));
      if (next === 1) setPan({ x: 0, y: 0 });
      return next;
    });
  }
  function resetView() {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }

  function onWheel(e) {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -ZOOM_STEP : ZOOM_STEP;
    setZoom((z) => {
      const next = Math.max(ZOOM_MIN, Math.min(ZOOM_MAX, +(z + delta).toFixed(2)));
      if (next === 1) setPan({ x: 0, y: 0 });
      return next;
    });
  }

  function onMouseDown(e) {
    if (zoom === 1) return;
    dragRef.current = {
      active: true,
      startX: e.clientX,
      startY: e.clientY,
      panX: pan.x,
      panY: pan.y,
    };
  }
  function onMouseMove(e) {
    if (!dragRef.current.active) return;
    setPan({
      x: dragRef.current.panX + (e.clientX - dragRef.current.startX),
      y: dragRef.current.panY + (e.clientY - dragRef.current.startY),
    });
  }
  function onMouseUp() {
    dragRef.current.active = false;
  }
  function onDoubleClick() {
    if (zoom === 1) setZoom(2);
    else resetView();
  }

  const cursor = zoom > 1 ? (dragRef.current.active ? "grabbing" : "grab") : "zoom-in";

  return (
    <div className="fixed inset-0 z-[100] bg-black/95">
      {/* ── Top bar (floats over the image so the image gets full viewport) */}
      <div className="absolute inset-x-0 top-0 z-10 flex items-center gap-2 bg-gradient-to-b from-black/70 to-transparent px-4 py-3 sm:px-6">
        <a
          href={image.imageUrl}
          download={downloadName}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
          aria-label="Download"
          title="Download"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
               strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
            <path d="M12 3v12" />
            <path d="m7 10 5 5 5-5" />
            <path d="M5 21h14" />
          </svg>
        </a>

        <div className="flex-1" />

        <button
          type="button"
          onClick={zoomOut}
          disabled={zoom <= ZOOM_MIN}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Zoom out"
          title="Zoom out (−)"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
               strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
            <path d="M5 12h14" />
          </svg>
        </button>

        <button
          type="button"
          onClick={resetView}
          className="rounded-full bg-white/10 px-3 py-2 text-xs font-semibold text-white transition hover:bg-white/20"
          title="Reset (0)"
        >
          {Math.round(zoom * 100)}%
        </button>

        <button
          type="button"
          onClick={zoomIn}
          disabled={zoom >= ZOOM_MAX}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Zoom in"
          title="Zoom in (+)"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
               strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
            <path d="M12 5v14" />
            <path d="M5 12h14" />
          </svg>
        </button>

        <button
          type="button"
          onClick={onClose}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
          aria-label="Close"
          title="Close (Esc)"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
               strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>
      </div>

      {/* ── Image viewport — full screen, top bar overlays on top ────────── */}
      <div
        className="absolute inset-0 select-none overflow-hidden"
        style={{ cursor }}
        onWheel={onWheel}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        onDoubleClick={onDoubleClick}
      >
        <img
          src={image.imageUrl}
          alt={image.report}
          draggable={false}
          className="absolute left-1/2 top-1/2 max-h-full max-w-full"
          style={{
            transform: `translate(-50%, -50%) translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: "center center",
            transition: dragRef.current.active ? "none" : "transform 0.12s ease-out",
            objectFit: "contain",
            maxHeight: "100%",
            maxWidth: "100%",
          }}
        />
      </div>
    </div>
  );
}

export default function ImageGenerator({ items }) {
  const [lightboxImage, setLightboxImage] = useState(null);

  if (!items?.length) return null;

  return (
    <>
      <div className="grid w-full grid-cols-2 gap-5">
        {items.map((item) => (
          <article key={item.report} className="w-full">
            <div className="mb-2 flex items-center justify-between gap-2">
              <p className="min-w-0 truncate text-xs font-semibold text-zinc-900">
                {item.report}
              </p>
              <StatusTag status={item.status} />
            </div>

            <div className="aspect-square w-full overflow-hidden rounded-lg bg-zinc-50">
              {item.status === "complete" && item.imageUrl ? (
                <button
                  type="button"
                  onClick={() => setLightboxImage(item)}
                  className="block h-full w-full"
                  aria-label={`Open ${item.report}`}
                >
                  <img
                    src={item.imageUrl}
                    alt={item.report}
                    className="h-full w-full cursor-zoom-in object-cover object-top transition hover:opacity-90"
                  />
                </button>
              ) : item.status === "generating" ? (
                <div className="flex h-full w-full items-center justify-center p-3">
                  <Loader label="Generating" />
                </div>
              ) : item.status === "error" ? (
                <div className="flex h-full w-full items-center justify-center p-3 text-center">
                  <p className="text-[11px] leading-snug text-red-600">{item.error}</p>
                </div>
              ) : (
                <div className="flex h-full w-full items-center justify-center p-3">
                  <p className="text-[11px] text-zinc-400">Queued</p>
                </div>
              )}
            </div>
          </article>
        ))}
      </div>

      <Lightbox image={lightboxImage} onClose={() => setLightboxImage(null)} />
    </>
  );
}
