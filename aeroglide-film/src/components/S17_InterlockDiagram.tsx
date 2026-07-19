import React from 'react'
import { useCurrentFrame } from 'remotion'
import { COLORS, FONTS } from '../theme/tokens'
import { ease } from '../lib/ease'

// Right-docked logic diagram. NO branch draws first (red), dims; YES branch
// (cyanEng) draws second. 45f per branch, strokeDashoffset draws.
const Node: React.FC<{ text: string; color: string; opacity: number; y: number; x?: number }> = ({ text, color, opacity, y, x = 0 }) => (
  <div
    style={{
      position: 'absolute', right: 90 - x, top: y,
      padding: '12px 22px', borderRadius: 10, border: `2px solid ${color}`,
      fontFamily: FONTS.sans, fontWeight: 600, fontSize: 20, letterSpacing: '0.08em',
      color, opacity, background: 'rgba(16,26,46,0.72)', backdropFilter: 'blur(8px)',
      width: 300, textAlign: 'center',
    }}
  >
    {text}
  </div>
)

export const S17_InterlockDiagram: React.FC = () => {
  const f = useCurrentFrame()
  const root = ease(f, [20, 40], [0, 1])
  const noDraw = ease(f, [45, 90], [0, 1]) // red branch first
  const noDim = ease(f, [120, 140], [1, 0.35]) // then dims
  const yesDraw = ease(f, [95, 140], [0, 1]) // cyan branch second
  const LINE = 70

  return (
    <>
      <Node text="BRIDGE LOCKED?" color={COLORS.bone} opacity={root} y={200} />
      {/* connecting lines */}
      <svg style={{ position: 'absolute', right: 220, top: 258 }} width={60} height={240}>
        <line x1={20} y1={0} x2={20} y2={LINE} stroke={COLORS.red} strokeWidth={2.5}
          strokeDasharray={LINE} strokeDashoffset={LINE * (1 - noDraw)} opacity={noDim} />
        <line x1={40} y1={0} x2={40} y2={LINE + 120} stroke={COLORS.cyanEng} strokeWidth={2.5}
          strokeDasharray={LINE + 120} strokeDashoffset={(LINE + 120) * (1 - yesDraw)} />
      </svg>
      <Node text="NO → LIFT DISABLED" color={COLORS.red} opacity={noDraw * noDim} y={340} />
      <Node text="YES → LIFT ENABLED" color={COLORS.cyanEng} opacity={yesDraw} y={460} />
    </>
  )
}
