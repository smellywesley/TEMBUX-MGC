import { LAYERS, NEON } from './theme'

// The 2.5D seat-module stack — the one hero object, reused by most scenes.
// explode: 0 assembled .. 1 fully separated. glow: bladder emissive strength.
// Stylized motion-design look (solid-offset shadows as extruded sides), not a
// photoreal render — the photoreal route is the AI-video prompts in STORYBOARD.md.
export function Stack({
  explode = 0,
  glow = 1,
  scale = 1,
  rotate = -26,
  tilt = 58,
  width = 560,
}) {
  const depth = width * 0.94
  const sep = 150 * explode

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        perspective: 2200,
      }}
    >
      <div
        style={{
          position: 'relative',
          width,
          height: depth,
          transform: `scale(${scale}) rotateX(${tilt}deg) rotateZ(${rotate}deg)`,
          transformStyle: 'preserve-3d',
        }}
      >
        {LAYERS.map((l, i) => {
          // stack top(i=0) -> base; z position along the extrusion axis
          const below = LAYERS.slice(i + 1).reduce((a, x) => a + x.h, 0)
          const z = below + (LAYERS.length - 1 - i) * sep
          const isBladder = !!l.tubes
          return (
            <div
              key={l.name}
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: l.radius,
                background: l.metal
                  ? 'linear-gradient(100deg,#eef1f5 0%,#b9c0c9 30%,#d8dde3 48%,#8f979f 75%,#c3c9d1 100%)'
                  : l.color,
                transform: `translateZ(${z}px)`,
                transformStyle: 'preserve-3d',
                boxShadow: isBladder
                  ? `0 0 ${60 * glow}px rgba(23,224,255,${0.55 * glow})`
                  : `inset 0 0 60px rgba(0,0,0,0.35)`,
                border: `1px solid rgba(255,255,255,${isBladder ? 0.25 : 0.07})`,
              }}
            >
              {/* extruded side (thickness) */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: l.radius,
                  background: l.side,
                  transform: `translateZ(${-l.h}px)`,
                }}
              />
              {/* bladder renders its five glowing chambers */}
              {isBladder && (
                <div
                  style={{
                    position: 'absolute',
                    inset: '4%',
                    display: 'flex',
                    gap: '2.5%',
                  }}
                >
                  {Array.from({ length: l.tubes }).map((_, k) => (
                    <div
                      key={k}
                      style={{
                        flex: 1,
                        borderRadius: 999,
                        background: `linear-gradient(90deg, rgba(23,224,255,${0.12 * glow}), rgba(190,250,255,${0.5 * glow}) 45%, rgba(23,224,255,${0.15 * glow}))`,
                        boxShadow: `0 0 ${28 * glow}px rgba(23,224,255,${0.5 * glow})`,
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
