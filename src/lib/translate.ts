import { CHICAGO_UTILITY_HINTS } from "./chicago";
import type { DetectedColor } from "../types";

function feetFromText(text: string): number[] {
  const values: number[] = [];
  const pattern =
    /(\d+(?:\.\d+)?)\s*(?:'|′|ft\.?|feet|foot)|(\d+)\s*-\s*(\d+)\s*(?:'|′|ft)/gi;
  for (const match of text.matchAll(pattern)) {
    if (match[1]) {
      values.push(Number(match[1]));
    } else if (match[2] && match[3]) {
      values.push(Number(match[2]) + Number(match[3]) / 12);
    }
  }
  return values.filter((n) => n > 0 && n < 40);
}

function includesAny(text: string, words: string[]): boolean {
  return words.some((word) => new RegExp(`\\b${word}\\b`, "i").test(text));
}

export function buildTranslation(
  colors: DetectedColor[],
  rawText: string,
): string {
  const text = rawText.toUpperCase();
  const sentences: string[] = [];
  const feet = feetFromText(text);
  const cutNumber = text.match(/\bC(?:UT)?\s*(\d+(?:\.\d+)?)/i);
  const fillNumber = text.match(/\bF(?:ILL)?\s*(\d+(?:\.\d+)?)/i);
  const ids = new Set(colors.map((color) => color.id));

  if (cutNumber) {
    sentences.push(
      `Grade needs to be cut down by ${cutNumber[1]} feet.`,
    );
  } else if (includesAny(text, ["CUT", "SAW", "SAWCUT", "REMOVE"])) {
    sentences.push("Cut concrete here for removal/trenching.");
  }

  if (fillNumber) {
    sentences.push(`Grade needs to be filled by ${fillNumber[1]} feet.`);
  }

  const utilityColor = colors.find((color) =>
    ["yellow", "red", "orange", "blue", "green", "purple"].includes(
      color.id,
    ),
  );

  if (utilityColor && feet.length > 0 && !cutNumber && !fillNumber) {
    sentences.push(`Utility is ${formatFeet(feet[0])} deep.`);
  }

  if (ids.has("white")) {
    sentences.push(
      "The white paint is a proposed excavation outline — the contractor marked where they want to work before Chicago 811 locates showed up.",
    );
  }

  if (ids.has("pink")) {
    sentences.push(
      "The pink paint is a temporary survey mark or benchmark for layout, not a buried utility.",
    );
  }

  colors.forEach((color) => {
    if (color.id === "white" || color.id === "pink") {
      return;
    }
    const company = CHICAGO_UTILITY_HINTS[color.id];
    sentences.push(
      `${color.label} paint means ${color.meaning.toLowerCase()}. ${company}`,
    );
  });

  if (includesAny(text, ["COMED", "CE", "EXELON"])) {
    sentences.push("Lettering looks like ComEd (electric).");
  }
  if (includesAny(text, ["PGL", "PEOPLES", "GAS"])) {
    sentences.push("Lettering looks like a gas locate, likely People's Gas.");
  }
  if (includesAny(text, ["CDWM", "DWM", "WATER"])) {
    sentences.push(
      "Lettering looks like Chicago Department of Water Management.",
    );
  }
  if (includesAny(text, ["AT&T", "ATT", "TELE"])) {
    sentences.push("Lettering looks like a telecom locate (often AT&T).");
  }
  if (includesAny(text, ["MH", "MANHOLE"])) {
    sentences.push("The marks may be calling out a manhole nearby.");
  }
  if (includesAny(text, ["WV", "VALVE"])) {
    sentences.push("The marks may be calling out a water valve.");
  }

  if (sentences.length === 0) {
    return "I can see sidewalk in the photo, but I could not confidently read a standard Chicago construction color or painted number. Try a closer shot in daylight, with the paint filling most of the frame.";
  }

  const unique = [...new Set(sentences)];
  return unique.join(" ");
}

function formatFeet(value: number): string {
  if (Number.isInteger(value)) {
    return `${value} feet`;
  }
  return `${value} feet`;
}
