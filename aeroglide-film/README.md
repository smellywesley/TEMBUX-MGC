# AeroGlide Film — W1 Remotion Pipeline

## Film2 (current) — the all-designed rebuild
`src/Film2.tsx` (~2:29, composition id `Film2`) is the ground-up rebuild: every
scene is 100% code-rendered SVG/CSS (no footage, no AI generation, no
placeholders — zero risk of a broken/missing asset in the published video).
Three acts: warm-illustrated human problem (`src/film2/scenesA.tsx`) → dark
engineering proof (`scenesB.tsx`) → warm market/close (`scenesC.tsx`), sharing
`src/film2/kit.tsx`'s illustration vocabulary. Render: `npx remotion render
src/index.ts Film2 out/film2.mp4 --codec h264`.

**No audio.** The connected media-generation account has 0 credits (verified),
so AI voiceover/music isn't available, and no royalty-free library is
connected. Rather than bolt on a crude synthesized drone to fill the silence,
the film ships silent — it already reads fully muted, since every claim is
carried on-screen (captions, numbers, labels). Add real narration or a scored
track in post; `MARKERS2` in `Film2.tsx` gives exact frame offsets per scene
for VO sync.

---


3:45 competition film (Team TembuX · Medical Grand Challenge 2026 · Project 1464).
1920×1080 · 30 fps · 6750 frames. Built per `SPEC.md` (the consolidated master prompt).

## Install & preview
```bash
cd aeroglide-film
npm install
npm run studio          # Remotion Studio — scrub the Film or any S-composition
npm run render          # full DoD render -> out/film.mp4 (h264)
npm run preview-render  # 0.5-scale fast preview -> out/film-preview.mp4
# single scene:
npx remotion render src/index.ts S03-ForceBar out/s03.mp4 --codec h264
```

## Footage drop-in
Put clips in `public/footage/` at the manifest filenames (e.g. `s01_cold_open.mp4`),
then add the filename to `AVAILABLE_FOOTAGE` in `src/slots/FootageSlot.tsx`.
Until then the slot renders the labelled MISSING placeholder — the timeline always
renders end-to-end.

## Retiming
All slot timings live in `src/slotManifest.ts` (single source of truth). `MARKERS`
exports every slot start frame for VO sync. FailureTracker X stamp frames are
`X_STAMPS` in the same file.

## v2 source segmentation
`public/source/v2_master.mp4` is the existing 60 s product animation. Cuts (already
produced into `public/footage/`) were adjusted from the spec's nominal timestamps —
verified frame-by-frame so no old branding leaks:

| Segment | Master window | Note |
|---|---|---|
| v2_beauty | 0.2–4.3 s | silhouette hero (spec's 12–16 s window carried the baked old title) |
| v2_lift57 | 15.2–22.4 s | full inflation scene |
| v2_exploded | 22.6–29.9 s | baked label column cropped by reframe in S14B |
| v2_materials | 30.0–35.0 s | |
| v2_bridge | 37.4–44.9 s | baked counter KEPT (625 mm / 300 mm travel = Part E dims) |

## Workstream 2 (Blender) status
BLOCKED: Blender is not installed on this machine, and `reference/spec_sheet.(jpeg|png)`
is absent (required by Part A for modeling). §E0 carries the canonical dimensions, so
W2 can start as soon as Blender + the sheet are present. The five Blender slots
(s08_airmat, s11_cushion, s15_clamp, s16_slide, s17_safety) currently render placeholders.
