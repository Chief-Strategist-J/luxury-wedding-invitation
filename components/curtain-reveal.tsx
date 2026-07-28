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
              'radial-gradient(115% 80% at 50% 8%, oklch(0.995 0.006 90) 0%, oklch(0.955 0.022 235) 42%, oklch(0.885 0.045 238) 100%)',
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
          {/* gold trim */}
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

      {/* ── centered A & K heart, sits where the curtains meet, fades as they part ── */}
      <motion.div
        className="pointer-events-none absolute left-1/2 top-1/2 z-45 -translate-x-1/2 -translate-y-1/2"
        initial={{ opacity: 1, scale: 1 }}
        animate={{ opacity: [1, 1, 0], scale: [1, 1.08, 0.9] }}
        transition={{ duration: 2.2, delay: 1.9, ease: 'easeInOut' }}
      >
        <svg viewBox="0 0 100 100" className="size-24 sm:size-32" aria-hidden="true">
          <defs>
            <linearGradient id="curtainHeartGold" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="oklch(0.97 0.05 90)" />
              <stop offset="45%" stopColor="oklch(0.86 0.09 82)" />
              <stop offset="100%" stopColor="oklch(0.74 0.1 74)" />
            </linearGradient>
          </defs>
          <path
            d="M50 90S8 64 8 36.5C8 22 18.5 13 30 13c8.5 0 15.5 4.8 20 12 4.5-7.2 11.5-12 20-12 11.5 0 22 9 22 23.5C92 64 50 90 50 90z"
            fill="url(#curtainHeartGold)"
            stroke="oklch(0.68 0.09 74 / 0.8)"
            strokeWidth="1.4"
            style={{ filter: 'drop-shadow(0 10px 20px oklch(0.5 0.08 74 / 0.45))' }}
          />
          <path
            d="M50 82S16 60 16 37.5C16 26.5 24 19.5 32 19.5c6.5 0 12 4 18 11 6-7 11.5-11 18-11 8 0 16 7 16 18C84 60 50 82 50 82z"
            fill="none"
            stroke="oklch(1 0 0 / 0.55)"
            strokeWidth="1"
          />
          <text
            x="50"
            y="55"
            textAnchor="middle"
            fontFamily="'Cormorant Garamond', serif"
            fontSize="26"
            fill="oklch(0.38 0.06 68)"
            letterSpacing="1"
          >
            A
            <tspan fontSize="16" fill="oklch(0.5 0.07 70)" dx="1">
              &amp;
            </tspan>
            <tspan dx="1">K</tspan>
          </text>
        </svg>
      </motion.div>
    </motion.div>
  )
}