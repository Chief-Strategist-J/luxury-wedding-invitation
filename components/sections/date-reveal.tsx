'use client'

import { motion } from 'motion/react'
import { Eyebrow, GoldDivider, Petals, Sparkles } from '@/components/decor'
import { weddingDateParts, weddingTimeLine } from '@/lib/wedding-config'

export function DateReveal() {
  const parts = [
    { value: weddingDateParts.day, label: 'Day' },
    { value: weddingDateParts.month, label: 'Month' },
    { value: weddingDateParts.year, label: 'Year' },
  ]

  return (
    <section
      className="relative isolate w-full overflow-hidden px-5 py-24 sm:px-8 sm:py-32"
      style={{
        background:
          'linear-gradient(180deg, oklch(0.9 0.045 238) 0%, oklch(0.97 0.016 234) 55%, oklch(0.995 0.006 90) 100%)',
      }}
    >
      <Petals count={10} />
      <Sparkles count={14} />

      {/* single soft golden light beam */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-full w-[70%] -translate-x-1/2 blur-3xl"
        style={{
          background:
            'radial-gradient(50% 40% at 50% 35%, oklch(0.97 0.05 88 / 0.55), transparent 70%)',
        }}
      />

      <div className="relative z-10 mx-auto max-w-3xl text-center">
        <Eyebrow>Save the date</Eyebrow>
        <motion.p
          className="mt-5 font-serif text-3xl font-light italic text-foreground sm:text-5xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          Our Forever Begins On...
        </motion.p>

        <GoldDivider className="mt-8" />

        <div className="mt-10 flex items-stretch justify-center gap-4 sm:gap-10">
          {parts.map((p, i) => (
            <motion.div
              key={p.label}
              className="flex flex-1 flex-col items-center"
              initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: true }}
              transition={{
                delay: 0.25 + i * 0.28,
                duration: 1,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <span className="font-serif text-[2.6rem] font-light leading-none text-foreground sm:text-7xl">
                {p.value}
              </span>
              <span className="mt-3 text-[0.55rem] uppercase tracking-[0.32em] text-muted-foreground sm:text-[0.65rem]">
                {p.label}
              </span>
              {i < parts.length - 1 && (
                <span className="sr-only" aria-hidden="true">
                  ·
                </span>
              )}
            </motion.div>
          ))}
        </div>

        <motion.p
          className="mt-10 text-xs uppercase tracking-[0.34em] text-accent-foreground/80"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 1.1, duration: 1 }}
        >
          {weddingDateParts.weekday} &middot; {weddingTimeLine} Onwards
        </motion.p>
      </div>
    </section>
  )
}
