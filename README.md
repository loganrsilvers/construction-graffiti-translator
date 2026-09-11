# 🎨 Construction Graffiti Translator

A mobile-first web app that translates the spray-painted marks you see on Chicago sidewalks into plain English. Snap a photo (or upload one), and it reads the paint colors and lettering to explain what construction crews usually mean — locates, cuts, grades, and layout marks.

**Live app:** [loganrsilvers.github.io/construction-graffiti-translator](https://loganrsilvers.github.io/construction-graffiti-translator/)

No sign-up, no history, no account. Take a photo, get a translation, hit **Done**, start over.

---

## How it works

1. **Capture** — take a photo or pick one from your camera roll
<img width="542" height="522" alt="Screenshot 2026-09-10 205807" src="https://github.com/user-attachments/assets/cbabc259-2a53-4f87-9ac4-8d763cf5e621" />
3. **Color detection** — the image is scanned for APWA / Chicago 811 paint colors (yellow, red, orange, blue, green, purple, pink, white)
<img width="538" height="592" alt="Screenshot 2026-09-10 205842" src="https://github.com/user-attachments/assets/ff218f64-d31c-4c2d-a8cb-c00feb194e34" />
5. **OCR** — [Tesseract.js](https://github.com/naptha/tesseract.js) reads any painted numbers and lettering, right in the browser
<img width="617" height="255" alt="Screenshot 2026-09-10 205816" src="https://github.com/user-attachments/assets/7dd69d12-fa92-48a0-b495-9ff6218ce313" />
7. **Translation** — colors + text are combined into a plain-English sentence describing what the marks likely mean
9. **Result** — you see your original photo, the translation, and a Chicago color-code legend
<img width="536" height="757" alt="Screenshot 2026-09-10 205827" src="https://github.com/user-attachments/assets/74feb81a-7047-4ea1-b77a-a49bce63571b" />

Everything runs client-side. No API key, no backend, no server costs.

> This is a curiosity tool, not a substitute for a real utility locate. For actual digging in Chicago, always call **DIGGER / Chicago 811** before you dig.

---

## Tech stack

- [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/) for bundling
- [Tesseract.js](https://github.com/naptha/tesseract.js) for in-browser OCR
- Deployed as a static site via **GitHub Pages** + **GitHub Actions**

---

## Project structure

```
src/
├── main.tsx                  # React entry point
├── App.tsx                   # Screen routing (capture → loading → result)
├── screens/
│   ├── CaptureScreen.tsx     # Camera / camera-roll buttons
│   ├── LoadingScreen.tsx     # Progress while the photo is analyzed
│   └── ResultScreen.tsx      # Photo, translation, color key, Done button
└── lib/
    ├── analyze.ts            # Orchestrates the full analysis pipeline
    ├── colors.ts             # Detects APWA / Chicago 811 paint colors
    ├── ocr.ts                 # Reads painted text with Tesseract.js
    ├── translate.ts           # Turns colors + text into plain-English sentences
    └── chicago.ts              # Chicago-specific color legend and utility hints
```

---

## Running locally

You'll need [Node.js](https://nodejs.org/) installed.

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`). Since `npm run dev` listens on your network, you can also open it on your phone if it's on the same Wi-Fi — handy for testing the camera capture flow.

---

## Deploying (free, via GitHub Pages)

This repo already includes a GitHub Actions workflow (`.github/workflows/deploy.yml`) that builds and deploys automatically on every push to `main`:

```
npm install → npm run build → deploy dist/ to GitHub Pages
```

To set it up on your own fork:

1. Go to **Settings → Pages**
2. Under **Build and deployment → Source**, select **GitHub Actions**
3. Push to `main` — the workflow will build and publish the site automatically

> **Note:** if you ever flip Source between "Deploy from a branch" and "GitHub Actions," GitHub's Pages backend can occasionally get stuck serving the old configuration even after the switch shows as saved. If a deploy shows green in Actions but the live site still doesn't reflect your changes, check the actual response with:
> ```bash
> curl -sI https://<username>.github.io/<repo>/
> ```
> Compare `Content-Length` to your local `dist/index.html` size. If they don't match, toggle Pages Source off and back on to force a clean reconnect.

**Do not** commit `node_modules/` or `dist/` to the repo — the workflow builds fresh on every push, and committing build output just causes conflicts. Both are already excluded via `.gitignore`.

---

## Notes

- Spray-paint OCR is imperfect by nature — a closer, brighter, less-angled photo helps a lot.
- Color detection is generally the more reliable signal of the two.
- Locate colors follow the APWA Uniform Color Code as adapted by Chicago 811 / DIGGER.
