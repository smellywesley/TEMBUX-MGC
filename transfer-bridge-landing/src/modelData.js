// ---------------------------------------------------------------------------
// Single source of truth for the product geometry — V2 FINALIZED schematic.
//
// Every value is read off the finalized engineering drawing (mm), scaled to
// scene units by MM. Keep these part `name`s on your GLB meshes and this file
// becomes the mapping table (see MODEL-EXPORT-GUIDE.md).
// ---------------------------------------------------------------------------

export const MM = 1 / 150 // 150 mm -> 1 scene unit

// Seat footprint (schematic top view: 450 x 440 mm)
export const SEAT_W = 450 * MM
export const SEAT_D = 440 * MM

// Seat module, BOTTOM -> TOP. Six layers, exactly as the exploded view (panel 10).
// `gap` = resting spread when fully exploded (× scroll explode factor).
// `name` MUST match the GLB mesh name for the loader path.
// `corner` = top-view corner radius (mm) for the rounded-rectangle plate.
// `bevel` = edge round (mm) — the top cover gets a pillow bevel.
export const SEAT_LAYERS = [
  {
    name: 'base_shell',
    label: 'Base Shell',
    spec: 'HDPE · 4 mm',
    dim: '4 mm',
    desc: 'Rigid HDPE floor of the module — mounts the casters and anchors the whole stack.',
    t: 4 * MM,
    corner: 22,
    color: '#26292d',
    roughness: 0.7,
    metalness: 0.05,
    gap: 0.0,
  },
  {
    name: 'lift_plate',
    label: 'Rigid Lift Plate',
    spec: 'Aluminium · 3 mm',
    dim: '3 mm',
    desc: 'Aluminium plate that spreads the user’s weight evenly across the bladder below.',
    t: 3 * MM,
    corner: 20,
    color: '#c7ccd2',
    roughness: 0.34,
    metalness: 0.95, // brushed metal — the one shiny layer
    gap: 0.55,
  },
  {
    name: 'restraint_fabric',
    label: 'Restraint Fabric Layer',
    spec: 'Nylon/Poly · non-stretch · anti-balloon',
    dim: '2 mm',
    desc: 'Non-stretch weave that stops the bladder ballooning sideways — so the air lifts straight up.',
    t: 2 * MM,
    corner: 40,
    color: '#17191c',
    roughness: 0.92,
    metalness: 0.0,
    gap: 1.05,
  },
  {
    name: 'air_bladder',
    label: 'Multi-Chamber Air Bladder',
    spec: 'TPU · AIR ONLY — NO LIQUID',
    dim: '40–60 mm inflated',
    desc: 'Five TPU chambers inflate on a 12 V pump to power the 40–60 mm lift. Air only — no liquid.',
    t: 50 * MM, // 40–60 mm inflated; this IS the lift
    color: '#0e1a1f',
    roughness: 0.18,
    metalness: 0.0,
    emissive: '#6fc9dd',
    emissiveIntensity: 1.7,
    transmissive: true,
    chambers: 5, // cylindrical tubes (panel 7 cross-section), not a slab
    gap: 1.85,
  },
  {
    name: 'comfort_foam',
    label: 'Comfort Foam',
    spec: 'PU foam · 8 mm',
    dim: '8 mm',
    desc: 'Pressure-relieving PU foam between the user and the chambers — comfort without losing lift.',
    t: 8 * MM,
    corner: 42,
    color: '#cdbb98', // warm tan foam
    roughness: 1.0,
    metalness: 0.0,
    gap: 2.75,
  },
  {
    name: 'top_cover',
    label: 'Top Cover',
    spec: 'PU Fabric · wipe-clean',
    dim: '10 mm',
    desc: 'Upholstered wipe-clean PU fabric — the surface the user actually sits and slides on.',
    t: 10 * MM,
    corner: 45,
    bevel: 7, // upholstered pillow top
    color: '#26282c',
    roughness: 0.62,
    metalness: 0.05,
    gap: 3.35,
  },
]

// Side transfer bridge (panels 3/6/8): 350 stored -> 625 extended,
// 240 mm wide panel, HDPE/aluminium 10–12 mm, aluminium extrusion rails.
export const BRIDGE = {
  name: 'bridge_panel',
  wStowed: 350 * MM,
  wExtended: 625 * MM,
  depth: 240 * MM,
  thick: 12 * MM,
  color: '#1c1e22',
  roughness: 0.5,
  metalness: 0.35,
  padDepth: 240 * MM, // non-slip rubber bed-contact pad at the far end (panel 12)
  padColor: '#0e0f11',
}

// Front clamp assembly (panels 9/11): clamps to front frame tube 22–32 mm.
export const CLAMP = {
  name: 'front_clamp',
  color: '#101215',
  tubeColor: '#3a3d42',
  tubeDia: 30 * MM,
}

// Key specs (panel 15) — used verbatim in the overlay. No invented numbers.
export const SPECS = {
  userWeight: '120 kg',
  liftVertical: '40–60 mm',
  liftHorizontal: '90 mm',
  seat: '450 × 440 mm',
  bridgeReach: '625 mm',
  telescoping: '300 mm',
  bridgeWidth: '240 mm',
}
