import React from 'react'
import { AbsoluteFill, useCurrentFrame } from 'remotion'
import { COLORS, FONTS, TYPE } from '../theme/tokens'
import { ease } from '../lib/ease'

// Bone bg. H1 per-letter cascade (30 ms/letter, 16 px rise). Five rounded
// square slots draw their borders sequentially beneath.
const TITLE = 'FIVE TOOLS. FIVE COMPROMISES.'

export const S06_FailureTitle: React.FC = () => {
  const f = useCurrentFrame()
  return (
    <AbsoluteFill style={{ background: COLORS.bone, alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ fontFamily: FONTS.serif, fontWeight: 600, fontSize: TYPE.h1, color: COLORS.navy, display: 'flex' }}>
        {TITLE.split('').map((ch, i) => {
          const start = i * 0.9 // 30ms/char
          const t = ease(f, [start, start + 10], [0, 1])
          return (
            <span key={i} style={{ opacity: t, transform: `translateY(${16 * (1 - t)}px)`, whiteSpace: 'pre' }}>
              {ch}
            </span>
          )
        })}
      </div>
      <div style={{ display: 'flex', gap: 34, marginTop: 70 }}>
        {[0, 1, 2, 3, 4].map((i) => {
          const start = 40 + i * 10
          const draw = ease(f, [start, start + 14], [0, 1])
          const P = 4 * 72 // perimeter approx
          return (
            <svg key={i} width={72} height={72}>
              <rect
                x={3} y={3} width={66} height={66} rx={14} fill="none"
                stroke={COLORS.navy} strokeWidth={3}
                strokeDasharray={P} strokeDashoffset={P * (1 - draw)}
              />
            </svg>
          )
        })}
      </div>
    </AbsoluteFill>
  )
}
