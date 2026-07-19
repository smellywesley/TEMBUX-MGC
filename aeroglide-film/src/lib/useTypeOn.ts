import { FPS } from '../theme/tokens'

// Type-on at 30 ms/char. Returns visible text, done flag, and underline width
// factor (2px underline retracts right->left over 8 frames after completion).
export function useTypeOn(localFrame: number, text: string, startFrame = 0, msPerChar = 30) {
  const elapsedMs = Math.max(0, (localFrame - startFrame) * (1000 / FPS))
  const chars = Math.min(text.length, Math.floor(elapsedMs / msPerChar))
  const done = chars >= text.length
  const doneFrame = startFrame + Math.ceil((text.length * msPerChar) / (1000 / FPS))
  const retract = done ? Math.min(1, (localFrame - doneFrame) / 8) : 0
  return { shown: text.slice(0, chars), done, underline: 1 - retract }
}
