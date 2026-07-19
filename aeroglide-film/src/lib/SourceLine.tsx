import React from 'react'
import { FONTS, TYPE } from '../theme/tokens'

// 18px bottom-center source attribution at 55% opacity.
export const SourceLine: React.FC<{ children: React.ReactNode; color?: string; opacity?: number }> = ({
  children,
  color = '#F4EFE6',
  opacity = 1,
}) => (
  <div
    style={{
      position: 'absolute',
      bottom: 42,
      left: 0,
      right: 0,
      textAlign: 'center',
      fontFamily: FONTS.sans,
      fontWeight: 400,
      fontSize: TYPE.sourceLine,
      letterSpacing: '0.06em',
      color,
      opacity: 0.55 * opacity,
    }}
  >
    {children}
  </div>
)
