import React from 'react'
import { AbsoluteFill, useCurrentFrame } from 'remotion'
import { COLORS, FONTS, LABEL_STYLE, TYPE } from '../theme/tokens'
import { ease, lin } from '../lib/ease'
import { Odometer } from '../lib/Odometer'
import { SourceLine } from '../lib/SourceLine'

// Hero data shot (slot 450–779, 330 local frames).
// f0–75 axis draws · 75–150 bar 0→3400 N · 150–165 threshold snap + flash +
// jitter · 165–240 to 4500 N, above-threshold portion red · 240–330 hold.
const MAX_N = 5000
const CHART_H = 620
const CHART_BOTTOM = 830

export const S03_ForceBar: React.FC = () => {
  const f = useCurrentFrame()

  const axisDraw = ease(f, [0, 75], [0, 1])
  const value = f < 150 ? ease(f, [75, 150], [0, 3400]) : ease(f, [150, 240], [3400, 4500])
  const barH = (value / MAX_N) * CHART_H
  const threshY = CHART_BOTTOM - (3400 / MAX_N) * CHART_H

  const threshIn = ease(f, [150, 165], [0, 1])
  const flash = f >= 152 && f < 154 ? 0.55 : 0
  const jitter = f >= 154 && f < 157 ? (f % 2 === 0 ? 2 : -2) : 0

  const capO = ease(f, [240, 252], [0, 1])
  const cap2O = ease(f, [270, 282], [0, 1])
  const exitY = ease(f, [318, 330], [0, -60])
  const exitO = ease(f, [318, 330], [1, 0])

  const redPortion = Math.max(0, barH - (CHART_BOTTOM - threshY))

  return (
    <AbsoluteFill style={{ background: COLORS.navy, opacity: exitO, transform: `translateY(${exitY}px)` }}>
      {/* axis + ticks */}
      <svg width={1920} height={1080} style={{ position: 'absolute' }}>
        <line
          x1={560} y1={CHART_BOTTOM} x2={560} y2={CHART_BOTTOM - CHART_H}
          stroke={COLORS.boneDim} strokeWidth={2}
          strokeDasharray={CHART_H} strokeDashoffset={CHART_H * (1 - axisDraw)}
        />
        <line
          x1={560} y1={CHART_BOTTOM} x2={1360} y2={CHART_BOTTOM}
          stroke={COLORS.boneDim} strokeWidth={2}
          strokeDasharray={800} strokeDashoffset={800 * (1 - axisDraw)}
        />
        {[1000, 2000, 3000, 4000, 5000].map((n) => (
          <g key={n} opacity={axisDraw}>
            <line x1={548} x2={560} y1={CHART_BOTTOM - (n / MAX_N) * CHART_H} y2={CHART_BOTTOM - (n / MAX_N) * CHART_H} stroke={COLORS.boneDim} strokeWidth={2} />
            <text x={534} y={CHART_BOTTOM - (n / MAX_N) * CHART_H + 6} fill={COLORS.boneDim} fontFamily={FONTS.sans} fontSize={18} textAnchor="end">
              {n.toLocaleString('en-US')}
            </text>
          </g>
        ))}
      </svg>

      {/* the bar */}
      <div style={{ position: 'absolute', left: 700, bottom: 1080 - CHART_BOTTOM, width: 220, height: barH, background: COLORS.bone, transform: `translateX(${jitter}px)` }} />
      {redPortion > 0 && (
        <div
          style={{
            position: 'absolute', left: 700, bottom: 1080 - threshY, width: 220, height: redPortion,
            background: COLORS.red, boxShadow: `0 0 8px ${COLORS.red}`, transform: `translateX(${jitter}px)`,
          }}
        />
      )}

      {/* threshold line snaps in from right */}
      <div
        style={{
          position: 'absolute', top: threshY, left: 560, width: 800 * threshIn, height: 0,
          borderTop: `3px dashed ${COLORS.red}`, right: 0, transformOrigin: 'right',
          marginLeft: 800 * (1 - threshIn),
        }}
      />
      <div style={{ position: 'absolute', top: threshY - 40, left: 990, ...LABEL_STYLE, fontSize: 20, color: COLORS.red, opacity: threshIn }}>
        INJURY-RISK THRESHOLD — 3,400 N
      </div>

      {/* odometer — clear of the threshold label */}
      <div style={{ position: 'absolute', left: 1020, top: 120 }}>
        <Odometer value={value} fontSize={TYPE.dataHero} color={value > 3400 ? COLORS.red : COLORS.bone} suffix="N" />
      </div>

      {/* captions */}
      <div style={{ position: 'absolute', left: 560, top: 900, fontFamily: FONTS.sans, fontSize: TYPE.body, color: COLORS.bone, opacity: capO }}>
        Compression at L5/S1 per manual lift
      </div>
      <div style={{ position: 'absolute', left: 560, top: 944, fontFamily: FONTS.sans, fontSize: TYPE.body, color: COLORS.red, opacity: cap2O }}>
        Worse when stooped, twisted, and repeated
      </div>
      <SourceLine opacity={capO}>Waters et al., 1993 · NIOSH lifting equation</SourceLine>

      {/* threshold-cross white flash */}
      {flash > 0 && <AbsoluteFill style={{ background: `rgba(255,255,255,${flash})` }} />}
    </AbsoluteFill>
  )
}
