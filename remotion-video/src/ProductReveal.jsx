import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  spring,
  Easing,
} from 'remotion'
import { TransitionSeries, linearTiming } from '@remotion/transitions'
import { fade } from '@remotion/transitions/fade'
import { Stack } from './Stack'
import { LAYERS, TEXTURES, NEON, BG, WARN, FONT } from './theme'

// 60 fps, everything timed in SECONDS via sec() so the rate stays decoupled.
export const FPS = 60
const sec = (t) => Math.round(t * FPS)
const SCENE = sec(7.9) // per-scene length
const FADE = sec(0.5) // crossfade overlap between scenes
export const DURATION = 8 * SCENE - 7 * FADE // TransitionSeries net length

// deterministic pseudo-random (Math.random would flicker per frame)
const rnd = (i, salt = 0) => {
  const x = Math.sin(i * 127.1 + salt * 311.7) * 43758.5453
  return x - Math.floor(x)
}

const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='280' height='280'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.6'/%3E%3C/svg%3E\")"

// ---------------------------------------------------------------------------
// Cine: the cinema frame every scene lives in. No punch-ins, no dips — the
// crossfades handle the cuts; each scene instead gets one slow continuous
// drift (alternate +1 push-in / -1 pull-out per scene for editorial rhythm).
// ---------------------------------------------------------------------------
function Cine({ children, drift = 1 }) {
  const f = useCurrentFrame()
  const d = interpolate(f, [0, SCENE], drift > 0 ? [1, 1.025] : [1.025, 1], {
    extrapolateRight: 'clamp',
  })
  return (
    <AbsoluteFill style={{ background: '#000', fontFamily: FONT, overflow: 'hidden' }}>
      <AbsoluteFill style={{ background: BG, transform: `scale(${d})` }}>
        {children}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(120% 90% at 50% 45%, transparent 55%, rgba(0,0,0,0.55) 100%)',
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: -40,
            backgroundImage: GRAIN,
            backgroundPosition: `${(f * 19) % 280}px ${(f * 31) % 280}px`,
            opacity: 0.05,
            mixBlendMode: 'overlay',
            pointerEvents: 'none',
          }}
        />
      </AbsoluteFill>
      {/* letterbox — 2.39:1 cinema crop */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 138, background: '#000' }} />
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 138, background: '#000' }} />
    </AbsoluteFill>
  )
}

const Eyebrow = ({ children, style }) => (
  <div
    style={{
      position: 'absolute',
      left: 120,
      top: 172,
      color: NEON,
      fontSize: 25,
      letterSpacing: '0.32em',
      textTransform: 'uppercase',
      ...style,
    }}
  >
    {children}
  </div>
)

const Haze = ({ frame, strength = 1 }) => (
  <>
    <div
      style={{
        position: 'absolute',
        width: 1400,
        height: 900,
        left: 200 + Math.sin(frame / (3 * FPS)) * 60,
        top: -200,
        background: `radial-gradient(closest-side, rgba(120,160,180,${0.07 * strength}), transparent)`,
      }}
    />
    <div
      style={{
        position: 'absolute',
        width: 1600,
        height: 1000,
        left: -300 - Math.sin(frame / (2.3 * FPS)) * 50,
        bottom: -300,
        background: `radial-gradient(closest-side, rgba(23,224,255,${0.05 * strength}), transparent)`,
      }}
    />
  </>
)

const Dust = ({ frame, count = 16 }) => (
  <>
    {Array.from({ length: count }).map((_, i) => {
      const x = rnd(i) * 1920
      const y = (rnd(i, 1) * 1080 + frame * (0.1 + rnd(i, 2) * 0.25)) % 1080
      const s = 1.5 + rnd(i, 3) * 2.5
      return (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: x + Math.sin((frame + i * 60) / (1.3 * FPS)) * 14,
            top: y,
            width: s,
            height: s,
            borderRadius: 999,
            background: `rgba(180,230,255,${0.1 + rnd(i, 4) * 0.2})`,
          }}
        />
      )
    })}
  </>
)

/* CLIP 1 — cold open: silhouette in haze, dust, breathing seam, V2 tease */
function ColdOpen() {
  const f = useCurrentFrame()
  const push = interpolate(f, [0, SCENE], [0.74, 0.96], { easing: Easing.out(Easing.quad) })
  const breath = 0.4 + 0.35 * Math.sin(f / (0.6 * FPS))
  const tease = interpolate(f, [sec(4.3), sec(5.5)], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  return (
    <Cine drift={1}>
      <Haze frame={f} />
      <Dust frame={f} />
      <div style={{ position: 'absolute', inset: 0, filter: 'brightness(0.3)' }}>
        <Stack scale={push} glow={breath} rotate={-20 + (f / FPS) * 0.6} />
      </div>
      <div
        style={{
          position: 'absolute',
          left: 120,
          bottom: 190,
          opacity: tease,
          transform: `translateY(${(1 - tease) * 20}px)`,
        }}
      >
        <div style={{ color: NEON, fontSize: 24, letterSpacing: '0.5em', textTransform: 'uppercase' }}>
          Version V2
        </div>
      </div>
    </Cine>
  )
}

/* CLIP 2 — hero rotation: lights up, staggered title, specular sweep */
function HeroRotation() {
  const f = useCurrentFrame()
  const rot = interpolate(f, [0, SCENE], [-80, 8], { easing: Easing.inOut(Easing.cubic) })
  const lights = interpolate(f, [0, sec(1)], [0.35, 1], { extrapolateRight: 'clamp' })
  const sweepX = interpolate(f, [sec(1), sec(4)], [-30, 130], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  const lines = ['Smart Inflatable', 'Seat-Lift & Side', 'Transfer Bridge']
  return (
    <Cine drift={-1}>
      <Haze frame={f} strength={0.7} />
      <Dust frame={f} count={10} />
      <div style={{ position: 'absolute', inset: 0, filter: `brightness(${lights})`, transform: 'translateX(300px)' }}>
        <Stack rotate={rot} glow={0.8} scale={0.98} />
      </div>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(100deg, transparent ${sweepX - 10}%, rgba(200,240,255,0.09) ${sweepX}%, transparent ${sweepX + 10}%)`,
          mixBlendMode: 'screen',
        }}
      />
      <div style={{ position: 'absolute', left: 120, top: 360 }}>
        {lines.map((l, i) => {
          const a = interpolate(f, [sec(0.9 + i * 0.3), sec(1.8 + i * 0.3)], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
            easing: Easing.out(Easing.cubic),
          })
          return (
            <div
              key={l}
              style={{
                color: '#f4f6f8',
                fontSize: 92,
                fontWeight: 700,
                lineHeight: 1.04,
                letterSpacing: '-0.02em',
                opacity: a,
                transform: `translateY(${(1 - a) * 46}px)`,
              }}
            >
              {l}
            </div>
          )
        })}
        <div
          style={{
            marginTop: 20,
            color: NEON,
            fontSize: 24,
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            opacity: interpolate(f, [sec(2.4), sec(3.2)], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            }),
          }}
        >
          Caregiver-assisted transfer · pneumatic
        </div>
      </div>
    </Cine>
  )
}

/* CLIP 3 — pneumatic inflation: module rises, live mm counter, pulse rings */
function Inflation() {
  const f = useCurrentFrame()
  const inflate = spring({ frame: f - sec(0.7), fps: FPS, config: { damping: 16, mass: 1.2 } })
  const rise = interpolate(inflate, [0, 1], [40, -34])
  const mm = Math.round(interpolate(inflate, [0, 1], [0, 57]))
  return (
    <Cine drift={1}>
      <Haze frame={f} />
      <div style={{ position: 'absolute', inset: 0, transform: `translate(-170px, ${rise}px)` }}>
        <Stack glow={0.5 + inflate * 1.3} scale={1.02} rotate={-18} />
      </div>
      {[0, 1, 2].map((i) => {
        const ring = ((f - sec(1) + i * sec(0.85)) % sec(2.6)) / sec(2.6)
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              right: 260,
              top: 430,
              width: 320 * ring,
              height: 320 * ring,
              marginRight: -160 * ring,
              marginTop: -160 * ring,
              borderRadius: 999,
              border: `2px solid rgba(23,224,255,${0.35 * (1 - ring) * inflate})`,
            }}
          />
        )
      })}
      <div style={{ position: 'absolute', right: 130, top: 330, textAlign: 'right' }}>
        <div style={{ color: '#f4f6f8', fontSize: 140, fontWeight: 700, letterSpacing: '-0.03em', fontVariantNumeric: 'tabular-nums' }}>
          {mm}
          <span style={{ fontSize: 60, color: '#9aa3ab' }}> mm</span>
        </div>
        <div style={{ color: NEON, fontSize: 25, letterSpacing: '0.3em', textTransform: 'uppercase', marginTop: 8 }}>
          Powered pneumatic lift · air only
        </div>
        <div style={{ color: '#6d757d', fontSize: 21, letterSpacing: '0.12em', marginTop: 12 }}>
          40–60 mm target · load interlock · 12 V pump
        </div>
      </div>
    </Cine>
  )
}

/* CLIP 4 — ★ exploded view: layers separate, legend rows cascade in */
function Exploded() {
  const f = useCurrentFrame()
  const explode = spring({ frame: f - sec(0.5), fps: FPS, config: { damping: 15, mass: 1.4 } })
  const drift = interpolate(f, [sec(1.3), SCENE], [0.56, 0.6], { extrapolateLeft: 'clamp' })
  return (
    <Cine drift={-1}>
      <Haze frame={f} />
      <Dust frame={f} count={8} />
      <div style={{ position: 'absolute', inset: 0, transform: `translate(-260px, ${explode * 210}px)` }}>
        <Stack
          explode={explode}
          glow={0.7 + explode}
          scale={interpolate(explode, [0, 1], [1.05, drift])}
          rotate={-26 + (f / FPS) * 1.35}
        />
      </div>
      <div style={{ position: 'absolute', right: 130, top: 280 }}>
        {LAYERS.map((l, i) => {
          const a = interpolate(f, [sec(2.1 + i * 0.37), sec(2.85 + i * 0.37)], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
            easing: Easing.out(Easing.cubic),
          })
          return (
            <div
              key={l.name}
              style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: 20,
                marginBottom: 30,
                opacity: a,
                transform: `translateX(${(1 - a) * 60}px)`,
              }}
            >
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 999,
                  border: `2px solid ${NEON}88`,
                  color: NEON,
                  fontSize: 20,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  alignSelf: 'center',
                  flex: 'none',
                }}
              >
                {i + 1}
              </div>
              <div>
                <div style={{ color: '#f4f6f8', fontSize: 30, fontWeight: 700 }}>{l.name}</div>
                <div style={{ color: '#9aa3ab', fontSize: 19, letterSpacing: '0.14em', textTransform: 'uppercase', marginTop: 3 }}>
                  {l.spec}
                </div>
              </div>
            </div>
          )
        })}
      </div>
      <Eyebrow>Engineering — exploded view · seat module (air-only)</Eyebrow>
    </Cine>
  )
}

/* CLIP 5 — material macro montage: soft wipes, Ken Burns, progress */
function Materials() {
  const f = useCurrentFrame()
  const per = Math.floor(SCENE / LAYERS.length)
  const i = Math.min(Math.floor(f / per), LAYERS.length - 1)
  const local = f - i * per
  const wipe = interpolate(local, [0, sec(0.45)], [100, 0], {
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  })
  const kenBurns = 1.04 + (local / per) * 0.05
  const cap = interpolate(local, [sec(0.15), sec(0.6)], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  const layer = LAYERS[i]
  return (
    <Cine drift={1}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          ...TEXTURES[layer.name],
          transform: `scale(${kenBurns})`,
          clipPath: `inset(0 ${wipe}% 0 0)`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(90deg, rgba(5,6,7,0.9) 0%, transparent 48%)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 120,
          bottom: 210,
          opacity: cap,
          transform: `translateX(${(1 - cap) * -50}px)`,
        }}
      >
        <div style={{ color: NEON, fontSize: 23, letterSpacing: '0.3em' }}>
          {String(i + 1).padStart(2, '0')} / 06
        </div>
        <div style={{ color: '#f4f6f8', fontSize: 78, fontWeight: 700, marginTop: 12, letterSpacing: '-0.02em' }}>
          {layer.name}
        </div>
        <div style={{ color: '#aeb6bd', fontSize: 29, marginTop: 8 }}>{layer.spec}</div>
      </div>
      <div style={{ position: 'absolute', left: 120, bottom: 176, width: 460, height: 3, background: 'rgba(255,255,255,0.14)' }}>
        <div style={{ width: `${((i + local / per) / LAYERS.length) * 100}%`, height: '100%', background: NEON }} />
      </div>
    </Cine>
  )
}

/* CLIP 6 — reassembly, bridge telescopes; lock = flash + shake + streaks */
function BridgeDeploy() {
  const f = useCurrentFrame()
  const close = spring({ frame: f, fps: FPS, config: { damping: 17 } })
  const extend = spring({ frame: f - sec(3), fps: FPS, config: { damping: 15, mass: 1.3 } })
  const bridgeW = interpolate(extend, [0, 1], [340, 610])
  // Impact flash + screen shake REMOVED for the medical-film master:
  // precision reads as stillness, not impact. (Was: 0.28 flash + 8px jitter.)
  const flash = 0
  const shakeX = 0
  const shakeY = 0
  const streaks = extend > 0.05 && extend < 0.97
  return (
    <Cine drift={-1}>
      <Haze frame={f} />
      <AbsoluteFill style={{ transform: `translate(${shakeX}px, ${shakeY}px)` }}>
        <div style={{ position: 'absolute', inset: 0, transform: 'translateX(-190px)' }}>
          <Stack explode={1 - close} glow={0.8} scale={0.88} rotate={-24} />
        </div>
        {streaks &&
          [0, 1, 2].map((k) => (
            <div
              key={k}
              style={{
                position: 'absolute',
                left: 1020 + bridgeW - 180 - k * 90,
                top: 622 + k * 9,
                width: 120,
                height: 2,
                background: `linear-gradient(90deg, transparent, rgba(23,224,255,${0.5 - k * 0.14}))`,
              }}
            />
          ))}
        <div
          style={{
            position: 'absolute',
            left: 1020,
            top: 610,
            width: bridgeW,
            height: 42,
            borderRadius: 21,
            background: 'linear-gradient(180deg, #26292e, #17191c)',
            border: '1px solid rgba(255,255,255,0.1)',
            boxShadow: '0 30px 60px rgba(0,0,0,0.6)',
            opacity: interpolate(f, [sec(2.3), sec(3.2)], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            }),
          }}
        >
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 10,
              top: -4,
              height: 3,
              background: NEON,
              opacity: 0.8,
              boxShadow: `0 0 18px ${NEON}`,
            }}
          />
          <div
            style={{
              position: 'absolute',
              right: -30,
              top: -12,
              width: 46,
              height: 66,
              border: '7px solid #15171a',
              borderRadius: 24,
            }}
          />
        </div>
        <div style={{ position: 'absolute', right: 130, top: 200, textAlign: 'right' }}>
          <div style={{ color: '#f4f6f8', fontSize: 84, fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>
            {Math.round(interpolate(extend, [0, 1], [350, 625]))}
            <span style={{ fontSize: 42, color: '#9aa3ab' }}> mm</span>
          </div>
          <div style={{ color: NEON, fontSize: 23, letterSpacing: '0.28em', textTransform: 'uppercase', marginTop: 8 }}>
            Telescoping side bridge · 300 mm travel
          </div>
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: `rgba(200,245,255,${flash})` }} />
    </Cine>
  )
}

/* CLIP 7 — human context: warm bleed, floating bokeh, slow push */
function Context() {
  const f = useCurrentFrame()
  const warm = interpolate(f, [0, sec(2.6)], [0, 1], { extrapolateRight: 'clamp' })
  return (
    <Cine drift={1}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: warm * 0.55,
          background:
            'radial-gradient(70% 60% at 15% 80%, rgba(255,180,110,0.24), transparent),' +
            'radial-gradient(60% 50% at 88% 20%, rgba(120,170,255,0.12), transparent)',
        }}
      />
      {Array.from({ length: 7 }).map((_, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: rnd(i, 9) * 1800,
            top: rnd(i, 8) * 800 + Math.sin((f + i * 80) / (2 * FPS)) * 30,
            width: 60 + rnd(i, 7) * 120,
            height: 60 + rnd(i, 7) * 120,
            borderRadius: 999,
            background: `radial-gradient(circle, rgba(255,190,130,${0.05 * warm}), transparent 70%)`,
            filter: 'blur(2px)',
          }}
        />
      ))}
      <div style={{ position: 'absolute', inset: 0, transform: 'translateX(280px)' }}>
        <Stack glow={0.9} scale={1 + (f / FPS) * 0.012} rotate={-30 + (f / FPS) * 0.9} />
      </div>
      <div style={{ position: 'absolute', left: 120, top: 380, maxWidth: 780 }}>
        <div style={{ color: '#f4f6f8', fontSize: 74, fontWeight: 700, lineHeight: 1.05, letterSpacing: '-0.02em' }}>
          One level surface.
          <br />
          One caregiver.
        </div>
        <div style={{ color: '#aeb6bd', fontSize: 27, marginTop: 20 }}>
          For caregiver assistance only — not a lifting device.
        </div>
      </div>
    </Cine>
  )
}

/* CLIP 8 — end card: staggered lock-up, light sweep, fade to black */
function EndCard() {
  const f = useCurrentFrame()
  const sweep = interpolate(f, [sec(1), sec(4.6)], [-40, 140], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  const toBlack = interpolate(f, [SCENE - sec(0.9), SCENE - sec(0.2)], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  const lines = ['Smart Inflatable', 'Seat-Lift & Side', 'Transfer Bridge']
  return (
    <Cine drift={1}>
      <div style={{ position: 'absolute', inset: 0, transform: 'translateX(330px)' }}>
        <Stack glow={0.7} scale={0.92} rotate={-30} />
      </div>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(105deg, transparent ${sweep - 12}%, rgba(23,224,255,0.14) ${sweep}%, transparent ${sweep + 12}%)`,
        }}
      />
      <div style={{ position: 'absolute', left: 120, top: 320 }}>
        <div
          style={{
            color: NEON,
            fontSize: 23,
            letterSpacing: '0.34em',
            textTransform: 'uppercase',
            opacity: interpolate(f, [sec(0.25), sec(0.85)], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            }),
          }}
        >
          Version V2 · Smart Prototype
        </div>
        {lines.map((l, i) => {
          const a = interpolate(f, [sec(0.5 + i * 0.27), sec(1.3 + i * 0.27)], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
            easing: Easing.out(Easing.cubic),
          })
          return (
            <div
              key={l}
              style={{
                color: '#f4f6f8',
                fontSize: 86,
                fontWeight: 700,
                lineHeight: 1.02,
                letterSpacing: '-0.02em',
                marginTop: i === 0 ? 20 : 0,
                opacity: a,
                transform: `translateY(${(1 - a) * 36}px)`,
              }}
            >
              {l}
            </div>
          )
        })}
        <div
          style={{
            display: 'inline-block',
            marginTop: 28,
            padding: '12px 26px',
            borderRadius: 999,
            border: `1px solid ${WARN}55`,
            color: WARN,
            fontSize: 21,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            opacity: interpolate(f, [sec(1.85), sec(2.5)], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            }),
          }}
        >
          Air only — no water, no liquid
        </div>
      </div>
      <AbsoluteFill style={{ background: '#000', opacity: toBlack }} />
    </Cine>
  )
}

const SCENES = [ColdOpen, HeroRotation, Inflation, Exploded, Materials, BridgeDeploy, Context, EndCard]

export function ProductReveal() {
  return (
    <TransitionSeries>
      {SCENES.flatMap((C, i) => {
        const seq = (
          <TransitionSeries.Sequence key={`s${i}`} durationInFrames={SCENE}>
            <C />
          </TransitionSeries.Sequence>
        )
        if (i === SCENES.length - 1) return [seq]
        return [
          seq,
          <TransitionSeries.Transition
            key={`t${i}`}
            presentation={fade()}
            timing={linearTiming({ durationInFrames: FADE })}
          />,
        ]
      })}
    </TransitionSeries>
  )
}
