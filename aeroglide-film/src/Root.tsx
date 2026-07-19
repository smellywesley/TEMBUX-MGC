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
  </>
)
