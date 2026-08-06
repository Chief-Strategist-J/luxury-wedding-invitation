'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import {
  Eyebrow,
  GoldDivider,
  HeartMark,
  Sparkles,
} from '@/components/decor'
import { storyChapters } from '@/lib/wedding-config'

export function LoveStory() {
  const [active, setActive] = useState(0)
  const itemRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const handleScroll = () => {
      itemRefs.current.forEach((el, index) => {
        if (!el) return
        const rect = el.getBoundingClientRect()
        // If card top has hit or passed the sticky offset line
        if (rect.top <= 120 && rect.bottom > 120) {
          setActive(index)
        }
      })
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <section id="story" className="relative w-full px-4 pb-16 sm:px-8 sm:pb-24" style={{ scrollMarginTop: '80px' }}>
      <Sparkles count={12} />

      <div className="relative z-10 mx-auto w-full max-w-6xl">
        <div className="mb-8 text-center sm:mb-12" style={{ paddingTop: 'calc(80px + 2rem)' }}>
          <Eyebrow>A little about us</Eyebrow>
          <h2 className="mt-2 font-serif text-4xl font-light italic text-foreground sm:text-5xl">
            Our Story
          </h2>
          <GoldDivider className="mt-4" />
        </div>

        <div className="grid lg:grid-cols-[1fr_280px] lg:gap-12">
          {/* Stacked Cards List */}
          <div className="flex flex-col" style={{ gap: '80vh' }}>
            {storyChapters.map((chapter, i) => (
              <div
                key={chapter.label}
                ref={(el) => {
                  itemRefs.current[i] = el
                }}
                className="story-card-item sticky overflow-hidden rounded-3xl border border-accent/40 bg-card shadow-[0_20px_50px_-15px_rgba(0,0,0,0.15)]"
                style={{
                  top: `${80 + i * 20}px`,
                  zIndex: i + 1,
                }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2">
                  {/* Figure / Image */}
                  <div className="relative h-52 w-full overflow-hidden bg-card/50 sm:h-64 md:h-full">
                    <Image
                      src={chapter.image || '/placeholder.svg'}
                      alt={chapter.label}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover transition-transform duration-700 hover:scale-105"
                      priority={i === 0}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-card/20" />
                  </div>

                  {/* Info / Description */}
                  <div className="flex flex-col justify-center p-5 sm:p-8">
                    <span className="mb-1 font-serif text-[0.7rem] italic tracking-widest text-accent-foreground uppercase">
                      Chapter {String(i + 1).padStart(2, '0')}
                    </span>
                    <h3 className="font-serif text-xl font-semibold text-foreground sm:text-2xl">
                      {chapter.label}
                    </h3>
                    <p className="mt-2 font-sans text-xs leading-relaxed text-muted-foreground sm:text-sm">
                      {chapter.description ||
                        'A magical moment in our journey together leading up to our forever.'}
                    </p>
                    <div className="mt-4 flex items-center gap-2 text-[0.7rem] font-medium tracking-wider text-accent uppercase">
                      <span>Memory #{i + 1}</span>
                      <span className="h-px w-8 bg-accent/40" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right Sticky Heart Timeline */}
          <div className="hidden lg:block">
            <div className="sticky top-28 pt-4">
              <div className="relative flex flex-col justify-center gap-8 rounded-2xl border border-accent/20 bg-card/60 p-6 backdrop-blur-sm">
                <span
                  aria-hidden="true"
                  className="absolute bottom-10 left-[41px] top-10 w-[2px] rounded-full bg-accent/20"
                />

                {storyChapters.map((c, i) => {
                  const reached = i <= active
                  return (
                    <div key={c.label} className="relative flex items-center gap-4">
                      <HeartMark filled={reached} active={i === active} />
                      <div>
                        <p
                          className={`font-serif text-xs tracking-[0.2em] transition-colors duration-300 ${
                            reached
                              ? 'text-accent-foreground'
                              : 'text-muted-foreground/50'
                          }`}
                        >
                          CHAPTER {String(i + 1).padStart(2, '0')}
                        </p>
                        <p
                          className={`mt-0.5 line-clamp-1 font-serif text-sm transition-all duration-300 ${
                            i === active
                              ? 'font-medium italic text-foreground'
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
        </div>
      </div>
    </section>
  )
}

