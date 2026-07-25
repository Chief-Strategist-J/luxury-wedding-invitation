'use client'

import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { FloralSprig, GoldCorner, GoldDivider, Petals, Sparkles } from '@/components/decor'
import { useMusic } from '@/components/music-provider'

/**
 * Screen 2 + 3: the locked luxury invitation and the cinematic 3D opening.
 * NOTHING is revealed here — no names, no date, no countdown.
 */
export function LockedInvitation({ onOpened }: { onOpened: () => void }) {
  const [opening, setOpening] = useState(false)
  const { start } = useMusic()

  function handleOpen() {
    if (opening) return
    setOpening(true)
    start() // music begins here — never on load
    setTimeout(onOpened, 3400)
  }

  return (
    <motion.div
      className="fixed inset-0 z-[60] overflow-hidden"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      style={{
        background:
          'radial-gradient(115% 80% at 50% 8%, oklch(0.995 0.006 90) 0%, oklch(0.955 0.022 235) 42%, oklch(0.885 0.045 238) 100%)',
        perspective: '1400px',
      }}
    >
      {/* palace-inspired silhouette */}
      <svg
        aria-hidden="true"
        viewBox="0 0 400 300"
        preserveAspectRatio="xMidYMax slice"
        className="absolute inset-x-0 bottom-0 h-[62%] w-full opacity-[0.45]"
        fill="none"
      >
        <path
          d="M40 300V150c0-30 26-54 60-54s60 24 60 54v150M240 300V150c0-30 26-54 60-54s60 24 60 54v150"
          stroke="oklch(0.82 0.05 238)"
          strokeWidth="1.4"
        />
        <path
          d="M100 96c0-26 0-40 0-52 0 12 0 26 0 52M300 96c0-26 0-40 0-52 0 12 0 26 0 52"
          stroke="var(--gold-soft)"
          strokeWidth="1.4"
        />
        <path
          d="M170 300V180c0-16 13-30 30-30s30 14 30 30v120"
          stroke="oklch(0.86 0.04 238)"
          strokeWidth="1.2"
        />
      </svg>

      <Petals count={16} />
      <Sparkles count={16} />

      {/* golden light burst during opening */}
      <AnimatePresence>
        {opening && (
          <motion.div
            className="pointer-events-none absolute inset-0 z-30"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.95, 0.35] }}
            transition={{ duration: 2.4, times: [0, 0.55, 1] }}
            style={{
              background:
                'radial-gradient(60% 45% at 50% 52%, oklch(0.97 0.07 88 / 0.95) 0%, transparent 70%)',
            }}
          />
        )}
      </AnimatePresence>

      <div className="relative z-20 flex h-full items-center justify-center px-5 py-8">
        <motion.div
          className="relative w-full max-w-sm"
          style={{ transformStyle: 'preserve-3d' }}
          animate={
            opening
              ? { scale: [1, 1.04, 1.35], y: [0, -6, -20], rotateX: [0, 2, 8] }
              : {}
          }
          transition={{ duration: 3.2, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* ─ invitation card ─ */}
          <div className="relative overflow-hidden rounded-[26px] border border-accent/40 bg-gradient-to-b from-card via-secondary/40 to-card px-6 pb-10 pt-9 shadow-[0_40px_90px_-40px_oklch(0.55_0.07_240/0.55)]">
            <GoldCorner position="tl" />
            <GoldCorner position="tr" />
            <GoldCorner position="bl" />
            <GoldCorner position="br" />

            {/* inner gold frame */}
            <div className="pointer-events-none absolute inset-4 rounded-[18px] border border-accent/25" />

            {/* luxury arch */}
            <div className="relative mx-auto mt-2 flex h-[19rem] w-[85%] items-end justify-center rounded-t-full border border-accent/35 bg-gradient-to-b from-secondary/70 via-card/70 to-card/20 sm:h-[21rem]">
              <FloralSprig className="absolute -left-6 bottom-1 w-28 opacity-90" />
              <FloralSprig
                flip
                className="absolute -right-6 bottom-1 w-28 opacity-90"
              />

              {/* 3D golden lock */}
              <div
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                style={{ perspective: '700px' }}
              >
                <motion.div
                  style={{ transformStyle: 'preserve-3d' }}
                  animate={
                    opening
                      ? { rotateY: [0, 180, 380], rotateZ: [0, 8, -4], scale: [1, 1.12, 0.85], opacity: [1, 1, 0] }
                      : { y: [0, -7, 0] }
                  }
                  transition={
                    opening
                      ? { duration: 2.2, ease: [0.65, 0, 0.35, 1] }
                      : { duration: 4.5, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' }
                  }
                >
                  <Lock3D opening={opening} />
                </motion.div>
              </div>

              {/* soft glow behind the lock */}
              <div
                aria-hidden="true"
                className="absolute left-1/2 top-1/2 size-40 -translate-x-1/2 -translate-y-1/2 rounded-full blur-2xl"
                style={{
                  background:
                    'radial-gradient(circle, oklch(0.93 0.06 88 / 0.6), transparent 70%)',
                }}
              />
            </div>

            <div className="relative mt-8 text-center">
              <p className="font-serif text-[1.6rem] font-light italic leading-snug text-foreground/85">
                A Beautiful Story Awaits...
              </p>
              <GoldDivider className="mt-5" />
            </div>

            {/* TAP TO OPEN */}
            <div className="mt-7 flex justify-center">
              <button
                type="button"
                onClick={handleOpen}
                disabled={opening}
                className="group relative overflow-hidden rounded-full border border-accent/60 bg-gradient-to-b from-[oklch(0.95_0.05_88)] to-[oklch(0.86_0.08_82)] px-9 py-4 text-[0.72rem] font-medium uppercase tracking-[0.34em] text-accent-foreground shadow-[0_14px_30px_-14px_oklch(0.7_0.09_82/0.8)] transition-transform active:scale-[0.97] disabled:opacity-70"
                style={{ animation: 'soft-glow 2.8s ease-in-out infinite' }}
              >
                <span className="relative z-10">
                  {opening ? 'Opening' : 'Tap to Open'}
                </span>
                <span
                  aria-hidden="true"
                  className="absolute inset-y-0 w-1/3 bg-white/45 blur-md"
                  style={{ animation: 'shimmer-sweep 3.2s ease-in-out infinite' }}
                />
              </button>
            </div>
          </div>

          {/* ─ card cover that swings open in 3D ─ */}
          <AnimatePresence>
            {opening && (
              <motion.div
                className="absolute inset-0 origin-left overflow-hidden rounded-[26px] border border-accent/50 bg-gradient-to-br from-[oklch(0.94_0.03_235)] via-[oklch(0.98_0.012_90)] to-[oklch(0.9_0.045_238)] shadow-[0_30px_70px_-30px_oklch(0.5_0.08_240/0.6)]"
                initial={{ rotateY: 0 }}
                animate={{ rotateY: -155 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 2.1, delay: 0.55, ease: [0.65, 0, 0.35, 1] }}
                style={{ transformStyle: 'preserve-3d', backfaceVisibility: 'hidden' }}
              >
                <div className="pointer-events-none absolute inset-5 rounded-[16px] border border-accent/30" />
                <div className="flex h-full items-center justify-center">
                  <svg viewBox="0 0 100 100" className="size-24" fill="none" aria-hidden="true">
                    <circle cx="50" cy="50" r="30" stroke="var(--gold)" strokeWidth="1" />
                    <path
                      d="M50 26c9 10 9 18 0 24-9-6-9-14 0-24zM50 74c-9-10-9-18 0-24 9 6 9 14 0 24zM26 50c10-9 18-9 24 0-6 9-14 9-24 0zM74 50c-10 9-18 9-24 0 6-9 14-9 24 0z"
                      fill="oklch(0.99 0.008 90 / 0.9)"
                      stroke="var(--gold-soft)"
                    />
                  </svg>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
  )
}

/* ── Faux-3D golden lock built from layered shapes ────────── */
function Lock3D({ opening }: { opening: boolean }) {
  return (
    <div className="relative flex flex-col items-center">
      {/* shackle */}
      <motion.div
        className="relative z-0 h-10 w-14 rounded-t-full border-[5px] border-b-0"
        style={{
          borderColor: 'oklch(0.82 0.09 82)',
          boxShadow: 'inset 0 2px 3px oklch(1 0 0 / 0.7)',
          transformOrigin: 'right bottom',
        }}
        animate={opening ? { rotate: -38, x: 6, y: -3 } : { rotate: 0 }}
        transition={{ duration: 0.8, delay: 0.9, ease: 'backOut' }}
      />
      {/* body */}
      <div
        className="relative -mt-1 flex size-[4.6rem] items-center justify-center rounded-2xl"
        style={{
          background:
            'linear-gradient(145deg, oklch(0.96 0.05 90) 0%, oklch(0.85 0.09 82) 45%, oklch(0.74 0.1 74) 100%)',
          boxShadow:
            '0 12px 26px -12px oklch(0.6 0.09 74 / 0.85), inset 0 2px 4px oklch(1 0 0 / 0.65), inset 0 -3px 6px oklch(0.6 0.08 70 / 0.5)',
        }}
      >
        <span
          className="absolute inset-[6px] rounded-xl border border-white/45"
          aria-hidden="true"
        />
        <svg viewBox="0 0 40 40" className="size-7" fill="none" aria-hidden="true">
          <circle cx="20" cy="16" r="5" fill="oklch(0.55 0.07 70)" />
          <path d="M20 20v9" stroke="oklch(0.55 0.07 70)" strokeWidth="3.4" strokeLinecap="round" />
        </svg>
        <span
          aria-hidden="true"
          className="absolute inset-y-1 left-2 w-3 rounded-full bg-white/45 blur-[3px]"
        />
      </div>
    </div>
  )
}
