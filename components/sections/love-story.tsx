'use client'

import { motion, useScroll, useTransform } from 'motion/react'
import Image from 'next/image'
import { useRef } from 'react'
import { Eyebrow, GoldDivider, Sparkles } from '@/components/decor'
import { story } from '@/lib/wedding-config'

function Chapter({
  index,
  chapter,
  text,
  image,
  video,
  poster,
}: {
  index: number
  chapter: string
  text: string
  image?: string
  video?: string
  poster?: string
}) {
  const ref = useRef<HTMLDivElement | null>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], [40, -40])
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.06, 1, 1.06])
  const flip = index % 2 === 1

  return (
    <div
      ref={ref}
      className={`relative grid items-center gap-7 sm:grid-cols-2 sm:gap-12 ${
        flip ? 'sm:[&>*:first-child]:order-2' : ''
      }`}
    >
      {/* media */}
      <motion.div
        style={{ y }}
        className="relative mx-auto w-full max-w-xs sm:max-w-none"
      >
        <div className="relative overflow-hidden rounded-[26px] border border-accent/35 shadow-[0_36px_70px_-36px_oklch(0.5_0.07_240/0.6)]">
          <div className="relative aspect-[4/5] w-full bg-secondary/40">
            <motion.div style={{ scale }} className="absolute inset-0">
              {video ? (
                <video
                  src={video}
                  poster={poster}
                  muted
                  loop
                  playsInline
                  autoPlay
                  preload="metadata"
                  className="size-full object-cover"
                />
              ) : (
                <Image
                  src={image || '/placeholder.svg'}
                  alt={chapter}
                  fill
                  sizes="(max-width: 640px) 90vw, 45vw"
                  className="object-cover"
                />
              )}
            </motion.div>
          </div>
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-3 rounded-[18px] border border-white/45"
          />
        </div>
        {/* chapter number */}
        <span className="absolute -top-5 left-1/2 -translate-x-1/2 rounded-full border border-accent/50 bg-card px-4 py-1 font-serif text-xs italic text-accent-foreground shadow-sm">
          Chapter {index + 1}
        </span>
      </motion.div>

      {/* text */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className={flip ? 'sm:text-right' : ''}
      >
        <h3 className="font-serif text-3xl font-light text-foreground sm:text-4xl">
          {chapter}
        </h3>
        <span
          aria-hidden="true"
          className={`mt-4 block h-px w-20 bg-accent/60 ${flip ? 'sm:ml-auto' : ''}`}
        />
        <p className="mt-5 text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">
          {text}
        </p>
      </motion.div>
    </div>
  )
}

export function LoveStory() {
  return (
    <section
      id="story"
      className="relative isolate w-full overflow-hidden px-5 py-24 sm:px-8 sm:py-32"
      style={{
        background:
          'linear-gradient(180deg, oklch(0.94 0.03 236) 0%, oklch(0.995 0.006 90) 30%, oklch(0.98 0.014 90) 70%, oklch(0.95 0.024 236) 100%)',
      }}
    >
      <Sparkles count={10} />

      <div className="relative z-10 mx-auto max-w-5xl">
        <div className="text-center">
          <Eyebrow>A little about us</Eyebrow>
          <h2 className="mt-4 font-serif text-4xl font-light italic text-foreground sm:text-6xl">
            Our Story
          </h2>
          <GoldDivider className="mt-6" />
        </div>

        <div className="mt-16 flex flex-col gap-20 sm:gap-28">
          {story.map((s, i) => (
            <Chapter
              key={s.chapter}
              index={i}
              chapter={s.chapter}
              text={s.text}
              image={'image' in s ? s.image : undefined}
              video={'video' in s ? s.video : undefined}
              poster={'poster' in s ? s.poster : undefined}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
