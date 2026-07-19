import React from 'react'
import { AbsoluteFill, useCurrentFrame } from 'remotion'
import { COLORS, FONTS, LABEL_STYLE, TYPE } from '../theme/tokens'
import { ease } from '../lib/ease'
import { Odometer } from '../lib/Odometer'
import { useTypeOn } from '../lib/useTypeOn'

// 10×10 person-glyph grid over the dimmed corridor. 91 tint red in a column
// wave (f60–140); 9 stay graphite. Right column: 91% odometer + labels.
const Person: React.FC<{ color: string; size?: number }> = ({ color, size = 34 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <circle cx="12" cy="5" r="3.2" />
    <path d="M12 9.5c-3 0-5 1.8-5 4.6V21h3.4v-6h3.2v6H17v-6.9c0-2.8-2-4.6-5-4.6z" />
  </svg>
)

export const S04_IsotypeWave: React.FC = () => {
  const f = useCurrentFrame()
  const gridIn = ease(f, [0, 30], [0, 1])
  const line2 = useTypeOn(f, '72% of nurses live with chronic low-back pain · WHO', 200)
  const pct = ease(f, [60, 140], [0, 91])

  return (
    <AbsoluteFill>
      <div style={{ position: 'absolute', left: 140, top: 170, display: 'grid', gridTemplateColumns: 'repeat(10, 44px)', gap: 10, opacity: gridIn }}>
        {Array.from({ length: 100 }).map((_, i) => {
          const col = i % 10
          const row = Math.floor(i / 10)
          const orderIdx = col * 10 + row // column wave
          const isInjured = orderIdx < 91
          // 12ms stagger ≈ 0.36f per glyph across f60–140
          const start = 60 + orderIdx * 0.36
          const t = ease(f, [start, start + 4], [0, 1])
          const color = isInjured
            ? `rgba(194,74,51,${0.25 + 0.75 * t})`
            : 'rgba(58,63,71,0.4)'
          return <Person key={i} color={f > start && isInjured ? color : isInjured ? 'rgba(244,239,230,0.6)' : 'rgba(58,63,71,0.4)'} />
        })}
      </div>

      <div style={{ position: 'absolute', right: 130, top: 260, width: 560 }}>
        <Odometer value={pct} fontSize={TYPE.dataHero} color={COLORS.red} suffix="%" />
        <div style={{ fontFamily: FONTS.sans, fontSize: TYPE.body, color: COLORS.bone, marginTop: 18, lineHeight: 1.4 }}>
          of serious care-worker injuries are back injuries — manual handling
        </div>
        <div
          style={{
            display: 'inline-block', marginTop: 22, padding: '10px 20px', borderRadius: 999,
            border: `1px solid ${COLORS.boneDim}`, ...LABEL_STYLE, fontSize: 20, color: COLORS.bone,
            opacity: ease(f, [150, 165], [0, 1]),
          }}
        >
          338 / year · MOM 2025
        </div>
        <div style={{ fontFamily: FONTS.sans, fontSize: 26, color: COLORS.boneDim, marginTop: 34, minHeight: 40 }}>
          {line2.shown}
          {!line2.done && line2.shown.length > 0 && (
            <span style={{ display: 'inline-block', width: 40, height: 2, background: COLORS.bone, marginLeft: 6, verticalAlign: 'baseline' }} />
          )}
        </div>
      </div>
    </AbsoluteFill>
  )
}
