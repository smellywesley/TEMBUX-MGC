import React from 'react'
import { useCurrentFrame } from 'remotion'
import { COLORS, FONTS, LABEL_STYLE } from '../theme/tokens'
import { ease } from '../lib/ease'

// Over dimmed home footage. Divider draws vertically first, then two columns.
const Chip: React.FC<{ text: string; color?: string; o: number; pulse?: number }> = ({ text, color = COLORS.bone, o, pulse = 0 }) => (
  <div
    style={{
      display: 'inline-block', padding: '10px 20px', borderRadius: 999, margin: '0 10px 12px 0',
      border: `1px solid ${pulse > 0 ? COLORS.teal : 'rgba(244,239,230,0.4)'}`,
      boxShadow: pulse > 0 ? `0 0 ${10 * pulse}px rgba(46,125,107,0.7)` : undefined,
      ...LABEL_STYLE, fontSize: 17, color, opacity: o,
    }}
  >
    {text}
  </div>
)

export const S21_MarketSplit: React.FC = () => {
  const f = useCurrentFrame()
  const divider = ease(f, [0, 30], [0, 1])
  const left = ease(f, [26, 44], [0, 1])
  const right = ease(f, [40, 58], [0, 1])
  // HCG chip pulses teal exactly once f60–75
  const pulse = f >= 60 && f <= 75 ? Math.sin(((f - 60) / 15) * Math.PI) : 0
  const footer = ease(f, [120, 140], [0, 1])

  return (
    <>
      <div style={{ position: 'absolute', left: '50%', top: 120, width: 1, height: 640 * divider, background: COLORS.boneDim }} />

      <div style={{ position: 'absolute', left: 130, top: 170, width: 720, opacity: left }}>
        <div style={{ ...LABEL_STYLE, color: COLORS.teal, marginBottom: 26 }}>INSTITUTIONS</div>
        <div>
          <Chip text="SingHealth" o={left} /> <Chip text="NHG" o={left} /> <Chip text="NUHS" o={left} />
        </div>
        <div style={{ fontFamily: FONTS.sans, fontSize: 28, color: COLORS.bone, marginTop: 22, lineHeight: 1.5 }}>
          1 claim: up to S$53,000 · permanent disability: S$346,000
        </div>
        <div style={{ fontFamily: FONTS.sans, fontSize: 22, color: COLORS.bone, opacity: 0.7, marginTop: 12 }}>
          plus temp cover at S$25–35/hr, absenteeism, burnout
        </div>
      </div>

      <div style={{ position: 'absolute', right: 130, top: 170, width: 660, opacity: right }}>
        <div style={{ ...LABEL_STYLE, color: COLORS.bone, marginBottom: 26 }}>HOME</div>
        <div style={{ fontFamily: FONTS.sans, fontSize: 28, color: COLORS.bone, lineHeight: 1.5 }}>
          “Lite” S$200–400 · AIC listings
        </div>
        <div style={{ marginTop: 20 }}>
          <Chip text="HCG 2026 — S$600/mo · transfer qualifies" o={right} pulse={pulse} />
        </div>
      </div>

      <div
        style={{
          position: 'absolute', left: 130, right: 130, bottom: 90, paddingTop: 26,
          borderTop: `1px solid rgba(244,239,230,0.3)`,
          fontFamily: FONTS.sans, fontWeight: 600, fontSize: 21, color: COLORS.boneDim,
          textAlign: 'center', letterSpacing: '0.06em', opacity: footer,
        }}
      >
        CAREGIVERS — less lumbar load · PATIENTS — stable and supported across the gap · INSTITUTIONS — lower injury liability
      </div>
    </>
  )
}
