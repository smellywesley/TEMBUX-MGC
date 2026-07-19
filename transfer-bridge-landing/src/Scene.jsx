import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import {
  ScrollControls,
  Scroll,
  Environment,
  Lightformer,
  ContactShadows,
  Float,
} from '@react-three/drei'
import { EffectComposer, Bloom, Vignette, DepthOfField } from '@react-three/postprocessing'
import TransferSystem from './TransferSystem'
import Overlay from './Overlay'

// Slow-orbiting rim light — a neutral moving highlight so surfaces "breathe"
// without reading as a neon effect.
function SweepLight() {
  const ref = useRef()
  useFrame((state) => {
    const t = state.clock.elapsedTime * 0.3
    if (ref.current) {
      ref.current.position.set(Math.cos(t) * 7, 3, Math.sin(t) * 7)
    }
  })
  return <spotLight ref={ref} angle={0.5} penumbra={1} intensity={38} color="#cfe9f0" />
}

// Touch devices (phone/iPad) get the SAME scroll choreography — drei's scroll
// track is a native overflow div, so swipes drive it directly. We only trim
// the heaviest GPU work so the swipe feels as smooth as desktop.
const IS_TOUCH = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches

export default function Scene() {
  return (
    <Canvas
      dpr={IS_TOUCH ? [1, 1.5] : [1, 2]}
      shadows
      camera={{ position: [0, 0.6, 6], fov: 38 }}
      gl={{ antialias: true, preserveDrawingBuffer: true }}
      onCreated={(state) => { if (typeof window !== 'undefined') window.__three = state }}
    >
      <color attach="background" args={['#09090b']} />
      <fog attach="fog" args={['#09090b', 8, 16]} />

      {/* Studio key + rim lighting for the premium reveal look */}
      <ambientLight intensity={0.22} />
      <spotLight position={[6, 8, 4]} angle={0.35} penumbra={1} intensity={120} castShadow />
      <SweepLight />

      {/* Procedural studio reflections — no CDN/HDRI fetch (sandbox-safe) */}
      <Environment resolution={256} frames={1}>
        <Lightformer intensity={2} position={[0, 4, 2]} scale={[8, 3, 1]} color="#ffffff" />
        <Lightformer intensity={1.1} position={[4, 1, 2]} scale={[3, 4, 1]} color="#9fd4e2" />
        <Lightformer intensity={1} position={[-4, 0, 2]} scale={[3, 4, 1]} color="#4a5058" />
      </Environment>

      {/* 7.6 pages: hero · overview · engineering · 6 compressed material steps (0.6 each) · CTA */}
      <ScrollControls pages={7.6} damping={0.22}>
        <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.25}>
          <TransferSystem position={[0, 0.1, 0]} />
        </Float>
        <ContactShadows
          position={[0, -1.4, 0]}
          opacity={0.5}
          scale={12}
          blur={2.6}
          far={4}
          color="#000000"
        />

        {/* HTML marketing copy, scroll-locked to the 3D track */}
        <Scroll html>
          <Overlay />
        </Scroll>
      </ScrollControls>

      <EffectComposer disableNormalPass>
        {/* mild — camera pans up the stack during the walkthrough; keep focus forgiving.
            Skipped on touch devices: DoF is the priciest pass and phones drop frames on it. */}
        {IS_TOUCH ? null : (
          <DepthOfField target={[0, 1.4, 0]} focalLength={0.02} bokehScale={1.3} height={480} />
        )}
        {/* restrained: only the bladder emissive crosses the threshold */}
        <Bloom mipmapBlur intensity={0.45} luminanceThreshold={0.75} luminanceSmoothing={0.25} />
        <Vignette eskil={false} offset={0.1} darkness={0.78} />
      </EffectComposer>
    </Canvas>
  )
}
