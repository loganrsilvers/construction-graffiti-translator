import type { ChangeEvent } from "react";

type CaptureScreenProps = {
  error: string | null;
  onPick: (file: File) => void;
};

export default function CaptureScreen({ error, onPick }: CaptureScreenProps) {
  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (file) {
      onPick(file);
    }
  }

  return (
    <main className="screen capture">
      <p className="kicker">Chicago sidewalks</p>
      <h1>Construction graffiti translator</h1>
      <p className="lede">
        Photograph the spray paint on the sidewalk. This app reads the colors
        and lettering and explains what crews usually mean — locates, cuts,
        grades, and layout marks.
      </p>

      <div className="actions">
        <label className="btn primary">
          Take a photo
          <input
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleChange}
          />
        </label>
        <label className="btn secondary">
          Upload from camera roll
          <input type="file" accept="image/*" onChange={handleChange} />
        </label>
      </div>

      {error ? <p className="error">{error}</p> : null}

      <p className="footnote">
        Inside Chicago, buried utilities are marked after a DIGGER / Chicago 811
        ticket. This is a curiosity tool, not a locate.
      </p>
    </main>
  );
}
