'use client'

import { motion } from 'motion/react'
import { useEffect } from 'react'
import { Sparkles } from '@/components/decor'

export function LoadingScreen({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 3200)
    return () => clearTimeout(t)
  }, [onDone])

  return (
    <motion.div
      className="fixed inset-0 z-[70] flex flex-col items-center justify-center overflow-hidden"
      exit={{ opacity: 0, filter: 'blur(8px)' }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      style={{
        background:
          'radial-gradient(120% 90% at 50% 20%, oklch(0.99 0.008 90) 0%, oklch(0.96 0.02 235) 45%, oklch(0.91 0.04 235) 100%)',
      }}
    >
      <Sparkles count={22} />

    {/* Elegant golden floral bloom */}
      <div className="relative mx-auto flex size-36 items-center justify-center sm:size-44">
        <svg
          aria-hidden="true"
          viewBox="0 0 200 200"
          className="absolute inset-0 size-full"
          fill="none"
        >
        {[0, 60, 120, 180, 240, 300].map((deg, i) => (
          <motion.ellipse
            key={deg}
            cx="100"
            cy="62"
            rx="15"
            ry="34"
            fill="oklch(0.99 0.008 90 / 0.75)"
            stroke="var(--gold)"
            strokeWidth="1"
            style={{ transformOrigin: '100px 100px', rotate: `${deg}deg` }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              delay: 0.15 + i * 0.11,
              duration: 0.9,
              ease: [0.22, 1, 0.36, 1],
            }}
          />
        ))}
        <motion.circle
          cx="100"
          cy="100"
          r="14"
          fill="var(--gold-soft)"
          stroke="var(--gold)"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.95, duration: 0.6, ease: 'backOut' }}
        />
        <motion.circle
          cx="100"
          cy="100"
          r="78"
          stroke="var(--gold)"
          strokeWidth="0.8"
          strokeDasharray="2 7"
          initial={{ rotate: 0, opacity: 0 }}
          animate={{ rotate: 360, opacity: 1 }}
          transition={{
            rotate: { duration: 16, repeat: Number.POSITIVE_INFINITY, ease: 'linear' },
            opacity: { duration: 1.2, delay: 0.4 },
          }}
          style={{ transformOrigin: '100px 100px' }}
        />
      </svg>
      </div>

      <motion.p
        className="mt-8 px-8 text-center font-serif text-2xl font-light italic tracking-wide text-foreground/85 sm:text-3xl"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 1 }}
      >
        A Beautiful Story Awaits...
      </motion.p>

      <motion.div
        className="mt-7 h-px w-40 overflow-hidden bg-accent/25"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3 }}
      >
        <motion.div
          className="h-full bg-accent"
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{ delay: 1.35, duration: 1.7, ease: 'easeInOut' }}
        />
      </motion.div>
    </motion.div>
  )
}
