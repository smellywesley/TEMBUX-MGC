import React from 'react'
import { useCurrentFrame } from 'remotion'
import { COLORS, LABEL_STYLE } from '../theme/tokens'
import { ease } from '../lib/ease'

// L-bracket measurement callout drawn around a %-positioned rect (editor
// tunes rect over the dial gauge in the real footage), then two chips dock.
export const S18_BenchOverlay: React.FC<{
  rect?: { x: number; y: number; w: number; h: number } // % units
  labelOnly?: boolean
}> = ({ rect = { x: 58, y: 30, w: 22, h: 30 }, labelOnly = false }) => {
  const f = useCurrentFrame()
  const draw = ease(f, [30, 70], [0, 1])
  const chip1 = ease(f, [80, 94], [0, 1])
  const chip2 = ease(f, [104, 118], [0, 1])

  return (
    <>
      {!labelOnly && (
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox="0 0 100 100" preserveAspectRatio="none">
          {/* top-left L */}
          <path
            d={`M ${rect.x} ${rect.y + 8} L ${rect.x} ${rect.y} L ${rect.x + 6} ${rect.y}`}
            fill="none" stroke={COLORS.cyanEng} strokeWidth={0.35}
            strokeDasharray={20} strokeDashoffset={20 * (1 - draw)} vectorEffect="non-scaling-stroke"
          />
          {/* bottom-right L */}
          <path
            d={`M ${rect.x + rect.w} ${rect.y + rect.h - 8} L ${rect.x + rect.w} ${rect.y + rect.h} L ${rect.x + rect.w - 6} ${rect.y + rect.h}`}
            fill="none" stroke={COLORS.cyanEng} strokeWidth={0.35}
            strokeDasharray={20} strokeDashoffset={20 * (1 - draw)} vectorEffect="non-scaling-stroke"
          />
        </svg>
      )}
      <div style={{ position: 'absolute', left: 90, bottom: 90, display: 'flex', gap: 16 }}>
        {[
          { t: 'SF 5.7 AGAINST YIELD', o: chip1 },
          { t: 'DEFLECTION < 5 mm', o: chip2 },
        ].map((c) => (
          <div
            key={c.t}
            style={{
              padding: '12px 24px', borderRadius: 999,
              background: 'rgba(16,26,46,0.72)', backdropFilter: 'blur(8px)',
              border: `1px solid ${COLORS.cyanEng}`,
              ...LABEL_STYLE, fontSize: 19, color: COLORS.cyanEng,
              opacity: c.o, transform: `translateY(${12 * (1 - c.o)}px)`,
            }}
          >
            {c.t}
          </div>
        ))}
      </div>
    </>
  )
}
