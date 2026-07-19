import { motion } from 'framer-motion'
import { SEAT_LAYERS, SPECS } from './modelData'

// Scroll pages (see ScrollControls pages={10} and the map in TransferSystem):
// 0 hero · 1 overview · 2 engineering · 3–8 one material step per page · 9 CTA.
// Copy comes from the V2 finalized schematic — no invented numbers.

const TOP_TO_BASE = [...SEAT_LAYERS].reverse()

const cardAnim = {
  initial: { opacity: 0, x: 90, filter: 'blur(6px)' },
  whileInView: { opacity: 1, x: 0, filter: 'blur(0px)' },
  viewport: { amount: 0.45 },
  transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
}

function MaterialStep({ layer, index }) {
  return (
    <section className="page right mat-step">
      <motion.div className="mat-card" {...cardAnim}>
        <span className="step-count">
          {String(index + 1).padStart(2, '0')} <em>/ 06</em>
        </span>
        <div className={`swatch swatch-${layer.name}`} aria-hidden="true" />
        <h3>{layer.label}</h3>
        <span className="mat-spec">{layer.spec}</span>
        <p>{layer.desc}</p>
        <span className="mat-dim">{layer.dim}</span>
      </motion.div>
    </section>
  )
}

export default function Overlay() {
  return (
    <div className="overlay">
      {/* 0 — HERO */}
      <section className="page hero">
        <span className="badge">Version V2 · Smart Prototype (Air-Only)</span>
        <h1>
          Smart Inflatable<br />
          Seat-Lift <span className="amp">&amp;</span> Side<br />
          Transfer Bridge
        </h1>
        <p className="lead">
          Caregiver-assisted wheelchair transfer, re-engineered as one pneumatic system.
        </p>
        <span className="scroll-cue">Scroll to explore ↓</span>
      </section>

      {/* 1 — OVERVIEW */}
      <section className="page right">
        <span className="eyebrow">01 — The System</span>
        <h2>One system.<br />Two motions.</h2>
        <p>
          A multi-chamber air seat that <strong>lifts {SPECS.liftVertical}</strong> on a 12&nbsp;V
          pump — air only, with a load interlock — and a rigid bridge that
          <strong> extends to {SPECS.bridgeReach}</strong>, so the transfer happens on one level surface.
        </p>
      </section>

      {/* 2 — ENGINEERING (explosion triggers here) */}
      <section className="page left">
        <span className="eyebrow">02 — Engineering</span>
        <h2>Exploded.<br />Down to the layer.</h2>
        <p>
          The seat module separates along its Y-axis — then keep scrolling and each of the
          <strong> six layers</strong> steps forward for inspection, top cover to base shell.
        </p>
      </section>

      {/* 3–8 — MATERIALS: one guided step per layer, top -> base */}
      {TOP_TO_BASE.map((l, i) => (
        <MaterialStep key={l.name} layer={l} index={i} />
      ))}

      {/* 9 — CTA (stack reassembles, bridge deploys behind this copy) */}
      <section className="page center">
        <span className="badge warn">Air Only — No Water, No Liquid</span>
        <h2>Engineered for<br />the real transfer.</h2>
        <div className="specs">
          <div><b>{SPECS.liftVertical}</b><span>Powered vertical lift</span></div>
          <div><b>{SPECS.bridgeReach}</b><span>Bridge reach (extended)</span></div>
          <div><b>{SPECS.userWeight}</b><span>Rated user weight</span></div>
        </div>
        <a className="cta" href="#" onClick={(e) => e.preventDefault()}>Request the V2 spec sheet</a>
        <div className="qr-block">
          <img src="/qr/transfer-bridge-qr.svg" alt="QR code linking to this page" width="92" height="92" />
          <span>Scan to open<br />on your phone</span>
        </div>
      </section>
    </div>
  )
}
