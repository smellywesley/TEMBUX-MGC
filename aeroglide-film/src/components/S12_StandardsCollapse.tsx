import React from 'react'
import { AbsoluteFill, useCurrentFrame } from 'remotion'
import { COLORS, FONTS, LABEL_STYLE } from '../theme/tokens'
import { ease, lin } from '../lib/ease'
import { useTypeOn } from '../lib/useTypeOn'
import { XMark } from './FailureTracker'

// The silence beat. Three assumption chips hover, flicker, and settle dim.
// The five X's TRAVEL from the tracker's position to a centered row.
// Serif line types on; last three words get a red underline. Then stillness.
const CHIPS = ['PATIENT COOPERATION', 'CAREGIVER TECHNIQUE', 'WORKFLOW CONDITIONS'] // report-canonical wording
const PHASES = [0.0, 2.1, 4.4] // seeded hover phases

export const S12_StandardsCollapse: React.FC = () => {
  const f = useCurrentFrame()
  const line1 = useTypeOn(f, 'Every tool leans on fragile assumptions.', 150)
  const line2Full = 'None addresses the unweighting lift.'
  const line2 = useTypeOn(f, line2Full, 172)
  const underline = ease(f, [196, 205], [0, 1]) // 300ms red underline, left->right

  // X travel from tracker position (bottom center, scaled row) to centered row
  const travel = ease(f, [120, 150], [0, 1])
  const fromY = 980
  const toY = 560
  const spacingFrom = 66 * 0.85
  const spacingTo = 90

  return (
    <AbsoluteFill style={{ background: COLORS.navy }}>
      {CHIPS.map((c, i) => {
        const inO = ease(f, [i * 7, i * 7 + 12], [0, 1])
        // flicker 200ms apart each, then settle at 22%
        const fStart = 60 + i * 6
        let o = 1
        if (f >= fStart) {
          const t = f - fStart
          o = t < 3 ? 0.3 : t < 6 ? 0.8 : t < 9 ? 0.15 : 0.22
        }
        const hover = Math.sin((f / 90) * Math.PI * 2 + PHASES[i]) * 3
        return (
          <div
            key={c}
            style={{
              position: 'absolute', top: 260 + hover, left: 330 + i * 450,
              padding: '16px 28px', borderRadius: 999, border: `1px solid ${COLORS.boneDim}`,
              ...LABEL_STYLE, fontSize: 20,
              color: COLORS.bone, opacity: inO * o,
              filter: f >= fStart + 9 ? 'saturate(0.3)' : undefined,
            }}
          >
            {c}
          </div>
        )
      })}

      {/* travelling X row */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: lin(travel, [0, 1], [fromY, toY]),
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: lin(travel, [0, 1], [spacingFrom - 34, spacingTo - 34]),
        }}
      >
        {[0, 1, 2, 3, 4].map((i) => (
          <XMark key={i} progress1={1} progress2={1} color={COLORS.red} size={40} />
        ))}
      </div>

      <div style={{ position: 'absolute', left: 0, right: 0, top: 660, textAlign: 'center', fontFamily: FONTS.serif, fontWeight: 600, fontSize: 44, color: COLORS.bone, lineHeight: 1.6 }}>
        <div>{line1.shown}</div>
        <div style={{ position: 'relative', display: 'inline-block' }}>
          {line2.shown}
          {/* red underline under "the unweighting lift." */}
          <div
            style={{
              position: 'absolute', bottom: -8, right: 0,
              width: `${58 * underline}%`,
              height: 3, background: COLORS.red,
              transformOrigin: 'left',
            }}
          />
        </div>
      </div>
    </AbsoluteFill>
  )
}
