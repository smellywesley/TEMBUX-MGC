# CAD → GLB Export Guide
### Dropping your real model into this landing page

The page currently builds the product **procedurally** from the schematic dimensions in
[`src/modelData.js`](src/modelData.js) — so it runs with zero CAD work. When your real model is
ready, export it to **GLB** with the mesh names below and swap it in. The scroll/explode logic
never changes.

---

## 1. Why GLB (not STL/OBJ)
| Format | Keeps separate named meshes? | Materials? | Web-optimised? | Verdict |
|--------|------------------------------|------------|----------------|---------|
| **GLB / glTF** | ✅ yes | ✅ PBR | ✅ (binary, compressible) | **Use this** |
| OBJ | ⚠️ groups only | ⚠️ flaky `.mtl` | ❌ text, bulky | fallback |
| FBX | ✅ | ✅ | ❌ heavy | avoid for web |
| STL | ❌ single fused mesh, no names | ❌ | ❌ | **unusable here** |

The exploded view works by grabbing each layer **by name** and animating it independently. STL fuses
everything into one nameless mesh — there's nothing to grab. That's the whole reason GLB matters.

## 2. Separate your meshes (in SolidWorks / Fusion 360 / Blender)
The animation needs these as **distinct objects**, each with its **origin at its own centre** and the
whole assembly centred on world origin, **+Y up**. Name them **exactly** (this is the contract with
`modelData.js`):

| Mesh name (required) | Part | Material (schematic) |
|----------------------|------|----------------------|
| `top_cover`        | Top Cover (layer 6, top)     | PU Fabric |
| `comfort_foam`     | Comfort Foam (layer 5)       | PU foam · 8 mm |
| `air_bladder`      | Multi-Chamber Air Bladder (layer 4, glowing) | TPU · AIR ONLY |
| `restraint_fabric` | Restraint Fabric Layer (layer 3) | Nylon/poly · non-stretch |
| `lift_plate`       | Rigid Lift Plate (layer 2)   | Aluminium · 3 mm |
| `base_shell`       | Base Shell (layer 1, bottom) | HDPE · 4 mm |
| `bridge_panel`     | Telescoping side bridge      | HDPE/aluminium 10–12 mm |
| `front_clamp`      | Front clamp assembly         | grips frame tube 22–32 mm |

> The air bladder is **multi-chamber** — if your CAD models the chambers as
> separate solids, either name them `air_bladder` collectively (a group) or
> merge them; the code treats `air_bladder` as one animated unit.

**Modelling checklist**
- One closed mesh per part; delete internal faces you'll never see (poly budget).
- Real-world scale in **metres** (glTF is metres). Keep proportions from the schematic.
- Apply materials in-CAD if you can (PBR: base colour + roughness + metalness). Otherwise the code's
  `meshStandardMaterial` values in `modelData.js` still drive the look.
- Triangulate before export. Target < ~150k tris total for a snappy web load.

## 3. Export settings
**Blender** (best control): `File ▸ Export ▸ glTF 2.0 (.glb)`
- Format: **glTF Binary (.glb)** · Include: **Selected Objects** (all six) · +Y Up ✅
- Transform: **Apply modifiers** ✅ · Data: **Mesh, Materials** ✅ · Compression: **Draco** ✅ (huge size win)

**Fusion 360 / SolidWorks:** export the assembly as OBJ/FBX → import to Blender → rename meshes to the
table above → export GLB. (Direct GLB exporters often flatten names; renaming in Blender is the reliable path.)

Then **optimise**:
```bash
npx gltf-transform optimize model.glb model-optimized.glb --texture-compress webp
# Draco compression, dedupe, resample. Typically 40–70% smaller.
```
Put the result at `public/transfer-system.glb`.

## 4. Swap it into the code — the only change needed
`src/TransferSystem.jsx` currently renders `<RoundedBox>` primitives. Replace its body with a GLB load
and keep the **same refs by name**. drei's `useGLTF` gives you named nodes:

```jsx
import { useGLTF } from '@react-three/drei'
useGLTF.preload('/transfer-system.glb')

export default function TransferSystem(props) {
  const scroll = useScroll()
  const { nodes } = useGLTF('/transfer-system.glb')
  const group = useRef()
  const layerRefs = useRef([])
  const bridge = useRef()

  // ...keep the EXACT useFrame block from the current file — it drives explode/rotate...

  return (
    <group ref={group} {...props} dispose={null}>
      {SEAT_LAYERS.map((l, i) => (
        <primitive
          key={l.name}
          object={nodes[l.name]}                    // matched by the names in the table above
          ref={(el) => (layerRefs.current[i] = el)}
        />
      ))}
      <primitive ref={bridge} object={nodes.bridge_panel} />
      <primitive object={nodes.front_clamp} />
    </group>
  )
}
```
Because the animation reads `SEAT_LAYERS` (each with its `name` + `gap`) from `modelData.js`, and your
GLB meshes carry those same names, **the explode, the neon air-chamber pulse, the bridge telescope,
and the scroll rotation all keep working untouched.** The only thing you deleted is the placeholder geometry.

> Keep the `air_chamber` mesh material emissive (or set `nodes.air_chamber.material.emissive`) so the
> Bloom pass still lights it cyan. If your CAD material overrides it, re-apply emissive in the map above.

## 5. Sanity-check the export
Drag your `.glb` onto <https://gltf-viewer.donmccurdy.com> and confirm the **Scene tree** on the right
lists all six names exactly. If a name is missing or wrong, the `<primitive>` for it renders nothing —
rename in Blender and re-export. That viewer is the fastest way to catch a naming mismatch before touching code.
