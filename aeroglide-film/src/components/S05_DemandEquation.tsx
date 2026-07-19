import React from 'react'
import { AbsoluteFill, useCurrentFrame } from 'remotion'
import { COLORS, FONTS, TYPE, LABEL_STYLE } from '../theme/tokens'
import { ease } from '../lib/ease'
import { useTypeOn } from '../lib/useTypeOn'

// Two bar-pairs grow (45f each), then charts dock up at 60% and the demand
// equation types on; final term tints red over 10f.
const BarPair: React.FC<{
  x: number; label: string; a: number; b: number; max: number
  unitA: string; unitB: string; start: number; frame: number
}> = ({ x, label, a, b, max, unitA, unitB, start, frame }) => {
  const H = 360
  const hA = (a / max) * H * ease(frame, [start, start + 45], [0, 1])
  const hB = (b / max) * H * ease(frame, [start + 20, start + 65], [0, 1])
  return (
    <div style={{ position: 'absolute', left: x, top: 300, width: 420 }}>
      <div style={{ position: 'relative', height: H }}>
        <div style={{ position: 'absolute', bottom: 0, left: 60, width: 120, height: hA, background: COLORS.graphite }} />
        <div style={{ position: 'absolute', bottom: 0, left: 230, width: 120, height: hB, background: COLORS.teal }} />
        <div style={{ position: 'absolute', bottom: hA + 12, left: 60, width: 120, textAlign: 'center', fontFamily: FONTS.sans, fontWeight: 600, fontSize: 26, color: COLORS.bone }}>{unitA}</div>
        <div style={{ position: 'absolute', bottom: hB + 12, left: 230, width: 120, textAlign: 'center', fontFamily: FONTS.sans, fontWeight: 600, fontSize: 26, color: COLORS.bone }}>{unitB}</div>
      </div>
      <div style={{ ...LABEL_STYLE, fontSize: 20, color: COLORS.boneDim, marginTop: 20, textAlign: 'center' }}>{label}</div>
    </div>
  )
}

export const S05_DemandEquation: React.FC = () => {
  const f = useCurrentFrame()
  const dock = ease(f, [180, 220], [0, 1])
  const eq1 = useTypeOn(f, 'MORE PATIENTS × MORE BEDS × BY HAND', 190)
  const eq2 = useTypeOn(f, '= MORE INJURED CAREGIVERS', 225)
  const redTint = ease(f, [258, 268], [0, 1])

  return (
    <AbsoluteFill style={{ background: COLORS.navy }}>
      <div
        style={{
          position: 'absolute', inset: 0,
          transform: `scale(${1 - 0.4 * dock}) translateY(${-260 * dock}px)`,
          transformOrigin: '50% 30%',
        }}
      >
        <BarPair x={420} label="Singapore residents 65+ · share of population" a={20.7} b={23.9} max={26} unitA="20.7%" unitB="23.9%" start={0} frame={f} />
        <BarPair x={1080} label="Community hospital & aged-care beds" a={16200} b={31000} max={34000} unitA="16,200" unitB="31,000+" start={45} frame={f} />
      </div>

      <div style={{ position: 'absolute', left: 0, right: 0, top: 640, textAlign: 'center', fontFamily: FONTS.serif, fontWeight: 600, fontSize: 40, color: COLORS.bone, lineHeight: 1.5 }}>
        <div>{eq1.shown}</div>
        <div style={{ color: `rgba(${194 * redTint + 244 * (1 - redTint)},${74 * redTint + 239 * (1 - redTint)},${51 * redTint + 230 * (1 - redTint)},1)` }}>
          {eq2.shown}
        </div>
      </div>
    </AbsoluteFill>
  )
}
