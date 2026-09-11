# Construction Graffiti Translator

A mobile-first website that explains spray paint on Chicago sidewalks. Take a photo or pick one from your camera roll, wait while it reads colors and lettering, then see a plain-English translation. **Done** takes you back. There is no history and no account.

It is built to run **for free**: everything happens in the browser. No API key and no server.

## How to run locally

You need [Node.js](https://nodejs.org/) installed.

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`) on your computer, or on your phone if it is on the same Wi-Fi (`npm run dev` already listens on the network).

## How it works

1. `src/screens/CaptureScreen.tsx` — camera and camera-roll buttons
2. `src/screens/LoadingScreen.tsx` — progress while the photo is analyzed
3. `src/lib/colors.ts` — finds APWA / Chicago 811 paint colors
4. `src/lib/ocr.ts` — reads numbers and words with Tesseract (in the browser)
5. `src/lib/translate.ts` and `src/lib/chicago.ts` — turns colors + text into sentences
6. `src/screens/ResultScreen.tsx` — original photo, translation, Chicago color key, Done

Chicago locates use **DIGGER / Chicago 811** and the APWA color code. The app is a curiosity translator, not a substitute for a real ticket.

## Put it on the web (free)

Because this is a static site, GitHub Pages or any static host works.

```bash
npm run build
```

The `dist/` folder is the site. This repo also has a GitHub Pages workflow: in the GitHub repo go to **Settings → Pages → Source: GitHub Actions**. After you push `main`, Pages will publish it.

Spray-paint OCR is imperfect. The color reading is the more reliable part; a closer, brighter photo helps.
