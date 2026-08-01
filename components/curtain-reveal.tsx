'use client'

import { motion, AnimatePresence } from 'motion/react'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Petals, Sparkles } from '@/components/decor'
import { wedding } from '@/lib/wedding-config'

const NAMAH = '॥ श्री गणेशाय नमः ॥'
const SHLOK_LINE_1 = '॥वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ'
const SHLOK_LINE_2 = 'निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा॥'
const TAGLINE = 'A Beautiful Story Awaits...'

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

type Phase =
  | 'namah'
  | 'image'
  | 'line1'
  | 'line2'
  | 'groom'
  | 'bride'
  | 'tagline'

/**
 * Screen 4: a decorative template with the Ganesh invocation, faded in on screen.
 * Sequence: namah -> ganesh image -> shlok (2 lines)
 * -> groom name + his parents -> bride name + her parents -> tagline (small, last).
 * Nothing auto-advances: the next page only opens on a real scroll/swipe gesture,
 * once the whole sequence has revealed — so anyone reading this screen can take their time.
 */
export function CurtainReveal({ onDone }: { onDone: () => void }) {
  const [phase, setPhase] = useState<Phase>('namah')
  const [scrollArmed, setScrollArmed] = useState(false)

  useEffect(() => {
    if (!scrollArmed) return

    let done = false
    const handleScrollIntent = (e: Event) => {
      if (done) return
      if (e.type === 'wheel') {
        const we = e as WheelEvent
        if (we.deltaY <= 0) return
      }
      done = true
      onDone()
    }

    window.addEventListener('wheel', handleScrollIntent, { passive: true })
    window.addEventListener('touchmove', handleScrollIntent, { passive: true })
    return () => {
      window.removeEventListener('wheel', handleScrollIntent)
      window.removeEventListener('touchmove', handleScrollIntent)
    }
  }, [scrollArmed, onDone])

  const showImage = phase !== 'namah'
  const showLine1 = phase === 'line1' || phase === 'line2' || phase === 'groom' || phase === 'bride' || phase === 'tagline'
  const showLine2 = phase === 'line2' || phase === 'groom' || phase === 'bride' || phase === 'tagline'
  const showGroom = phase === 'groom' || phase === 'bride' || phase === 'tagline'
  const showBride = phase === 'bride' || phase === 'tagline'
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
          src="/media/blank-templates.png"
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

      {/* Same centered-block feel as before, but:
          - pt increased so the Namah line isn't glued to the very top edge
          - justify-between (with the scroll cue as a separate flex child) so that
            once the cue appears, it gets pushed down and actually fills the empty
            space at the bottom instead of leaving it blank */}
      <div className="relative z-30 flex h-full flex-col items-center justify-between gap-2 px-6 pb-8 pt-16 text-center sm:pt-20">
        <div className="flex flex-col items-center gap-2">
          {/* श्री गणेशाय नमः — fades in first, before anything else appears */}
          <Reveal
            text={NAMAH}
            duration={0.8}
            startDelay={200}
            onDone={() => setPhase('image')}
            className="font-serif text-lg font-medium tracking-wide text-foreground sm:text-xl"
            key="namah-reveal"
          />

          {/* Ganesh medallion — larger, fades and scales in once the namah finishes */}
          <AnimatePresence>
            {showImage && (
              <motion.div
                className="relative mt-1"
                initial={{ opacity: 0, scale: 0.6, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                onAnimationComplete={() => {
                  if (phase === 'image') setPhase('line1')
                }}
              >
                <div
                  aria-hidden="true"
                  className="absolute -inset-2 rounded-full blur-lg"
                  style={{
                    background:
                      'radial-gradient(circle, oklch(0.93 0.06 88 / 0.55), transparent 70%)',
                  }}
                />
                <div
                  className="relative size-28 overflow-hidden rounded-full border-2 shadow-[0_8px_20px_-10px_oklch(0.5_0.08_74/0.6)] sm:size-32"
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

          {/* shlok — two lines, smaller and more delicate so it reads cleanly on the template */}
          <div className="mt-2 flex max-w-xs flex-col items-center gap-0.5">
            {showLine1 && (
              <Reveal
                text={SHLOK_LINE_1}
                duration={0.7}
                startDelay={80}
                onDone={() => setPhase((p) => (p === 'line1' ? 'line2' : p))}
                className="font-serif text-xs font-light italic leading-snug text-foreground/80 sm:text-sm"
                key="shlok-line-1"
              />
            )}
            {showLine2 && (
              <Reveal
                text={SHLOK_LINE_2}
                duration={0.7}
                startDelay={120}
                onDone={() => setPhase((p) => (p === 'line2' ? 'groom' : p))}
                className="font-serif text-xs font-light italic leading-snug text-foreground/80 sm:text-sm"
                key="shlok-line-2"
              />
            )}
          </div>

          {/* groom's name — highlighted in gold, then a normal-toned "son of" + parents,
              parent names bumped up a touch for better readability */}
          {showGroom && (
            <motion.div
              className="mt-2 flex flex-col items-center gap-0.5"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              onAnimationComplete={() => setPhase((p) => (p === 'groom' ? 'bride' : p))}
              key="groom-block"
            >
              <span className="font-serif text-2xl font-semibold text-gold-gradient sm:text-3xl">
                {wedding.groom}
              </span>
              <span className="mt-0.5 font-serif text-sm italic text-foreground/60 sm:text-base">son of</span>
              <span className="font-serif text-sm italic text-foreground/75 sm:text-base">
                Mr. {wedding.groomFather}
              </span>
              <span className="font-serif text-sm italic text-foreground/75 sm:text-base">
                Mrs. {wedding.groomMother}
              </span>
            </motion.div>
          )}

          {/* gathbandhan image, then bride's name — highlighted in gold, then "daughter of" + parents */}
          {showBride && (
            <>
              <div className="relative mt-2 h-10 w-48 sm:h-12 sm:w-56">
                <Image
                  src="/media/gathbandhan.png"
                  alt="Gathbandhan"
                  fill
                  sizes="224px"
                  className="object-contain"
                />
              </div>
              <motion.div
                className="mt-2 flex flex-col items-center gap-0.5"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                onAnimationComplete={() => setPhase((p) => (p === 'bride' ? 'tagline' : p))}
                key="bride-block"
              >
                <span className="font-serif text-2xl font-semibold text-gold-gradient sm:text-3xl">
                  {wedding.bride}
                </span>
                <span className="mt-0.5 font-serif text-sm italic text-foreground/60 sm:text-base">daughter of</span>
                <span className="font-serif text-sm italic text-foreground/75 sm:text-base">
                  Mr. {wedding.brideFather}
                </span>
                <span className="font-serif text-sm italic text-foreground/75 sm:text-base">
                  Mrs. {wedding.brideMother}
                </span>
              </motion.div>
            </>
          )}

          {/* tagline — sits directly under the bride's parents, part of the same
              flowing block instead of being pushed down to the bottom edge */}
          {showTagline && (
            <Reveal
              text={TAGLINE}
              duration={0.8}
              startDelay={150}
              onDone={() => setScrollArmed(true)}
              className="mt-3 font-serif text-sm font-light italic text-foreground/80 sm:text-base"
              key="tagline-reveal"
            />
          )}
        </div>

        {/* animated scroll-down cue — its own flex child now, so once it shows up,
            justify-between on the parent pushes it down and fills the leftover
            space at the bottom instead of leaving it empty */}
        {scrollArmed && (
          <motion.div
            className="flex flex-col items-center gap-0.5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-[oklch(0.6_0.09_74)]"
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.6, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' }}
            >
              <path d="M12 5v14" />
              <path d="M5 12l7 7 7-7" />
            </motion.svg>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}