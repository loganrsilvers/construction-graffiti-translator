import { legendFor } from "./chicago";
import type { DetectedColor, PaintColorId } from "../types";

function rgbToHsl(
  r: number,
  g: number,
  b: number,
): { h: number; s: number; l: number } {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) {
    return { h: 0, s: 0, l };
  }
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  switch (max) {
    case r:
      h = (g - b) / d + (g < b ? 6 : 0);
      break;
    case g:
      h = (b - r) / d + 2;
      break;
    default:
      h = (r - g) / d + 4;
  }
  return { h: h * 60, s, l };
}

function classifyPaint(h: number, s: number, l: number): PaintColorId | null {
  if (s < 0.18 && l > 0.78) {
    return "white";
  }
  if (s < 0.22 && l >= 0.22 && l <= 0.82) {
    return null;
  }
  if (s < 0.28) {
    return null;
  }

  if (h >= 42 && h < 72 && l > 0.28 && l < 0.88) {
    return "yellow";
  }
  if (h >= 18 && h < 42 && s > 0.35) {
    return "orange";
  }
  if ((h < 14 || h >= 350) && s > 0.4 && l < 0.62) {
    return "red";
  }
  if (h >= 300 && h < 350 && l > 0.45) {
    return "pink";
  }
  if (h >= 255 && h < 300 && s > 0.3) {
    return "purple";
  }
  if (h >= 185 && h < 255 && s > 0.28) {
    return "blue";
  }
  if (h >= 72 && h < 170 && s > 0.28) {
    return "green";
  }
  return null;
}

export async function detectPaintColors(
  image: HTMLImageElement,
): Promise<DetectedColor[]> {
  const canvas = document.createElement("canvas");
  const maxEdge = 160;
  const scale = Math.min(maxEdge / image.width, maxEdge / image.height, 1);
  canvas.width = Math.max(1, Math.round(image.width * scale));
  canvas.height = Math.max(1, Math.round(image.height * scale));
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) {
    return [];
  }
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
  const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const counts: Record<PaintColorId, number> = {
    yellow: 0,
    red: 0,
    orange: 0,
    blue: 0,
    green: 0,
    purple: 0,
    pink: 0,
    white: 0,
  };
  const total = canvas.width * canvas.height;

  for (let i = 0; i < data.length; i += 4) {
    const alpha = data[i + 3];
    if (alpha < 80) {
      continue;
    }
    const { h, s, l } = rgbToHsl(data[i], data[i + 1], data[i + 2]);
    const id = classifyPaint(h, s, l);
    if (id) {
      counts[id] += 1;
    }
  }

  const found: DetectedColor[] = [];
  (Object.keys(counts) as PaintColorId[]).forEach((id) => {
    const share = counts[id] / total;
    const minShare = id === "white" ? 0.045 : 0.012;
    if (share >= minShare) {
      found.push({ ...legendFor(id), share });
    }
  });

  found.sort((a, b) => b.share - a.share);
  return found;
}
