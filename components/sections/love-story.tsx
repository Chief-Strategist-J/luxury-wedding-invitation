'use client'

import {
  motion,
  useMotionValueEvent,
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

const TUNING = {
  mobile: { scaleStep: 0.035, peek: 10, imageZoom: 1.32 },
  desktop: { scaleStep: 0.05, peek: 16, imageZoom: 1.6 },
} as const

function clamp(v: number, min: number, max: number) {
  return Math.min(Math.max(v, min), max)
}

type DeckMetrics = {
  desktop: boolean
  vh: number
  panel: number
  distance: number
}

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
  const reduceMotion = false
  const pin = useDeckPin(progress, metrics, index)

  const { scaleStep, peek, imageZoom } = metrics.desktop
    ? TUNING.desktop
    : TUNING.mobile

  const start = index / TOTAL
  const step = 1 / TOTAL
  const enterFrom = Math.max(start - step, 0)

  const targetScale = 1 - (TOTAL - 1 - index) * scaleStep
  const scale = useTransform(
    progress,
    [start, 1],
    reduceMotion ? [targetScale, targetScale] : [1, targetScale],
    { clamp: true },
  )

  const y = useTransform(pin, (p) => p + index * peek)

  const imageScale = useTransform(
    progress,
    [enterFrom, start],
    reduceMotion || index === 0 ? [1, 1] : [imageZoom, 1],
    { clamp: true },
  )

  const filter = useTransform(
    progress,
    [start, Math.min(start + step, 1)],
    index === TOTAL - 1 ? ['brightness(1)', 'brightness(1)'] : ['brightness(1)', 'brightness(0.92)'],
  )

  const isActive = index === active
  const near = Math.abs(index - active) <= 1

  return (
    <div className="flex h-[100dvh] items-center justify-center px-4 pb-16 pt-52 sm:pt-56 lg:pb-24 lg:pt-32">
      <motion.div
        transformTemplate={(_, generated) => generated}
        style={{
          y,
          scale,
          filter,
          zIndex: index,
          willChange: 'transform, filter',
        }}
        className="relative w-full max-w-[300px] origin-top sm:max-w-[340px] lg:max-w-[370px]"
      >
        <div className="relative rounded-[26px] border border-accent/40 bg-card p-3 shadow-[0_36px_80px_-38px_oklch(0.45_0.08_240/0.55)]">
          <div className="relative aspect-[4/5] max-h-[46dvh] w-full overflow-hidden rounded-[18px] bg-card lg:max-h-[52dvh]">
            <motion.div
              transformTemplate={(_, generated) => generated}
              style={{
                scale: imageScale,
                willChange: 'transform',
              }}
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
  const reduceMotion = false

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

  useEffect(() => {
    sync(scrollYProgress.get())
  }, [sync, scrollYProgress])

  return (
    <SectionShell
      id="story"
      className="overflow-visible !py-0"
      background={<Sparkles count={reduceMotion ? 0 : 10} />}
    >
      <div
        ref={container}
        className="relative"
        style={{ height: `${TOTAL * 100}vh` }}
      >
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
