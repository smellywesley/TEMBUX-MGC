import { Easing } from 'remotion'
import { loadFont as loadLora } from '@remotion/google-fonts/Lora'
import { loadFont as loadInter } from '@remotion/google-fonts/Inter'

const lora = loadLora('normal', { weights: ['600'] })
const inter = loadInter('normal', { weights: ['400', '600'] })

export const COLORS = {
  navy: '#101A2E',
  bone: '#F4EFE6',
  teal: '#2E7D6B',
  red: '#C24A33',
  amber: '#D9A441',
  graphite: '#3A3F47',
  boneDim: 'rgba(244,239,230,0.62)',
  // engineering accent — Act 3 only; sampled to sit with the v2 bladder glow
  cyanEng: '#45C6E0',
}

export const FONTS = { serif: lora.fontFamily, sans: inter.fontFamily }

export const EASE_OUT_QUINT = Easing.bezier(0.22, 1, 0.36, 1)
export const FPS = 30
export const TOTAL_FRAMES = 6750 // 3:45 at 30 fps

// Type scale (px @1080p)
export const TYPE = {
  h1: 84,
  h2: 56,
  label: 26,
  body: 30,
  dataHero: 160,
  sourceLine: 18,
}

export const TABULAR = { fontVariantNumeric: 'tabular-nums' } as const

export const LABEL_STYLE = {
  fontFamily: FONTS.sans,
  fontWeight: 600,
  fontSize: TYPE.label,
  letterSpacing: '0.14em',
  textTransform: 'uppercase',
} as const
