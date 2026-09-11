import type { DetectedColor, PaintColorId } from "./types";

export const CHICAGO_COLOR_KEY: {
  id: PaintColorId;
  label: string;
  meaning: string;
}[] = [
  {
    id: "yellow",
    label: "Yellow",
    meaning: "Natural gas, oil, petroleum, steam",
  },
  {
    id: "red",
    label: "Red",
    meaning: "Electric power, cables, conduit, street lighting",
  },
  {
    id: "orange",
    label: "Orange",
    meaning:
      "Telecommunications, fiber optics, cable TV, signal lines",
  },
  {
    id: "blue",
    label: "Blue",
    meaning: "Potable (drinking) water",
  },
  {
    id: "green",
    label: "Green",
    meaning: "Sanitary sewers and storm drain lines",
  },
  {
    id: "purple",
    label: "Purple",
    meaning: "Reclaimed water, slurry lines, irrigation",
  },
  {
    id: "pink",
    label: "Pink",
    meaning: "Temporary survey markings / benchmarks",
  },
  {
    id: "white",
    label: "White",
    meaning:
      "Proposed excavation limits (drawn by contractors before 811 arrives)",
  },
];

export const CHICAGO_UTILITY_HINTS: Record<PaintColorId, string> = {
  yellow:
    "In Chicago this is often People's Gas or a steam/petroleum line.",
  red: "In Chicago this is often ComEd power or street lighting conduit.",
  orange:
    "In Chicago this is often AT&T, Comcast, or city signal / fiber lines.",
  blue: "In Chicago this is often Department of Water Management drinking water.",
  green:
    "In Chicago this is often a sewer or storm drain owned by the city.",
  purple: "This is non-potable water — irrigation, slurry, or reclaimed lines.",
  pink: "This is layout / survey paint, not a buried utility locate.",
  white:
    "This is the contractor's proposed work area, painted before locates.",
};

export function legendFor(id: PaintColorId): DetectedColor {
  const row = CHICAGO_COLOR_KEY.find((item) => item.id === id)!;
  return { ...row, share: 0 };
}
