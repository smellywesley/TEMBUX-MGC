import React from 'react'
import { useCurrentFrame } from 'remotion'
import { COLORS, LABEL_STYLE } from '../theme/tokens'
import { ease } from '../lib/ease'

// Deployment step pills (sheet-canonical sequence), bottom-center. Each
// activates at its prop frame. Optional clamp dimension readout.
const STEPS = ['1 STOWED', '2 SWING OUT', '3 EXTEND', '4 LOCKED ON BED']

export const S15_DeploySteps: React.FC<{
  activationFrames: [number, number, number, number]
  clampReadoutAt?: number
}> = ({ activationFrames, clampReadoutAt }) => {
  const f = useCurrentFrame()
  return (
    <>
      <div style={{ position: 'absolute', bottom: 60, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 14 }}>
        {STEPS.map((s, i) => {
          const active = f >= activationFrames[i]
          const pop = ease(f, [activationFrames[i], activationFrames[i] + 8], [0.92, 1])
          return (
            <div
              key={s}
              style={{
                padding: '10px 20px', borderRadius: 999,
                background: active ? COLORS.bone : 'rgba(16,26,46,0.72)',
                backdropFilter: 'blur(8px)',
                ...LABEL_STYLE, fontSize: 17,
                color: active ? COLORS.navy : COLORS.boneDim,
                transform: `scale(${active ? pop : 1})`,
                border: `1px solid ${active ? COLORS.bone : COLORS.boneDim}`,
              }}
            >
              {s}
            </div>
          )
        })}
      </div>
      {clampReadoutAt !== undefined && (
        <div
          style={{
            position: 'absolute', right: 90, top: 140,
            padding: '14px 24px', borderRadius: 12,
            background: 'rgba(16,26,46,0.72)', backdropFilter: 'blur(8px)',
            ...LABEL_STYLE, fontSize: 20, color: COLORS.cyanEng,
            opacity: ease(f, [clampReadoutAt, clampReadoutAt + 10], [0, 1]),
          }}
        >
          FITS ROUND FRAME TUBES · 22–32 mm
        </div>
      )}
    </>
  )
}
