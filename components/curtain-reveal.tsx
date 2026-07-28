'use client'

import { motion, AnimatePresence } from 'motion/react'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Petals, Sparkles } from '@/components/decor'

const NAMAH = 'श्री गणेशाय नमः ॥'
const SHLOK_LINE_1 = 'वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ।'
const SHLOK_LINE_2 = 'निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा॥'
const TAGLINE = 'One Beautiful Story...'

/**
 * Reveal: fades a whole line of text in at once (NOT a letter-by-letter typewriter).
 * Calls onDone once the fade-in finishes, so the sequencing logic below still works.
 */
function Reveal({
  text,
  duration = 0.9,
  startDelay = 0,
  className,
  onDone,
}: {
  text: string
  duration?: number
  startDelay?: number
  className?: string
  onDone?: () => void
}) {
  return (
    <motion.span
      className={className}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration, delay: startDelay / 1000, ease: [0.22, 1, 0.36, 1] }}
      onAnimationComplete={onDone}
    >
      {text}
    </motion.span>
  )
}

type Phase = 'namah' | 'image' | 'line1' | 'line2' | 'tagline'

/** Screen 4: a decorative template with the Ganesh invocation, faded in on screen. */
export function CurtainReveal({ onDone }: { onDone: () => void }) {
  const [phase, setPhase] = useState<Phase>('namah')

  useEffect(() => {
    // shorter now that there's no per-letter typing delay to wait through
    const t = setTimeout(onDone, 7000)
    return () => clearTimeout(t)
  }, [onDone])

  const showImage = phase !== 'namah'
  const showLine1 = phase === 'line1' || phase === 'line2' || phase === 'tagline'
  const showLine2 = phase === 'line2' || phase === 'tagline'
  const showTagline = phase === 'tagline'

  return (
    <motion.div
      className="fixed inset-0 z-[55] overflow-hidden bg-[oklch(0.93_0.035_236)]"
      exit={{ opacity: 0, scale: 1.06 }}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* blank decorative template as the full background */}
      <div className="absolute inset-0">
        <Image
          src="/media/balnk-templates.png"
          alt="Decorative wedding invitation background"
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
              'linear-gradient(180deg, oklch(0.99 0.008 90 / 0.15) 0%, transparent 35%, oklch(0.9 0.04 238 / 0.35) 100%)',
          }}
        />
        <Petals count={16} />
        <Sparkles count={18} />
      </div>

      {/* content anchored near the top (not dead-center) so there's no big empty gap above the namah line */}
      <div className="relative z-30 flex h-full flex-col items-center justify-start gap-5 px-6 pt-16 text-center sm:pt-20">
        {/* श्री गणेशाय नमः — fades in first, before anything else appears */}
        <Reveal
          text={NAMAH}
          duration={0.8}
          startDelay={300}
          onDone={() => setPhase('image')}
          className="font-serif text-xl font-medium tracking-wide text-foreground sm:text-2xl"
          key="namah-reveal"
        />

        {/* Ganesh medallion — fades and scales in once the namah finishes */}
        <AnimatePresence>
          {showImage && (
            <motion.div
              className="relative"
              initial={{ opacity: 0, scale: 0.6, y: -14 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
              onAnimationComplete={() => {
                if (phase === 'image') setPhase('line1')
              }}
            >
              <div
                aria-hidden="true"
                className="absolute -inset-3 rounded-full blur-xl"
                style={{
                  background:
                    'radial-gradient(circle, oklch(0.93 0.06 88 / 0.55), transparent 70%)',
                }}
              />
              <div
                className="relative size-28 overflow-hidden rounded-full border-[3px] shadow-[0_10px_30px_-10px_oklch(0.5_0.08_74/0.6)] sm:size-32"
                style={{ borderColor: 'var(--gold)' }}
              >
                <Image
                  src="/media/gold_festive_ganesh_india.png"
                  alt="Lord Ganesha"
                  fill
                  sizes="128px"
                  className="object-cover"
                />
              </div>
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 rounded-full"
                style={{ boxShadow: 'inset 0 0 0 1px oklch(1 0 0 / 0.6)' }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* shlok — two lines, fading in one after the other */}
        <div className="flex max-w-md flex-col items-center gap-1.5">
          {showLine1 && (
            <Reveal
              text={SHLOK_LINE_1}
              duration={0.8}
              startDelay={100}
              onDone={() => setPhase((p) => (p === 'line1' ? 'line2' : p))}
              className="font-serif text-base font-light italic leading-relaxed text-foreground/90 sm:text-lg"
              key="shlok-line-1"
            />
          )}
          {showLine2 && (
            <Reveal
              text={SHLOK_LINE_2}
              duration={0.8}
              startDelay={150}
              onDone={() => setPhase((p) => (p === 'line2' ? 'tagline' : p))}
              className="font-serif text-base font-light italic leading-relaxed text-foreground/90 sm:text-lg"
              key="shlok-line-2"
            />
          )}
        </div>

        {/* tagline — fades in only after the shlok finishes */}
        {showTagline && (
          <Reveal
            text={TAGLINE}
            duration={0.9}
            startDelay={200}
            className="font-serif text-2xl font-light italic text-foreground drop-shadow-[0_2px_10px_oklch(1_0_0/0.7)] sm:text-4xl mt-4 sm:mt-6"
            key="tagline-reveal"
          />
        )}
      </div>
    </motion.div>
  )
}