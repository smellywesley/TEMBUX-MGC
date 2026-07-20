import React from 'react'
import { AbsoluteFill, useCurrentFrame } from 'remotion'
import { FONTS, TYPE, TABULAR, LABEL_STYLE } from '../theme/tokens'
import { ease, lin } from '../lib/ease'
import { Odometer } from '../lib/Odometer'
import { SourceLine } from '../lib/SourceLine'
import { useTypeOn } from '../lib/useTypeOn'
import { DARK, DarkFrame, CaptionBlock, SeatModuleSide, BridgeSide } from './kit'

// ============ B1 — REVEAL (240f): AeroGlide, LIFT · BRIDGE · SLIDE ============
export const B1_Reveal: React.FC = () => {
  const f = useCurrentFrame()
  const title = ease(f, [10, 40], [0, 1])
  const tagIn = ease(f, [55, 80], [0, 1])
  const steps = ['LIFT', 'BRIDGE', 'SLIDE']
  const moduleIn = ease(f, [90, 130], [0, 1])
  return (
    <DarkFrame>
      <div style={{ position: 'absolute', top: 300, left: 0, right: 0, textAlign: 'center', opacity: title, transform: `translateY(${20 * (1 - title)}px)` }}>
        <div style={{ fontFamily: FONTS.serif, fontWeight: 600, fontSize: 108, color: DARK.ink, letterSpacing: '0.02em' }}>AeroGlide</div>
      </div>
      <div style={{ position: 'absolute', top: 452, left: 0, right: 0, textAlign: 'center', opacity: tagIn, display: 'flex', justifyContent: 'center', gap: 28 }}>
        {steps.map((s, i) => (
          <React.Fragment key={s}>
            {i > 0 && <span style={{ color: DARK.line, fontSize: 22 }}>·</span>}
            <span style={{ ...LABEL_STYLE, fontSize: 24, color: DARK.cyan }}>{s}</span>
          </React.Fragment>
        ))}
      </div>
      <svg width={1920} height={1080} style={{ position: 'absolute', opacity: moduleIn }}>
        <g transform={`translate(760 ${lin(moduleIn, [0, 1], [640, 600])})`}>
          <SeatModuleSide inflate={0.4} accent={DARK.cyan} w={400} />
          <BridgeSide extend={0.15} stroke={DARK.ink} x={400} reach={260} />
        </g>
      </svg>
      <div style={{ position: 'absolute', bottom: 130, left: 0, right: 0, textAlign: 'center', fontFamily: FONTS.sans, fontSize: 27, color: DARK.inkSoft, opacity: ease(f, [150, 175], [0, 1]) }}>
        An integrated unweighting and anchoring system for lateral transfer
      </div>
    </DarkFrame>
  )
}

// ============ B2 — LIFT MECHANISM (300f): payoff vs Act 1's 3,400 N ============
export const B2_Lift: React.FC = () => {
  const f = useCurrentFrame()
  const inflate = ease(f, [30, 130], [0, 1])
  const force = ease(f, [40, 150], [4500, 2380])
  const headline = useTypeOn(f, 'The lift changes the mechanics.', 0)
  const chipO = ease(f, [190, 215], [0, 1])
  return (
    <DarkFrame>
      <CaptionBlock world="dark" eyebrow="THE MECHANISM" y={90} head={<>{headline.shown}</>} />
      <svg width={1920} height={1080} style={{ position: 'absolute' }}>
        <g transform={`translate(280 ${lin(inflate, [0, 1], [700, 620])})`}>
          <SeatModuleSide inflate={inflate} accent={DARK.cyan} w={480} />
          {/* seated icon riding the rising seat */}
          <g transform="translate(200 -46)">
            <circle cx={0} cy={-58} r={20} fill={DARK.ink} />
            <rect x={-20} y={-40} width={40} height={40} rx={14} fill={DARK.ink} />
          </g>
        </g>
        {/* threshold reference line, same 3,400N read as Act 1 */}
        <line x1={1120} y1={520} x2={1780} y2={520} stroke={DARK.red} strokeWidth={2.5} strokeDasharray="10 8" opacity={0.7} />
        <text x={1120} y={500} fill={DARK.red} fontFamily={FONTS.sans} fontWeight={600} fontSize={19} letterSpacing="0.08em">
          3,400 N — THE THRESHOLD FROM ACT ONE
        </text>
      </svg>
      <div style={{ position: 'absolute', right: 130, top: 560, textAlign: 'right' }}>
        <Odometer value={force} fontSize={130} color={force > 3400 ? DARK.red : DARK.cyan} suffix="N" />
        <div style={{ fontFamily: FONTS.sans, fontSize: 24, color: DARK.inkSoft, marginTop: 12 }}>
          required caregiver force, same lift
        </div>
      </div>
      <div
        style={{
          position: 'absolute', left: 130, bottom: 130, padding: '14px 26px', borderRadius: 12,
          border: `1px solid ${DARK.cyan}66`, background: 'rgba(69,198,224,0.06)',
          ...LABEL_STYLE, fontSize: 21, color: DARK.cyan, opacity: chipO,
        }}
      >
        40–60 mm powered micro-lift · 12 V · air only
      </div>
      <SourceLine color={DARK.ink}>TembuX prototype testing, 2025</SourceLine>
    </DarkFrame>
  )
}

// ============ B3 — BRIDGE (270f): 350 -> 625 mm ============
export const B3_Bridge: React.FC = () => {
  const f = useCurrentFrame()
  const extend = ease(f, [40, 160], [0, 1])
  const mm = lin(extend, [0, 1], [350, 625])
  const headline = useTypeOn(f, 'A rigid bridge closes the gap.', 0)
  const chip1 = ease(f, [190, 210], [0, 1])
  const chip2 = ease(f, [215, 235], [0, 1])
  return (
    <DarkFrame>
      <CaptionBlock world="dark" eyebrow="THE CROSSING" y={90} head={<>{headline.shown}</>} />
      <svg width={1920} height={1080} style={{ position: 'absolute' }}>
        <g transform="translate(560 700) scale(1.6)">
          {/* wheelchair-side anchor: the frame-clamp stub the bridge hinges from */}
          <rect x={-70} y={-40} width={40} height={80} rx={8} fill={DARK.ink} opacity={0.85} />
          <circle cx={-50} cy={0} r={7} fill={DARK.cyan} />
          <BridgeSide extend={extend} stroke={DARK.ink} accent={DARK.cyan} reach={340} />
          {/* bed edge the extended bridge reaches */}
          <g opacity={ease(f, [140, 165], [0, 1])} transform={`translate(${118 + 340 * extend + 60} 0)`}>
            <rect x={0} y={-70} width={16} height={140} rx={4} fill={DARK.line} />
            <rect x={-6} y={-70} width={22} height={14} rx={4} fill={DARK.inkSoft} />
          </g>
        </g>
      </svg>
      <div style={{ position: 'absolute', left: 130, top: 380 }}>
        <Odometer value={mm} fontSize={120} color={DARK.ink} suffix="mm" />
        <div style={{ fontFamily: FONTS.sans, fontSize: 24, color: DARK.inkSoft, marginTop: 10 }}>
          stowed → extended reach
        </div>
      </div>
      <div style={{ position: 'absolute', left: 130, bottom: 160, display: 'flex', gap: 16 }}>
        <div style={{ padding: '12px 22px', borderRadius: 999, border: `1px solid ${DARK.cyan}66`, ...LABEL_STYLE, fontSize: 19, color: DARK.cyan, opacity: chip1 }}>
          300 mm telescoping travel
        </div>
        <div style={{ padding: '12px 22px', borderRadius: 999, border: `1px solid ${DARK.line}`, ...LABEL_STYLE, fontSize: 19, color: DARK.ink, opacity: chip2 }}>
          clamps to front frame tubing, Ø22–32 mm
        </div>
      </div>
    </DarkFrame>
  )
}

// ============ B4 — MATERIALS (280f): six layers, flat stack + legend ============
const LAYERS: { n: string; name: string; spec: string; color: string }[] = [
  { n: '01', name: 'Top Cover', spec: 'PU fabric', color: '#3a3f47' },
  { n: '02', name: 'Comfort Foam', spec: 'PU foam, 8 mm', color: '#cdbb98' },
  { n: '03', name: 'Multi-Chamber Air Bladder', spec: 'TPU · air only, no liquid', color: DARK.cyan },
  { n: '04', name: 'Restraint Fabric', spec: 'non-stretch, prevents ballooning', color: '#2a2d33' },
  { n: '05', name: 'Rigid Lift Plate', spec: 'aluminium, 3 mm', color: '#c7ccd2' },
  { n: '06', name: 'Base Shell', spec: 'HDPE', color: '#26292d' },
]
export const B4_Materials: React.FC = () => {
  const f = useCurrentFrame()
  const headline = useTypeOn(f, 'Six layers, precisely specified.', 0)
  return (
    <DarkFrame>
      <CaptionBlock world="dark" eyebrow="THE STACK" y={90} head={<>{headline.shown}</>} />
      {/* stacked bars, top layer at top, widening slightly as they cascade in */}
      <div style={{ position: 'absolute', left: 220, top: 380, width: 480 }}>
        {LAYERS.map((l, i) => {
          const start = 30 + i * 16
          const t = ease(f, [start, start + 16], [0, 1])
          return (
            <div
              key={l.n}
              style={{
                height: 46, marginBottom: 8, borderRadius: 8, background: l.color,
                opacity: t, transform: `translateX(${(1 - t) * -40}px)`,
                border: l.color === DARK.cyan ? `1px solid ${DARK.cyan}` : '1px solid rgba(0,0,0,0.2)',
                boxShadow: l.color === DARK.cyan ? `0 0 22px ${DARK.cyan}55` : undefined,
              }}
            />
          )
        })}
      </div>
      <div style={{ position: 'absolute', right: 160, top: 300 }}>
        {LAYERS.map((l, i) => {
          const start = 46 + i * 16
          const t = ease(f, [start, start + 16], [0, 1])
          return (
            <div key={l.n} style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginBottom: 26, opacity: t, transform: `translateX(${(1 - t) * 30}px)` }}>
              <span style={{ ...TABULAR, fontFamily: FONTS.sans, fontWeight: 600, fontSize: 19, color: DARK.cyan, width: 30 }}>{l.n}</span>
              <div>
                <div style={{ fontFamily: FONTS.sans, fontWeight: 600, fontSize: 26, color: DARK.ink }}>{l.name}</div>
                <div style={{ fontFamily: FONTS.sans, fontSize: 17, color: DARK.inkSoft, marginTop: 2, letterSpacing: '0.04em' }}>{l.spec}</div>
              </div>
            </div>
          )
        })}
      </div>
    </DarkFrame>
  )
}

// ============ B5 — SAFETY (300f): interlock logic + true-time emergency dump ============
export const B5_Safety: React.FC = () => {
  const f = useCurrentFrame()
  const headline = useTypeOn(f, 'The lift only runs when the bridge is locked.', 0)
  const root = ease(f, [40, 60], [0, 1])
  const noDraw = ease(f, [65, 100], [0, 1])
  const noDim = ease(f, [130, 150], [1, 0.35])
  const yesDraw = ease(f, [105, 150], [0, 1])
  const stopwatchStart = 180
  const t = lin(f, [stopwatchStart, stopwatchStart + 56], [0, 1.87])
  const frozen = f >= stopwatchStart + 56
  const swIn = ease(f, [stopwatchStart - 10, stopwatchStart], [0, 1])
  return (
    <DarkFrame>
      <CaptionBlock world="dark" eyebrow="THE SAFEGUARD" y={90} head={<>{headline.shown}</>} />
      <div style={{ position: 'absolute', left: 260, top: 400 }}>
        <div style={{ padding: '14px 26px', borderRadius: 10, border: `2px solid ${DARK.ink}`, ...LABEL_STYLE, fontSize: 20, color: DARK.ink, opacity: root, width: 280, textAlign: 'center' }}>
          BRIDGE LOCKED?
        </div>
        <div style={{ marginTop: 26, display: 'flex', gap: 40 }}>
          <div style={{ opacity: noDraw * noDim }}>
            <div style={{ padding: '12px 20px', borderRadius: 10, border: `2px solid ${DARK.red}`, ...LABEL_STYLE, fontSize: 18, color: DARK.red, width: 240, textAlign: 'center' }}>
              NO → LIFT DISABLED
            </div>
          </div>
          <div style={{ opacity: yesDraw }}>
            <div style={{ padding: '12px 20px', borderRadius: 10, border: `2px solid ${DARK.cyan}`, ...LABEL_STYLE, fontSize: 18, color: DARK.cyan, width: 240, textAlign: 'center' }}>
              YES → LIFT ENABLED
            </div>
          </div>
        </div>
      </div>
      <div style={{ position: 'absolute', right: 130, bottom: 130, textAlign: 'right', opacity: swIn }}>
        <div style={{ fontFamily: FONTS.sans, fontWeight: 600, fontSize: 84, color: frozen ? DARK.cyan : DARK.ink, ...TABULAR }}>
          {t.toFixed(2)} s
        </div>
        <div style={{ ...LABEL_STYLE, fontSize: 17, color: DARK.inkSoft, marginTop: 6 }}>
          EMERGENCY DEFLATION · REAL TIME · SPEC &lt; 2 s
        </div>
      </div>
    </DarkFrame>
  )
}

// ============ B6 — EVIDENCE (240f): bench-tested, not just modeled ============
export const B6_Evidence: React.FC = () => {
  const f = useCurrentFrame()
  const headline = useTypeOn(f, 'Bench-tested, not just modeled.', 0)
  const sf = ease(f, [40, 110], [0, 5.7])
  const chip1 = ease(f, [140, 160], [0, 1])
  const chip2 = ease(f, [165, 185], [0, 1])
  const chip3 = ease(f, [190, 210], [0, 1])
  return (
    <DarkFrame>
      <CaptionBlock world="dark" eyebrow="THE PROOF" y={90} head={<>{headline.shown}</>} />
      {/* Odometer is integer-only (its digit strip can never settle on a
          fraction) — a decimal like 5.7 needs a plain tween, same pattern
          as the stopwatch's "1.87 s" elsewhere in this project. */}
      <div style={{ position: 'absolute', left: 0, right: 0, top: 400, textAlign: 'center' }}>
        <span style={{ fontFamily: FONTS.sans, fontWeight: 600, fontSize: 170, color: DARK.cyan, ...TABULAR }}>
          {sf.toFixed(1)}<span style={{ fontSize: 68 }}>× SF</span>
        </span>
        <div style={{ fontFamily: FONTS.sans, fontSize: 26, color: DARK.inkSoft, marginTop: 16 }}>
          bridge safety factor against yield
        </div>
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 190, display: 'flex', justifyContent: 'center', gap: 20 }}>
        {[
          { t: 'DEFLECTION < 5 mm', o: chip1 },
          { t: 'RATED TO 120 kg', o: chip2 },
          { t: 'NURSE-VALIDATED LIFT TARGET', o: chip3 },
        ].map((c) => (
          <div key={c.t} style={{ padding: '12px 22px', borderRadius: 999, border: `1px solid ${DARK.cyan}66`, ...LABEL_STYLE, fontSize: 18, color: DARK.cyan, opacity: c.o }}>
            {c.t}
          </div>
        ))}
      </div>
      <SourceLine color={DARK.ink}>TembuX prototype testing, 2025</SourceLine>
    </DarkFrame>
  )
}
