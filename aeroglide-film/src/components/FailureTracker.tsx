import React from 'react'
import { useCurrentFrame } from 'remotion'
import { COLORS } from '../theme/tokens'
import { ease } from '../lib/ease'
import { X_STAMPS } from '../slotManifest'

// Persistent bottom-center tracker (abs frames 1470–2789, mounted once).
// Each X stamps: scale 1.4→1.0 over 8f + fade-in + 1-frame 1px shake
// (tracker only). X = two round-cap strokes drawn 4 frames apart.
export const XMark: React.FC<{ progress1: number; progress2: number; color: string; size?: number }> = ({
  progress1,
  progress2,
  color,
  size = 34,
}) => {
  const L = Math.hypot(size - 8, size - 8)
  return (
    <svg width={size} height={size}>
      <line x1={4} y1={4} x2={size - 4} y2={size - 4} stroke={color} strokeWidth={5} strokeLinecap="round"
        strokeDasharray={L} strokeDashoffset={L * (1 - progress1)} />
      <line x1={size - 4} y1={4} x2={4} y2={size - 4} stroke={color} strokeWidth={5} strokeLinecap="round"
        strokeDasharray={L} strokeDashoffset={L * (1 - progress2)} />
    </svg>
  )
}

export const FailureTracker: React.FC<{ mountFrame: number }> = ({ mountFrame }) => {
  const local = useCurrentFrame()
  const abs = local + mountFrame
  const latestStamp = X_STAMPS.filter((s) => abs >= s).pop()
  const shake = latestStamp !== undefined && abs - latestStamp === 0 ? 1 : 0

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 44,
        left: '50%',
        transform: `translateX(-50%) scale(0.85) translate(${shake}px, ${-shake}px)`,
        display: 'flex',
        gap: 22,
        padding: '16px 26px',
        borderRadius: 16,
        background: 'rgba(16,26,46,0.72)',
        backdropFilter: 'blur(8px)',
      }}
    >
      {X_STAMPS.map((stampAt, i) => {
        const p1 = ease(abs, [stampAt, stampAt + 4], [0, 1])
        const p2 = ease(abs, [stampAt + 4, stampAt + 8], [0, 1])
        const pop = ease(abs, [stampAt, stampAt + 8], [1.4, 1])
        const o = ease(abs, [stampAt, stampAt + 6], [0, 1])
        return (
          <div key={i} style={{ width: 44, height: 44, borderRadius: 10, border: `2px solid ${COLORS.boneDim}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ opacity: o, transform: `scale(${pop})` }}>
              <XMark progress1={p1} progress2={p2} color={COLORS.red} />
            </div>
          </div>
        )
      })}
    </div>
  )
}
