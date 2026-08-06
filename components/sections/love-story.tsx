'use client'

import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
  type MotionValue,
} from 'motion/react'
import Image from 'next/image'
import { useRef, useState } from 'react'
import {
  Eyebrow,
  GoldDivider,
  HeartMark,
  Sparkles,
} from '@/components/decor'
import { storyChapters } from '@/lib/wedding-config'

const TOTAL = storyChapters.length

function clamp(v: number, min: number, max: number) {
  return Math.min(Math.max(v, min), max)
}

function StackedCard({
  index,
  image,
  label,
  progress,
  active,
}: {
  index: number
  image: string
  label: string
  progress: MotionValue<number>
  active: number
}) {
  const isLast = index === TOTAL - 1
  const start = index / TOTAL
  const end = Math.min(start + 1 / TOTAL, 1)

  const scale = useTransform(
    progress,
    [start, end],
    [1, isLast ? 1 : 0.94],
  )
  const rotate = useTransform(
    progress,
    [start, end],
    [0, isLast ? 0 : index % 2 === 0 ? -2 : 2],
  )
  const opacity = useTransform(
    progress,
    [start, end],
    [1, isLast ? 1 : 0.7],
  )

  const isActive = index === active

  return (
    <div
      className="sticky top-20 flex h-[75vh] items-center justify-center sm:top-24 sm:h-[80vh]"
      style={{
        zIndex: index + 10,
      }}
    >
      <motion.div
        style={{
          scale,
          rotate,
          opacity,
          willChange: 'transform, opacity',
        }}
        className="relative w-full max-w-[300px] origin-top sm:max-w-[340px] lg:max-w-[370px]"
      >
        <div className="relative rounded-[26px] border border-accent/40 bg-card p-3 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)]">
          <div className="relative aspect-[4/5] max-h-[52dvh] w-full overflow-hidden rounded-[18px] bg-card">
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

function HeartTimeline({ active }: { active: number }) {
  return (
    <div className="sticky top-32 hidden lg:block">
      <div className="flex items-center pt-8">
        <div className="relative flex flex-col justify-center gap-10">
          <span
            aria-hidden="true"
            className="absolute bottom-6 left-[18px] top-6 w-[2px] rounded-full bg-accent/20"
          />
          {storyChapters.map((c, i) => {
            const reached = i <= active
            return (
              <div key={c.label} className="relative flex items-center gap-5">
                <HeartMark filled={reached} active={i === active} />
                <div>
                  <p
                    className={`font-serif text-xs tracking-[0.28em] transition-colors duration-500 ${
                      reached
                        ? 'text-accent-foreground'
                        : 'text-muted-foreground/50'
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
      </div>
    </div>
  )
}

export function LoveStory() {
  const container = useRef<HTMLDivElement | null>(null)

  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start start', 'end end'],
  })

  const [active, setActive] = useState(0)
  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    setActive(clamp(Math.floor(p * TOTAL), 0, TOTAL - 1))
  })

  return (
    <section id="story" className="relative w-full px-5 py-12 sm:px-8 sm:py-16">
      <Sparkles count={10} />

      <div className="relative z-10 mx-auto w-full max-w-6xl">
        <div className="py-8 text-center">
          <Eyebrow>A little about us</Eyebrow>
          <h2 className="mt-3 font-serif text-4xl font-light italic text-foreground sm:text-5xl">
            Our Story
          </h2>
          <GoldDivider className="mt-5" />
        </div>

        <div ref={container} className="relative mx-auto min-h-[300vh] max-w-6xl">
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
                />
              ))}
            </div>

            <HeartTimeline active={active} />
          </div>
        </div>
      </div>
    </section>
  )
}
