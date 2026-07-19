import * as THREE from 'three'

// A flat rounded-rectangle plate, thickness `h` along Y, centred at origin.
// This is what gives the seat its upholstered rounded-square footprint instead
// of sharp box corners. `r` = top-view corner radius, `bevel` = edge round.
export function roundedPlateGeometry(w, d, h, r, bevel = 0) {
  r = Math.min(r, w / 2 - 0.001, d / 2 - 0.001)
  const s = new THREE.Shape()
  const x = -w / 2
  const y = -d / 2
  s.moveTo(x + r, y)
  s.lineTo(x + w - r, y)
  s.quadraticCurveTo(x + w, y, x + w, y + r)
  s.lineTo(x + w, y + d - r)
  s.quadraticCurveTo(x + w, y + d, x + w - r, y + d)
  s.lineTo(x + r, y + d)
  s.quadraticCurveTo(x, y + d, x, y + d - r)
  s.lineTo(x, y + r)
  s.quadraticCurveTo(x, y, x + r, y)

  const b = Math.min(bevel, h / 2)
  const geo = new THREE.ExtrudeGeometry(s, {
    depth: Math.max(h - b * 2, 0.001),
    bevelEnabled: b > 0,
    bevelThickness: b,
    bevelSize: b,
    bevelSegments: 3,
    curveSegments: 10,
  })
  geo.rotateX(-Math.PI / 2) // extrude runs along +Z -> lay flat so it runs along +Y
  geo.center()
  geo.computeVertexNormals()
  return geo
}
