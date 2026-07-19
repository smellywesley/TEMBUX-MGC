# V2 — Smart Inflatable Seat-Lift & Side Transfer Bridge · Landing Page

Scroll-triggered React-Three-Fiber landing page + 60s video storyboard for the V2 medical device.

## Run
```bash
cd transfer-bridge-landing
npm install
npm run dev        # http://localhost:5199
```

## What's here
| File | What it is |
|------|------------|
| `src/modelData.js` | **Single source of truth** — every dimension/material from the schematic. Edit here. |
| `src/TransferSystem.jsx` | The 3D product: 4 stacked seat layers + telescoping bridge + clamp. Scroll drives rotate + explode. |
| `src/Scene.jsx` | Canvas, studio lighting, procedural reflections, Bloom (neon airflow), scroll track (5 pages). |
| `src/Overlay.jsx` | The scroll-locked marketing copy (Hero → Overview → Engineering → Materials → CTA). |
| `STORYBOARD.md` | **Part 1** — second-by-second 60s reveal, Veo 3 / Sora prompts + Midjourney style frames. |
| `../remotion-video/` | The same 60s storyboard implemented in **Remotion** — renders an actual MP4 (`npm run render`). |
| `MODEL-EXPORT-GUIDE.md` | How to export your CAD to GLB with the right mesh names and swap it in (one component). |

## How the scroll story works (10 pages)
`ScrollControls pages={10}` → `useScroll()` gives a `0..1` offset. Sections:
**0** hero · **1** overview · **2** engineering (stack explodes along Y) ·
**3–8** guided material walkthrough — one layer per page, top cover → base shell: the featured
layer stays solid, floats forward and glows while the other five ghost to 12% opacity, and a
Framer-Motion card slides in with a CSS-built texture swatch + exact spec ·
**9** CTA — the stack reassembles, then the bridge swings out and telescopes to 625 mm.

Tune the trigger ranges (`EXPLODE`, `REASSEMBLE`, `SWING`, `EXTEND`) and the step map
(`featuredStep`) at the top of `TransferSystem.jsx`. **Dev knob:** in the browser console,
`window.__forceOffset = 0.55` previews any scroll position without scrolling (`= null` to release).

## Notes on the current model
The product is built from **primitives** (`RoundedBox`/boxes) sized to the schematic, so it runs today
with no CAD. It reads as a clean layered engineering model, not a photoreal render — swap in your GLB
(see `MODEL-EXPORT-GUIDE.md`) for the final look. All animation logic is model-agnostic and carries over.
