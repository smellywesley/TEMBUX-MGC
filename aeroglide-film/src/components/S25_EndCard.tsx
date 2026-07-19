import React from 'react'
import { AbsoluteFill, useCurrentFrame } from 'remotion'
import { COLORS, FONTS, LABEL_STYLE } from '../theme/tokens'
import { ease } from '../lib/ease'
import { useTypeOn } from '../lib/useTypeOn'

// End card: AeroGlide scales 0.97→1.0 + fade; tagline types on; TEAL underline
// draws left→right — closing the arc the red underline opened in Act 1/2.
// Final 30f fade to pure black.
export const S25_EndCard: React.FC = () => {
  const f = useCurrentFrame()
  const title = ease(f, [0, 36], [0, 1])
  const scale = ease(f, [0, 36], [0.97, 1])
  const tagline = useTypeOn(f, 'One controlled lift to a safer transfer.', 40)
  const underline = ease(f, [92, 116], [0, 1])
  const toBlack = ease(f, [240, 270], [0, 1])

  return (
    <AbsoluteFill style={{ background: COLORS.navy, alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', transform: `scale(${scale})`, opacity: title }}>
        <div style={{ fontFamily: FONTS.serif, fontWeight: 600, fontSize: 120, color: COLORS.bone }}>AeroGlide</div>
        <div style={{ position: 'relative', display: 'inline-block', marginTop: 26 }}>
          <div style={{ fontFamily: FONTS.sans, fontSize: 32, color: COLORS.boneDim, minHeight: 44 }}>{tagline.shown}</div>
          <div style={{ position: 'absolute', bottom: -10, left: 0, width: `${100 * underline}%`, height: 3, background: COLORS.teal }} />
        </div>
      </div>
      <div style={{ position: 'absolute', bottom: 130, ...LABEL_STYLE, fontSize: 19, color: COLORS.boneDim, opacity: ease(f, [70, 90], [0, 1]) }}>
        TEAM TEMBUX · MEDICAL GRAND CHALLENGE 2026 · PROJECT 1464
      </div>
      <AbsoluteFill style={{ background: '#000', opacity: toBlack }} />
    </AbsoluteFill>
  )
}
