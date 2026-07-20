import React from 'react'
import { AbsoluteFill, Sequence } from 'remotion'
import { COLORS } from './theme/tokens'
import { A1_ColdOpen, A2_ForceBar, A3_Isotype, A4_Demand, A5_FiveTools, A6_Silence } from './film2/scenesA'
import { B1_Reveal, B2_Lift, B3_Bridge, B4_Materials, B5_Safety, B6_Evidence } from './film2/scenesB'
import { C1_Market, C2_Impact, C3_Close } from './film2/scenesC'

// ---------------------------------------------------------------------------
// Film2 — the full rebuild. Every scene is 100% code-rendered (no footage
// dependency, no AI generation, no placeholders) — zero risk of a missing
// asset or broken clip in the published video.
//
// Structure: Act 1 (warm, the human problem) -> A6 performs its own built-in
// warm->dark wash as the Act1/Act2 transition -> Act 2 (dark, the engineering
// answer) -> Act 3 (warm, market + close).
//
// Scene-to-scene cuts are HARD CUTS by design (not a missing feature): a
// hand-rolled crossfade was considered and rejected as unnecessary risk for
// a single remaining transition point (Act2->Act3) given this film's fast,
// data-driven pace — see chat history / PR notes for the rationale.
// ---------------------------------------------------------------------------

const SCENES: { id: string; Comp: React.FC; duration: number }[] = [
  // Act 1 — warm
  { id: 'A1', Comp: A1_ColdOpen, duration: 240 },
  { id: 'A2', Comp: A2_ForceBar, duration: 330 },
  { id: 'A3', Comp: A3_Isotype, duration: 300 },
  { id: 'A4', Comp: A4_Demand, duration: 270 },
  { id: 'A5', Comp: A5_FiveTools, duration: 750 },
  { id: 'A6', Comp: A6_Silence, duration: 150 }, // performs the warm->dark wash itself
  // Act 2 — dark
  { id: 'B1', Comp: B1_Reveal, duration: 240 },
  { id: 'B2', Comp: B2_Lift, duration: 300 },
  { id: 'B3', Comp: B3_Bridge, duration: 270 },
  { id: 'B4', Comp: B4_Materials, duration: 280 },
  { id: 'B5', Comp: B5_Safety, duration: 300 },
  { id: 'B6', Comp: B6_Evidence, duration: 240 },
  // Act 3 — warm
  { id: 'C1', Comp: C1_Market, duration: 300 },
  { id: 'C2', Comp: C2_Impact, duration: 240 },
  { id: 'C3', Comp: C3_Close, duration: 270 }, // ends on pure black itself
]

export const MARKERS2: { frame: number; id: string }[] = (() => {
  let f = 0
  return SCENES.map((s) => {
    const m = { frame: f, id: s.id }
    f += s.duration
    return m
  })
})()

export const TOTAL_FRAMES_2 = SCENES.reduce((a, s) => a + s.duration, 0)

export const Film2: React.FC = () => {
  let cursor = 0
  return (
    <AbsoluteFill style={{ background: COLORS.navy }}>
      {SCENES.map((s) => {
        const from = cursor
        cursor += s.duration
        return (
          <Sequence key={s.id} from={from} durationInFrames={s.duration} name={s.id}>
            <s.Comp />
          </Sequence>
        )
      })}
    </AbsoluteFill>
  )
}
