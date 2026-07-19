import React from 'react'
import { useCurrentFrame } from 'remotion'
import { COLORS, LABEL_STYLE } from '../theme/tokens'
import { ease } from '../lib/ease'

// Label pill. onFootage -> navy glass; else bone on light.
export const LowerThird: React.FC<{
  text: string
  onFootage?: boolean
  outAt?: number // local frame to begin exit
}> = ({ text, onFootage = true, outAt }) => {
  const f = useCurrentFrame()
  const inO = ease(f, [0, 12], [0, 1]) // 400ms fade
  const rise = ease(f, [0, 12], [12, 0])
  const outO = outAt !== undefined ? ease(f, [outAt, outAt + 9], [1, 0]) : 1
  return (
    <div
      style={{
        position: 'absolute',
        left: 90,
        bottom: 90,
        padding: '16px 28px',
        borderRadius: 999,
        background: onFootage ? 'rgba(16,26,46,0.72)' : COLORS.bone,
        backdropFilter: onFootage ? 'blur(8px)' : undefined,
        color: onFootage ? COLORS.bone : COLORS.navy,
        ...LABEL_STYLE,
        opacity: inO * outO,
        transform: `translateY(${rise}px)`,
      }}
    >
      {text}
    </div>
  )
}
