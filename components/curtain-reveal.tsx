'use client'

import { motion } from 'motion/react'
import { useEffect } from 'react'
import Image from 'next/image'
import { Petals, Sparkles } from '@/components/decor'

/** Screen 4: luxurious 3D silk curtains parting over a mandap scene. */
export function CurtainReveal({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 6600)
    return () => clearTimeout(t)
  }, [onDone])

  return (
    <motion.div
      className="fixed inset-0 z-[55] overflow-hidden bg-[oklch(0.93_0.035_236)]"
      exit={{ opacity: 0, scale: 1.06 }}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* ── behind the curtains: luxury mandap environment ── */}
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1.18 }}
        animate={{ scale: 1 }}
        transition={{ duration: 6.5, ease: 'easeOut' }}
      >
        <Image
          src="/media/mandap.png"
          alt="A luxurious Indian wedding mandap decorated with white and blue flowers and golden lamps"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(180deg, oklch(0.99 0.008 90 / 0.35) 0%, transparent 40%, oklch(0.9 0.04 238 / 0.45) 100%)',
          }}
        />
        {/* golden hanging lamps */}
        {[18, 38, 62, 82].map((left, i) => (
          <motion.div
            key={left}
            className="absolute top-0 flex flex-col items-center"
            style={{ left: `${left}%` }}
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.6 + i * 0.2, duration: 1.4, ease: 'easeOut' }}
          >
            <span className="h-16 w-px bg-accent/60 sm:h-24" />
            <span
              className="size-5 rounded-full"
              style={{
                background:
                  'radial-gradient(circle at 35% 30%, oklch(0.99 0.05 92), oklch(0.82 0.1 80))',
                boxShadow: '0 0 22px 6px oklch(0.9 0.08 88 / 0.6)',
                animation: 'gentle-float 4s ease-in-out infinite',
              }}
            />
          </motion.div>
        ))}
        <Petals count={18} />
        <Sparkles count={20} />
      </motion.div>

      {/* ── the words ── */}
      <div className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-3 px-6 text-center">
        <motion.p
          className="font-serif text-3xl font-light italic text-foreground drop-shadow-[0_2px_10px_oklch(1_0_0/0.8)] sm:text-5xl"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: [0, 1, 1, 0], y: [18, 0, 0, -10] }}
          transition={{ duration: 3, times: [0, 0.25, 0.75, 1], delay: 0.6 }}
        >
          Two Hearts...
        </motion.p>
        <motion.p
          className="absolute font-serif text-3xl font-light italic text-foreground drop-shadow-[0_2px_10px_oklch(1_0_0/0.8)] sm:text-5xl"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: [0, 1, 1], y: [18, 0, 0] }}
          transition={{ duration: 2.6, delay: 3.6, ease: 'easeOut' }}
        >
          One Beautiful Story...
        </motion.p>
      </div>

      {/* ── curtains ── */}
      {(['left', 'right'] as const).map((side) => (
        <motion.div
          key={side}
          className="absolute inset-y-0 z-40 w-1/2"
          style={{
            [side]: 0,
            transformOrigin: side === 'left' ? 'left center' : 'right center',
            background:
              side === 'left'
                ? 'linear-gradient(90deg, oklch(0.86 0.05 236) 0%, oklch(0.95 0.025 236) 22%, oklch(0.88 0.045 236) 42%, oklch(0.97 0.015 90) 62%, oklch(0.87 0.05 236) 82%, oklch(0.93 0.03 236) 100%)'
                : 'linear-gradient(270deg, oklch(0.86 0.05 236) 0%, oklch(0.95 0.025 236) 22%, oklch(0.88 0.045 236) 42%, oklch(0.97 0.015 90) 62%, oklch(0.87 0.05 236) 82%, oklch(0.93 0.03 236) 100%)',
            boxShadow:
              side === 'left'
                ? '18px 0 50px -14px oklch(0.55 0.06 240 / 0.5)'
                : '-18px 0 50px -14px oklch(0.55 0.06 240 / 0.5)',
          }}
          initial={{ x: 0, scaleX: 1 }}
          animate={{
            x: side === 'left' ? '-102%' : '102%',
            scaleX: [1, 0.94, 0.88],
          }}
          transition={{ duration: 4.2, delay: 2.1, ease: [0.76, 0, 0.24, 1] }}
        >
          {/* silk folds */}
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-70"
            style={{
              backgroundImage:
                'repeating-linear-gradient(90deg, oklch(0.72 0.05 240 / 0.22) 0px, transparent 10px, oklch(1 0 0 / 0.35) 22px, transparent 34px)',
            }}
          />
          {/* gold trim + tassels */}
          <div
            aria-hidden="true"
            className={`absolute inset-y-0 w-2 ${side === 'left' ? 'right-0' : 'left-0'}`}
            style={{
              background:
                'linear-gradient(180deg, var(--gold), var(--gold-soft), var(--gold))',
            }}
          />
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-8"
            style={{
              background:
                'linear-gradient(180deg, oklch(0.84 0.08 82), oklch(0.93 0.05 88 / 0.4))',
            }}
          />
        </motion.div>
      ))}
    </motion.div>
  )
}
