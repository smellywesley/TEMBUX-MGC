import { interpolate } from 'remotion'
import { EASE_OUT_QUINT } from '../theme/tokens'

// Standard eased interpolate: clamped, EASE_OUT_QUINT. The one motion law.
export const ease = (
  frame: number,
  inRange: [number, number],
  outRange: [number, number],
) =>
  interpolate(frame, inRange, outRange, {
    easing: EASE_OUT_QUINT,
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

// Linear clamped (for counters/time-true devices)
export const lin = (
  frame: number,
  inRange: [number, number],
  outRange: [number, number],
) =>
  interpolate(frame, inRange, outRange, {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

// Critically-damped spring config — nothing bounces; medical devices don't bounce.
export const DAMPED = { damping: 200 } as const
