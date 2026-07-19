import React from 'react'
import { AbsoluteFill, OffthreadVideo, staticFile } from 'remotion'
import { COLORS, FONTS, TYPE } from '../theme/tokens'

// Seeded SVG grain (deterministic — no Math.random at render time).
const GRAIN_URI =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='2' seed='7'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)'/%3E%3C/svg%3E\")"

export type FootageSlotProps = {
  src: string
  label: string
  from: number
  durationInFrames: number
  startFrom?: number
  endAt?: number
  grade?: boolean
  v2Grade?: boolean
  dim?: number
  fill?: boolean
  fillScale?: number
  reframe?: { x: number; y: number; scale: number }
}

// The footage files that exist right now. Anything not listed renders the
// labelled placeholder so the master timeline ALWAYS renders end-to-end.
// Update this list as clips land in public/footage/.
export const AVAILABLE_FOOTAGE = new Set([
  'v2_beauty.mp4',
  'v2_lift57.mp4',
  'v2_exploded.mp4',
  'v2_materials.mp4',
  'v2_bridge.mp4',
])

const Placeholder: React.FC<{ label: string; src: string; from: number; durationInFrames: number }> = ({
  label,
  src,
  from,
  durationInFrames,
}) => (
  <AbsoluteFill style={{ background: COLORS.navy }}>
    <div
      style={{
        position: 'absolute',
        inset: 40,
        border: `2px dashed ${COLORS.bone}`,
        borderRadius: 8,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: 18,
      }}
    >
      <div
        style={{
          fontFamily: FONTS.sans,
          fontWeight: 600,
          fontSize: 34,
          color: COLORS.bone,
          letterSpacing: '0.06em',
        }}
      >
        MISSING: {label} → public/footage/{src}
      </div>
      <div style={{ fontFamily: FONTS.sans, fontSize: TYPE.label, color: COLORS.boneDim }}>
        frames {from}–{from + durationInFrames - 1}
      </div>
    </div>
  </AbsoluteFill>
)

export const FootageSlot: React.FC<FootageSlotProps> = (p) => {
  const {
    src,
    label,
    from,
    durationInFrames,
    startFrom,
    endAt,
    grade = true,
    v2Grade = false,
    dim = 0,
    fill = false,
    fillScale = 1,
    reframe,
  } = p

  if (!AVAILABLE_FOOTAGE.has(src)) {
    return <Placeholder label={label} src={src} from={from} durationInFrames={durationInFrames} />
  }

  const filter = v2Grade
    ? 'brightness(1.07) hue-rotate(-6deg)'
    : grade
      ? 'saturate(0.85) contrast(1.05)'
      : undefined

  const transforms: string[] = []
  if (fill) transforms.push(`scale(${1.334 * fillScale})`) // 1080/810 kills 2.39:1 letterbox bars
  if (reframe) transforms.push(`translate(${reframe.x}%, ${reframe.y}%) scale(${reframe.scale})`)

  return (
    <AbsoluteFill style={{ background: '#000', overflow: 'hidden' }}>
      <OffthreadVideo
        src={staticFile('footage/' + src)}
        startFrom={startFrom}
        endAt={endAt}
        muted
        style={{
          width: '100%',
          height: '100%',
          objectFit: fill ? 'cover' : 'contain',
          filter,
          transform: transforms.length ? transforms.join(' ') : undefined,
        }}
      />
      {/* film-look teal shadow (photoreal grade only — v2 clips are already teal-dark) */}
      {grade && !v2Grade ? (
        <AbsoluteFill style={{ background: 'rgba(46,125,107,0.06)', mixBlendMode: 'multiply' }} />
      ) : null}
      {/* 1.5% seeded grain */}
      {grade || v2Grade ? (
        <AbsoluteFill style={{ backgroundImage: GRAIN_URI, opacity: 0.015, pointerEvents: 'none' }} />
      ) : null}
      {dim > 0 ? <AbsoluteFill style={{ background: `rgba(0,0,0,${dim})` }} /> : null}
    </AbsoluteFill>
  )
}
