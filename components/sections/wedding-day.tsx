'use client'

import { motion, useScroll, useTransform } from 'motion/react'
import Image from 'next/image'
import { useRef } from 'react'
import { GoldDivider, Petals, Sparkles } from '@/components/decor'
import { wedding, weddingDateLine } from '@/lib/wedding-config'

export function WeddingDay() {
  const ref = useRef<HTMLElement | null>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const scale = useTransform(scrollYProgress, [0, 1], [1.15, 1])
  const y = useTransform(scrollYProgress, [0, 1], ['-4%', '4%'])

  return (
    <section
      ref={ref}
      className="relative isolate flex min-h-[100svh] w-full items-center justify-center overflow-hidden px-5 py-24"
    >
      {/* cinematic mandap backdrop with slow camera move */}
      <motion.div style={{ scale, y }} className="absolute inset-0 -z-10">
        <Image
          src="/media/mandap.png"
          alt="The wedding mandap decorated with white roses, blue flowers and golden lamps"
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(180deg, oklch(0.99 0.008 90 / 0.75) 0%, oklch(0.96 0.02 235 / 0.4) 45%, oklch(0.9 0.045 238 / 0.8) 100%)',
          }}
        />
      </motion.div>

      <Petals count={20} />
      <Sparkles count={18} />

      <div className="relative z-10 mx-auto max-w-2xl text-center">
        <motion.p
          className="text-[0.66rem] font-medium uppercase tracking-[0.42em] text-accent-foreground/80"
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          The main event
        </motion.p>

        <motion.h2
          className="mt-5 font-serif text-4xl font-light italic leading-tight text-foreground drop-shadow-[0_2px_12px_oklch(1_0_0/0.7)] sm:text-6xl"
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        >
          The Day We Say I Do
        </motion.h2>

        <GoldDivider className="mt-8" />

        <motion.p
          className="mt-8 font-serif text-3xl font-light text-foreground sm:text-5xl"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 1 }}
        >
          {wedding.groom}
          <span className="mx-3 text-accent">&hearts;</span>
          {wedding.bride}
        </motion.p>

        <motion.p
          className="mt-6 text-xs uppercase tracking-[0.34em] text-accent-foreground/85"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.55, duration: 1 }}
        >
          {weddingDateLine} &middot; 7:00 PM
        </motion.p>
      </div>
    </section>
  )
}
