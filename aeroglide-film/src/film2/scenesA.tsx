import React from 'react'
import { AbsoluteFill, useCurrentFrame } from 'remotion'
import { FONTS, TYPE, TABULAR, COLORS } from '../theme/tokens'
import { ease, lin } from '../lib/ease'
import { Odometer } from '../lib/Odometer'
import { SourceLine } from '../lib/SourceLine'
import { useTypeOn } from '../lib/useTypeOn'
import { XMark } from '../components/FailureTracker'
import {
  WARM, DARK, WarmFrame, DarkFrame, Eyebrow, Headline, CaptionBlock,
  Figure, Wheelchair, Bed, ForceVector,
} from './kit'

// Shared ground-plane constants so every scene's wheelchair/bed/figure sit on
// a common, correctly-aligned floor line (fixes the "floating seat" bug).
const FLOOR_Y = 860
const WHEELCHAIR_Y = FLOOR_Y - 62 // big-wheel radius, so the wheel touches the floor
const SEAT_Y = WHEELCHAIR_Y - 76 // wheelchair cushion top — Figure(seated) origin
const BED_Y = FLOOR_Y - 96 // bed leg height

// ============ A1 — COLD OPEN (240f): the ward, the stooped lift ============
// Register: free-body-diagram, not "acted" illustration — a rigid tilt +
// force vector reads as credible engineering shorthand for a clinical/
// medtech audience, and sidesteps the broken bent-limb pose from draft 1.
export const A1_ColdOpen: React.FC = () => {
  const f = useCurrentFrame()
  const sceneIn = ease(f, [0, 24], [0, 1])
  const lean = ease(f, [50, 130], [3, 17]) // rigid whole-body tilt only
  const vecIn = ease(f, [70, 110], [0, 1])
  const head = useTypeOn(f, 'Every day, someone lifts.', 30)
  const subO = ease(f, [120, 145], [0, 1])
  const SCALE = 1.35
  return (
    <WarmFrame>
      <div style={{ position: 'absolute', top: 90, left: 0, right: 0 }}>
        <Eyebrow color={WARM.red}>LATERAL PATIENT TRANSFER</Eyebrow>
        <div style={{ marginTop: 18 }}>
          <Headline color={WARM.ink} size={68}>{head.shown}</Headline>
        </div>
        <div style={{ fontFamily: FONTS.sans, fontSize: 27, color: WARM.inkSoft, textAlign: 'center', marginTop: 14, opacity: subO }}>
          wheelchair → bed · many times a day · by hand
        </div>
      </div>
      <svg width={1920} height={1080} style={{ position: 'absolute', opacity: sceneIn }}>
        <g transform={`translate(140 -230) scale(${SCALE})`}>
          <line x1={320} y1={FLOOR_Y} x2={1280} y2={FLOOR_Y} stroke={WARM.line} strokeWidth={3} />
          {/* ground shadows for depth */}
          <ellipse cx={620} cy={FLOOR_Y + 4} rx={110} ry={10} fill={WARM.ink} opacity={0.08} />
          <ellipse cx={920} cy={FLOOR_Y + 4} rx={70} ry={9} fill={WARM.ink} opacity={0.08} />

          <Wheelchair stroke={WARM.ink} seat={WARM.teal + '55'} x={620} y={WHEELCHAIR_Y} />
          <g transform={`translate(636 ${SEAT_Y})`}><Figure color={WARM.red + 'cc'} seated /></g>

          {/* bed shortened + moved in so it stays fully on-canvas at this scale */}
          <Bed stroke={WARM.ink} mattress="#ffffff" x={960} y={BED_Y} w={320} />

          {/* the caregiver — rigid tilt at the hips, engineering-diagram register */}
          <g transform={`translate(820 ${FLOOR_Y})`}>
            <g transform={`rotate(${lean})`}>
              <Figure color={WARM.ink} />
            </g>
          </g>
          {/* free-body force vector at the lift point — kept clear of the bed */}
          <g opacity={vecIn}>
            <ForceVector x={750} y={FLOOR_Y - 118} angle={100} length={80} color={WARM.red} label="lift force" />
          </g>
        </g>
      </svg>
    </WarmFrame>
  )
}

// ============ A2 — FORCE BAR, warm world (330f) ============
const MAX_N = 5000
const CH = 520
const CB = 840
export const A2_ForceBar: React.FC = () => {
  const f = useCurrentFrame()
  const axis = ease(f, [0, 60], [0, 1])
  const value = f < 130 ? ease(f, [60, 130], [0, 3400]) : ease(f, [130, 210], [3400, 4500])
  const barH = (value / MAX_N) * CH
  const threshY = CB - (3400 / MAX_N) * CH
  const threshIn = ease(f, [130, 145], [0, 1])
  const capO = ease(f, [215, 230], [0, 1])
  const cap2O = ease(f, [245, 260], [0, 1])
  return (
    <WarmFrame>
      <CaptionBlock
        world="warm" eyebrow="THE HIDDEN LOAD" y={86}
        head={<>One lift can exceed the spine’s design limit.</>}
      />
      <svg width={1920} height={1080} style={{ position: 'absolute' }}>
        <line x1={620} y1={CB} x2={620} y2={CB - CH} stroke={WARM.ink} strokeWidth={2.5} strokeDasharray={CH} strokeDashoffset={CH * (1 - axis)} opacity={0.55} />
        <line x1={620} y1={CB} x2={1300} y2={CB} stroke={WARM.ink} strokeWidth={2.5} strokeDasharray={680} strokeDashoffset={680 * (1 - axis)} opacity={0.55} />
        {[1000, 2000, 3000, 4000, 5000].map((n) => (
          <text key={n} x={598} y={CB - (n / MAX_N) * CH + 7} fill={WARM.inkSoft} fontFamily={FONTS.sans} fontSize={19} textAnchor="end" opacity={axis}>
            {n.toLocaleString('en-US')}
          </text>
        ))}
      </svg>
      <div style={{ position: 'absolute', left: 740, bottom: 1080 - CB, width: 190, height: barH, background: WARM.ink, borderRadius: '6px 6px 0 0' }} />
      {barH > CB - threshY && (
        <div style={{ position: 'absolute', left: 740, bottom: 1080 - threshY, width: 190, height: barH - (CB - threshY), background: WARM.red, borderRadius: '6px 6px 0 0' }} />
      )}
      {/* dashed line spans only the chart's own column (620-950) — never reaches the number column */}
      <div style={{ position: 'absolute', top: threshY, left: 620, width: 330 * threshIn, borderTop: `3px dashed ${WARM.red}` }} />
      {/* label lives in the LEFT MARGIN, right-aligned to the axis — a fixed
          580px box guarantees it can never reach the bar (740+) or the
          number column (1150+) regardless of text length or line position */}
      <div style={{ position: 'absolute', top: threshY - 44, left: 0, width: 600, textAlign: 'right', fontFamily: FONTS.sans, fontWeight: 600, fontSize: 20, letterSpacing: '0.09em', color: WARM.red, opacity: threshIn }}>
        INJURY-RISK THRESHOLD — 3,400 N
      </div>
      {/* number column hugs the right edge, well clear of the headline band (which ends ~y210) */}
      <div style={{ position: 'absolute', right: 130, top: 320, textAlign: 'right' }}>
        <Odometer value={value} fontSize={130} color={value > 3400 ? WARM.red : WARM.ink} suffix="N" />
        <div style={{ fontFamily: FONTS.sans, fontSize: 25, color: WARM.inkSoft, marginTop: 14, opacity: capO }}>
          compression at L5/S1 per manual lift
        </div>
        <div style={{ fontFamily: FONTS.sans, fontWeight: 600, fontSize: 25, color: WARM.red, marginTop: 6, opacity: cap2O }}>
          worse when stooped, twisted, and repeated
        </div>
      </div>
      <SourceLine color={WARM.ink} opacity={capO}>Waters et al., 1993 · NIOSH lifting equation</SourceLine>
    </WarmFrame>
  )
}

// ============ A3 — ISOTYPE (300f): 72% WHO + 338/yr MOM ============
const PersonGlyph: React.FC<{ color: string }> = ({ color }) => (
  <svg width={40} height={40} viewBox="0 0 24 24" fill={color}>
    <circle cx="12" cy="5" r="3.4" />
    <path d="M12 9.5c-3 0-5 1.8-5 4.6V21h3.4v-6h3.2v6H17v-6.9c0-2.8-2-4.6-5-4.6z" />
  </svg>
)
export const A3_Isotype: React.FC = () => {
  const f = useCurrentFrame()
  const pct = ease(f, [40, 130], [0, 72])
  const gridIn = ease(f, [0, 25], [0, 1])
  const chipO = ease(f, [150, 170], [0, 1])
  const chip2O = ease(f, [175, 195], [0, 1])
  return (
    <WarmFrame>
      <CaptionBlock world="warm" eyebrow="THE HUMAN TOLL" y={86} head={<>The people who care are getting hurt.</>} />
      <div style={{ position: 'absolute', left: 300, top: 420, display: 'grid', gridTemplateColumns: 'repeat(10, 54px)', gap: 14, opacity: gridIn }}>
        {Array.from({ length: 100 }).map((_, i) => {
          const col = i % 10
          const row = Math.floor(i / 10)
          const order = col * 10 + row
          const hurt = order < 72
          const start = 40 + order * 1.1
          const on = f >= start
          return <PersonGlyph key={i} color={hurt && on ? WARM.red : hurt ? 'rgba(46,42,36,0.35)' : 'rgba(46,42,36,0.22)'} />
        })}
      </div>
      <div style={{ position: 'absolute', right: 230, top: 460, width: 560 }}>
        <Odometer value={pct} fontSize={TYPE.dataHero} color={WARM.red} suffix="%" />
        <div style={{ fontFamily: FONTS.sans, fontSize: 29, color: WARM.ink, marginTop: 20, lineHeight: 1.45 }}>
          of nurses live with chronic low-back pain
        </div>
        <div
          style={{
            display: 'inline-block', marginTop: 30, padding: '12px 22px', borderRadius: 999,
            border: `1.5px solid ${WARM.line}`, fontFamily: FONTS.sans, fontWeight: 600,
            fontSize: 21, letterSpacing: '0.1em', color: WARM.ink, opacity: chipO, ...TABULAR,
          }}
        >
          338 serious back injuries / year
        </div>
        <div
          style={{
            fontFamily: FONTS.sans, fontSize: 20, color: WARM.inkSoft, marginTop: 14, opacity: chip2O,
          }}
        >
          reported to the Ministry of Manpower, 2025
        </div>
      </div>
      <SourceLine color={WARM.ink}>World Health Organization, 2018 · Ministry of Manpower, 2025</SourceLine>
    </WarmFrame>
  )
}

// ============ A4 — DEMAND (270f): aging × beds = more injured caregivers ============
export const A4_Demand: React.FC = () => {
  const f = useCurrentFrame()
  const eq = useTypeOn(f, 'MORE PATIENTS  ×  MORE BEDS  ×  BY HAND', 150)
  const eq2 = useTypeOn(f, '=  MORE INJURED CAREGIVERS', 185)
  const Bar: React.FC<{ x: number; h: number; v: string; label: string; start: number; color: string }> = ({ x, h, v, label, start, color }) => {
    const t = ease(f, [start, start + 45], [0, 1])
    return (
      <>
        <div style={{ position: 'absolute', left: x, bottom: 400, width: 120, height: h * t, background: color, borderRadius: '6px 6px 0 0' }} />
        <div style={{ position: 'absolute', left: x - 20, bottom: 408 + h * t, width: 160, textAlign: 'center', fontFamily: FONTS.sans, fontWeight: 600, fontSize: 26, color: WARM.ink, ...TABULAR }}>{v}</div>
        <div style={{ position: 'absolute', left: x - 40, bottom: 340, width: 200, textAlign: 'center', fontFamily: FONTS.sans, fontSize: 19, color: WARM.inkSoft, opacity: t }}>{label}</div>
      </>
    )
  }
  return (
    <WarmFrame>
      <CaptionBlock world="warm" eyebrow="AND IT IS ACCELERATING" y={86} head={<>Singapore is ageing into this problem.</>} />
      <Bar x={480} h={180} v="20.7%" label="65+ share · 2025" start={20} color={WARM.teal + '99'} />
      <Bar x={660} h={210} v="23.9%" label="65+ share · 2030" start={40} color={WARM.teal} />
      <Bar x={1080} h={140} v="16,200" label="care beds · 2020" start={70} color={WARM.amber + '99'} />
      <Bar x={1260} h={265} v="31,000+" label="care beds · 2030s" start={90} color={WARM.amber} />
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 170, textAlign: 'center', fontFamily: FONTS.serif, fontWeight: 600, fontSize: 40, color: WARM.ink, lineHeight: 1.55 }}>
        <div>{eq.shown}</div>
        <div style={{ color: WARM.red }}>{eq2.shown}</div>
      </div>
      <SourceLine color={WARM.ink}>MOH 2023 · Population.gov.sg 2025</SourceLine>
    </WarmFrame>
  )
}

// ============ A5 — FIVE TOOLS (750f): illustrated vignettes + X tracker ============
// All vignettes share one 1200x520 stage (VB), scaled/centred identically —
// keeps every tool visually consistent instead of five hand-tuned layouts.
type Vignette = { label: string; verdict: string; draw: (t: number, f: number) => React.ReactNode }
const V_STROKE = WARM.ink
const VB_Y = 420 // wheelchair/bed floor line inside the shared stage
const VB_WY = VB_Y - 62
const VB_SY = VB_WY - 76
const VB_BY = VB_Y - 96

const VIGNETTES: Vignette[] = [
  {
    label: 'SLIDE BOARD',
    verdict: 'bridges the gap — but does not lift',
    draw: (t) => (
      <>
        <Wheelchair stroke={V_STROKE} seat={WARM.teal + '55'} x={430} y={VB_WY} />
        <Bed stroke={V_STROKE} mattress="#fff" x={780} y={VB_BY} w={360} />
        {/* board across, patient stuck at wheelchair end */}
        <rect x={470} y={VB_WY - 44} width={330 * t} height={12} rx={6} fill={WARM.amber} />
        <g transform={`translate(446 ${VB_SY})`}><Figure color={WARM.red + 'cc'} seated /></g>
      </>
    ),
  },
  {
    label: 'AIR MAT',
    verdict: 'built for lying flat — wrong geometry for a seated body',
    draw: (t) => (
      <>
        <Bed stroke={V_STROKE} mattress="#fff" x={250} y={VB_BY} w={330} />
        <rect x={270} y={VB_BY - 52} width={290} height={22} rx={11} fill={WARM.teal + '88'} />
        <Wheelchair stroke={V_STROKE} seat={WARM.teal + '55'} x={980} y={VB_WY} />
        <g transform={`translate(996 ${VB_SY})`}><Figure color={WARM.red + 'cc'} seated /></g>
        {/* flat mat propped uselessly against the seated form */}
        <g transform={`translate(860 ${VB_WY - 40 * t}) rotate(-62)`}>
          <rect x={0} y={0} width={250} height={20} rx={10} fill={WARM.red + '77'} />
        </g>
      </>
    ),
  },
  {
    label: 'HOIST',
    verdict: 'no lifting for staff — but slow, stressful, frightening',
    draw: (t, f) => (
      <>
        <line x1={600} y1={VB_Y} x2={600} y2={130} stroke={V_STROKE} strokeWidth={4} opacity={0.35} />
        <path d={`M 500 ${VB_Y} L 500 200 L 750 200 L 750 280`} stroke={V_STROKE} strokeWidth={10} fill="none" strokeLinecap="round" />
        {/* sling swings gently — unsettling pendulum. Two straps + a hammock
            seat + a small cradled figure reads as "suspended patient";
            the previous single blob shape didn't. */}
        <g transform={`translate(750 280) rotate(${Math.sin(f / 14) * 7 * t})`}>
          <line x1={0} y1={0} x2={-38} y2={86} stroke={V_STROKE} strokeWidth={4} />
          <line x1={0} y1={0} x2={38} y2={86} stroke={V_STROKE} strokeWidth={4} />
          <path d="M -38 86 Q 0 120 38 86 L 33 102 Q 0 132 -33 102 Z" fill={WARM.red + '77'} stroke={V_STROKE} strokeWidth={2} />
          <g transform="translate(0 90) scale(0.5)">
            <Figure color={WARM.red + 'ee'} seated />
          </g>
        </g>
        {/* clock */}
        <g transform="translate(1050 280)">
          <circle r={64} fill="none" stroke={V_STROKE} strokeWidth={5} />
          <line x1={0} y1={0} x2={0} y2={-46} stroke={WARM.red} strokeWidth={5} strokeLinecap="round" transform={`rotate(${lin(t, [0, 1], [0, 720])})`} />
        </g>
      </>
    ),
  },
  {
    label: 'WALKING BELT',
    verdict: 'only for patients who can already stand',
    draw: (t) => (
      <>
        {/* standing cooperative patient with belt around the TRUNK (was
            mis-positioned at head height, reading as a hat, not a belt) */}
        <g transform={`translate(430 ${VB_Y})`}><Figure color={WARM.teal} /></g>
        <rect x={404} y={VB_Y - 96} width={52} height={20} rx={4} fill={WARM.amber} stroke={WARM.ink} strokeWidth={2} />
        {/* the excluded seated patient, dimmed */}
        <g transform={`translate(880 ${VB_WY})`} opacity={0.5 + 0.08 * t}>
          <Wheelchair stroke={V_STROKE} seat={WARM.teal + '55'} />
        </g>
        <g transform={`translate(896 ${VB_SY})`} opacity={0.92}>
          <Figure color={WARM.red + 'cc'} seated />
        </g>
      </>
    ),
  },
  {
    label: 'PRESSURE CUSHION',
    verdict: 'protects skin by holding the pelvis — then blocks the slide',
    draw: (t) => (
      <>
        {/* cross-section: contoured hollow, pelvis caught on the leading wall */}
        <path d={`M 480 ${VB_Y - 90} Q 660 ${VB_Y - 156} 840 ${VB_Y - 90} L 840 ${VB_Y} L 480 ${VB_Y} Z`} fill={WARM.teal + '66'} stroke={V_STROKE} strokeWidth={4} />
        <circle cx={640 + 44 * t} cy={VB_Y - 116} r={48} fill={WARM.red + 'bb'} />
        {/* blocked arrow */}
        <line x1={730} y1={VB_Y - 116} x2={930} y2={VB_Y - 116} stroke={WARM.red} strokeWidth={7} strokeDasharray="16 12" strokeLinecap="round" opacity={t} />
        <line x1={800} y1={VB_Y - 168} x2={800} y2={VB_Y - 64} stroke={WARM.red} strokeWidth={7} strokeLinecap="round" opacity={t} />
      </>
    ),
  },
]

export const A5_FiveTools: React.FC = () => {
  const f = useCurrentFrame()
  const PER = 150
  const i = Math.min(Math.floor(f / PER), 4)
  const local = f - i * PER
  const t = ease(local, [15, 90], [0, 1])
  // Each tool now dips in AND out, so the five swaps read as intentional
  // dissolves instead of hard cuts (the most visible "cut" problem in v1).
  const segIn = ease(local, [0, 16], [0, 1])
  const segOut = ease(local, [PER - 18, PER - 2], [1, 0])
  const segO = segIn * segOut
  // slow push across each tool's 5s — keeps a still frame alive
  const push = 1 + (local / PER) * 0.06
  const drift = (local / PER) * -14
  const v = VIGNETTES[i]
  const xStamp = local >= 116
  return (
    <WarmFrame>
      <div style={{ opacity: segO }}>
        <CaptionBlock
          world="warm" eyebrow={`EXISTING TOOL ${i + 1} OF 5`} y={86}
          head={<>{v.label}</>} sub={v.verdict}
        />
      </div>
      <svg
        width={1920} height={1080}
        style={{ position: 'absolute', opacity: segO, transform: `scale(${push}) translateY(${drift}px)` }}
      >
        <g transform="translate(-225 230) scale(1.5)">{v.draw(t, f)}</g>
      </svg>
      {/* X tracker */}
      <div style={{ position: 'absolute', bottom: 64, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 20 }}>
        {[0, 1, 2, 3, 4].map((k) => {
          const stamped = k < i || (k === i && xStamp)
          const justNow = k === i && xStamp
          const p1 = justNow ? ease(local, [116, 120], [0, 1]) : stamped ? 1 : 0
          const p2 = justNow ? ease(local, [120, 124], [0, 1]) : stamped ? 1 : 0
          const pop = justNow ? ease(local, [116, 124], [1.35, 1]) : 1
          return (
            <div key={k} style={{ width: 46, height: 46, borderRadius: 11, border: `2px solid ${WARM.line}`, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff8' }}>
              <div style={{ transform: `scale(${pop})`, opacity: stamped ? 1 : 0 }}>
                <XMark progress1={p1} progress2={p2} color={WARM.red} size={30} />
              </div>
            </div>
          )
        })}
      </div>
    </WarmFrame>
  )
}

// ============ A6 — SILENCE / world transition (150f) ============
export const A6_Silence: React.FC = () => {
  const f = useCurrentFrame()
  const bgT = ease(f, [0, 40], [0, 1]) // warm -> navy crossfade
  const l1 = useTypeOn(f, 'Every tool leans on fragile assumptions.', 34)
  const l2 = useTypeOn(f, 'None addresses the unweighting lift.', 66)
  const underline = ease(f, [104, 116], [0, 1])
  return (
    <AbsoluteFill style={{ background: WARM.bg }}>
      <AbsoluteFill style={{ background: COLORS.navy, opacity: bgT }} />
      <div style={{ position: 'absolute', top: 430, left: 0, right: 0, textAlign: 'center', fontFamily: FONTS.serif, fontWeight: 600, fontSize: 46, color: COLORS.bone, lineHeight: 1.65 }}>
        <div style={{ opacity: bgT }}>{l1.shown}</div>
        <div style={{ position: 'relative', display: 'inline-block', opacity: bgT }}>
          {l2.shown}
          <div style={{ position: 'absolute', bottom: -10, right: 0, width: `${56 * underline}%`, height: 3, background: COLORS.red }} />
        </div>
      </div>
    </AbsoluteFill>
  )
}
