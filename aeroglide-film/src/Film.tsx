import React from 'react'
import { AbsoluteFill, Sequence } from 'remotion'
import { COLORS, FONTS, LABEL_STYLE } from './theme/tokens'
import { SLOTS } from './slotManifest'
import { FootageSlot } from './slots/FootageSlot'
import { LowerThird } from './components/LowerThird'
import { S03_ForceBar } from './components/S03_ForceBar'
import { S04_IsotypeWave } from './components/S04_IsotypeWave'
import { S05_DemandEquation } from './components/S05_DemandEquation'
import { S06_FailureTitle } from './components/S06_FailureTitle'
import { FailureTracker } from './components/FailureTracker'
import { FailureCard } from './components/FailureCard'
import { S08_AirMatBar } from './components/S08_AirMatBar'
import { S12_StandardsCollapse } from './components/S12_StandardsCollapse'
import { S13_TitleReveal } from './components/S13_TitleReveal'
import { StepChip } from './components/StepChip'
import { S14_ExplodedLabels } from './components/S14_ExplodedLabels'
import { S15_DeploySteps } from './components/S15_DeploySteps'
import { S17_InterlockDiagram } from './components/S17_InterlockDiagram'
import { S17_DumpStopwatch } from './components/S17_DumpStopwatch'
import { S18_BenchOverlay } from './components/S18_BenchOverlay'
import { S20_HonestyLedger } from './components/S20_HonestyLedger'
import { S21_MarketSplit } from './components/S21_MarketSplit'
import { S22_Triptych } from './components/S22_Triptych'
import { S24_Team } from './components/S24_Team'
import { S25_EndCard } from './components/S25_EndCard'

// Small re-annotation used over S13B (the baked "57 mm" is reframed off-screen)
const MicroLiftLabel: React.FC = () => (
  <div
    style={{
      position: 'absolute', right: 110, top: 160, textAlign: 'right',
      padding: '16px 26px', borderRadius: 12,
      background: 'rgba(16,26,46,0.72)', backdropFilter: 'blur(8px)',
    }}
  >
    <div style={{ fontFamily: FONTS.sans, fontWeight: 600, fontSize: 64, color: COLORS.bone, fontVariantNumeric: 'tabular-nums' }}>
      40–60 mm
    </div>
    <div style={{ ...LABEL_STYLE, fontSize: 18, color: COLORS.cyanEng, marginTop: 4 }}>CONTROLLED MICRO-LIFT</div>
  </div>
)

export const Film: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: COLORS.navy }}>
      {/* footage layer */}
      {SLOTS.map((s) => (
        <Sequence key={s.id} from={s.from} durationInFrames={s.durationInFrames} name={s.id}>
          <FootageSlot {...s} />
        </Sequence>
      ))}

      {/* ---- ACT 1 graphics ---- */}
      <Sequence from={450} durationInFrames={330} name="S03_ForceBar"><S03_ForceBar /></Sequence>
      <Sequence from={780} durationInFrames={300} name="S04_IsotypeWave"><S04_IsotypeWave /></Sequence>
      <Sequence from={1080} durationInFrames={270} name="S05_DemandEquation"><S05_DemandEquation /></Sequence>

      {/* ---- ACT 2: five failures ---- */}
      <Sequence from={1350} durationInFrames={120} name="S06_FailureTitle"><S06_FailureTitle /></Sequence>
      <Sequence from={1470} durationInFrames={270} name="S07_card">
        <FailureCard label="SLIDE BOARD" sentence="bridges, but does not lift" />
      </Sequence>
      <Sequence from={1740} durationInFrames={270} name="S08_overlay">
        <FailureCard label="AIR MAT" sentence="wrong geometry for seated transfer" />
        <S08_AirMatBar />
      </Sequence>
      <Sequence from={2010} durationInFrames={240} name="S09_card">
        <FailureCard label="HOIST" sentence="slow, stressful, frightening" clock />
      </Sequence>
      <Sequence from={2250} durationInFrames={210} name="S10_card">
        <FailureCard label="WALKING BELT" sentence="only for patients who barely need it" />
      </Sequence>
      {/* persistent failure tracker — mounts once across its whole span */}
      <Sequence from={1470} durationInFrames={1320} name="FailureTracker">
        <FailureTracker mountFrame={1470} />
      </Sequence>
      <Sequence from={2640} durationInFrames={210} name="S12_StandardsCollapse"><S12_StandardsCollapse /></Sequence>

      {/* ---- ACT 3: AeroGlide ---- */}
      <Sequence from={2850} durationInFrames={240} name="S13_TitleReveal"><S13_TitleReveal /></Sequence>
      <Sequence from={2970} durationInFrames={120} name="S13B_annotation"><MicroLiftLabel /></Sequence>
      <Sequence from={3090} durationInFrames={1410} name="StepChip">
        <StepChip mountFrame={3090} />
      </Sequence>
      <Sequence from={3300} durationInFrames={150} name="S14_ExplodedLabels"><S14_ExplodedLabels /></Sequence>
      <Sequence from={3480} durationInFrames={360} name="S15_DeploySteps">
        <S15_DeploySteps activationFrames={[0, 30, 60, 140]} clampReadoutAt={270} />
      </Sequence>
      <Sequence from={4140} durationInFrames={360} name="S17_overlays">
        <S17_InterlockDiagram />
        <S17_DumpStopwatch startAt={270} />
      </Sequence>

      {/* ---- ACT 4: evidence ---- */}
      <Sequence from={4500} durationInFrames={360} name="S18_BenchOverlay"><S18_BenchOverlay /></Sequence>
      <Sequence from={4860} durationInFrames={300} name="S19_lowerthird">
        <LowerThird text="NURSE INTERVIEW — NAME TBC" outAt={280} />
      </Sequence>
      <Sequence from={5160} durationInFrames={300} name="S20_HonestyLedger"><S20_HonestyLedger /></Sequence>

      {/* ---- ACT 5: market + close ---- */}
      <Sequence from={5460} durationInFrames={360} name="S21_MarketSplit"><S21_MarketSplit /></Sequence>
      <Sequence from={6120} durationInFrames={150} name="S22_Triptych"><S22_Triptych /></Sequence>
      <Sequence from={6270} durationInFrames={210} name="S24_Team"><S24_Team /></Sequence>
      <Sequence from={6480} durationInFrames={270} name="S25_EndCard"><S25_EndCard /></Sequence>
    </AbsoluteFill>
  )
}
