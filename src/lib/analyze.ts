import { detectPaintColors } from "./colors";
import { readPaintedText } from "./ocr";
import { buildTranslation } from "./translate";
import type { AnalysisResult } from "../types";

export type ProgressTick = (label: string, amount: number) => void;

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Could not read that photo."));
    };
    image.src = url;
  });
}

export async function analyzePhoto(
  file: File,
  onProgress: ProgressTick,
): Promise<AnalysisResult> {
  onProgress("Opening photo…", 0.08);
  const image = await loadImage(file);
  const imageUrl = image.src;

  onProgress("Looking at paint colors…", 0.22);
  const colors = await detectPaintColors(image);

  onProgress("Reading painted letters and numbers…", 0.4);
  let ocrText = "";
  try {
    ocrText = await readPaintedText(image, (progress) => {
      onProgress(
        "Reading painted letters and numbers…",
        0.4 + progress * 0.45,
      );
    });
  } catch {
    ocrText = "";
  }

  onProgress("Writing the translation…", 0.92);
  const translation = buildTranslation(colors, ocrText);
  onProgress("Done.", 1);

  return { imageUrl, colors, ocrText, translation };
}
