import { createWorker } from "tesseract.js";

function contrastCanvas(image: HTMLImageElement): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  const maxEdge = 900;
  const scale = Math.min(maxEdge / image.width, maxEdge / image.height, 1);
  canvas.width = Math.max(1, Math.round(image.width * scale));
  canvas.height = Math.max(1, Math.round(image.height * scale));
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return canvas;
  }
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
  const frame = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const pixels = frame.data;
  for (let i = 0; i < pixels.length; i += 4) {
    const gray =
      0.2126 * pixels[i] + 0.7152 * pixels[i + 1] + 0.0722 * pixels[i + 2];
    const boosted = gray < 140 ? 0 : 255;
    pixels[i] = boosted;
    pixels[i + 1] = boosted;
    pixels[i + 2] = boosted;
  }
  ctx.putImageData(frame, 0, 0);
  return canvas;
}

export async function readPaintedText(
  image: HTMLImageElement,
  onProgress?: (progress: number) => void,
): Promise<string> {
  const worker = await createWorker("eng", 1, {
    logger: (message) => {
      if (message.status === "recognizing text" && onProgress) {
        onProgress(message.progress);
      }
    },
  });
  try {
    const contrasted = contrastCanvas(image);
    const { data } = await worker.recognize(contrasted);
    return data.text.replace(/\s+/g, " ").trim();
  } finally {
    await worker.terminate();
  }
}
