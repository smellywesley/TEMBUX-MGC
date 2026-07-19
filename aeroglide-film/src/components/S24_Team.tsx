import React from 'react'
import { AbsoluteFill, useCurrentFrame } from 'remotion'
import { COLORS, FONTS, LABEL_STYLE } from '../theme/tokens'
import { ease } from '../lib/ease'

const MEMBERS = [
  { init: 'TJ', name: 'Tang Je Re Jeremiah' },
  { init: 'NR', name: 'Ng Hao Yuan Remy' },
  { init: 'WW', name: 'Wesley Ong Wei Cheng' },
  { init: 'CJ', name: 'Cheow Jun Wei' },
  { init: 'CY', name: 'Chen Yun Ze' },
]

export const S24_Team: React.FC = () => {
  const f = useCurrentFrame()
  return (
    <AbsoluteFill style={{ background: COLORS.navy, alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ ...LABEL_STYLE, color: COLORS.boneDim, position: 'absolute', top: 140 }}>
        NATIONAL UNIVERSITY OF SINGAPORE
      </div>
      <div style={{ display: 'flex', gap: 60 }}>
        {MEMBERS.map((m, i) => {
          const start = 10 + i * 2.4 // 80ms stagger
          const t = ease(f, [start, start + 16], [0, 1])
          return (
            <div key={m.init} style={{ textAlign: 'center', opacity: t, transform: `translateY(${24 * (1 - t)}px)` }}>
              <div
                style={{
                  width: 96, height: 96, borderRadius: 999, border: `2px solid ${COLORS.boneDim}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: FONTS.serif, fontWeight: 600, fontSize: 34, color: COLORS.bone, margin: '0 auto',
                }}
              >
                {m.init}
              </div>
              <div style={{ fontFamily: FONTS.sans, fontSize: 20, color: COLORS.bone, marginTop: 18, width: 190 }}>{m.name}</div>
            </div>
          )
        })}
      </div>
      <div style={{ position: 'absolute', bottom: 150, fontFamily: FONTS.sans, fontSize: 21, color: COLORS.boneDim, letterSpacing: '0.08em', opacity: ease(f, [60, 80], [0, 1]) }}>
        Mechanical design · Electronics &amp; controls · Clinical research · Commercial planning
      </div>
    </AbsoluteFill>
  )
}
