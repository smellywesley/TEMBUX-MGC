import React from 'react'
import { useCurrentFrame } from 'remotion'
import { COLORS, LABEL_STYLE } from '../theme/tokens'
import { ease } from '../lib/ease'

// Persistent top-center pills: 1 LIFT · 2 BRIDGE · 3 SLIDE, joined by a 1px
// line. Active = bone/navy. Completion ✓ draws in cyanEng — the same stamp
// rhythm as the failure X, deliberately, in the opposite color.
const STEPS = ['1 LIFT', '2 BRIDGE', '3 SLIDE']

// absolute completion frames
const COMPLETE_AT = [3480, 3840, 4460]
const ACTIVE_RANGES: [number, number][] = [
  [3090, 3479],
  [3480, 3839],
  [3840, 4499],
]

const Check: React.FC<{ p1: number; p2: number }> = ({ p1, p2 }) => (
  <svg width={22} height={22} viewBox="0 0 22 22">
    <line x1={3} y1={12} x2={9} y2={18} stroke={COLORS.cyanEng} strokeWidth={3.5} strokeLinecap="round"
      strokeDasharray={9} strokeDashoffset={9 * (1 - p1)} />
    <line x1={9} y1={18} x2={19} y2={4} stroke={COLORS.cyanEng} strokeWidth={3.5} strokeLinecap="round"
      strokeDasharray={18} strokeDashoffset={18 * (1 - p2)} />
  </svg>
)

export const StepChip: React.FC<{ mountFrame: number }> = ({ mountFrame }) => {
  const abs = useCurrentFrame() + mountFrame
  const inO = ease(abs, [3090, 3102], [0, 1])
  return (
    <div style={{ position: 'absolute', top: 54, left: '50%', transform: 'translateX(-50%)', display: 'flex', alignItems: 'center', opacity: inO }}>
      {STEPS.map((s, i) => {
        const active = abs >= ACTIVE_RANGES[i][0] && abs <= ACTIVE_RANGES[i][1]
        const done = abs >= COMPLETE_AT[i]
        const p1 = ease(abs, [COMPLETE_AT[i], COMPLETE_AT[i] + 4], [0, 1])
        const p2 = ease(abs, [COMPLETE_AT[i] + 4, COMPLETE_AT[i] + 8], [0, 1])
        return (
          <React.Fragment key={s}>
            {i > 0 && <div style={{ width: 46, height: 1, background: COLORS.boneDim }} />}
            <div
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 22px', borderRadius: 999,
                background: active ? COLORS.bone : 'rgba(16,26,46,0.72)',
                border: `1px solid ${active ? COLORS.bone : COLORS.boneDim}`,
                ...LABEL_STYLE, fontSize: 19,
                color: active ? COLORS.navy : COLORS.bone,
                opacity: active || done ? 1 : 0.3,
              }}
            >
              {s}
              {done && <Check p1={p1} p2={p2} />}
            </div>
          </React.Fragment>
        )
      })}
    </div>
  )
}
