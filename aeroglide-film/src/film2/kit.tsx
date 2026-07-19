import React from 'react'
import { AbsoluteFill } from 'remotion'
import { COLORS, FONTS } from '../theme/tokens'

// ---------------------------------------------------------------------------
// Film 2 scene kit — the two worlds + a flat-illustration vocabulary that
// matches the reference film's warmth (simple rounded figures, side-view
// furniture) so every scene is a finished design, never a placeholder.
// ---------------------------------------------------------------------------

export const WARM = {
  bg: '#F4EFE6',
  bg2: '#EFE7D9',
  ink: '#2E2A24',
  inkSoft: 'rgba(46,42,36,0.62)',
  red: '#C24A33',
  teal: '#2E7D6B',
  amber: '#D9A441',
  line: 'rgba(46,42,36,0.18)',
}

export const DARK = {
  bg: COLORS.navy,
  ink: COLORS.bone,
  inkSoft: COLORS.boneDim,
  cyan: COLORS.cyanEng,
  red: COLORS.red,
  line: 'rgba(244,239,230,0.2)',
}

export const WarmFrame: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill style={{ background: `linear-gradient(180deg, ${WARM.bg} 0%, ${WARM.bg2} 100%)` }}>
    {children}
  </AbsoluteFill>
)

export const DarkFrame: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill style={{ background: DARK.bg }}>{children}</AbsoluteFill>
)

export const Eyebrow: React.FC<{ children: React.ReactNode; color: string }> = ({ children, color }) => (
  <div
    style={{
      fontFamily: FONTS.sans, fontWeight: 600, fontSize: 25,
      letterSpacing: '0.22em', textTransform: 'uppercase', color, textAlign: 'center',
    }}
  >
    {children}
  </div>
)

export const Headline: React.FC<{ children: React.ReactNode; color: string; size?: number }> = ({
  children, color, size = 62,
}) => (
  <div
    style={{
      fontFamily: FONTS.serif, fontWeight: 600, fontSize: size, color,
      textAlign: 'center', lineHeight: 1.2, letterSpacing: '-0.01em',
    }}
  >
    {children}
  </div>
)

// ---- Flat illustration vocabulary (side view, reference style) ----

// Simple person: circle head + rounded body. pose via rotation/offsets.
export const Figure: React.FC<{
  color: string
  scale?: number
  lean?: number // degrees forward-lean at hips (stooped nurse)
  seated?: boolean
}> = ({ color, scale = 1, lean = 0, seated = false }) => (
  <g transform={`scale(${scale}) rotate(${lean})`}>
    <circle cx={0} cy={-86} r={22} fill={color} />
    {seated ? (
      // seated: torso + thigh block
      <>
        <rect x={-20} y={-64} width={40} height={64} rx={16} fill={color} />
        <rect x={-20} y={-14} width={58} height={18} rx={9} fill={color} />
      </>
    ) : (
      <rect x={-20} y={-64} width={40} height={110} rx={16} fill={color} />
    )}
  </g>
)

// Manual wheelchair, side view (matches sheet proportions loosely).
export const Wheelchair: React.FC<{ stroke: string; seat?: string; x?: number; y?: number; scale?: number }> = ({
  stroke, seat, x = 0, y = 0, scale = 1,
}) => (
  <g transform={`translate(${x} ${y}) scale(${scale})`}>
    <circle cx={0} cy={0} r={62} fill="none" stroke={stroke} strokeWidth={5} />
    <circle cx={0} cy={0} r={7} fill={stroke} />
    {[0, 45, 90, 135].map((a) => (
      <line key={a} x1={-62 * Math.cos((a * Math.PI) / 180)} y1={-62 * Math.sin((a * Math.PI) / 180)} x2={62 * Math.cos((a * Math.PI) / 180)} y2={62 * Math.sin((a * Math.PI) / 180)} stroke={stroke} strokeWidth={3} opacity={0.5} />
    ))}
    <circle cx={74} cy={38} r={22} fill="none" stroke={stroke} strokeWidth={4.5} />
    {/* frame */}
    <path d={`M -8 -58 L -8 -104 M -8 -58 L 66 -58 L 74 16 M 66 -58 L 66 -96`} stroke={stroke} strokeWidth={5} fill="none" strokeLinecap="round" />
    {/* seat cushion */}
    {seat ? <rect x={-14} y={-76} width={86} height={20} rx={9} fill={seat} /> : null}
    {/* push handle */}
    <path d={`M -8 -104 L -26 -104`} stroke={stroke} strokeWidth={5} strokeLinecap="round" />
  </g>
)

// Hospital bed, side view.
export const Bed: React.FC<{ stroke: string; mattress: string; x?: number; y?: number; w?: number }> = ({
  stroke, mattress, x = 0, y = 0, w = 380,
}) => (
  <g transform={`translate(${x} ${y})`}>
    <rect x={0} y={-26} width={w} height={26} rx={12} fill={mattress} />
    <line x1={8} y1={0} x2={8} y2={96} stroke={stroke} strokeWidth={6} strokeLinecap="round" />
    <line x1={w - 8} y1={0} x2={w - 8} y2={96} stroke={stroke} strokeWidth={6} strokeLinecap="round" />
    {/* headboard */}
    <line x1={w} y1={-26} x2={w} y2={-92} stroke={stroke} strokeWidth={6} strokeLinecap="round" />
  </g>
)

// AeroGlide seat module (side): thin stack with glowing bladder line.
export const SeatModuleSide: React.FC<{ inflate?: number; accent: string; x?: number; y?: number; w?: number }> = ({
  inflate = 0, accent, x = 0, y = 0, w = 96,
}) => {
  const bladderH = 8 + 12 * inflate
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x={0} y={-6} width={w} height={6} rx={3} fill="#3A3F47" />
      <rect x={0} y={-6 - bladderH} width={w} height={bladderH} rx={bladderH / 2} fill={accent} opacity={0.85} />
      <rect x={0} y={-6 - bladderH - 8} width={w} height={8} rx={4} fill="#2E2A24" />
    </g>
  )
}

// Telescoping bridge (side): rail + extending panel.
export const BridgeSide: React.FC<{ extend: number; stroke: string; x?: number; y?: number; reach?: number }> = ({
  extend, stroke, x = 0, y = 0, reach = 300,
}) => (
  <g transform={`translate(${x} ${y})`}>
    <rect x={0} y={-7} width={120} height={12} rx={6} fill={stroke} />
    <rect x={110} y={-5} width={reach * extend} height={9} rx={4.5} fill={stroke} opacity={0.85} />
    {/* bed pad tip */}
    {extend > 0.02 ? <rect x={104 + reach * extend} y={-8} width={26} height={14} rx={6} fill={stroke} /> : null}
  </g>
)

export const CaptionBlock: React.FC<{
  eyebrow?: string; head: React.ReactNode; sub?: React.ReactNode
  world: 'warm' | 'dark'; y?: number; opacity?: number; rise?: number
}> = ({ eyebrow, head, sub, world, y = 108, opacity = 1, rise = 0 }) => {
  const W = world === 'warm' ? WARM : DARK
  const accent = world === 'warm' ? WARM.red : DARK.cyan
  return (
    <div style={{ position: 'absolute', top: y, left: 0, right: 0, opacity, transform: `translateY(${rise}px)` }}>
      {eyebrow ? <Eyebrow color={accent}>{eyebrow}</Eyebrow> : null}
      <div style={{ marginTop: 16 }}>
        <Headline color={W.ink}>{head}</Headline>
      </div>
      {sub ? (
        <div style={{ fontFamily: FONTS.sans, fontSize: 28, color: W.inkSoft, textAlign: 'center', marginTop: 14 }}>
          {sub}
        </div>
      ) : null}
    </div>
  )
}
