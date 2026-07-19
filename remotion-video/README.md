# V2 Product Reveal — Remotion Video

The 60-second reveal from `transfer-bridge-landing/STORYBOARD.md`, implemented as code and
rendered to MP4. Stylized motion-design look (2.5D CSS stack, dark + cyan) — for the
photoreal route, feed the Veo 3 / Sora prompts in the storyboard instead.

## Commands
```bash
cd remotion-video
npm install
npm run studio    # live-edit the video in the browser (Remotion Studio)
npm run render    # -> out/product-reveal.mp4 (1920x1080 @ 30fps, 60s)
npx remotion still src/index.jsx ProductReveal out/frame.png --frame=825   # one frame
```

## Structure — 8 clips × 7.5 s (mirrors STORYBOARD.md)
| Frames | Clip | Scene component |
|--------|------|-----------------|
| 0–224 | Cold open — silhouette in haze, breathing seam | `ColdOpen` |
| 225–449 | Hero rotation, lights snap up | `HeroRotation` |
| 450–674 | Pneumatic inflation, 40–60 mm rise | `Inflation` |
| 675–899 | ★ Exploded view, 6 layers + numbered legend | `Exploded` |
| 900–1124 | Material macro montage (6 textures) | `Materials` |
| 1125–1349 | Reassembly + bridge telescopes to 625 mm | `BridgeDeploy` |
| 1350–1574 | Human context, warm bleed | `Context` |
| 1575–1799 | End card + cyan light sweep | `EndCard` |

## Files
- `src/theme.js` — design tokens + the 6-layer data (mirrors `transfer-bridge-landing/src/modelData.js`; keep in sync)
- `src/Stack.jsx` — the reusable 2.5D seat-module stack (explode / glow / rotate props)
- `src/ProductReveal.jsx` — the 8 scenes + `<Series>` timeline
- `out/` — rendered artifacts (gitignore-able)

## Tuning
Every scene is plain React + `interpolate`/`spring` — change timing constants at the top of
`ProductReveal.jsx` (`CLIP` length) or per-scene spring configs. Run `npm run studio` to
scrub the timeline live while editing.
