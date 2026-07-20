import React from 'react'
import { AbsoluteFill, OffthreadVideo, staticFile, useCurrentFrame } from 'remotion'
import { FONTS, LABEL_STYLE, TABULAR } from '../theme/tokens'
import { ease, lin } from '../lib/ease'
import { DARK, DarkFrame, CaptionBlock } from './kit'
import { Odometer } from '../lib/Odometer'
import { SourceLine } from '../lib/SourceLine'
import { useTypeOn } from '../lib/useTypeOn'

// ---------------------------------------------------------------------------
// Act 2 product showcase, driven by the real 3D product animation.
//
// IMPORTANT: this uses product3d_clean.mp4, NOT the original 60s reveal.
// The original is a finished film with its own titles and counters burned in;
// laying our annotations over it put two competing text systems on screen at
// once (verified — "57 mm" and "POWERED PNEUMATIC LIFT" collided with our
// overlay). The clean plate is the same geometry and choreography rendered
// with zero type, so this film can annotate it freely.
//
// Clean plate beat map (40s, 30fps):
//   0-8s    assembled hero, slow orbit
//   8-18s   opening into the exploded stack
//   18-26s  fully exploded, held
//   26-34s  reassembling
// ---------------------------------------------------------------------------

const V = 'video/product3d_clean.mp4'

/** Full-bleed product footage with a legibility scrim on one side.
 *  `push` shifts the (centred) product away from the type side. */
const ProductPlate: React.FC<{
  startFrom: number
  scrim?: 'left' | 'right' | 'none'
  push?: number // % of frame width; negative = product moves left
  pushY?: number // % of frame height; positive = product moves down
  zoom?: number
}> = ({ startFrom, scrim = 'right', push = 0, pushY = 0, zoom = 1.06 }) => (
  <AbsoluteFill style={{ background: '#05070a', overflow: 'hidden' }}>
    <OffthreadVideo
      src={staticFile(V)}
      startFrom={startFrom}
      muted
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        transform: `translate(${push}%, ${pushY}%) scale(${zoom})`,
      }}
    />
    {scrim !== 'none' && (
      <AbsoluteFill
        style={{
          background:
            scrim === 'right'
              ? 'linear-gradient(270deg, rgba(5,7,10,0.92) 0%, rgba(5,7,10,0.40) 34%, rgba(5,7,10,0) 60%)'
              : 'linear-gradient(90deg, rgba(5,7,10,0.92) 0%, rgba(5,7,10,0.40) 34%, rgba(5,7,10,0) 60%)',
        }}
      />
    )}
  </AbsoluteFill>
)

// ============ B1 — REVEAL (240f): real 3D hero ============
export const B1_RevealVideo: React.FC = () => {
  const f = useCurrentFrame()
  const title = ease(f, [20, 52], [0, 1])
  const tag = ease(f, [60, 88], [0, 1])
  const sub = ease(f, [150, 180], [0, 1])
  const out = ease(f, [222, 238], [1, 0])
  return (
    <AbsoluteFill style={{ opacity: out }}>
      {/* clean plate 1s — assembled hero, slow orbit */}
      <ProductPlate startFrom={30} scrim="none" />
      <AbsoluteFill style={{ background: 'rgba(5,7,10,0.42)' }} />
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              fontFamily: FONTS.serif, fontWeight: 600, fontSize: 116, color: DARK.ink,
              letterSpacing: '0.01em', opacity: title,
              transform: `translateY(${(1 - title) * 18}px)`,
              textShadow: '0 4px 40px rgba(0,0,0,0.7)',
            }}
          >
            AeroGlide
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 26, marginTop: 18, opacity: tag }}>
            {['LIFT', 'BRIDGE', 'SLIDE'].map((s, i) => (
              <React.Fragment key={s}>
                {i > 0 && <span style={{ color: DARK.inkSoft }}>·</span>}
                <span style={{ ...LABEL_STYLE, fontSize: 24, color: DARK.cyan }}>{s}</span>
              </React.Fragment>
            ))}
          </div>
          <div
            style={{
              fontFamily: FONTS.sans, fontSize: 26, color: 'rgba(244,239,230,0.72)',
              marginTop: 34, opacity: sub,
            }}
          >
            An integrated unweighting and anchoring system for lateral transfer
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  )
}

// ============ B2 — THE LIFT (300f): inflation footage + force payoff ============
export const B2_LiftVideo: React.FC = () => {
  const f = useCurrentFrame()
  const head = useTypeOn(f, 'The lift changes the mechanics.', 10)
  const force = ease(f, [70, 190], [4500, 2380])
  const chip = ease(f, [210, 236], [0, 1])
  return (
    <AbsoluteFill>
      {/* clean plate ~4s — type sits LEFT, so the scrim and the product both
          move right: dark side under the type, product clear of it. */}
      <ProductPlate startFrom={4 * 30} scrim="left" push={18} pushY={-4} />
      <div style={{ position: 'absolute', left: 110, top: 120 }}>
        <div style={{ ...LABEL_STYLE, fontSize: 22, color: DARK.cyan }}>THE MECHANISM</div>
        <div
          style={{
            fontFamily: FONTS.serif, fontWeight: 600, fontSize: 60, color: DARK.ink,
            marginTop: 16, letterSpacing: '-0.01em', textShadow: '0 2px 26px rgba(0,0,0,0.6)',
          }}
        >
          {head.shown}
        </div>
      </div>
      <div style={{ position: 'absolute', left: 110, bottom: 190 }}>
        <div style={{ fontFamily: FONTS.sans, fontSize: 21, color: 'rgba(244,239,230,0.6)', marginBottom: 6 }}>
          required caregiver force, same patient
        </div>
        <Odometer value={force} fontSize={128} color={force > 3400 ? DARK.red : DARK.cyan} suffix="N" />
        <div
          style={{
            fontFamily: FONTS.sans, fontSize: 22, color: DARK.red, marginTop: 10, ...TABULAR,
          }}
        >
          injury-risk threshold — 3,400 N
        </div>
      </div>
      <div
        style={{
          position: 'absolute', left: 110, bottom: 96, padding: '12px 24px', borderRadius: 999,
          border: `1px solid ${DARK.cyan}66`, background: 'rgba(69,198,224,0.08)',
          ...LABEL_STYLE, fontSize: 19, color: DARK.cyan, opacity: chip, display: 'inline-block',
        }}
      >
        40–60 MM POWERED MICRO-LIFT · 12 V · AIR ONLY
      </div>
      <SourceLine color={DARK.ink}>TembuX prototype testing, 2025</SourceLine>
    </AbsoluteFill>
  )
}

// ============ B4 — THE STACK (280f): exploded-view footage + layer legend ============
const LAYERS = [
  ['01', 'Top Cover', 'PU fabric'],
  ['02', 'Comfort Foam', 'PU foam, 8 mm'],
  ['03', 'Multi-Chamber Air Bladder', 'TPU · air only, no liquid'],
  ['04', 'Restraint Fabric', 'non-stretch, anti-balloon'],
  ['05', 'Rigid Lift Plate', 'aluminium, 3 mm'],
  ['06', 'Base Shell', 'HDPE'],
]

export const B4_MaterialsVideo: React.FC = () => {
  const f = useCurrentFrame()
  const head = useTypeOn(f, 'Six layers, precisely specified.', 10)
  return (
    <AbsoluteFill>
      {/* clean plate ~18s — fully exploded. Pushed down + scaled back so the
          tall exploded stack clears the headline above it. */}
      <ProductPlate startFrom={18 * 30} scrim="right" push={-15} pushY={14} zoom={0.88} />
      <div style={{ position: 'absolute', left: 110, top: 110 }}>
        <div style={{ ...LABEL_STYLE, fontSize: 22, color: DARK.cyan }}>THE STACK</div>
        <div
          style={{
            fontFamily: FONTS.serif, fontWeight: 600, fontSize: 56, color: DARK.ink,
            marginTop: 14, textShadow: '0 2px 26px rgba(0,0,0,0.6)',
          }}
        >
          {head.shown}
        </div>
      </div>
      <div style={{ position: 'absolute', right: 120, top: 250 }}>
        {LAYERS.map((l, i) => {
          const s = 40 + i * 20
          const o = ease(f, [s, s + 22], [0, 1])
          return (
            <div
              key={l[0]}
              style={{
                display: 'flex', alignItems: 'baseline', gap: 16, marginBottom: 26,
                opacity: o, transform: `translateX(${(1 - o) * 28}px)`, justifyContent: 'flex-end',
              }}
            >
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontFamily: FONTS.sans, fontWeight: 600, fontSize: 25, color: DARK.ink }}>{l[1]}</div>
                <div style={{ fontFamily: FONTS.sans, fontSize: 17, color: 'rgba(244,239,230,0.6)', marginTop: 2 }}>{l[2]}</div>
              </div>
              <span style={{ ...TABULAR, fontFamily: FONTS.sans, fontWeight: 600, fontSize: 18, color: DARK.cyan, width: 30 }}>
                {l[0]}
              </span>
            </div>
          )
        })}
      </div>
    </AbsoluteFill>
  )
}

// ============ B3 — THE BRIDGE (270f): telescoping footage + reach counter ============
export const B3_BridgeVideo: React.FC = () => {
  const f = useCurrentFrame()
  const head = useTypeOn(f, 'A rigid bridge closes the gap.', 10)
  const ext = ease(f, [60, 190], [0, 1])
  const mm = lin(ext, [0, 1], [350, 625])
  const chip1 = ease(f, [200, 224], [0, 1])
  const chip2 = ease(f, [226, 250], [0, 1])
  return (
    <AbsoluteFill>
      {/* source ~37s — the bridge telescoping out */}
      <ProductPlate startFrom={37 * 30} scrim="left" />
      <div style={{ position: 'absolute', right: 110, top: 120, textAlign: 'right' }}>
        <div style={{ ...LABEL_STYLE, fontSize: 22, color: DARK.cyan }}>THE CROSSING</div>
        <div
          style={{
            fontFamily: FONTS.serif, fontWeight: 600, fontSize: 56, color: DARK.ink,
            marginTop: 14, textShadow: '0 2px 26px rgba(0,0,0,0.6)',
          }}
        >
          {head.shown}
        </div>
      </div>
      <div style={{ position: 'absolute', left: 110, bottom: 210 }}>
        <Odometer value={mm} fontSize={118} color={DARK.ink} suffix="mm" />
        <div style={{ fontFamily: FONTS.sans, fontSize: 22, color: 'rgba(244,239,230,0.62)', marginTop: 8 }}>
          stowed → extended reach
        </div>
      </div>
      <div style={{ position: 'absolute', left: 110, bottom: 100, display: 'flex', gap: 14 }}>
        <div style={{ padding: '11px 20px', borderRadius: 999, border: `1px solid ${DARK.cyan}66`, ...LABEL_STYLE, fontSize: 17, color: DARK.cyan, opacity: chip1 }}>
          300 MM TELESCOPING TRAVEL
        </div>
        <div style={{ padding: '11px 20px', borderRadius: 999, border: '1px solid rgba(244,239,230,0.3)', ...LABEL_STYLE, fontSize: 17, color: DARK.ink, opacity: chip2 }}>
          CLAMPS TO FRAME TUBING · Ø22–32 MM
        </div>
      </div>
    </AbsoluteFill>
  )
}

// ============ NEW — SUSTAINABILITY (270f) ============
// Rubric-driven: Environmental Sustainability is 15% of the score and the
// previous cut carried only a single passing line. This scene makes the
// circular-design argument explicitly.
export const B7_Sustainability: React.FC = () => {
  const f = useCurrentFrame()
  const head = useTypeOn(f, 'Designed to be repaired, not replaced.', 10)
  const boards = ease(f, [70, 150], [0, 10])

  const Row: React.FC<{ at: number; big: string; label: string; sub: string }> = ({ at, big, label, sub }) => {
    const o = ease(f, [at, at + 24], [0, 1])
    return (
      <div style={{ opacity: o, transform: `translateY(${(1 - o) * 16}px)`, textAlign: 'center' }}>
        <div style={{ fontFamily: FONTS.sans, fontWeight: 600, fontSize: 62, color: DARK.cyan, ...TABULAR }}>{big}</div>
        <div style={{ ...LABEL_STYLE, fontSize: 17, color: DARK.ink, marginTop: 10 }}>{label}</div>
        <div style={{ fontFamily: FONTS.sans, fontSize: 19, color: 'rgba(244,239,230,0.6)', marginTop: 8, maxWidth: 300, marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.5 }}>
          {sub}
        </div>
      </div>
    )
  }

  return (
    <DarkFrame>
      <CaptionBlock world="dark" eyebrow="SUSTAINABILITY" y={100} head={<>{head.shown}</>} />
      <div style={{ position: 'absolute', left: 0, right: 0, top: 370, display: 'flex', justifyContent: 'center', gap: 110 }}>
        <Row at={60} big="S$40" label="BLADDER SWAP" sub="the one wear part is replaced — not the whole device" />
        <Row at={86} big="5–7 yr" label="SERVICE LIFE" sub="against 6–18 months for a passive board" />
        <Row at={112} big="100%" label="RECYCLABLE FRAME" sub="6061-T6 aluminium and HDPE, separable by hand" />
      </div>
      {/* displaced-boards visual: 10 boards struck through as one unit replaces them */}
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 250, textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 14, marginBottom: 26 }}>
          {Array.from({ length: 10 }).map((_, i) => {
            const on = boards > i
            return (
              <div
                key={i}
                style={{
                  width: 62, height: 18, borderRadius: 3,
                  background: on ? 'rgba(244,239,230,0.18)' : 'rgba(244,239,230,0.5)',
                  position: 'relative',
                }}
              >
                {on && (
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center' }}>
                    <div style={{ width: '100%', height: 2, background: DARK.red }} />
                  </div>
                )}
              </div>
            )
          })}
        </div>
        <div style={{ fontFamily: FONTS.sans, fontSize: 24, color: 'rgba(244,239,230,0.82)' }}>
          One reusable unit displaces an estimated <strong style={{ color: DARK.ink }}>5–10 disposable slide boards</strong> over its life.
        </div>
        <div style={{ fontFamily: FONTS.sans, fontSize: 19, color: 'rgba(244,239,230,0.55)', marginTop: 12 }}>
          Planned bladder take-back programme keeps consumable waste low as volume grows.
        </div>
      </div>
    </DarkFrame>
  )
}
