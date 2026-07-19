import type { FootageSlotProps } from './slots/FootageSlot'

// ---------------------------------------------------------------------------
// Single source of truth for all timings (Part C3). Frames at 30 fps.
// v2 segment note: cuts were adjusted vs the spec's nominal -ss/-to per C5's
// own instruction (verified frame-by-frame so no old branding leaks):
//   v2_beauty   = master 0.2–4.3   (silhouette hero; spec window 12–16 carried
//                                   the baked product title — prohibited)
//   v2_lift57   = master 15.2–22.4 (full inflation scene, 216 frames)
//   v2_exploded = master 22.6–29.9
//   v2_materials= master 30.0–35.0
//   v2_bridge   = master 37.4–44.9 (spec window 35–46 leaked the materials
//                                   tail + the old "not a lifting device" line)
//   Baked bridge counter KEPT: reads 625 mm / 300 mm travel = Part E dims.
// ---------------------------------------------------------------------------

export type Slot = FootageSlotProps & { id: string }

export const SLOTS: Slot[] = [
  { id: 'S01_COLD_OPEN', src: 's01_cold_open.mp4', label: 'S01_COLD_OPEN', from: 0, durationInFrames: 210 },
  { id: 'S02A_MACRO', src: 's02a_macro.mp4', label: 'S02A_MACRO', from: 210, durationInFrames: 120 },
  { id: 'S02B_PROFILE', src: 's02b_profile.mp4', label: 'S02B_PROFILE', from: 330, durationInFrames: 120 },
  { id: 'S04_CORRIDOR', src: 's04_corridor.mp4', label: 'S04_CORRIDOR', from: 780, durationInFrames: 300, dim: 0.55 },
  { id: 'S07_SLIDEBOARD', src: 's07_slideboard.mp4', label: 'S07_SLIDEBOARD', from: 1470, durationInFrames: 270 },
  { id: 'S08_AIRMAT', src: 's08_airmat.mp4', label: 'S08_AIRMAT', from: 1740, durationInFrames: 270 },
  { id: 'S09_HOIST', src: 's09_hoist.mp4', label: 'S09_HOIST', from: 2010, durationInFrames: 240 },
  { id: 'S10_BELT', src: 's10_belt.mp4', label: 'S10_BELT', from: 2250, durationInFrames: 210 },
  { id: 'S11_CUSHION', src: 's11_cushion.mp4', label: 'S11_CUSHION', from: 2460, durationInFrames: 180 },
  { id: 'S13_HERO', src: 'v2_beauty.mp4', label: 'S13_HERO', from: 2850, durationInFrames: 120, v2Grade: true, fill: true },
  {
    id: 'S13B_HERO', src: 'v2_lift57.mp4', label: 'S13B_HERO', from: 2970, durationInFrames: 120,
    v2Grade: true, fill: true, startFrom: 0, endAt: 120,
    reframe: { x: -8, y: 0, scale: 1.15 }, // pushes baked "57 mm" off-frame; Remotion re-annotates
  },
  {
    id: 'S14A_LIFT', src: 'v2_lift57.mp4', label: 'S14A_LIFT', from: 3090, durationInFrames: 210,
    v2Grade: true, fill: true, startFrom: 120, // SPEC DEFECT: source has 216f; 120+210 > 216 — holds last frame ~114f. See report.
  },
  {
    id: 'S14B_EXPLODED', src: 'v2_exploded.mp4', label: 'S14B_EXPLODED', from: 3300, durationInFrames: 150,
    v2Grade: true, fill: true, reframe: { x: 12, y: 0, scale: 1.28 }, // crops baked label column
  },
  { id: 'S14C_MATERIALS_1', src: 'v2_materials.mp4', label: 'S14C_MATERIALS', from: 3450, durationInFrames: 15, v2Grade: true, fill: true, startFrom: 20 },
  { id: 'S14C_MATERIALS_2', src: 'v2_materials.mp4', label: 'S14C_MATERIALS', from: 3465, durationInFrames: 15, v2Grade: true, fill: true, startFrom: 95 },
  { id: 'S15A_DEPLOY', src: 'v2_bridge.mp4', label: 'S15A_DEPLOY', from: 3480, durationInFrames: 150, v2Grade: true, fill: true },
  { id: 'S15B_CLAMP', src: 's15_clamp.mp4', label: 'S15B_CLAMP', from: 3630, durationInFrames: 210 },
  { id: 'S16_SLIDE', src: 's16_slide.mp4', label: 'S16_SLIDE', from: 3840, durationInFrames: 300 },
  { id: 'S17_SAFETY', src: 's17_safety.mp4', label: 'S17_SAFETY', from: 4140, durationInFrames: 360 },
  { id: 'S18_BENCH', src: 's18_bench.mp4', label: 'S18_BENCH', from: 4500, durationInFrames: 360 },
  { id: 'S19_NURSE', src: 's19_nurse.mp4', label: 'S19_NURSE', from: 4860, durationInFrames: 300 },
  { id: 'S21_HOME', src: 's21_home.mp4', label: 'S21_HOME', from: 5460, durationInFrames: 360, dim: 0.55 },
  { id: 'S23_BOOKEND', src: 's23_bookend.mp4', label: 'S23_BOOKEND', from: 5820, durationInFrames: 300 },
]

// Pure-Remotion spans (for reference/markers)
export const GRAPHIC_SPANS = [
  { id: 'S03_FORCEBAR', from: 450, durationInFrames: 330 },
  { id: 'S04_ISOTYPE', from: 780, durationInFrames: 300 },
  { id: 'S05_DEMAND', from: 1080, durationInFrames: 270 },
  { id: 'S06_FAILURE_TITLE', from: 1350, durationInFrames: 120 },
  { id: 'S12_STANDARDS', from: 2640, durationInFrames: 210 },
  { id: 'S20_LEDGER', from: 5160, durationInFrames: 300 },
  { id: 'S22_TRIPTYCH', from: 6120, durationInFrames: 150 }, // overlaps bookend tail per C3
  { id: 'S24_TEAM', from: 6270, durationInFrames: 210 },
  { id: 'S25_ENDCARD', from: 6480, durationInFrames: 270 },
]

// VO-sync markers for the editor
export const MARKERS: { frame: number; label: string }[] = [
  ...SLOTS.map((s) => ({ frame: s.from, label: s.id })),
  ...GRAPHIC_SPANS.map((s) => ({ frame: s.from, label: s.id })),
].sort((a, b) => a.frame - b.frame)

// FailureTracker X stamp frames (absolute)
export const X_STAMPS = [1650, 1965, 2190, 2400, 2580]
