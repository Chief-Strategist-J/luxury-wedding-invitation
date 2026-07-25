'use client'

import { motion } from 'motion/react'
import Image from 'next/image'
import { useState } from 'react'
import { Eyebrow, GoldDivider, Petals } from '@/components/decor'
import { MediaLightbox } from '@/components/media-lightbox'
import { memories, type MediaItem } from '@/lib/wedding-config'

/** Layout recipe so the gallery never looks like a plain grid. */
const layout = [
  'sm:col-span-7 sm:row-span-2',
  'sm:col-span-5 sm:mt-10',
  'sm:col-span-5 sm:-mt-6',
  'sm:col-span-7',
  'sm:col-span-6 sm:mt-8',
  'sm:col-span-6',
]

const tilts = [-2.2, 1.8, -1.4, 2.4, -1.8, 1.2]

export function Memories() {
  const [active, setActive] = useState<MediaItem | null>(null)

  return (
    <section
      id="memories"
      className="relative isolate w-full overflow-hidden px-5 py-24 sm:px-8 sm:py-32"
      style={{
        background:
          'radial-gradient(100% 60% at 85% 0%, oklch(0.99 0.02 90) 0%, oklch(0.96 0.022 235) 45%, oklch(0.91 0.042 238) 100%)',
      }}
    >
      <Petals count={12} />

      <div className="relative z-10 mx-auto max-w-6xl">
        <div className="sm:flex sm:items-end sm:justify-between">
          <div>
            <Eyebrow>Photos &amp; films</Eyebrow>
            <h2 className="mt-4 font-serif text-4xl font-light italic text-foreground sm:text-6xl">
              Memories
            </h2>
          </div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground sm:mt-0 sm:text-right">
            Tap any photo to view it, or press play to watch a moment come back
            to life.
          </p>
        </div>
        <GoldDivider className="mt-8 sm:mx-0 sm:justify-start" />

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-12 sm:gap-7">
          {memories.map((m, i) => (
            <motion.button
              key={m.id}
              type="button"
              onClick={() => setActive(m)}
              initial={{ opacity: 0, y: 44, rotateX: 12 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{
                delay: (i % 3) * 0.1,
                duration: 0.9,
                ease: [0.22, 1, 0.36, 1],
              }}
              whileHover={{ y: -8, rotate: 0, scale: 1.015 }}
              className={`group relative mx-auto w-full max-w-sm text-left sm:max-w-none ${layout[i % layout.length]}`}
              style={{ rotate: `${tilts[i % tilts.length]}deg` }}
              aria-label={`Open ${m.title}`}
            >
              {/* polaroid-style card */}
              <div className="relative overflow-hidden rounded-2xl border border-accent/40 bg-card p-2.5 shadow-[0_30px_60px_-32px_oklch(0.5_0.07_240/0.65)] transition-shadow group-hover:shadow-[0_40px_80px_-30px_oklch(0.5_0.07_240/0.7)]">
                <div
                  className={`relative w-full overflow-hidden rounded-xl bg-secondary/40 ${
                    i === 0 ? 'aspect-[4/5] sm:aspect-[4/5]' : 'aspect-[4/5]'
                  }`}
                >
                  <Image
                    src={(m.type === 'image' ? m.src : m.poster) || '/placeholder.svg'}
                    alt={m.caption ?? m.title}
                    fill
                    sizes="(max-width: 640px) 90vw, 40vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.06]"
                  />
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                    style={{
                      background:
                        'linear-gradient(180deg, transparent 40%, oklch(0.5 0.06 240 / 0.35) 100%)',
                    }}
                  />

                  {m.type === 'video' && (
                    <span className="absolute inset-0 flex items-center justify-center">
                      <span className="flex size-14 items-center justify-center rounded-full border border-accent/60 bg-card/80 backdrop-blur-sm transition-transform duration-500 group-hover:scale-110">
                        <svg
                          viewBox="0 0 24 24"
                          className="ml-0.5 size-5 text-accent-foreground"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path d="M8 5l12 7-12 7z" />
                        </svg>
                      </span>
                    </span>
                  )}
                </div>

                <div className="flex items-baseline justify-between gap-3 px-1 pb-1 pt-3">
                  <p className="font-serif text-base italic text-foreground">
                    {m.title}
                  </p>
                  <span className="text-[0.55rem] uppercase tracking-[0.24em] text-accent-foreground/70">
                    {m.type === 'video' ? 'Film' : 'Photo'}
                  </span>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      <MediaLightbox item={active} onClose={() => setActive(null)} />
    </section>
  )
}
