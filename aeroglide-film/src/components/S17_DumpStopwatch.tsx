import React from 'react'
import { useCurrentFrame } from 'remotion'
import { COLORS, FONTS, LABEL_STYLE, TABULAR } from '../theme/tokens'
import { ease, lin } from '../lib/ease'

// Bottom-right stopwatch. 0.00 → 1.87 s in TRUE real time (56 frames), then
// freezes and tints cyanEng. Never sped up — this is the credibility device.
export const S17_DumpStopwatch: React.FC<{ startAt: number }> = ({ startAt }) => {
  const f = useCurrentFrame()
  const t = lin(f, [startAt, startAt + 56], [0, 1.87]) // linear — real time
  const frozen = f >= startAt + 56
  const inO = ease(f, [startAt - 10, startAt], [0, 1])
  return (
    <div
      style={{
        position: 'absolute', right: 90, bottom: 90, textAlign: 'right',
        padding: '18px 28px', borderRadius: 14,
        background: 'rgba(16,26,46,0.72)', backdropFilter: 'blur(8px)', opacity: inO,
      }}
    >
      <div
        style={{
          fontFamily: FONTS.sans, fontWeight: 600, fontSize: 84,
          color: frozen ? COLORS.cyanEng : COLORS.bone, ...TABULAR,
        }}
      >
        {t.toFixed(2)} s
      </div>
      <div style={{ ...LABEL_STYLE, fontSize: 17, color: COLORS.boneDim, marginTop: 6 }}>
        EMERGENCY DEFLATION — HARDWARE RELAY · SPEC &lt; 2 s
      </div>
    </div>
  )
}
