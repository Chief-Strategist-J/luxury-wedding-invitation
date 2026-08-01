'use client'

import { motion } from 'motion/react'
import { useEffect, useState } from 'react'
import { Eyebrow, GoldDivider, Sparkles, ConfettiBurst } from '@/components/decor'
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
  // confetti should burst once and stop — not loop forever
  const [showConfetti, setShowConfetti] = useState(true)

  useEffect(() => {
    setMounted(true)
    setT(diff(target))
    const id = setInterval(() => setT(diff(target)), 1000)
    return () => clearInterval(id)
  }, [target])

  useEffect(() => {
    // let the burst play for ~2s, then unmount it so it doesn't replay/loop
    const timeout = setTimeout(() => setShowConfetti(false), 2000)
    return () => clearTimeout(timeout)
  }, [])

  const cells = [
    { label: 'Days', value: t.days },
    { label: 'Hours', value: t.hours },
    { label: 'Minutes', value: t.minutes },
    { label: 'Seconds', value: t.seconds },
  ]

  return (
    <section
      className="relative isolate w-full overflow-hidden px-5 py-10 sm:px-8 sm:py-16"
      style={{
        backgroundImage: 'url(/media/getting-married.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* dark overlay so text stays legible over the photo */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, oklch(0.15 0.02 260 / 0.55) 0%, oklch(0.15 0.02 260 / 0.35) 40%, oklch(0.12 0.02 260 / 0.65) 100%)',
        }}
      />

      <Sparkles count={12} />
      {showConfetti && (
        <>
          <ConfettiBurst count={140} side="left" originY="45%" />
          <ConfettiBurst count={140} side="right" originY="55%" />
        </>
      )}

      {/* soft ornamental rings */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 top-10 size-72 rounded-full border border-white/25"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-20 bottom-0 size-56 rounded-full border border-white/20"
      />

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <Eyebrow className="text-white/90">Almost there</Eyebrow>
        <h2 className="mt-2 font-serif text-2xl font-light italic text-white drop-shadow-[0_4px_18px_rgba(0,0,0,0.55)] sm:text-4xl">
          The Countdown To Forever
        </h2>
        <GoldDivider className="mt-4" />

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          {cells.map((c, i) => (
            <motion.div
              key={c.label}
              initial={{ opacity: 0, y: 26, rotateX: 16 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="relative overflow-hidden rounded-xl border border-white/30 px-2 py-3 shadow-[0_20px_40px_-24px_rgba(0,0,0,0.7)] sm:px-3 sm:py-4"
              style={{
                // solid dark base instead of a mostly-transparent gradient,
                // so the numbers stay readable against any part of the photo
                background:
                  'linear-gradient(160deg, oklch(0.18 0.02 260 / 0.92), oklch(0.12 0.02 260 / 0.9))',
                backdropFilter: 'blur(10px)',
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
              <span className="block font-serif text-2xl font-light tabular-nums leading-none text-white sm:text-3xl">
                {mounted ? String(c.value).padStart(2, '0') : '--'}
              </span>
              <span className="mt-1.5 block text-[0.5rem] uppercase tracking-[0.25em] text-white/80 sm:text-[0.58rem]">
                {c.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}