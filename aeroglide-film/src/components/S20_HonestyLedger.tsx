import React from 'react'
import { AbsoluteFill, useCurrentFrame } from 'remotion'
import { COLORS, FONTS, LABEL_STYLE } from '../theme/tokens'
import { ease } from '../lib/ease'

// Bone two-column ledger. VALIDATED rows: teal check draws then text.
// STILL TO PROVE rows: amber dot, ONE pulse. Then a 30-week timeline bar
// with two flags leadered to the amber rows.
const VALIDATED = [
  'Nurse-confirmed: unweighting is the hardest phase',
  '40–60 mm lift target validated with clinicians',
  'Bridge: SF 5.7 · < 5 mm deflection at load',
]
const TO_PROVE = [
  'TPU bladder durability over inflation cycles',
  'Dual-clamp torsion at the 120 kg limit',
]

export const S20_HonestyLedger: React.FC = () => {
  const f = useCurrentFrame()
  const barW = ease(f, [180, 250], [0, 1])
  return (
    <AbsoluteFill style={{ background: COLORS.bone, padding: '110px 150px' }}>
      <div style={{ display: 'flex', gap: 120 }}>
        <div style={{ flex: 1 }}>
          <div style={{ ...LABEL_STYLE, color: COLORS.teal, marginBottom: 36 }}>VALIDATED</div>
          {VALIDATED.map((t, i) => {
            const start = 20 + i * 20
            const c1 = ease(f, [start, start + 5], [0, 1])
            const c2 = ease(f, [start + 5, start + 10], [0, 1])
            const txt = ease(f, [start + 8, start + 20], [0, 1])
            return (
              <div key={t} style={{ display: 'flex', gap: 18, alignItems: 'flex-start', marginBottom: 30 }}>
                <svg width={30} height={30} style={{ flex: 'none', marginTop: 4 }}>
                  <line x1={4} y1={16} x2={12} y2={24} stroke={COLORS.teal} strokeWidth={4} strokeLinecap="round" strokeDasharray={12} strokeDashoffset={12 * (1 - c1)} />
                  <line x1={12} y1={24} x2={26} y2={5} stroke={COLORS.teal} strokeWidth={4} strokeLinecap="round" strokeDasharray={24} strokeDashoffset={24 * (1 - c2)} />
                </svg>
                <div style={{ fontFamily: FONTS.sans, fontSize: 28, color: COLORS.navy, opacity: txt }}>{t}</div>
              </div>
            )
          })}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ ...LABEL_STYLE, color: COLORS.amber, marginBottom: 36 }}>STILL TO PROVE</div>
          {TO_PROVE.map((t, i) => {
            const start = 90 + i * 20
            const o = ease(f, [start, start + 14], [0, 1])
            // single pulse
            const pf = f - (start + 20)
            const pulse = pf > 0 && pf < 24 ? 1 + 0.25 * Math.sin((pf / 24) * Math.PI) : 1
            return (
              <div key={t} id={`prove-${i}`} style={{ display: 'flex', gap: 18, alignItems: 'flex-start', marginBottom: 30, opacity: o }}>
                <div style={{ width: 18, height: 18, borderRadius: 999, background: COLORS.amber, marginTop: 10, flex: 'none', transform: `scale(${pulse})` }} />
                <div style={{ fontFamily: FONTS.sans, fontSize: 28, color: COLORS.navy }}>{t}</div>
              </div>
            )
          })}
        </div>
      </div>

      {/* 30-week timeline */}
      <div style={{ position: 'absolute', left: 150, right: 150, bottom: 150 }}>
        <div style={{ height: 6, background: 'rgba(16,26,46,0.15)', borderRadius: 3 }}>
          <div style={{ height: 6, width: `${100 * barW}%`, background: COLORS.navy, borderRadius: 3 }} />
        </div>
        {[
          { wk: 18, label: 'bladder cycle rig', at: 0.6 },
          { wk: 24, label: 'torsion test @ 120 kg', at: 0.8 },
        ].map((flag) => {
          const show = barW >= flag.at
          return (
            <div key={flag.wk} style={{ position: 'absolute', left: `${(flag.wk / 30) * 100}%`, bottom: 10, opacity: show ? 1 : 0 }}>
              <div style={{ width: 1.5, height: 46, background: COLORS.amber, marginBottom: 6 }} />
              <div style={{ ...LABEL_STYLE, fontSize: 15, color: COLORS.amber, transform: 'translateX(-30%)', whiteSpace: 'nowrap' }}>
                WK {flag.wk} · {flag.label}
              </div>
            </div>
          )
        })}
        <div style={{ ...LABEL_STYLE, fontSize: 16, color: 'rgba(16,26,46,0.5)', marginTop: 16 }}>30-WEEK VALIDATION PLAN</div>
      </div>
    </AbsoluteFill>
  )
}
