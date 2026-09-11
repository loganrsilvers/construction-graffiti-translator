import { CHICAGO_COLOR_KEY } from "../lib/chicago";
import type { AnalysisResult } from "../types";

type ResultScreenProps = {
  result: AnalysisResult;
  onDone: () => void;
};

export default function ResultScreen({ result, onDone }: ResultScreenProps) {
  return (
    <main className="screen result">
      <p className="kicker">Translation</p>
      <h1>What that paint is saying</h1>

      <img
        className="photo"
        src={result.imageUrl}
        alt="The sidewalk photo you submitted"
      />

      <section className="card">
        <h2>Translation</h2>
        <p>{result.translation}</p>
      </section>

      <section className="card">
        <h2>Chicago color key</h2>
        <ul className="legend">
          {CHICAGO_COLOR_KEY.map((row) => {
            const seen = result.colors.some((color) => color.id === row.id);
            return (
              <li key={row.id} className={seen ? "seen" : undefined}>
                <span className={`swatch ${row.id}`} />
                <span>
                  <strong>
                    {row.label}
                    {seen ? " — seen in photo" : ""}
                  </strong>
                  <br />
                  {row.meaning}
                </span>
              </li>
            );
          })}
        </ul>
      </section>

      <p className="footnote">
        Marks are usually within 18 inches of the real line, and a locate is
        only valid with a current Chicago 811 / DIGGER ticket. Do not dig from
        this translation.
      </p>

      <button className="btn primary" type="button" onClick={onDone}>
        Done
      </button>
    </main>
  );
}
