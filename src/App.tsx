import { useState } from "react";
import { analyzePhoto } from "./lib/analyze";
import type { AnalysisResult } from "./types";
import CaptureScreen from "./screens/CaptureScreen";
import LoadingScreen from "./screens/LoadingScreen";
import ResultScreen from "./screens/ResultScreen";

type Screen = "capture" | "loading" | "result";

export default function App() {
  const [screen, setScreen] = useState<Screen>("capture");
  const [progress, setProgress] = useState({ label: "", amount: 0 });
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handlePick(file: File) {
    setError(null);
    setScreen("loading");
    setProgress({ label: "Opening photo…", amount: 0.05 });
    try {
      const next = await analyzePhoto(file, (label, amount) => {
        setProgress({ label, amount });
      });
      setResult(next);
      setScreen("result");
    } catch (caught) {
      setScreen("capture");
      setError(
        caught instanceof Error
          ? caught.message
          : "Something went wrong reading that photo.",
      );
    }
  }

  function handleDone() {
    if (result?.imageUrl) {
      URL.revokeObjectURL(result.imageUrl);
    }
    setResult(null);
    setProgress({ label: "", amount: 0 });
    setScreen("capture");
  }

  if (screen === "loading") {
    return <LoadingScreen label={progress.label} amount={progress.amount} />;
  }

  if (screen === "result" && result) {
    return <ResultScreen result={result} onDone={handleDone} />;
  }

  return <CaptureScreen error={error} onPick={handlePick} />;
}
