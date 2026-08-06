'use client'

import { useCallback, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { LoadingScreen } from '@/components/loading-screen'
import { LockedInvitation } from '@/components/locked-invitation'
import { CurtainReveal } from '@/components/curtain-reveal'
import { ScratchReveal } from '@/components/scratch-reveal'
import { SiteNav } from '@/components/site-nav'
import { MusicControl } from '@/components/music-control'
import { CoupleReveal } from '@/components/sections/couple-reveal'
import { DateReveal } from '@/components/sections/date-reveal'
import { Countdown } from '@/components/sections/countdown'
import { LoveStory } from '@/components/sections/love-story'
import { Memories } from '@/components/sections/memories'
import { Celebrations } from '@/components/sections/celebrations'
import { WeddingDay } from '@/components/sections/wedding-day'
import { Venue } from '@/components/sections/venue'
import { Blessings } from '@/components/sections/blessings'
import { Closing } from '@/components/sections/closing'

type Stage = 'loading' | 'locked' | 'curtain' | 'scratch' | 'site'

export function InvitationExperience() {
  const [stage, setStage] = useState<Stage>('loading')

  const toLocked = useCallback(() => setStage('locked'), [])
  const toCurtain = useCallback(() => setStage('curtain'), [])
  const toScratch = useCallback(() => setStage('scratch'), [])
  const toSite = useCallback(() => setStage('site'), [])

  return (
    <>
      <AnimatePresence mode="wait">
        {stage === 'loading' && <LoadingScreen key="loading" onDone={toLocked} />}
        {stage === 'locked' && <LockedInvitation key="locked" onOpened={toCurtain} />}
        {stage === 'curtain' && <CurtainReveal key="curtain" onDone={toScratch} />}
        {stage === 'scratch' && <ScratchReveal key="scratch" onDone={toSite} />}
      </AnimatePresence>

      {stage === 'site' && (
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.1, ease: 'easeOut' }}
          className="relative w-full"
        >
          <SiteNav />
          <CoupleReveal />
          <DateReveal />
          <Countdown />
          <LoveStory />
          <Memories />
          <Celebrations />
          <WeddingDay />
          <Venue />
          <Blessings />
          <Closing />
        </motion.main>
      )}

      {/* Global music on/off — appears as soon as the song is armed */}
      <MusicControl />
    </>
  )
}
