import React from 'react'
import { useCurrentFrame } from 'remotion'
import { COLORS, FONTS } from '../theme/tokens'
import { ease } from '../lib/ease'

// AEROGLIDE serif title, 96px, rise+fade at slot-frame 60; tagline at 90.
export const S13_TitleReveal: React.FC = () => {
  const f = useCurrentFrame()
  const t = ease(f, [60, 78], [0, 1])
  const tag = ease(f, [90, 106], [0, 1])
  return (
    <div style={{ position: 'absolute', left: 110, bottom: 150 }}>
      <div
        style={{
          fontFamily: FONTS.serif, fontWeight: 600, fontSize: 96, color: COLORS.bone,
          letterSpacing: '0.04em', opacity: t, transform: `translateY(${20 * (1 - t)}px)`,
        }}
      >
        AEROGLIDE
      </div>
      <div
        style={{
          fontFamily: FONTS.sans, fontWeight: 600, fontSize: 26, color: COLORS.boneDim,
          letterSpacing: '0.3em', marginTop: 14, opacity: tag,
        }}
      >
        LIFT · BRIDGE · SLIDE
      </div>
    </div>
  )
}
