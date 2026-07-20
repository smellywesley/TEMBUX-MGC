import React from 'react'
import { Composition } from 'remotion'
import { FPS, TOTAL_FRAMES } from './theme/tokens'
import { Film } from './Film'
import { S03_ForceBar } from './components/S03_ForceBar'
import { S04_IsotypeWave } from './components/S04_IsotypeWave'
import { S05_DemandEquation } from './components/S05_DemandEquation'
import { S06_FailureTitle } from './components/S06_FailureTitle'
import { S12_StandardsCollapse } from './components/S12_StandardsCollapse'
import { S20_HonestyLedger } from './components/S20_HonestyLedger'
import { S22_Triptych } from './components/S22_Triptych'
import { S24_Team } from './components/S24_Team'
import { S25_EndCard } from './components/S25_EndCard'
import { A1_ColdOpen, A2_ForceBar, A3_Isotype, A4_Demand, A5_FiveTools, A6_Silence } from './film2/scenesA'
import { B1_Reveal, B2_Lift, B3_Bridge, B4_Materials, B5_Safety, B6_Evidence } from './film2/scenesB'
import { C1_Market, C2_Impact, C3_Close } from './film2/scenesC'
import { Film2, TOTAL_FRAMES_2 } from './Film2'

const std = { fps: FPS, width: 1920, height: 1080 }

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="Film" component={Film} durationInFrames={TOTAL_FRAMES} {...std} />
    <Composition id="S03-ForceBar" component={S03_ForceBar} durationInFrames={330} {...std} />
    <Composition id="S04-IsotypeWave" component={S04_IsotypeWave} durationInFrames={300} {...std} />
    <Composition id="S05-DemandEquation" component={S05_DemandEquation} durationInFrames={270} {...std} />
    <Composition id="S06-FailureTitle" component={S06_FailureTitle} durationInFrames={120} {...std} />
    <Composition id="S12-StandardsCollapse" component={S12_StandardsCollapse} durationInFrames={210} {...std} />
    <Composition id="S20-HonestyLedger" component={S20_HonestyLedger} durationInFrames={300} {...std} />
    <Composition id="S22-Triptych" component={S22_Triptych} durationInFrames={150} {...std} />
    <Composition id="S24-Team" component={S24_Team} durationInFrames={210} {...std} />
    <Composition id="S25-EndCard" component={S25_EndCard} durationInFrames={270} {...std} />

    {/* ---- Film2 rebuild: warm-world Act 1 (dev/QA compositions) ---- */}
    <Composition id="A1-ColdOpen" component={A1_ColdOpen} durationInFrames={240} {...std} />
    <Composition id="A2-ForceBar" component={A2_ForceBar} durationInFrames={330} {...std} />
    <Composition id="A3-Isotype" component={A3_Isotype} durationInFrames={300} {...std} />
    <Composition id="A4-Demand" component={A4_Demand} durationInFrames={270} {...std} />
    <Composition id="A5-FiveTools" component={A5_FiveTools} durationInFrames={750} {...std} />
    <Composition id="A6-Silence" component={A6_Silence} durationInFrames={150} {...std} />

    {/* ---- Film2 rebuild: dark-world Act 2 (dev/QA compositions) ---- */}
    <Composition id="B1-Reveal" component={B1_Reveal} durationInFrames={240} {...std} />
    <Composition id="B2-Lift" component={B2_Lift} durationInFrames={300} {...std} />
    <Composition id="B3-Bridge" component={B3_Bridge} durationInFrames={270} {...std} />
    <Composition id="B4-Materials" component={B4_Materials} durationInFrames={280} {...std} />
    <Composition id="B5-Safety" component={B5_Safety} durationInFrames={300} {...std} />
    <Composition id="B6-Evidence" component={B6_Evidence} durationInFrames={240} {...std} />

    {/* ---- Film2 rebuild: warm-world Act 3 (dev/QA compositions) ---- */}
    <Composition id="C1-Market" component={C1_Market} durationInFrames={300} {...std} />
    <Composition id="C2-Impact" component={C2_Impact} durationInFrames={240} {...std} />
    <Composition id="C3-Close" component={C3_Close} durationInFrames={270} {...std} />

    {/* ---- Film2: the full rebuild (~2:29, all-designed, zero placeholders) ---- */}
    <Composition id="Film2" component={Film2} durationInFrames={TOTAL_FRAMES_2} {...std} />
  </>
)
