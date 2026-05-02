import { createRoot } from "react-dom/client";
import html2canvas from "html2canvas";
import EditorialTemplate from "../components/EditorialTemplate";
import { getReportContent } from "./templates/content";

// Mount the template into a hidden DOM node, wait for the hero image to load,
// snapshot the node with html2canvas, return a PNG data URL.
export async function composeEditorialReport({ reportType, heroImageUrl, analysis }) {
  const content = getReportContent(reportType, analysis);
  const { width, height } = EditorialTemplate.dimensions;

  // Hidden offscreen container — must be in the DOM so html2canvas can read it.
  const container = document.createElement("div");
  container.style.position = "fixed";
  container.style.left = "-99999px";
  container.style.top = "0";
  container.style.width = `${width}px`;
  container.style.height = `${height}px`;
  container.style.pointerEvents = "none";
  document.body.appendChild(container);

  const root = createRoot(container);

  // Wait for the hero <img> to fire onLoad before capturing.
  const heroLoaded = new Promise((resolve) => {
    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      resolve();
    };
    // Safety timeout in case onLoad never fires (e.g., 0×0 fallback).
    setTimeout(finish, 8000);

    root.render(
      <EditorialTemplate
        heroImageUrl={heroImageUrl}
        content={content}
        onHeroLoad={finish}
      />,
    );
  });

  await heroLoaded;
  // Give the browser one paint cycle so layout settles before snapshotting.
  await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));

  let dataUrl;
  try {
    const canvas = await html2canvas(container.firstChild, {
      backgroundColor: "#fbf7f1",
      scale: 1,
      useCORS: true,
      allowTaint: true,
      logging: false,
      width,
      height,
      windowWidth: width,
      windowHeight: height,
    });
    dataUrl = canvas.toDataURL("image/png");
  } finally {
    root.unmount();
    container.remove();
  }

  return dataUrl;
}
