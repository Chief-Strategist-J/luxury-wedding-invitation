'use client'

import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from 'motion/react'
import Image from 'next/image'
import { useCallback, useEffect, useRef, useState, type RefObject } from 'react'
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
const TUNING = {
  mobile: { scaleStep: 0.035, peek: 10, imageZoom: 1.32 },
  desktop: { scaleStep: 0.05, peek: 16, imageZoom: 1.6 },
} as const

function clamp(v: number, min: number, max: number) {
  return Math.min(Math.max(v, min), max)
}

type DeckMetrics = {
  /** true once the layout is at the `lg` breakpoint (matches Tailwind's 1024px) */
  desktop: boolean
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
    desktop: false,
    vh: 0,
    panel: 0,
    distance: 0,
  })

  useEffect(() => {
    const node = container.current
    if (!node) return

    let frame = 0
    const read = () => {
      cancelAnimationFrame(frame)
      /* Batch reads into one frame: ResizeObserver + resize + orientation can
         all fire together and each one triggers a layout read. */
      frame = requestAnimationFrame(() => {
        const el = container.current
        if (!el) return
        const vh = window.innerHeight
        const height = el.offsetHeight
        const next: DeckMetrics = {
          desktop: window.innerWidth >= 1024,
          vh,
          panel: height / TOTAL,
          distance: Math.max(height - vh, 1),
        }
        setMetrics((prev) =>
          prev.desktop === next.desktop &&
          prev.vh === next.vh &&
          prev.panel === next.panel &&
          prev.distance === next.distance
            ? prev
            : next,
        )
      })
    }

    read()

    const observer = new ResizeObserver(read)
    observer.observe(node)
    window.addEventListener('resize', read)
    window.addEventListener('orientationchange', read)

    return () => {
      cancelAnimationFrame(frame)
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
  const reduceMotion = useReducedMotion()
  const pin = useDeckPin(progress, metrics, index)

  /* Phones get a gentler stack: less shrink, a smaller peek and a softer photo
     zoom, so the cards stay readable on a narrow screen while desktop keeps the
     full dramatic stacked-zoom. Both run the exact same scroll logic. */
  const { scaleStep, peek, imageZoom } = metrics.desktop
    ? TUNING.desktop
    : TUNING.mobile

  const start = index / TOTAL
  const step = 1 / TOTAL
  /* the window in which this card travels up into the deck */
  const enterFrom = Math.max(start - step, 0)

  /* ---- the classic framer-motion stacked-card zoom -------------------
     Each card is pinned once it reaches the top of the deck, then shrinks
     to its own target scale as every following card scrolls over it. The
     card that ends up on top stays at 1, the one under it at 0.95, etc. */
  const targetScale = 1 - (TOTAL - 1 - index) * scaleStep
  const scale = useTransform(
    progress,
    [start, 1],
    reduceMotion ? [targetScale, targetScale] : [1, targetScale],
    { clamp: true },
  )

  const y = useTransform(pin, (p) => p + index * peek)

  /* the photo zooms out from a strong close-up to its natural framing while
     the card is scrolling into place — the "zoom on scroll" itself */
  const imageScale = useTransform(
    progress,
    [enterFrom, start],
    reduceMotion || index === 0 ? [1, 1] : [imageZoom, 1],
    { clamp: true },
  )

  /* cards that are buried dim slightly so the top one reads first */
  const filter = useTransform(
    progress,
    [start, Math.min(start + step, 1)],
    index === TOTAL - 1 ? ['brightness(1)', 'brightness(1)'] : ['brightness(1)', 'brightness(0.92)'],
  )

  const isActive = index === active
  /* Only the top few cards need compositor layers; keeping `willChange` on
     every card at once is what makes long decks stutter on mobile. */
  const near = Math.abs(index - active) <= 1

  return (
    <div className="flex h-[100dvh] items-center justify-center px-4 pb-16 pt-52 sm:pt-56 lg:pb-24 lg:pt-32">
      <motion.div
        style={{
          y,
          scale,
          filter,
          zIndex: index,
          willChange: near ? 'transform, filter' : 'auto',
        }}
        className="relative w-full max-w-[300px] origin-top sm:max-w-[340px] lg:max-w-[370px]"
      >
        <div className="relative rounded-[26px] border border-accent/40 bg-card p-3 shadow-[0_36px_80px_-38px_oklch(0.45_0.08_240/0.55)]">
          <div className="relative aspect-[4/5] max-h-[46dvh] w-full overflow-hidden rounded-[18px] bg-card lg:max-h-[52dvh]">
            <motion.div
              style={{ scale: imageScale, willChange: near ? 'transform' : 'auto' }}
              className="absolute inset-0"
            >

              <Image
                src={image || '/placeholder.svg'}
                alt={label}
                fill
                sizes="(max-width: 640px) 86vw, 400px"
                className="object-cover object-center"
                priority={index === 0}
                loading={index === 0 ? undefined : 'lazy'}
              />
            </motion.div>
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
        <ol className="relative flex flex-col justify-center gap-12">
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
            const isActive = i === active
            return (
              <li
                key={c.label}
                aria-current={isActive ? 'step' : undefined}
                className="relative flex items-center gap-5"
              >
                <HeartMark filled={reached} active={isActive} />
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
                      isActive
                        ? 'italic text-foreground'
                        : reached
                          ? 'text-foreground/70'
                          : 'text-muted-foreground/55'
                    }`}
                  >
                    {c.label}
                  </p>
                  {/* the one-line note from wedding-config, only for the chapter
                      currently on top of the deck */}
                  <p
                    className={`max-w-[15rem] text-pretty font-serif text-[0.8rem] italic leading-relaxed text-muted-foreground transition-all duration-500 ${
                      isActive
                        ? 'mt-2 max-h-24 opacity-100'
                        : 'mt-0 max-h-0 overflow-hidden opacity-0'
                    }`}
                  >
                    {c.note}
                  </p>
                </div>
              </li>
            )
          })}
        </ol>
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
      <p
        aria-live="polite"
        className="font-serif text-[0.7rem] italic tracking-[0.22em] text-accent-foreground"
      >
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
  const reduceMotion = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start start', 'end end'],
  })

  const [active, setActive] = useState(0)

  const sync = useCallback(
    (p: number) => {
      if (!metrics.panel) return
      const scrolled = p * metrics.distance
      const next = clamp(Math.round(scrolled / metrics.panel), 0, TOTAL - 1)
      setActive((prev) => (prev === next ? prev : next))
    },
    [metrics.panel, metrics.distance],
  )

  useMotionValueEvent(scrollYProgress, 'change', sync)

  /* Re-sync after mount / resize / restored scroll position, otherwise the
     rail stays on chapter 1 when the page loads mid-section. */
  useEffect(() => {
    sync(scrollYProgress.get())
  }, [sync, scrollYProgress])

  return (
    <SectionShell
      id="story"
      className="overflow-visible !py-0"
      background={<Sparkles count={reduceMotion ? 0 : 10} />}
    >
      <div ref={container} className="relative">
        <StoryHeading
          progress={scrollYProgress}
          active={active}
          metrics={metrics}
        />

        <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] lg:items-start lg:gap-10">
          <div className="relative">
            <Sparkles count={reduceMotion ? 0 : 10} className="opacity-60" />
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
