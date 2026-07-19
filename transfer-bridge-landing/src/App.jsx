import { Suspense, useEffect } from 'react'
import Scene from './Scene'

export default function App() {
  // ponytail: R3F (react-use-measure) can report size 0 on first paint inside
  // some embeds/iframes and then never re-fire, leaving a 300x150 dead canvas.
  // One resize nudge after mount forces the measure. Cheap, harmless everywhere.
  useEffect(() => {
    const ts = [60, 400, 1200].map((ms) =>
      setTimeout(() => window.dispatchEvent(new Event('resize')), ms),
    )
    return () => ts.forEach(clearTimeout)
  }, [])

  return (
    <Suspense fallback={<div className="boot">Loading V2…</div>}>
      <Scene />
    </Suspense>
  )
}
