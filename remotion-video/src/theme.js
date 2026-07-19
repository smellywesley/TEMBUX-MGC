// Design tokens + layer data for the V2 reveal video.
// Layer values mirror transfer-bridge-landing/src/modelData.js (the source of
// truth, from the finalized schematic) — keep the two in sync if specs change.

export const NEON = '#17e0ff'
export const BG = '#050607'
export const WARN = '#ffcf4a'
export const FONT = "'Helvetica Neue', 'Inter', system-ui, sans-serif"

// Top -> base, with per-layer visual treatment for the 2.5D stack.
export const LAYERS = [
  {
    name: 'Top Cover',
    spec: 'PU Fabric · 10 mm',
    h: 26,
    color: '#26282c',
    side: '#141518',
    radius: 46,
  },
  {
    name: 'Comfort Foam',
    spec: 'PU foam · 8 mm',
    h: 20,
    color: '#cdbb98',
    side: '#8f7d5c',
    radius: 42,
  },
  {
    name: 'Multi-Chamber Air Bladder',
    spec: 'TPU · AIR ONLY — NO LIQUID',
    h: 60,
    color: '#0b1822',
    side: '#06222c',
    radius: 30,
    tubes: 5, // renders as glowing cylinders
  },
  {
    name: 'Restraint Fabric Layer',
    spec: 'Nylon/Poly · non-stretch',
    h: 10,
    color: '#17191c',
    side: '#0c0d0f',
    radius: 40,
  },
  {
    name: 'Rigid Lift Plate',
    spec: 'Aluminium · 3 mm',
    h: 12,
    color: '#c7ccd2',
    side: '#7d848c',
    radius: 20,
    metal: true,
  },
  {
    name: 'Base Shell',
    spec: 'HDPE · 4 mm',
    h: 16,
    color: '#26292d',
    side: '#101214',
    radius: 22,
  },
]

// Reusable CSS material textures (same recipes as the landing page swatches).
export const TEXTURES = {
  'Top Cover': {
    background:
      'repeating-linear-gradient(45deg, rgba(255,255,255,0.05) 0 3px, transparent 3px 44px, rgba(0,0,0,0.8) 44px 47px),' +
      'repeating-linear-gradient(-45deg, transparent 0 44px, rgba(0,0,0,0.8) 44px 47px),' +
      'radial-gradient(120% 90% at 30% 20%, #43474d 0%, #26282c 55%, #1a1c1f 100%)',
  },
  'Comfort Foam': {
    backgroundColor: '#cdbb98',
    backgroundImage:
      'radial-gradient(circle at 12px 16px, rgba(122,104,72,0.55) 3px, transparent 5px),' +
      'radial-gradient(circle at 36px 40px, rgba(122,104,72,0.4) 2.5px, transparent 4.5px),' +
      'radial-gradient(circle at 56px 12px, rgba(122,104,72,0.45) 2px, transparent 4px),' +
      'linear-gradient(160deg, #d8c7a6 0%, #cdbb98 50%, #b5a17c 100%)',
    backgroundSize: '68px 68px, 68px 68px, 68px 68px, 100% 100%',
  },
  'Multi-Chamber Air Bladder': {
    background:
      'repeating-linear-gradient(90deg, #041016 0 4px, rgba(23,224,255,0.16) 4px 24px,' +
      ' rgba(180,250,255,0.75) 30px 38px, rgba(23,224,255,0.28) 44px 68px, #041016 68px 72px),' +
      'linear-gradient(180deg, #06222c, #03141b)',
    boxShadow: 'inset 0 12px 36px rgba(0,0,0,0.6), 0 0 52px rgba(23,224,255,0.35)',
  },
  'Restraint Fabric Layer': {
    background:
      'repeating-linear-gradient(0deg, rgba(255,255,255,0.14) 0 3px, transparent 3px 16px),' +
      'repeating-linear-gradient(90deg, rgba(255,255,255,0.12) 0 3px, transparent 3px 16px),' +
      'radial-gradient(80% 70% at 35% 25%, #2e3237 0%, transparent 60%),' +
      'linear-gradient(150deg, #24272c 0%, #17191c 60%, #101214 100%)',
  },
  'Rigid Lift Plate': {
    background:
      'repeating-linear-gradient(180deg, rgba(255,255,255,0.13) 0 2px, rgba(0,0,0,0.12) 2px 4px, transparent 4px 6px),' +
      'linear-gradient(100deg, #eef1f5 0%, #b9c0c9 30%, #d8dde3 48%, #8f979f 75%, #c3c9d1 100%)',
  },
  'Base Shell': {
    background:
      'radial-gradient(140% 100% at 25% 0%, rgba(255,255,255,0.16) 0%, transparent 55%),' +
      'repeating-linear-gradient(115deg, rgba(255,255,255,0.045) 0 6px, transparent 6px 13px),' +
      'linear-gradient(160deg, #33373d 0%, #26292d 55%, #1d2023 100%)',
  },
}
