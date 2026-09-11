type LoadingScreenProps = {
  label: string;
  amount: number;
};

export default function LoadingScreen({ label, amount }: LoadingScreenProps) {
  const percent = Math.round(amount * 100);

  return (
    <main className="screen loading">
      <p className="kicker">Reading the sidewalk</p>
      <h1>Translating paint…</h1>
      <div
        className="meter"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
        aria-label="Translation progress"
      >
        <span style={{ width: `${percent}%` }} />
      </div>
      <p className="lede">{label}</p>
    </main>
  );
}
