'use client'

import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
  type MotionValue,
} from 'motion/react'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import {
  Eyebrow,
  GoldDivider,
  HeartMark,
  SectionShell,
  Sparkles,
} from '@/components/decor'
import { storyChapters } from '@/lib/wedding-config'

const TOTAL = storyChapters.length

/* Viewport height in px, kept in sync on resize / mobile toolbar changes.
   We need the real number because the pinning is done with transforms
   instead of `position: sticky` (see note in LoveStory below). */
function useViewportHeight() {
  const [vh, setVh] = useState(0)
  useEffect(() => {
    const read = () => setVh(window.innerHeight)
    read()
    window.addEventListener('resize', read)
    return () => window.removeEventListener('resize', read)
  }, [])
  return vh
}

function clamp(v: number, min: number, max: number) {
  return Math.min(Math.max(v, min), max)
}

/* One page of the deck. It lives in a normal 100dvh block, and is
   translated DOWN by exactly the amount the page has scrolled, so it
   looks pinned while the next card slides over the top of it. */
function StackedCard({
  index,
  image,
  label,
  progress,
  active,
  vh,
}: {
  index: number
  image: string
  label: string
  progress: MotionValue<number>
  active: number
  vh: number
}) {
  const isLast = index === TOTAL - 1
  const start = index / TOTAL
  const end = Math.min(start + 1 / TOTAL, 1)
  const targetScale = 1 - (TOTAL - index - 1) * 0.055

  /* progress 0 → 1 maps to (TOTAL - 1) * vh of scrolling */
  const y = useTransform(progress, (p) => {
    if (!vh) return 0
    const scrolled = p * (TOTAL - 1) * vh
    return clamp(scrolled - index * vh, 0, (TOTAL - 1 - index) * vh) + index * 14
  })

  const scale = useTransform(progress, [start, 1], [1, targetScale])
  const rotate = useTransform(
    progress,
    [start, 1],
    [0, index % 2 === 0 ? -3 : 3],
  )
  const brightness = useTransform(
    progress,
    [start, end],
    isLast
      ? ['brightness(1)', 'brightness(1)']
      : ['brightness(1)', 'brightness(0.9)'],
  )

  const isActive = index === active

  return (
    <div className="flex h-[100dvh] items-center justify-center pt-24 sm:pt-28">
      <motion.div
        style={{ y, scale, rotate, filter: brightness, willChange: 'transform' }}
        className="relative w-full max-w-[300px] origin-center sm:max-w-[340px] lg:max-w-[370px]"
      >
        <div className="relative rounded-[26px] border border-accent/40 bg-card p-3 shadow-[0_36px_80px_-38px_oklch(0.45_0.08_240/0.55)]">
          <div className="relative aspect-[4/5] max-h-[60dvh] w-full overflow-hidden rounded-[18px] bg-card">
            <Image
              src={image || '/placeholder.svg'}
              alt={label}
              fill
              sizes="(max-width: 640px) 86vw, 400px"
              className="object-contain"
              priority={index === 0}
            />
          </div>
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-[10px] rounded-[20px] border border-accent/25"
          />
        </div>

        <span
          className={`absolute -top-4 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-accent/50 bg-card px-4 py-1 font-serif text-xs italic text-accent-foreground shadow-sm transition-opacity duration-500 ${isActive ? 'opacity-100' : 'opacity-0'
            }`}
        >
          Chapter {index + 1}
        </span>
        <span
          className={`absolute -bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-accent/40 bg-card px-4 py-1 font-serif text-[0.72rem] text-muted-foreground shadow-sm transition-opacity duration-500 lg:hidden ${isActive ? 'opacity-100' : 'opacity-0'
            }`}
        >
          {label}
        </span>
      </motion.div>
    </div>
  )
}

/* Right column: gold rail with a heart per chapter. The rail fills and
   each heart turns solid gold as its chapter reaches the top of the deck. */
function HeartTimeline({
  progress,
  active,
  vh,
}: {
  progress: MotionValue<number>
  active: number
  vh: number
}) {
  const y = useTransform(progress, (p) =>
    vh ? clamp(p * (TOTAL - 1) * vh, 0, (TOTAL - 1) * vh) : 0,
  )
  const fill = useTransform(progress, [0.04, 0.9], [0, 1])

  return (
    <div className="hidden lg:block">
      <motion.div
        style={{ y, willChange: 'transform' }}
        className="flex h-[100dvh] items-center pt-24 sm:pt-28"
      >
        <div className="relative flex flex-col justify-center gap-12">
          <span
            aria-hidden="true"
            className="absolute bottom-6 left-[18px] top-6 w-[2px] rounded-full bg-accent/20"
          />
          <motion.span
            aria-hidden="true"
            style={{ scaleY: fill }}
            className="absolute bottom-6 left-[18px] top-6 w-[2px] origin-top rounded-full bg-gradient-to-b from-accent to-accent/60"
          />

          {storyChapters.map((c, i) => {
            const reached = i <= active
            return (
              <div key={c.label} className="relative flex items-center gap-5">
                <HeartMark filled={reached} active={i === active} />
                <div>
                  <p
                    className={`font-serif text-xs tracking-[0.28em] transition-colors duration-500 ${reached
                        ? 'text-accent-foreground'
                        : 'text-muted-foreground/50'
                      }`}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </p>
                  <p
                    className={`mt-1 max-w-[15rem] text-pretty font-serif text-lg leading-snug transition-all duration-500 xl:text-xl ${i === active
                        ? 'italic text-foreground'
                        : reached
                          ? 'text-foreground/70'
                          : 'text-muted-foreground/55'
                      }`}
                  >
                    {c.label}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </motion.div>
    </div>
  )
}

/* The "Our Story" heading. Pinned with the SAME transform technique as the
   cards, so it can never be hidden by an ancestor `overflow` rule the way
   `position: sticky` is. It rides down with the scroll for the whole length
   of the deck and stops exactly when the last chapter is on screen. */
function StoryHeading({
  progress,
  vh,
}: {
  progress: MotionValue<number>
  vh: number
}) {
  const y = useTransform(progress, (p) =>
    vh ? clamp(p * (TOTAL - 1) * vh, 0, (TOTAL - 1) * vh) : 0,
  )

  return (
    <motion.div
      style={{ y, willChange: 'transform' }}
      className="pointer-events-none absolute inset-x-0 top-0 z-30 bg-gradient-to-b from-background via-background/90 to-transparent pb-8 pt-4 text-center"
    >
      <Eyebrow>A little about us</Eyebrow>
      <h2 className="mt-3 font-serif text-4xl font-light italic text-foreground sm:text-5xl">
        Our Story
      </h2>
      <GoldDivider className="mt-5" />
    </motion.div>
  )
}

export function LoveStory() {
  const container = useRef<HTMLDivElement | null>(null)
  const vh = useViewportHeight()

  /* Pinning is transform-based on purpose: `position: sticky` is silently
     disabled by ANY ancestor with `overflow: hidden` (SectionShell has it),
     while transforms always work — so the deck can stay inside the normal
     SectionShell without touching the rest of the page. */
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start start', 'end end'],
  })

  const [active, setActive] = useState(0)
  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    setActive(clamp(Math.floor(p * (TOTAL - 1) + 0.35), 0, TOTAL - 1))
  })

  return (
    <SectionShell
      id="story"
      className="overflow-visible !py-0"
      background={<Sparkles count={10} />}
    >
      <div ref={container} className="relative">
        <StoryHeading progress={scrollYProgress} vh={vh} />

        <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] lg:items-start lg:gap-10">
          <div className="relative">
            <Sparkles count={10} className="opacity-60" />
            {storyChapters.map((c, i) => (
              <StackedCard
                key={c.label}
                index={i}
                image={c.image}
                label={c.label}
                progress={scrollYProgress}
                active={active}
                vh={vh}
              />
            ))}
          </div>

          <HeartTimeline progress={scrollYProgress} active={active} vh={vh} />
        </div>
      </div>
    </SectionShell>
  )
}
