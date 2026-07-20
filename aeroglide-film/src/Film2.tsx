import React from 'react'
import { AbsoluteFill } from 'remotion'
import { TransitionSeries, linearTiming, springTiming } from '@remotion/transitions'
import { fade } from '@remotion/transitions/fade'
import { slide } from '@remotion/transitions/slide'
import { wipe } from '@remotion/transitions/wipe'
import { dipToBlack } from './film2/dipToBlack'
import { A1_ColdOpen, A2_ForceBar, A3_Isotype, A4_Demand, A5_FiveTools, A6_Silence } from './film2/scenesA'
import { B1_Reveal, B2_Lift, B3_Bridge, B4_Materials, B5_Safety, B6_Evidence } from './film2/scenesB'
import { C1_Market, C2_Impact, C3_Close } from './film2/scenesC'

// ---------------------------------------------------------------------------
// Film2 — all-designed rebuild, now with CHOREOGRAPHED transitions.
//
// Transition grammar (deliberate, not decorative):
//   ACT 1 (the problem accumulating) -> slide left. Forward, relentless,
//     each fact shoving the last one off screen. The problem won't let up.
//   INTO THE SILENCE BEAT (A6)       -> slow fade. Everything stops.
//   ACT 1 -> ACT 2 (the turn)        -> long fade; A6 performs its own
//     warm->dark colour wash inside, so the fade lets that land clean.
//   ACT 2 (engineering)              -> wipes. Mechanical, precise, deliberate
//     — the machine revealing itself panel by panel.
//   ACT 2 -> ACT 3 (dark->warm)      -> long fade home.
//   ACT 3 (resolution)               -> gentle slides, then a final fade.
//
// Durations are chosen per beat: fast (16f) inside a rhythm, slow (30f) at act
// boundaries so the audience feels the gear change.
// ---------------------------------------------------------------------------

type Beat = {
  id: string
  Comp: React.FC
  duration: number
  // transition INTO the next scene (undefined on the last beat)
  next?: { presentation: ReturnType<typeof fade>; frames: number; spring?: boolean }
}

const SLIDE_L = () => slide({ direction: 'from-right' })
const SLIDE_UP = () => slide({ direction: 'from-bottom' })

const BEATS: Beat[] = [
  // ---- ACT 1 — warm, the human problem ----
  { id: 'A1', Comp: A1_ColdOpen, duration: 240, next: { presentation: SLIDE_L(), frames: 22 } },
  { id: 'A2', Comp: A2_ForceBar, duration: 330, next: { presentation: SLIDE_L(), frames: 22 } },
  { id: 'A3', Comp: A3_Isotype, duration: 300, next: { presentation: SLIDE_L(), frames: 22 } },
  { id: 'A4', Comp: A4_Demand, duration: 270, next: { presentation: SLIDE_UP(), frames: 26 } },
  { id: 'A5', Comp: A5_FiveTools, duration: 750, next: { presentation: fade(), frames: 34 } },
  // the silence beat — and the warm->dark wash lives inside it.
  // ACT BOUNDARY: dip through black, never cross-fade (see dipToBlack.tsx).
  { id: 'A6', Comp: A6_Silence, duration: 150, next: { presentation: dipToBlack(), frames: 40 } },

  // ---- ACT 2 — dark, the engineering answer ----
  { id: 'B1', Comp: B1_Reveal, duration: 240, next: { presentation: wipe({ direction: 'from-left' }), frames: 24 } },
  { id: 'B2', Comp: B2_Lift, duration: 300, next: { presentation: wipe({ direction: 'from-left' }), frames: 24 } },
  { id: 'B3', Comp: B3_Bridge, duration: 270, next: { presentation: wipe({ direction: 'from-bottom' }), frames: 24 } },
  { id: 'B4', Comp: B4_Materials, duration: 280, next: { presentation: wipe({ direction: 'from-left' }), frames: 24 } },
  { id: 'B5', Comp: B5_Safety, duration: 300, next: { presentation: wipe({ direction: 'from-left' }), frames: 24 } },
  // ACT BOUNDARY (dark -> warm): must dip, a cross-fade here rendered as
  // muddy grey with doubled headlines.
  { id: 'B6', Comp: B6_Evidence, duration: 240, next: { presentation: dipToBlack(), frames: 40 } },

  // ---- ACT 3 — warm, market + close ----
  { id: 'C1', Comp: C1_Market, duration: 300, next: { presentation: SLIDE_L(), frames: 22 } },
  { id: 'C2', Comp: C2_Impact, duration: 240, next: { presentation: fade(), frames: 30 } },
  { id: 'C3', Comp: C3_Close, duration: 270 }, // ends on pure black itself
]

// TransitionSeries overlaps neighbours, so the film is SHORTER than the sum of
// scene durations by exactly the total transition time.
const SUM_SCENES = BEATS.reduce((a, b) => a + b.duration, 0)
const SUM_TRANSITIONS = BEATS.reduce((a, b) => a + (b.next?.frames ?? 0), 0)
export const TOTAL_FRAMES_2 = SUM_SCENES - SUM_TRANSITIONS

// Frame markers for VO sync, accounting for transition overlap.
export const MARKERS2: { frame: number; id: string }[] = (() => {
  let f = 0
  return BEATS.map((b, i) => {
    const m = { frame: f, id: b.id }
    f += b.duration - (b.next?.frames ?? 0)
    return m
  })
})()

export const Film2: React.FC = () => (
  // Root is BLACK (not navy) so dipToBlack's midpoint is genuinely black.
  // Every scene paints its own full-bleed background, so the root is only
  // ever visible during a dip.
  <AbsoluteFill style={{ background: '#000000' }}>
    <TransitionSeries>
      {BEATS.flatMap((b, i) => {
        const seq = (
          <TransitionSeries.Sequence key={`s-${b.id}`} durationInFrames={b.duration}>
            <b.Comp />
          </TransitionSeries.Sequence>
        )
        if (!b.next) return [seq]
        return [
          seq,
          <TransitionSeries.Transition
            key={`t-${b.id}`}
            presentation={b.next.presentation}
            timing={
              b.next.spring
                ? springTiming({ config: { damping: 200 }, durationInFrames: b.next.frames })
                : linearTiming({ durationInFrames: b.next.frames })
            }
          />,
        ]
      })}
    </TransitionSeries>
  </AbsoluteFill>
)
