import { Composition } from 'remotion'
import { ProductReveal, FPS, DURATION } from './ProductReveal'

export function RemotionRoot() {
  return (
    <Composition
      id="ProductReveal"
      component={ProductReveal}
      durationInFrames={DURATION}
      fps={FPS}
      width={1920}
      height={1080}
    />
  )
}
