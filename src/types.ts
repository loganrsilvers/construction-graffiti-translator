export type PaintColorId =
  | "yellow"
  | "red"
  | "orange"
  | "blue"
  | "green"
  | "purple"
  | "pink"
  | "white";

export type DetectedColor = {
  id: PaintColorId;
  label: string;
  meaning: string;
  share: number;
};

export type AnalysisResult = {
  imageUrl: string;
  colors: DetectedColor[];
  ocrText: string;
  translation: string;
};
