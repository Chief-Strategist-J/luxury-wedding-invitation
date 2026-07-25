'use client'

import { motion } from 'motion/react'
import Image from 'next/image'
import { useState } from 'react'
import { Eyebrow, GoldDivider, Petals, Sparkles } from '@/components/decor'
import { MediaLightbox } from '@/components/media-lightbox'
import { celebrations, type MediaItem } from '@/lib/wedding-config'

/** A tiny unique gold glyph per event. */
function EventGlyph({ index }: { index: number }) {
  const glyphs = [
    // diya
    <path key="d" d="M4 15h16c-1.6 3-4.6 5-8 5s-6.4-2-8-5zM12 4c2.6 2.6 2.6 5.4 0 8-2.6-2.6-2.6-5.4 0-8z" />,
    // scroll
    <path key="s" d="M6 4h12v16H6zM9 8h6M9 12h6M9 16h4" />,
    // henna hand
    <path key="h" d="M8 20v-6M12 20V8M16 20v-5M6 14c0-3 2-4 2-6M18 15c0-3-2-4-2-6" />,
    // marigold
    <path key="m" d="M12 6a3 3 0 100 6 3 3 0 000-6zM12 3v2M12 19v2M3 12h2M19 12h2M6 6l1.5 1.5M16.5 16.5L18 18M18 6l-1.5 1.5M7.5 16.5L6 18" />,
    // music note
    <path key="n" d="M9 18V6l9-2v12M9 18a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0zM18 16a2 2 0 11-4 0 2 2 0 014 0z" />,
    // mandap
    <path key="w" d="M4 20V9l8-5 8 5v11M9 20v-6h6v6" />,
    // doli
    <path key="b" d="M4 8h16l-2 6H6L4 8zM8 14v6M16 14v6M12 4v4" />,
  ]
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-6 text-accent-foreground"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {glyphs[index % glyphs.length]}
    </svg>
  )
}

export function Celebrations() {
  const [active, setActive] = useState<MediaItem | null>(null)

  return (
    <section
      id="celebrations"
      className="relative isolate w-full overflow-hidden px-5 py-24 sm:px-8 sm:py-32"
      style={{
        background:
          'linear-gradient(200deg, oklch(0.91 0.042 238) 0%, oklch(0.97 0.016 234) 40%, oklch(0.99 0.014 90) 100%)',
      }}
    >
      <Petals count={10} />
      <Sparkles count={12} />

      <div className="relative z-10 mx-auto max-w-4xl">
        <div className="text-center">
          <Eyebrow>Seven days of joy</Eyebrow>
          <h2 className="mt-4 font-serif text-4xl font-light italic text-foreground sm:text-6xl">
            Our Wedding Celebrations
          </h2>
          <GoldDivider className="mt-6" />
        </div>

        {/* vertical gold timeline */}
        <div className="relative mt-14 pl-10 sm:pl-0">
          <span
            aria-hidden="true"
            className="absolute bottom-0 left-3 top-0 w-px sm:left-1/2"
            style={{
              background:
                'linear-gradient(180deg, transparent, var(--gold), var(--gold-soft), transparent)',
            }}
          />

          <ol className="flex flex-col gap-10 sm:gap-14">
            {celebrations.map((c, i) => {
              const right = i % 2 === 1
              return (
                <motion.li
                  key={c.name}
                  initial={{ opacity: 0, y: 34 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
                  className={`relative sm:w-1/2 ${right ? 'sm:ml-auto sm:pl-10' : 'sm:pr-10'}`}
                >
                  {/* node */}
                  <span
                    aria-hidden="true"
                    className={`absolute -left-[2.05rem] top-6 flex size-4 items-center justify-center rounded-full border border-accent bg-card sm:top-8 ${
                      right ? 'sm:-left-2' : 'sm:-right-2 sm:left-auto'
                    }`}
                  >
                    <span className="size-1.5 rounded-full bg-accent" />
                  </span>

                  <div
                    className="group relative overflow-hidden rounded-3xl border border-accent/40 p-5 shadow-[0_26px_54px_-30px_oklch(0.5_0.07_240/0.55)] transition-transform duration-500 hover:-translate-y-1"
                    style={{
                      background:
                        'linear-gradient(150deg, oklch(1 0 0 / 0.88), oklch(0.95 0.024 236 / 0.7))',
                      backdropFilter: 'blur(6px)',
                    }}
                  >
                    <div className="flex items-start gap-4">
                      <span className="flex size-11 shrink-0 items-center justify-center rounded-full border border-accent/45 bg-card/80">
                        <EventGlyph index={i} />
                      </span>
                      <div className="min-w-0">
                        <h3 className="font-serif text-2xl font-light leading-tight text-foreground">
                          {c.name}
                        </h3>
                        <p className="mt-1 text-[0.62rem] uppercase tracking-[0.26em] text-accent-foreground/80">
                          {c.date} &middot; {c.time}
                        </p>
                        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                          {c.venue}
                        </p>
                        <p className="mt-3 text-pretty font-serif text-base italic leading-snug text-foreground/80">
                          {c.description}
                        </p>
                      </div>
                    </div>

                    {c.media && (
                      <button
                        type="button"
                        onClick={() => setActive(c.media!)}
                        className="mt-4 flex w-full items-center gap-3 rounded-2xl border border-accent/35 bg-card/70 p-2 text-left transition-colors hover:bg-card"
                        aria-label={`Watch ${c.media.title}`}
                      >
                        <span className="relative size-16 shrink-0 overflow-hidden rounded-xl">
                          <Image
                            src={c.media.poster || c.media.src || '/placeholder.svg'}
                            alt=""
                            fill
                            sizes="64px"
                            className="object-cover"
                          />
                          <span className="absolute inset-0 flex items-center justify-center bg-[oklch(0.5_0.06_240/0.25)]">
                            <svg
                              viewBox="0 0 24 24"
                              className="size-4 text-white"
                              fill="currentColor"
                              aria-hidden="true"
                            >
                              <path d="M8 5l12 7-12 7z" />
                            </svg>
                          </span>
                        </span>
                        <span className="text-[0.6rem] uppercase tracking-[0.24em] text-accent-foreground/85">
                          Watch the moment
                        </span>
                      </button>
                    )}
                  </div>
                </motion.li>
              )
            })}
          </ol>
        </div>
      </div>

      <MediaLightbox item={active} onClose={() => setActive(null)} />
    </section>
  )
}
