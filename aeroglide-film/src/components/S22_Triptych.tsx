import React from 'react'
import { useCurrentFrame } from 'remotion'
import { COLORS, FONTS } from '../theme/tokens'
import { ease } from '../lib/ease'

// Three cards flip in (rotateY 90→0 over 2.5s, staggered).
const CARDS = [
  '~S$350/unit · off-the-shelf components',
  '5–7 yr life · S$40 bladder swap · displaces 5–10 boards',
  'HSA CLASS B PATHWAY · IP FILED — IPOS',
]

export const S22_Triptych: React.FC = () => {
  const f = useCurrentFrame()
  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 46, perspective: 1600 }}>
      {CARDS.map((c, i) => {
        const start = 20 + i * 30
        const rot = ease(f, [start, start + 75], [90, 0])
        const o = ease(f, [start, start + 20], [0, 1])
        return (
          <div
            key={c}
            style={{
              width: 460, height: 300, borderRadius: 20,
              background: 'rgba(16,26,46,0.85)', backdropFilter: 'blur(8px)',
              border: `1px solid rgba(244,239,230,0.25)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: 46, textAlign: 'center',
              fontFamily: FONTS.sans, fontWeight: 600, fontSize: 30, color: COLORS.bone, lineHeight: 1.5,
              transform: `rotateY(${rot}deg)`, opacity: o,
            }}
          >
            {c}
          </div>
        )
      })}
    </div>
  )
}
