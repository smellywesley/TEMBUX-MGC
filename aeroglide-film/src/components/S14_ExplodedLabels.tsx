import React from 'react'
import { useCurrentFrame } from 'remotion'
import { COLORS, FONTS } from '../theme/tokens'
import { ease } from '../lib/ease'

// Right-docked numbered layer column with leader lines. CANONICAL copy —
// engineering-sheet wording; base-shell thickness intentionally omitted
// (report/sheet conflict — see consistency register).
const LAYERS: { n: string; name: string; spec: string; y: number }[] = [
  { n: '01', name: 'TOP COVER', spec: 'PU fabric', y: 22 },
  { n: '02', name: 'COMFORT FOAM', spec: 'PU foam, 8 mm', y: 33 },
  { n: '03', name: 'MULTI-CHAMBER AIR BLADDER', spec: 'TPU · air only, no liquid', y: 45 },
  { n: '04', name: 'RESTRAINT FABRIC', spec: 'non-stretch, prevents ballooning', y: 57 },
  { n: '05', name: 'RIGID LIFT PLATE', spec: 'aluminium, 3 mm', y: 68 },
  { n: '06', name: 'BASE SHELL', spec: 'HDPE', y: 79 },
]

export const S14_ExplodedLabels: React.FC = () => {
  const f = useCurrentFrame()
  return (
    <>
      {/* right-edge scrim behind labels (hides any baked column peeking past reframe) */}
      <div
        style={{
          position: 'absolute', right: 0, top: 0, bottom: 0, width: 620,
          background: 'linear-gradient(90deg, rgba(16,26,46,0) 0%, rgba(16,26,46,0.85) 36%)',
        }}
      />
      {LAYERS.map((l, i) => {
        const start = 20 + i * 12
        const circ = ease(f, [start, start + 10], [0, 1])
        const txt = ease(f, [start + 8, start + 18], [0, 1])
        const C = 2 * Math.PI * 17
        return (
          <div key={l.n} style={{ position: 'absolute', right: 90, top: `${l.y}%`, display: 'flex', alignItems: 'center', gap: 16, width: 470 }}>
            {/* leader line toward the model */}
            <div style={{ position: 'absolute', right: '100%', width: 90 * txt, height: 1, background: COLORS.cyanEng, opacity: 0.7 }} />
            <svg width={38} height={38} style={{ flex: 'none' }}>
              <circle cx={19} cy={19} r={17} fill="none" stroke={COLORS.cyanEng} strokeWidth={2}
                strokeDasharray={C} strokeDashoffset={C * (1 - circ)} transform="rotate(-90 19 19)" />
              <text x={19} y={24} textAnchor="middle" fill={COLORS.cyanEng} fontFamily={FONTS.sans} fontWeight={600} fontSize={14} opacity={circ}>
                {l.n}
              </text>
            </svg>
            <div style={{ opacity: txt, transform: `translateX(${12 * (1 - txt)}px)` }}>
              <div style={{ fontFamily: FONTS.sans, fontWeight: 600, fontSize: 23, color: COLORS.bone, letterSpacing: '0.04em' }}>{l.name}</div>
              <div style={{ fontFamily: FONTS.sans, fontSize: 18, color: COLORS.boneDim, marginTop: 2 }}>{l.spec}</div>
            </div>
          </div>
        )
      })}
    </>
  )
}
