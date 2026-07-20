import { Composition } from 'remotion'
import { ProductReveal, FPS, DURATION } from './ProductReveal'
import { ProductClean, CLEAN_FPS, CLEAN_DURATION } from './ProductClean'

export function RemotionRoot() {
  return (
    <>
      <Composition
        id="ProductReveal"
        component={ProductReveal}
        durationInFrames={DURATION}
        fps={FPS}
        width={1920}
        height={1080}
      />
      {/* text-free product plate for use as B-roll in the competition film */}
      <Composition
        id="ProductClean"
        component={ProductClean}
        durationInFrames={CLEAN_DURATION}
        fps={CLEAN_FPS}
        width={1920}
        height={1080}
      />
    </>
  )
}
