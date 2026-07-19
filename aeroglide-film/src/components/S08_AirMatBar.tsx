import React from 'react'
import { useCurrentFrame } from 'remotion'
import { COLORS, FONTS, LABEL_STYLE, TYPE } from '../theme/tokens'
import { ease } from '../lib/ease'
import { Odometer } from '../lib/Odometer'

// Right-third overlay for S08: force shrinks 4,500 → ~3,080 N (−31.5%) over
// 40f; the 3,400 threshold reveals; amber bracket annotates.
const MAX_N = 5000
const H = 420

export const S08_AirMatBar: React.FC = () => {
  const f = useCurrentFrame()
  const startAt = 30
  const value = ease(f, [startAt, startAt + 40], [4500, 3080])
  const barH = (value / MAX_N) * H
  const threshH = (3400 / MAX_N) * H
  const threshIn = ease(f, [startAt + 44, startAt + 56], [0, 1])
  const bracketIn = ease(f, [startAt + 60, startAt + 74], [0, 1])

  return (
    <div style={{ position: 'absolute', right: 90, top: 150, width: 460, padding: 30, borderRadius: 16, background: 'rgba(16,26,46,0.72)', backdropFilter: 'blur(8px)' }}>
      <div style={{ position: 'relative', height: H, marginBottom: 20 }}>
        <div style={{ position: 'absolute', bottom: 0, left: 60, width: 110, height: barH, background: value > 3400 ? COLORS.red : COLORS.amber }} />
        <div style={{ position: 'absolute', bottom: threshH, left: 40, width: 220, borderTop: `3px dashed ${COLORS.red}`, opacity: threshIn }} />
        <div style={{ position: 'absolute', bottom: threshH + 8, left: 40, ...LABEL_STYLE, fontSize: 16, color: COLORS.red, opacity: threshIn }}>3,400 N</div>
        <div style={{ position: 'absolute', top: 0, right: 0 }}>
          <Odometer value={value} fontSize={64} color={COLORS.bone} suffix="N" />
        </div>
        {/* amber bracket */}
        <div style={{ position: 'absolute', right: 6, bottom: barH, height: H - barH, width: 16, borderRight: `3px solid ${COLORS.amber}`, borderTop: `3px solid ${COLORS.amber}`, borderBottom: `3px solid ${COLORS.amber}`, opacity: bracketIn }} />
      </div>
      <div style={{ fontFamily: FONTS.sans, fontWeight: 600, fontSize: 24, color: COLORS.amber, opacity: bracketIn }}>
        −31.5% — still near the limit
      </div>
    </div>
  )
}
