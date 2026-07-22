import React from 'react'
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from 'remotion'
import { FONTS, LABEL_STYLE } from '../theme/tokens'
import { ease } from '../lib/ease'
import { WARM, WarmFrame } from './kit'
import { XMark } from '../components/FailureTracker'

// ---------------------------------------------------------------------------
// Photo-based scenes. Replaces the hand-drawn SVG figures with the real ward
// photography — the single biggest credibility + emotion lever in the film.
//
// Treatment is consistent across every photo so five different source images
// read as one deliberate film: full-bleed cover, slow Ken Burns push, a warm
// grade to sit in the bone palette, and a directional scrim so type always
// lands on the darkest part of the frame (never floating over a face).
// ---------------------------------------------------------------------------

export const PhotoPlate: React.FC<{
  src: string
  frame: number
  duration: number
  /** push direction — alternate per scene so consecutive photos don't feel identical */
  zoomIn?: boolean
  scrim?: 'bottom' | 'left'
}> = ({ src, frame, duration, zoomIn = true, scrim = 'bottom' }) => {
  const p = frame / duration
  const scale = zoomIn ? 1.02 + p * 0.07 : 1.09 - p * 0.07
  const drift = zoomIn ? p * -10 : p * 10
  return (
    <AbsoluteFill style={{ overflow: 'hidden', background: '#1a1614' }}>
      <Img
        src={staticFile(src)}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transform: `scale(${scale}) translateY(${drift}px)`,
          // warm-documentary grade so clinical stock sits inside the film's palette
          filter: 'saturate(0.82) contrast(1.06) sepia(0.10) brightness(0.97)',
        }}
      />
      {/* warm wash */}
      <AbsoluteFill style={{ background: 'rgba(244,239,230,0.06)' }} />
      {/* directional scrim — type always lands on the darkest area */}
      <AbsoluteFill
        style={{
          background:
            scrim === 'bottom'
              ? 'linear-gradient(180deg, rgba(20,16,14,0.55) 0%, rgba(20,16,14,0.06) 34%, rgba(20,16,14,0.10) 52%, rgba(20,16,14,0.90) 100%)'
              : 'linear-gradient(90deg, rgba(20,16,14,0.92) 0%, rgba(20,16,14,0.40) 44%, rgba(20,16,14,0.05) 72%)',
        }}
      />
    </AbsoluteFill>
  )
}

// ============ A1 — COLD OPEN, real ward (240f) ============
// The emotional open. A real caregiver taking a real patient's weight.
export const A1_ColdOpenPhoto: React.FC = () => {
  const f = useCurrentFrame()
  const eyebrow = ease(f, [14, 34], [0, 1])
  const l1 = ease(f, [34, 60], [0, 1])
  const l2 = ease(f, [64, 92], [0, 1])
  const sub = ease(f, [120, 148], [0, 1])
  const out = ease(f, [216, 238], [1, 0])
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <PhotoPlate src="photos/tool4_walkingbelt.jpg" frame={f} duration={240} zoomIn scrim="bottom" />
      <div style={{ position: 'absolute', left: 120, bottom: 140 }}>
        <div style={{ ...LABEL_STYLE, fontSize: 23, color: '#E8A79A', opacity: eyebrow }}>
          LATERAL PATIENT TRANSFER
        </div>
        <div
          style={{
            fontFamily: FONTS.serif, fontWeight: 600, fontSize: 78, color: '#FDFBF7',
            lineHeight: 1.12, marginTop: 20, letterSpacing: '-0.01em',
            textShadow: '0 2px 30px rgba(0,0,0,0.5)',
          }}
        >
          <div style={{ opacity: l1, transform: `translateY(${(1 - l1) * 16}px)` }}>
            Someone has to be moved.
          </div>
          <div style={{ opacity: l2, transform: `translateY(${(1 - l2) * 16}px)` }}>
            Someone has to lift them.
          </div>
        </div>
        <div
          style={{
            fontFamily: FONTS.sans, fontSize: 26, color: 'rgba(253,251,247,0.78)',
            marginTop: 22, opacity: sub, letterSpacing: '0.02em',
          }}
        >
          wheelchair → bed · many times a day · by hand
        </div>
      </div>
    </AbsoluteFill>
  )
}

// ============ A5 — FIVE TOOLS, real photos (750f) ============
type Tool = {
  photo: string
  n: string
  name: string
  critique: string
  cite?: string
  zoomIn: boolean
}

// Critiques are the report's own cited findings wherever the literature
// supports them — this is what makes the act read as clinical, not opinion.
const TOOLS: Tool[] = [
  {
    photo: 'photos/tool1_slideboard.jpg',
    n: '01',
    name: 'Slide board',
    critique: 'Bridges the gap — but never lifts. The patient must still scoot and hold themselves upright.',
    cite: 'Sun et al., 2018',
    zoomIn: true,
  },
  {
    photo: 'photos/tool2_aircushion.jpg',
    n: '02',
    name: 'Air cushion',
    critique: 'Inflates under the pelvis and balloons outward — leaving the patient perched on an unstable surface.',
    zoomIn: false,
  },
  {
    photo: 'photos/tool3_hoist.jpg',
    n: '03',
    name: 'Mechanical hoist',
    critique: 'Takes the load off staff, yet nurses rate it as stressful as lifting by hand — and it takes far longer.',
    cite: 'Garg et al., 1991',
    zoomIn: true,
  },
  {
    photo: 'photos/tool4_walkingbelt.jpg',
    n: '04',
    name: 'Walking belt',
    critique: 'Only for patients who can already bear weight. Not for the heavy, the contracted, or those who cannot stand.',
    cite: 'Garg et al., 1991',
    zoomIn: false,
  },
  {
    photo: 'photos/tool5_pressurecushion.jpg',
    n: '05',
    name: 'Pressure cushion',
    critique: 'Its contour cradles the pelvis to protect skin — and that same contour must be overcome before any sideways slide.',
    cite: 'Sonenblum et al., 2018',
    zoomIn: true,
  },
]

// 7s per tool (was 5s) so each intervention has room to land — the failure
// act is the film's credibility spine and it was flying by too fast.
const PER = 210
// crossfade window between tools — the incoming tool rises ON TOP of the
// outgoing one, so the scene never passes through black (the old segIn/segOut
// both hit zero at the boundary, producing a ~0.5s black flash every swap).
const XF = 26
export const A5_TOTAL = PER * TOOLS.length // 1050

// One tool layer. It only ever fades IN; the next layer paints over it, so no
// layer needs to fade to black. Ken Burns runs on its own clamped local clock.
const ToolLayer: React.FC<{ t: Tool; start: number; f: number }> = ({ t, start, f }) => {
  const local = Math.min(Math.max(f - start, 0), PER + XF)
  const appear = ease(f, [start, start + XF], [0, 1]) // crossfade in over the layer below
  const nameIn = ease(local, [14, 40], [0, 1])
  const critIn = ease(local, [34, 64], [0, 1])
  const citeIn = ease(local, [58, 84], [0, 1])
  return (
    <AbsoluteFill style={{ opacity: appear }}>
      <PhotoPlate src={t.photo} frame={local} duration={PER} zoomIn={t.zoomIn} scrim="left" />
      <div style={{ position: 'absolute', left: 110, top: 220, width: 660 }}>
        <div style={{ ...LABEL_STYLE, fontSize: 20, color: '#E8A79A' }}>
          EXISTING TOOL {t.n} / 05
        </div>
        <div
          style={{
            fontFamily: FONTS.serif, fontWeight: 600, fontSize: 68, color: '#FDFBF7',
            marginTop: 18, letterSpacing: '-0.01em', lineHeight: 1.08,
            opacity: nameIn, transform: `translateY(${(1 - nameIn) * 18}px)`,
            textShadow: '0 2px 24px rgba(0,0,0,0.45)',
          }}
        >
          {t.name}
        </div>
        <div
          style={{
            width: 74, height: 3, background: WARM.red, marginTop: 24,
            transform: `scaleX(${critIn})`, transformOrigin: 'left',
          }}
        />
        <div
          style={{
            fontFamily: FONTS.sans, fontSize: 27, lineHeight: 1.55,
            color: 'rgba(253,251,247,0.90)', marginTop: 24,
            opacity: critIn, transform: `translateY(${(1 - critIn) * 12}px)`,
            textShadow: '0 2px 18px rgba(0,0,0,0.5)',
          }}
        >
          {t.critique}
        </div>
        {t.cite && (
          <div
            style={{
              fontFamily: FONTS.sans, fontSize: 18, letterSpacing: '0.08em',
              color: 'rgba(253,251,247,0.55)', marginTop: 20, opacity: citeIn,
            }}
          >
            {t.cite}
          </div>
        )}
      </div>
    </AbsoluteFill>
  )
}

export const A5_FiveToolsPhoto: React.FC = () => {
  const f = useCurrentFrame()
  const cur = Math.min(Math.floor(f / PER), TOOLS.length - 1)
  const localCur = f - cur * PER
  const xAt = 150 // failure X stamps ~5s into each tool, leaving it to breathe

  return (
    <AbsoluteFill style={{ background: '#000' }}>
      {/* photo layers — later tools paint over earlier ones during the crossfade,
          so the scene never dips to black between interventions */}
      {TOOLS.map((t, k) => (
        <ToolLayer key={k} t={t} start={k * PER} f={f} />
      ))}

      {/* failure tracker — one persistent overlay, driven by absolute frame */}
      <div style={{ position: 'absolute', bottom: 70, left: 110, display: 'flex', gap: 16 }}>
        {TOOLS.map((_, k) => {
          const stampFrame = k * PER + xAt
          const stamped = f >= stampFrame
          const now = k === cur && localCur >= xAt
          const p1 = now ? ease(localCur, [xAt, xAt + 5], [0, 1]) : stamped ? 1 : 0
          const p2 = now ? ease(localCur, [xAt + 5, xAt + 10], [0, 1]) : stamped ? 1 : 0
          const pop = now ? ease(localCur, [xAt, xAt + 10], [1.3, 1]) : 1
          return (
            <div
              key={k}
              style={{
                width: 42, height: 42, borderRadius: 10,
                border: `2px solid ${stamped ? 'rgba(232,167,154,0.9)' : 'rgba(253,251,247,0.28)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'rgba(20,16,14,0.45)',
              }}
            >
              <div style={{ transform: `scale(${pop})`, opacity: stamped ? 1 : 0 }}>
                <XMark progress1={p1} progress2={p2} color="#E8776A" size={26} />
              </div>
            </div>
          )
        })}
      </div>
    </AbsoluteFill>
  )
}
