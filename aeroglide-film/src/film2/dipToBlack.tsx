import React from 'react'
import { AbsoluteFill } from 'remotion'
import type {
  TransitionPresentation,
  TransitionPresentationComponentProps,
} from '@remotion/transitions'

// ---------------------------------------------------------------------------
// dipToBlack — the act-boundary transition.
//
// WHY THIS EXISTS: a straight cross-fade between the warm world (bone #F4EFE6)
// and the dark world (navy #101A2E) averages to muddy grey AND superimposes
// both headlines into unreadable doubled text. Verified on frame 3373 of the
// first cut — it read as a rendering error, not a transition.
//
// The film-grammar fix is a dip through black: the outgoing scene falls to
// black over the first half, the incoming scene rises out of black over the
// second half. They never overlap, so there is no mud and no doubled type —
// and the beat of true black is what makes an act change *feel* like one.
//
// Requires the composition root to be black so the midpoint is genuinely black.
// ---------------------------------------------------------------------------

const DipToBlackPresentation: React.FC<
  TransitionPresentationComponentProps<Record<string, never>>
> = ({ children, presentationProgress, presentationDirection }) => {
  const p = presentationProgress // 0 -> 1 across the transition

  // Exiting owns the first half, entering owns the second. The hard split is
  // deliberate: at p = 0.5 the frame is pure black with nothing drawn.
  const opacity =
    presentationDirection === 'exiting'
      ? Math.max(0, 1 - p / 0.5)
      : Math.max(0, (p - 0.5) / 0.5)

  return (
    <AbsoluteFill style={{ opacity }}>
      {children}
    </AbsoluteFill>
  )
}

export const dipToBlack = (): TransitionPresentation<Record<string, never>> => ({
  component: DipToBlackPresentation,
  props: {},
})
