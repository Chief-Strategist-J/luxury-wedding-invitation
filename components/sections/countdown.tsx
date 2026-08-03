'use client'

import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState } from 'react'
import { CelebrationBurst, Eyebrow, GoldDivider, Sparkles } from '@/components/decor'
import { wedding } from '@/lib/wedding-config'

function diff(target: number) {
  const ms = Math.max(0, target - Date.now())
  return {
    days: Math.floor(ms / 86400000),
    hours: Math.floor((ms / 3600000) % 24),
    minutes: Math.floor((ms / 60000) % 60),
    seconds: Math.floor((ms / 1000) % 60),
  }
}

export function Countdown() {
  const target = new Date(wedding.date).getTime()
  const [t, setT] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const [mounted, setMounted] = useState(false)
  const [burst, setBurst] = useState(false)

  useEffect(() => {
    setMounted(true)
    setT(diff(target))
    const id = setInterval(() => setT(diff(target)), 1000)
    return () => clearInterval(id)
  }, [target])

  const cells = [
    { label: 'Days', value: t.days },
    { label: 'Hours', value: t.hours },
    { label: 'Minutes', value: t.minutes },
    { label: 'Seconds', value: t.seconds },
  ]

  return (
    <section
      className="relative isolate w-full overflow-hidden px-5 py-20 sm:px-8 sm:py-28"
      style={{
        background:
          'linear-gradient(160deg, oklch(0.995 0.006 90) 0%, oklch(0.94 0.03 236) 100%)',
      }}
    >
      <Sparkles count={12} />

      {/* one-shot celebration burst, fired once the countdown scrolls into view */}
      <AnimatePresence>
        {burst && (
          <>
            <CelebrationBurst side="left" top="35%" />
            <CelebrationBurst side="right" top="35%" />
          </>
        )}
      </AnimatePresence>

      {/* soft ornamental rings */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 top-10 size-72 rounded-full border border-accent/25"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-20 bottom-0 size-56 rounded-full border border-accent/20"
      />

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <Eyebrow>Almost there</Eyebrow>
        <h2 className="mt-4 font-serif text-3xl font-light italic text-foreground sm:text-5xl">
          The Countdown To Forever
        </h2>
        <GoldDivider className="mt-6" />

        <motion.div
          className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6"
          onViewportEnter={() => setBurst(true)}
          viewport={{ once: true, amount: 0.6 }}
        >
          {cells.map((c, i) => (
            <motion.div
              key={c.label}
              initial={{ opacity: 0, y: 26, rotateX: 16 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="relative overflow-hidden rounded-2xl border border-accent/45 px-4 py-6 shadow-[0_20px_40px_-24px_oklch(0.55_0.07_240/0.6)]"
              style={{
                background:
                  'linear-gradient(160deg, oklch(1 0 0 / 0.8), oklch(0.95 0.025 236 / 0.6))',
                backdropFilter: 'blur(8px)',
              }}
            >
              <span
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-px"
                style={{
                  background:
                    'linear-gradient(90deg, transparent, var(--gold), transparent)',
                }}
              />
              <span className="block font-serif text-4xl font-light tabular-nums leading-none text-foreground sm:text-5xl">
                {mounted ? String(c.value).padStart(2, '0') : '--'}
              </span>
              <span className="mt-3 block text-[0.55rem] uppercase tracking-[0.3em] text-muted-foreground sm:text-[0.62rem]">
                {c.label}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}