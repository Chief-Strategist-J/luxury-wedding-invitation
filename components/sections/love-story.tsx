'use client'

import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
  type MotionValue,
} from 'motion/react'
import Image from 'next/image'
import { useEffect, useRef, useState, type RefObject } from 'react'
import {
  Eyebrow,
  GoldDivider,
  HeartMark,
  SectionShell,
  Sparkles,
} from '@/components/decor'
import { storyChapters } from '@/lib/wedding-config'

const TOTAL = storyChapters.length

/* How much each panel shrinks for every panel that stacks on top of it, and
   how far down the next panel sits so the one beneath still peeks out. */
const SCALE_STEP = 0.05
const PEEK = 16

function clamp(v: number, min: number, max: number) {
  return Math.min(Math.max(v, min), max)
}

type DeckMetrics = {
  /** real viewport height in px (the unit `scrollYProgress` is measured in) */
  vh: number
  /** measured height of ONE panel in px */
  panel: number
  /** total px the page scrolls between progress 0 and 1 */
  distance: number
}

/* The panels are laid out in `dvh`, but scroll offsets are reported in px
   against the LAYOUT viewport. On mobile those two units differ (the URL bar
   changes `dvh` but not `innerHeight`), so assuming `panel === innerHeight`
   made every pinned element drift upward as you scrolled — the heart line
   ended up floating above the photo instead of staying under it.
   Measuring the deck instead keeps the math exact in every browser. */
function useDeckMetrics(container: RefObject<HTMLDivElement | null>): DeckMetrics {
  const [metrics, setMetrics] = useState<DeckMetrics>({
    vh: 0,
    panel: 0,
    distance: 0,
  })

  useEffect(() => {
    const read = () => {
      const node = container.current
      if (!node) return
      const vh = window.innerHeight
      const height = node.offsetHeight
      setMetrics({
        vh,
        panel: height / TOTAL,
        distance: Math.max(height - vh, 1),
      })
    }

    read()

    const observer = new ResizeObserver(read)
    if (container.current) observer.observe(container.current)
    window.addEventListener('resize', read)
    window.addEventListener('orientationchange', read)

    return () => {
      observer.disconnect()
      window.removeEventListener('resize', read)
      window.removeEventListener('orientationchange', read)
    }
  }, [container])

  return metrics
}

/* Translate an element DOWN by exactly the distance the page has scrolled so
   it behaves like `position: sticky` — but with transforms, which no ancestor
   `overflow` rule can disable. Panel `index` only starts holding still once it
   has become the top card of the deck. */
function useDeckPin(progress: MotionValue<number>, m: DeckMetrics, index = 0) {
  return useTransform(progress, (p) => {
    if (!m.distance || !m.panel) return 0
    const scrolled = p * m.distance
    const offset = index * m.panel
    return clamp(scrolled - offset, 0, Math.max(m.distance - offset, 0))
  })
}

function StackedPanel({
  index,
  image,
  label,
  progress,
  active,
  metrics,
}: {
  index: number
  image: string
  label: string
  progress: MotionValue<number>
  active: number
  metrics: DeckMetrics
}) {
  const pin = useDeckPin(progress, metrics, index)
  const y = useTransform(pin, (v) => v + index * PEEK)

  /* every panel above shrinks this one a little further */
  const stacked = (TOTAL - 1 - index) * SCALE_STEP
  const start = index / TOTAL
  const scale = useTransform(progress, [start, 1], [1, 1 - stacked])
  const brightness = useTransform(
    progress,
    [start, Math.min(start + 1 / TOTAL, 1)],
    index === TOTAL - 1 ? [1, 1] : [1, 0.9],
  )
  const filter = useTransform(brightness, (b) => `brightness(${b})`)

  const isActive = index === active

  return (
    <div className="flex h-[100dvh] items-center justify-center px-4 pb-16 pt-52 sm:pt-56 lg:pb-24 lg:pt-32">
      <motion.div
        style={{ y, scale, filter, willChange: 'transform' }}
        className="relative w-full max-w-[300px] origin-top sm:max-w-[340px] lg:max-w-[370px]"
      >
        <div className="relative rounded-[26px] border border-accent/40 bg-card p-3 shadow-[0_36px_80px_-38px_oklch(0.45_0.08_240/0.55)]">
          <div className="relative aspect-[4/5] max-h-[46dvh] w-full overflow-hidden rounded-[18px] bg-card lg:max-h-[52dvh]">
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
          className={`absolute -top-4 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-accent/50 bg-card px-4 py-1 font-serif text-xs italic text-accent-foreground shadow-sm transition-opacity duration-500 ${
            isActive ? 'opacity-100' : 'opacity-0'
          }`}
        >
          Chapter {index + 1}
        </span>
        <span
          className={`absolute -bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-accent/40 bg-card px-4 py-1 font-serif text-[0.72rem] text-muted-foreground shadow-sm transition-opacity duration-500 lg:hidden ${
            isActive ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {label}
        </span>
      </motion.div>
    </div>
  )
}

/* Desktop: gold rail with a heart per chapter. The rail fills and each heart
   turns solid gold as its chapter reaches the top of the deck. */
function HeartTimeline({
  progress,
  active,
  metrics,
}: {
  progress: MotionValue<number>
  active: number
  metrics: DeckMetrics
}) {
  const y = useDeckPin(progress, metrics)
  const fill = useTransform(progress, [0.04, 0.9], [0, 1])

  return (
    <div className="hidden lg:block">
      <motion.div
        style={{
          y,
          height: metrics.vh || undefined,
          willChange: 'transform',
        }}
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
                    className={`font-serif text-xs tracking-[0.28em] transition-colors duration-500 ${
                      reached ? 'text-accent-foreground' : 'text-muted-foreground/50'
                    }`}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </p>
                  <p
                    className={`mt-1 max-w-[15rem] text-pretty font-serif text-lg leading-snug transition-all duration-500 xl:text-xl ${
                      i === active
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

/* Mobile / tablet: the horizontal heart rail. It is NOT pinned on its own any
   more — it rides inside the pinned "Our Story" header, directly under the gold
   divider, so it reads as part of the heading instead of floating over the
   bottom of the photo. */
function HeartRailMobile({
  progress,
  active,
}: {
  progress: MotionValue<number>
  active: number
}) {
  const fill = useTransform(progress, [0.04, 0.9], [0, 1])

  return (
    <div className="mt-5 flex flex-col items-center gap-2.5 lg:hidden">
      <div className="relative flex max-w-full items-center justify-center gap-3 sm:gap-8">
        <span
          aria-hidden="true"
          className="absolute left-3 right-3 top-1/2 h-[2px] -translate-y-1/2 rounded-full bg-accent/20"
        />
        <motion.span
          aria-hidden="true"
          style={{ scaleX: fill }}
          className="absolute left-3 right-3 top-1/2 h-[2px] -translate-y-1/2 origin-left rounded-full bg-gradient-to-r from-accent to-accent/60"
        />
        {storyChapters.map((c, i) => (
          <span key={c.label} className="relative scale-[0.72] sm:scale-90">
            <HeartMark filled={i <= active} active={i === active} />
          </span>
        ))}
      </div>
      <p className="font-serif text-[0.7rem] italic tracking-[0.22em] text-accent-foreground">
        Chapter {active + 1} of {TOTAL}
      </p>
    </div>
  )
}

/* The "Our Story" heading, pinned with the same transform technique. On small
   screens it also carries the heart rail underneath the gold divider. */
function StoryHeading({
  progress,
  active,
  metrics,
}: {
  progress: MotionValue<number>
  active: number
  metrics: DeckMetrics
}) {
  const y = useDeckPin(progress, metrics)

  return (
    <motion.div
      style={{ y, willChange: 'transform' }}
      className="pointer-events-none absolute inset-x-0 top-0 z-30 bg-gradient-to-b from-background via-background to-transparent pb-10 pt-4 text-center"
    >
      <Eyebrow>A little about us</Eyebrow>
      <h2 className="mt-3 font-serif text-4xl font-light italic text-foreground sm:text-5xl">
        Our Story
      </h2>
      <GoldDivider className="mt-5" />
      <HeartRailMobile progress={progress} active={active} />
    </motion.div>
  )
}

export function LoveStory() {
  const container = useRef<HTMLDivElement | null>(null)
  const metrics = useDeckMetrics(container)

  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start start', 'end end'],
  })

  const [active, setActive] = useState(0)
  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    if (!metrics.panel) return
    const scrolled = p * metrics.distance
    setActive(clamp(Math.round(scrolled / metrics.panel), 0, TOTAL - 1))
  })

  return (
    <SectionShell
      id="story"
      className="overflow-visible !py-0"
      background={<Sparkles count={10} />}
    >
      <div ref={container} className="relative">
        <StoryHeading
          progress={scrollYProgress}
          active={active}
          metrics={metrics}
        />

        <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] lg:items-start lg:gap-10">
          <div className="relative">
            <Sparkles count={10} className="opacity-60" />
            {storyChapters.map((c, i) => (
              <StackedPanel
                key={c.label}
                index={i}
                image={c.image}
                label={c.label}
                progress={scrollYProgress}
                active={active}
                metrics={metrics}
              />
            ))}
          </div>

          <HeartTimeline
            progress={scrollYProgress}
            active={active}
            metrics={metrics}
          />
        </div>
      </div>
    </SectionShell>
  )
}
