import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { useScroll } from '@react-three/drei'
import { MathUtils, Vector3 } from 'three'
import { SEAT_LAYERS, SEAT_W, SEAT_D, BRIDGE, CLAMP, MM } from './modelData'
import { roundedPlateGeometry } from './geometry'

// Scroll choreography on a 7.6-page track (see ScrollControls pages={7.6}).
// Page units: 0 hero · 1 overview · 2 engineering (explode) · 3..6.6 six
// compressed material steps (0.6 page each, top cover -> base shell) · 6.6 CTA
// (reassemble + bridge deploys). offset = pageUnits / (pages - 1) = p / 6.6.
// Tune these live on your machine — the preview sandbox throttles rAF.
const TRACK = 6.6 // pages - 1: offset->page-unit conversion
const STEP = 0.6 // scroll length of one material step, in pages
const EXPLODE = [0.28, 0.1] // engineering: seat fans out along Y, holds through materials
const REASSEMBLE = [0.92, 0.05] // CTA: stack closes back up
const SWING = [0.94, 0.04] // bridge swings out from stowed
const EXTEND = [0.955, 0.045] // bridge telescopes to full reach
const GHOST_OPACITY = 0.12 // non-featured layers during the material walkthrough
const FEATURE_LIFT = 0.24 // featured layer drifts up/out by this much

// Featured material step (0..5, top cover first) for a given scroll offset,
// or -1 outside the materials chapter. Step k's section tops at page 3 + k*STEP.
function featuredStep(offset) {
  if (offset >= REASSEMBLE[0]) return -1
  const p = offset * TRACK // current scroll position in page units
  const k = Math.floor((p - (3 - STEP / 2)) / STEP)
  return k >= 0 && k <= 5 ? k : -1
}

// Assembled resting Y of each layer, bottom-up.
const stackY = []
let cursor = 0
for (const l of SEAT_LAYERS) {
  stackY.push(cursor + l.t / 2)
  cursor += l.t
}
const stackHeight = cursor

// One seat layer. Rigid/upholstered layers are rounded-rectangle extrusions;
// the air bladder is a row of cylindrical inflatable tubes (multi-chamber TPU).
function Layer({ data, refCb, y0 }) {
  const geo = useMemo(
    () =>
      data.chambers
        ? null
        : roundedPlateGeometry(SEAT_W, SEAT_D, data.t, (data.corner || 20) * MM, (data.bevel || 0) * MM),
    [data],
  )

  if (data.chambers) {
    const n = data.chambers
    const spacing = SEAT_W / n
    const radius = Math.min(data.t / 2, (spacing / 2) * 0.92)
    return (
      <group ref={refCb} name={data.name} position={[0, y0, 0]}>
        {Array.from({ length: n }).map((_, i) => {
          const x = -SEAT_W / 2 + spacing / 2 + i * spacing
          return (
            <mesh key={i} position={[x, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[radius, radius, SEAT_D * 0.98, 24]} />
              <meshStandardMaterial
                color={data.color}
                roughness={data.roughness}
                metalness={data.metalness}
                emissive={data.emissive}
                emissiveIntensity={data.emissiveIntensity}
                transparent
                opacity={0.5}
              />
            </mesh>
          )
        })}
      </group>
    )
  }

  return (
    <mesh ref={refCb} name={data.name} geometry={geo} position={[0, y0, 0]}>
      {/* transparent: opacity is scroll-animated (ghosting in the materials walkthrough) */}
      <meshStandardMaterial
        color={data.color}
        roughness={data.roughness}
        metalness={data.metalness}
        transparent
      />
    </mesh>
  )
}

// Swivel caster under the seat base.
function Caster({ position }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.06, 0]}>
        <cylinderGeometry args={[0.035, 0.045, 0.12, 12]} />
        <meshStandardMaterial color="#15171a" roughness={0.5} metalness={0.6} />
      </mesh>
      <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.07, 0.07, 0.05, 20]} />
        <meshStandardMaterial color="#0c0d0f" roughness={0.7} metalness={0.2} />
      </mesh>
    </group>
  )
}

export default function TransferSystem(props) {
  const scroll = useScroll()
  const group = useRef()
  const layerRefs = useRef([])
  const hinge = useRef() // bridge swing pivot
  const telescope = useRef() // telescoping segment
  const intro = useRef(0) // entrance clock (accumulated, rAF-safe)
  const look = useRef(new Vector3(0, 0, 0)) // damped camera look-at target

  const bridgeGeo = useMemo(
    () => ({
      base: roundedPlateGeometry(BRIDGE.wStowed, BRIDGE.depth, BRIDGE.thick, 30 * MM),
      slide: roundedPlateGeometry(BRIDGE.wStowed, BRIDGE.depth * 0.9, BRIDGE.thick * 0.85, 26 * MM),
      pad: roundedPlateGeometry(BRIDGE.padDepth * 0.5, BRIDGE.depth * 0.9, BRIDGE.thick * 0.7, 20 * MM),
    }),
    [],
  )

  useFrame((state, delta) => {
    if (!scroll) return
    // Dev knob: `window.__forceOffset = 0.5` in the console previews any scroll
    // position (handy for tuning the ranges below). `= null` to release.
    const offset = window.__forceOffset ?? scroll.offset
    // same semantics as drei's scroll.range, but driven by our (overridable) offset
    const range = (a, l) => MathUtils.clamp((offset - a) / l, 0, 1)
    // explode ramps up in Engineering, holds through Materials, closes at CTA
    const explode = range(...EXPLODE) * (1 - range(...REASSEMBLE))
    const swing = range(...SWING)
    const extend = range(...EXTEND)
    const step = featuredStep(offset) // 0..5 top->base, -1 outside materials
    // step counts from the TOP of the stack; SEAT_LAYERS is bottom-up
    const featuredIdx = step === -1 ? -1 : SEAT_LAYERS.length - 1 - step

    // --- Camera rig: pan up/down the exploded stack to frame the featured
    // layer (top cover high, base shell low) and push in while inspecting ---
    let camY = 0.6
    let camZ = 6
    let lookY = 0
    if (featuredIdx !== -1) {
      const ly =
        stackY[featuredIdx] - stackHeight / 2 + SEAT_LAYERS[featuredIdx].gap * explode + FEATURE_LIFT
      camY = ly * 0.9 + 0.4
      camZ = 4.6 // push in for the inspection
      lookY = ly * 0.9
    }
    const cam = state.camera
    cam.position.y = MathUtils.damp(cam.position.y, camY, 2.5, delta)
    cam.position.z = MathUtils.damp(cam.position.z, camZ, 2.5, delta)
    look.current.y = MathUtils.damp(look.current.y, lookY, 2.5, delta)
    cam.lookAt(look.current)

    // --- Cinematic entrance: settles in over the first ~1.6s on load ---
    intro.current = Math.min(intro.current + delta, 1.8)
    const t = MathUtils.smoothstep(intro.current, 0, 1.6)
    const introSpin = (1 - t) * 0.7
    const introRise = (1 - t) * -0.6

    if (group.current) {
      group.current.scale.setScalar(0.9 + t * 0.1)
      group.current.position.y = (props.position?.[1] ?? 0) + introRise
      group.current.rotation.y = MathUtils.damp(group.current.rotation.y, offset * Math.PI * 1.8 + 0.5 + introSpin, 3, delta)
      group.current.rotation.x = MathUtils.damp(group.current.rotation.x, -0.15 + explode * 0.32, 3, delta)
    }

    // --- Seat layers: fan out along Y; during the materials walkthrough the
    // featured layer floats forward solid while the rest ghost out ---
    SEAT_LAYERS.forEach((l, i) => {
      const m = layerRefs.current[i]
      if (!m) return
      const isFeatured = featuredIdx === i
      const y = stackY[i] - stackHeight / 2 + l.gap * explode + (isFeatured ? FEATURE_LIFT : 0)
      m.position.y = MathUtils.damp(m.position.y, y, 4, delta)
      const s = MathUtils.damp(m.scale.x, isFeatured ? 1.07 : 1, 4, delta)
      m.scale.setScalar(s)
      const baseOpacity = l.transmissive ? 0.5 : 1
      const opacity = featuredIdx === -1 ? baseOpacity : isFeatured ? baseOpacity : GHOST_OPACITY
      const glow =
        l.emissiveIntensity !== undefined
          ? l.emissiveIntensity *
            (0.3 + explode + (isFeatured ? 0.8 : 0)) *
            (1 + Math.sin(offset * 40) * 0.15 * explode)
          : 0
      m.traverse?.((o) => {
        if (!o.material) return
        o.material.opacity = MathUtils.damp(o.material.opacity, opacity, 5, delta)
        if (l.emissive && o.material.emissiveIntensity !== undefined)
          o.material.emissiveIntensity = glow
      })
    })

    // --- Bridge: swing out on its hinge, then telescope ---
    if (hinge.current) hinge.current.rotation.y = MathUtils.damp(hinge.current.rotation.y, swing * -0.55, 4, delta)
    if (telescope.current)
      telescope.current.position.x = MathUtils.damp(telescope.current.position.x, (BRIDGE.wExtended - BRIDGE.wStowed) * extend, 4, delta)
  })

  const baseY = -stackHeight / 2

  return (
    <group ref={group} {...props} dispose={null}>
      {/* ---- SEAT MODULE : 6 layers ---- */}
      {SEAT_LAYERS.map((l, i) => (
        <Layer key={l.name} data={l} y0={stackY[i] - stackHeight / 2} refCb={(el) => (layerRefs.current[i] = el)} />
      ))}

      {/* ---- CASTERS under the base shell ---- */}
      {[
        [SEAT_W * 0.36, SEAT_D * 0.34],
        [-SEAT_W * 0.36, SEAT_D * 0.34],
        [SEAT_W * 0.36, -SEAT_D * 0.34],
        [-SEAT_W * 0.36, -SEAT_D * 0.34],
      ].map(([x, z], i) => (
        <Caster key={i} position={[x, baseY - 0.12, z]} />
      ))}

      {/* ---- SIDE TRANSFER BRIDGE : hinge (swing) -> telescope (extend) ---- */}
      <group ref={hinge} position={[SEAT_W / 2, baseY + BRIDGE.thick / 2, 0]}>
        {/* stowed base panel + aluminium extrusion rails */}
        <mesh geometry={bridgeGeo.base} position={[BRIDGE.wStowed / 2, 0, 0]} name={BRIDGE.name}>
          <meshStandardMaterial color={BRIDGE.color} roughness={BRIDGE.roughness} metalness={BRIDGE.metalness} />
        </mesh>
        {[-1, 1].map((s) => (
          <mesh key={s} position={[BRIDGE.wStowed / 2, BRIDGE.thick * 0.45, (s * BRIDGE.depth) / 2.2]}>
            <boxGeometry args={[BRIDGE.wStowed, BRIDGE.thick * 0.5, BRIDGE.thick * 0.5]} />
            <meshStandardMaterial color="#9aa0a8" roughness={0.34} metalness={0.92} />
          </mesh>
        ))}

        {/* telescoping segment: sliding panel + non-slip bed pad + D-handle */}
        <group ref={telescope}>
          <mesh geometry={bridgeGeo.slide} position={[BRIDGE.wStowed * 1.5, BRIDGE.thick * 0.15, 0]}>
            <meshStandardMaterial color={BRIDGE.color} roughness={BRIDGE.roughness} metalness={BRIDGE.metalness} />
          </mesh>
          {/* bed-contact pad (rubber/TPR, non-slip) */}
          <mesh geometry={bridgeGeo.pad} position={[BRIDGE.wStowed * 1.9, BRIDGE.thick * 0.5, 0]}>
            <meshStandardMaterial color={BRIDGE.padColor} roughness={0.95} metalness={0} />
          </mesh>
          {/* D grab-handle at the far end */}
          <mesh position={[BRIDGE.wStowed * 2.05, BRIDGE.thick * 0.5, 0]} rotation={[0, Math.PI / 2, 0]}>
            <torusGeometry args={[BRIDGE.depth * 0.32, 0.02, 12, 28]} />
            <meshStandardMaterial color="#15171a" roughness={0.4} metalness={0.7} />
          </mesh>
        </group>
      </group>

      {/* ---- FRONT CLAMP ASSEMBLY : articulated grip on frame tube (22–32 mm) ---- */}
      <group name={CLAMP.name} position={[-SEAT_W / 2 - 0.14, baseY - 0.02, 0]}>
        {/* frame tube it clamps onto (context) */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[CLAMP.tubeDia / 2, CLAMP.tubeDia / 2, SEAT_D * 1.3, 20]} />
          <meshStandardMaterial color={CLAMP.tubeColor} roughness={0.4} metalness={0.7} />
        </mesh>
        {/* C-clamp collars around the tube */}
        {[-0.28, 0.28].map((z) => (
          <mesh key={z} position={[0, 0, z]}>
            <torusGeometry args={[CLAMP.tubeDia * 0.7, 0.022, 12, 24, Math.PI * 1.6]} />
            <meshStandardMaterial color={CLAMP.color} roughness={0.45} metalness={0.6} />
          </mesh>
        ))}
        {/* knuckle joint + short arm reaching toward the seat */}
        <mesh position={[0.07, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 0.14, 16]} />
          <meshStandardMaterial color={CLAMP.color} roughness={0.4} metalness={0.65} />
        </mesh>
        <mesh position={[0.16, 0, 0]}>
          <boxGeometry args={[0.14, 0.06, 0.09]} />
          <meshStandardMaterial color={CLAMP.color} roughness={0.4} metalness={0.65} />
        </mesh>
      </group>
    </group>
  )
}
