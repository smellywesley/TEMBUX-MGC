import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion'
import { Stack } from './Stack'
import { BG } from './theme'

// ---------------------------------------------------------------------------
// ProductClean — the product animation with ZERO baked text.
//
// WHY: the original ProductReveal is a finished 60s film with its own titles,
// counters and legends burned in. Using it as B-roll under the competition
// film's own annotations produced two competing text systems on screen at once
// (verified: "57 mm" + "POWERED PNEUMATIC LIFT" collided with our overlay).
//
// This composition renders the same hero geometry and choreography as pure
// visuals, so the competition film can annotate it freely. One continuous
// 40s take: slow orbit throughout, a full explode-and-reassemble in the
// middle, breathing bladder glow — any window of it is usable as a plate.
// ---------------------------------------------------------------------------

export const CLEAN_FPS = 30
export const CLEAN_DURATION = 40 * CLEAN_FPS // 1200 frames

export const ProductClean = () => {
  const f = useCurrentFrame()
  const t = f / CLEAN_FPS // seconds

  // continuous slow orbit — never stops, so every window has life in it
  const rotate = -34 + t * 2.6

  // explode: hold assembled, open 8-18s, hold open, close 26-34s
  const open = interpolate(t, [8, 18], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic),
  })
  const close = interpolate(t, [26, 34], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic),
  })
  const explode = open * (1 - close)

  // bladder glow breathes, and swells while exploded so the air layer reads
  const glow = 0.75 + Math.sin(t * 1.1) * 0.15 + explode * 0.9

  // ease scale down as it opens so the taller exploded stack stays in frame
  const scale = interpolate(explode, [0, 1], [1.02, 0.66])
  const rise = explode * 150 // keep the growing stack vertically centred

  return (
    <AbsoluteFill style={{ background: BG, overflow: 'hidden' }}>
      {/* soft studio pools for depth — purely visual, no type */}
      <div
        style={{
          position: 'absolute', width: 1500, height: 950,
          left: 210 + Math.sin(t * 0.35) * 40, top: -180,
          background: 'radial-gradient(closest-side, rgba(120,160,180,0.08), transparent)',
        }}
      />
      <div
        style={{
          position: 'absolute', width: 1600, height: 1000,
          left: -260 - Math.sin(t * 0.28) * 40, bottom: -300,
          background: 'radial-gradient(closest-side, rgba(23,224,255,0.06), transparent)',
        }}
      />
      <div style={{ position: 'absolute', inset: 0, transform: `translateY(${rise}px)` }}>
        <Stack explode={explode} glow={glow} scale={scale} rotate={rotate} />
      </div>
      {/* vignette */}
      <AbsoluteFill
        style={{
          background:
            'radial-gradient(120% 90% at 50% 45%, transparent 55%, rgba(0,0,0,0.55) 100%)',
          pointerEvents: 'none',
        }}
      />
    </AbsoluteFill>
  )
}
