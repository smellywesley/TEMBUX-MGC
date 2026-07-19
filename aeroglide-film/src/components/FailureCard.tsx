import React from 'react'
import { useCurrentFrame } from 'remotion'
import { COLORS, FONTS, LABEL_STYLE } from '../theme/tokens'
import { ease, lin } from '../lib/ease'

// Lower-left dock over footage: label + one-sentence failure.
// Slide-in 24px + 400ms fade. Optional hoist clock icon (hand sweeps 1080°).
export const FailureCard: React.FC<{ label: string; sentence: string; clock?: boolean }> = ({
  label,
  sentence,
  clock = false,
}) => {
  const f = useCurrentFrame()
  const o = ease(f, [0, 12], [0, 1])
  const x = ease(f, [0, 12], [-24, 0])
  const sweep = lin(f, [10, 190], [0, 1080])
  return (
    <div
      style={{
        position: 'absolute', left: 90, bottom: 150, maxWidth: 640,
        padding: '22px 30px', borderRadius: 14,
        background: 'rgba(16,26,46,0.72)', backdropFilter: 'blur(8px)',
        opacity: o, transform: `translateX(${x}px)`,
        display: 'flex', alignItems: 'center', gap: 22,
      }}
    >
      {clock && (
        <svg width={40} height={40} viewBox="0 0 40 40">
          <circle cx={20} cy={20} r={17} fill="none" stroke={COLORS.bone} strokeWidth={3} />
          <line x1={20} y1={20} x2={20} y2={8} stroke={COLORS.red} strokeWidth={3} strokeLinecap="round"
            transform={`rotate(${sweep} 20 20)`} />
        </svg>
      )}
      <div>
        <div style={{ ...LABEL_STYLE, fontSize: 20, color: COLORS.bone }}>{label}</div>
        <div style={{ fontFamily: FONTS.sans, fontSize: 24, color: COLORS.boneDim, marginTop: 6 }}>{sentence}</div>
      </div>
    </div>
  )
}
