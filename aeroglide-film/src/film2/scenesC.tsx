import React from 'react'
import { AbsoluteFill, useCurrentFrame } from 'remotion'
import { FONTS, LABEL_STYLE, TABULAR } from '../theme/tokens'
import { ease } from '../lib/ease'
import { useTypeOn } from '../lib/useTypeOn'
import { WARM, WarmFrame, CaptionBlock } from './kit'

// ============ C1 — MARKET (300f): institutions vs home ============
export const C1_Market: React.FC = () => {
  const f = useCurrentFrame()
  const headline = useTypeOn(f, 'Two markets, one system.', 0)
  const divider = ease(f, [40, 70], [0, 1])
  const left = ease(f, [60, 85], [0, 1])
  const right = ease(f, [75, 100], [0, 1])
  const footer = ease(f, [190, 215], [0, 1])
  return (
    <WarmFrame>
      <CaptionBlock world="warm" eyebrow="THE MARKET" y={90} head={<>{headline.shown}</>} />
      <div style={{ position: 'absolute', left: '50%', top: 340, width: 1, height: 480 * divider, background: WARM.line }} />
      <div style={{ position: 'absolute', left: 200, top: 400, width: 660, opacity: left }}>
        <div style={{ ...LABEL_STYLE, color: WARM.teal, marginBottom: 22 }}>INSTITUTIONS</div>
        <div style={{ fontFamily: FONTS.sans, fontSize: 26, color: WARM.ink, lineHeight: 1.6 }}>
          SingHealth · NHG · NUHS · nursing homes
        </div>
        <div style={{ fontFamily: FONTS.sans, fontSize: 22, color: WARM.inkSoft, marginTop: 16, lineHeight: 1.6 }}>
          1 injury claim: up to S$53,000 · permanent disability: S$346,000
        </div>
      </div>
      <div style={{ position: 'absolute', right: 200, top: 400, width: 620, textAlign: 'right', opacity: right }}>
        <div style={{ ...LABEL_STYLE, color: WARM.ink, marginBottom: 22 }}>HOME CAREGIVERS</div>
        <div style={{ fontFamily: FONTS.sans, fontSize: 26, color: WARM.ink, lineHeight: 1.6 }}>
          Home Caregiving Grant · S$600/mo from 2026
        </div>
        <div style={{ fontFamily: FONTS.sans, fontSize: 22, color: WARM.inkSoft, marginTop: 16, lineHeight: 1.6 }}>
          bed-to-chair transfer is a qualifying activity
        </div>
      </div>
      <div
        style={{
          position: 'absolute', left: 200, right: 200, bottom: 150, textAlign: 'center', paddingTop: 28,
          borderTop: `1px solid ${WARM.line}`, fontFamily: FONTS.sans, fontWeight: 600, fontSize: 20,
          color: WARM.inkSoft, letterSpacing: '0.04em', opacity: footer,
        }}
      >
        LESS LUMBAR LOAD FOR CAREGIVERS · A STABLE CROSSING FOR PATIENTS · LOWER INJURY LIABILITY FOR INSTITUTIONS
      </div>
    </WarmFrame>
  )
}

// ============ C2 — IMPACT (240f): three flip cards ============
const CARDS = [
  { h: '~S$350', s: 'per unit · off-the-shelf components' },
  { h: '5–7 yr', s: 'life · S$40 bladder swap · displaces 5–10 disposable boards' },
  { h: 'Class B', s: 'HSA pathway · IP filed with IPOS' },
]
export const C2_Impact: React.FC = () => {
  const f = useCurrentFrame()
  const headline = useTypeOn(f, 'Built to actually ship.', 0)
  return (
    <WarmFrame>
      <CaptionBlock world="warm" eyebrow="THE PLAN" y={90} head={<>{headline.shown}</>} />
      <div style={{ position: 'absolute', inset: 0, top: 420, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', gap: 50, perspective: 1600 }}>
        {CARDS.map((c, i) => {
          const start = 40 + i * 26
          const rot = ease(f, [start, start + 60], [80, 0])
          const o = ease(f, [start, start + 18], [0, 1])
          return (
            <div
              key={c.h}
              style={{
                width: 440, height: 300, borderRadius: 20, background: '#ffffffb0',
                border: `1px solid ${WARM.line}`, boxShadow: '0 24px 50px -20px rgba(46,42,36,0.25)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                padding: 40, textAlign: 'center', opacity: o, transform: `rotateY(${rot}deg)`,
              }}
            >
              <div style={{ fontFamily: FONTS.serif, fontWeight: 600, fontSize: 52, color: WARM.ink }}>{c.h}</div>
              <div style={{ fontFamily: FONTS.sans, fontSize: 21, color: WARM.inkSoft, marginTop: 18, lineHeight: 1.5 }}>{c.s}</div>
            </div>
          )
        })}
      </div>
    </WarmFrame>
  )
}

// ============ C3 — CLOSE (270f): team + end card ============
const MEMBERS = [
  { init: 'TJ', name: 'Tang Je Re Jeremiah' },
  { init: 'NR', name: 'Ng Hao Yuan Remy' },
  { init: 'WW', name: 'Wesley Ong Wei Cheng' },
  { init: 'CJ', name: 'Cheow Jun Wei' },
  { init: 'CY', name: 'Chen Yun Ze' },
]
export const C3_Close: React.FC = () => {
  const f = useCurrentFrame()
  const teamOut = ease(f, [130, 155], [1, 0])
  const titleIn = ease(f, [140, 170], [0, 1])
  const tagline = useTypeOn(f, 'One controlled lift to a safer transfer.', 175)
  const underline = ease(f, [225, 250], [0, 1])
  const fadeOut = ease(f, [255, 270], [0, 1])
  return (
    <WarmFrame>
      <AbsoluteFill style={{ opacity: teamOut, alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ position: 'absolute', top: 220, ...LABEL_STYLE, color: WARM.inkSoft }}>
          NATIONAL UNIVERSITY OF SINGAPORE · TEAM TEMBUX
        </div>
        <div style={{ display: 'flex', gap: 54 }}>
          {MEMBERS.map((m, i) => {
            const start = 10 + i * 6
            const t = ease(f, [start, start + 16], [0, 1])
            return (
              <div key={m.init} style={{ textAlign: 'center', opacity: t, transform: `translateY(${20 * (1 - t)}px)` }}>
                <div
                  style={{
                    width: 92, height: 92, borderRadius: 999, border: `2px solid ${WARM.line}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: FONTS.serif, fontWeight: 600, fontSize: 32, color: WARM.ink, margin: '0 auto',
                  }}
                >
                  {m.init}
                </div>
                <div style={{ fontFamily: FONTS.sans, fontSize: 18, color: WARM.inkSoft, marginTop: 16, width: 170 }}>{m.name}</div>
              </div>
            )
          })}
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', opacity: titleIn * (1 - fadeOut) }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: FONTS.serif, fontWeight: 600, fontSize: 110, color: WARM.ink }}>AeroGlide</div>
          <div style={{ position: 'relative', display: 'inline-block', marginTop: 22 }}>
            <div style={{ fontFamily: FONTS.sans, fontSize: 30, color: WARM.inkSoft, minHeight: 40 }}>{tagline.shown}</div>
            <div style={{ position: 'absolute', bottom: -10, left: 0, width: `${100 * underline}%`, height: 3, background: WARM.teal }} />
          </div>
          <div style={{ ...LABEL_STYLE, fontSize: 18, color: WARM.inkSoft, marginTop: 34 }}>
            MEDICAL GRAND CHALLENGE 2026 · PROJECT 1464
          </div>
        </div>
      </AbsoluteFill>
      {/* final fade to pure black — required by the DoD ("ends on 1s black") */}
      <AbsoluteFill style={{ background: '#000000', opacity: fadeOut }} />
    </WarmFrame>
  )
}
