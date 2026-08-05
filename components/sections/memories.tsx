'use client'

import { AnimatePresence, motion } from 'motion/react'
import Image from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Eyebrow, GoldDivider, Petals } from '@/components/decor'
import { HeartNavButton } from '@/components/heart-nav-button'
import { MediaLightbox } from '@/components/media-lightbox'
import { memories } from '@/lib/wedding-config'

/** Images only in the ring — the video entries stay in wedding-config. */
const items = memories.filter((m) => m.type === 'image')
const COUNT = items.length
const ANGLE = 360 / COUNT
/** Degrees per second — one slow, never-ending revolution. */
const SPEED = 7.5

/** A long perspective keeps the front card from being blown up so much that
 *  it swallows its neighbours on screen. */
const PERSPECTIVE = 2200

/** Card + ring geometry per breakpoint (mobile first).
 *  The radius comes from the card width so neighbouring cards never touch:
 *  the chord between two cards is 2 * radius * sin(ANGLE / 2), and we keep
 *  that wider than a card by GAP_FACTOR. */
const GAP_FACTOR = 1.16
const chordRadius = (w: number) =>
  Math.round((w * GAP_FACTOR) / (2 * Math.sin((ANGLE * Math.PI) / 360)))

/** How much the nearest card is magnified by the perspective projection —
 *  used to reserve enough stage height for it. */
const frontScale = (radius: number) => PERSPECTIVE / (PERSPECTIVE - radius)

function geo(w: number, h: number) {
  const radius = chordRadius(w)
  return {
    w,
    h,
    radius,
    /* frame + padding + floor reflection, magnified by the projection, plus
       a little extra for the keystone of the two half-turned front cards, so
       the ring never bleeds into the caption below. */
    stage: Math.round((h + 26 + h * 0.3) * frontScale(radius) * 1.16),
  }
}

const SIZES = {
  xs: geo(126, 164),
  sm: geo(162, 210),
  lg: geo(198, 256),
}

const EDGE = 'oklch(0.88 0.03 238 / 0.5)'
const EDGE_ACTIVE = 'var(--gold)'

export function Memories() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [open, setOpen] = useState(false)
  const [size, setSize] = useState(SIZES.xs)
  const [failed, setFailed] = useState<Record<string, boolean>>({})

  // Spin state lives in refs so the rAF loop never re-renders React.
  const ringRef = useRef<HTMLDivElement | null>(null)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])
  const flipRefs = useRef<(HTMLDivElement | null)[]>([])
  const frameRefs = useRef<(HTMLDivElement | null)[]>([])
  const sizeRef = useRef(SIZES.xs)
  const base = useRef(0) // endless drift
  const nudge = useRef(0) // eased offset from arrows/dots
  const nudgeTo = useRef(0)
  const dragBy = useRef(0) // live finger offset
  const holdRef = useRef(false) // paused only while actually dragging
  const openRef = useRef(false)
  const activeRef = useRef(0)
  const pointer = useRef<{ id: number; x: number; moved: boolean } | null>(null)

  useEffect(() => {
    const sm = window.matchMedia('(min-width: 480px)')
    const lg = window.matchMedia('(min-width: 1024px)')
    const apply = () => {
      const next = lg.matches ? SIZES.lg : sm.matches ? SIZES.sm : SIZES.xs
      sizeRef.current = next
      setSize(next)
    }
    apply()
    sm.addEventListener('change', apply)
    lg.addEventListener('change', apply)
    return () => {
      sm.removeEventListener('change', apply)
      lg.removeEventListener('change', apply)
    }
  }, [])

  useEffect(() => {
    openRef.current = open
  }, [open])

  /* ── the endless spin ──────────────────────────────────────── */
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    let raf = 0
    let last = performance.now()

    const frame = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05)
      last = now

      if (!holdRef.current && !openRef.current && !reduced.matches) {
        base.current -= SPEED * dt
      }
      nudge.current += (nudgeTo.current - nudge.current) * Math.min(1, dt * 5)

      const rot = base.current + nudge.current + dragBy.current
      const { w, radius } = sizeRef.current

      if (ringRef.current) {
        ringRef.current.style.transform = `translateX(-50%) rotateY(${rot}deg)`
      }

      for (let i = 0; i < COUNT; i++) {
        const el = cardRefs.current[i]
        if (!el) continue
        const rad = ((i * ANGLE + rot) * Math.PI) / 180
        const cos = Math.cos(rad) // +1 = front of ring, -1 = far back
        const front = cos > 0
        const depth = Math.abs(cos)

        el.style.width = `${w}px`
        el.style.marginLeft = `${-w / 2}px`
        // Depth scale: nearest card is biggest, far side stays visible.
        el.style.transform = `rotateY(${i * ANGLE}deg) translateZ(${radius}px) scale(${(
          0.82 + 0.18 * cos
        ).toFixed(3)})`
        // Far-side cards keep showing through instead of disappearing.
        el.style.opacity = (
          front ? 0.5 + 0.5 * depth ** 1.2 : 0.2 + 0.16 * depth
        ).toFixed(3)
        el.style.filter = `brightness(${(front ? 0.86 + 0.14 * depth : 0.94).toFixed(
          3,
        )}) saturate(${front ? 1 : 0.7})`
        el.style.zIndex = String(Math.round(cos * 100) + 200)
        el.style.pointerEvents = cos > 0.3 ? 'auto' : 'none'

        // Flip the far-side faces back toward the viewer so their photos
        // read correctly instead of appearing mirrored.
        const flip = flipRefs.current[i]
        if (flip) flip.style.transform = front ? 'none' : 'rotateY(180deg)'

        const fr = frameRefs.current[i]
        if (fr) fr.style.borderColor = cos > 0.86 ? EDGE_ACTIVE : EDGE
      }

      const idx = ((Math.round(-rot / ANGLE) % COUNT) + COUNT) % COUNT
      if (idx !== activeRef.current) {
        activeRef.current = idx
        setActiveIndex(idx)
      }

      raf = requestAnimationFrame(frame)
    }

    raf = requestAnimationFrame(frame)
    return () => cancelAnimationFrame(raf)
  }, [])

  const active = items[activeIndex]

  const go = useCallback((step: number) => {
    nudgeTo.current -= step * ANGLE
  }, [])

  const goTo = useCallback((i: number) => {
    let delta = (((i - activeRef.current) % COUNT) + COUNT) % COUNT
    if (delta > COUNT / 2) delta -= COUNT
    nudgeTo.current -= delta * ANGLE
  }, [])

  function onPointerDown(e: React.PointerEvent) {
    pointer.current = { id: e.pointerId, x: e.clientX, moved: false }
    holdRef.current = true
  }
  function onPointerMove(e: React.PointerEvent) {
    if (pointer.current?.id !== e.pointerId) return
    const dx = e.clientX - pointer.current.x
    if (Math.abs(dx) > 4) pointer.current.moved = true
    dragBy.current = dx * 0.3
  }
  function onPointerUp(e: React.PointerEvent) {
    if (pointer.current?.id !== e.pointerId) return
    // Fold the drag into the drift so the ring carries on from where it is.
    base.current += dragBy.current
    dragBy.current = 0
    pointer.current = null
    holdRef.current = false
  }

  return (
    <section
      id="memories"
      className="relative isolate w-full overflow-hidden px-4 py-20 sm:px-8 sm:py-28"
      /* background intentionally unchanged */
      style={{
        background:
          'radial-gradient(100% 60% at 85% 0%, oklch(0.99 0.02 90) 0%, oklch(0.96 0.022 235) 45%, oklch(0.91 0.042 238) 100%)',
      }}
    >
      <Petals count={12} />

      <div className="relative z-10 mx-auto max-w-6xl">
        <header className="text-center">
          <Eyebrow>LOVE IN FRAMES</Eyebrow>
          <h2 className="mt-4 font-serif text-4xl font-light italic text-foreground sm:text-6xl lg:text-7xl">
            Timeless Memories
          </h2>
          <GoldDivider className="mt-5 justify-center" />
          <p className="mx-auto mt-5 max-w-sm text-pretty text-sm leading-relaxed text-muted-foreground sm:max-w-md">
            Together, we've created countless beautiful memories that have led us to this special day. We are delighted to share the beginning of our forever with you.
          </p>
        </header>

        {/* ── 3D ring stage ────────────────────────────────────── */}
        <div
          role="group"
          aria-label="Memory carousel"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'ArrowLeft') go(-1)
            if (e.key === 'ArrowRight') go(1)
          }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          className="relative mt-24 cursor-grab touch-pan-y select-none outline-none active:cursor-grabbing sm:mt-32 lg:mt-36"
          style={{ height: size.stage, perspective: PERSPECTIVE }}
        >
          {/* stage floor glow */}
          <div
            aria-hidden="true"
            className="absolute inset-x-0 bottom-10 mx-auto h-20 max-w-xl rounded-[100%] opacity-40 blur-2xl"
            style={{
              background:
                'radial-gradient(60% 100% at 50% 50%, var(--gold-soft), transparent 70%)',
            }}
          />

          <div
            ref={ringRef}
            className="absolute left-1/2 top-2"
            style={{ transformStyle: 'preserve-3d', willChange: 'transform' }}
          >
            {items.map((m, i) => (
              <div
                key={m.id}
                ref={(el) => {
                  cardRefs.current[i] = el
                }}
                className="absolute top-0"
                style={{
                  width: size.w,
                  marginLeft: -size.w / 2,
                  transformStyle: 'preserve-3d',
                  willChange: 'transform, opacity',
                }}
              >
                <div
                  ref={(el) => {
                    flipRefs.current[i] = el
                  }}
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  <button
                    type="button"
                    onClick={() => {
                      if (pointer.current?.moved) return
                      if (i === activeRef.current) setOpen(true)
                      else goTo(i)
                    }}
                    aria-label={`Open ${m.title}`}
                    className="block w-full text-left"
                  >
                    <div
                      ref={(el) => {
                        frameRefs.current[i] = el
                      }}
                      className="relative overflow-hidden rounded-2xl border bg-card p-2 shadow-[0_36px_64px_-30px_var(--stage-shadow)]"
                      style={{ borderColor: EDGE }}
                    >
                      <div
                        className="relative w-full overflow-hidden rounded-xl"
                        style={{
                          height: size.h,
                          background:
                            'linear-gradient(160deg, oklch(0.93 0.035 236), oklch(0.87 0.05 88 / 0.5))',
                        }}
                      >
                        {failed[m.id] ? (
                          <div className="flex h-full items-center justify-center px-3">
                            <span className="font-serif text-base italic text-muted-foreground">
                              {m.title}
                            </span>
                          </div>
                        ) : (
                          <Image
                            src={m.src || '/placeholder.svg'}
                            alt=""
                            fill
                            sizes="(max-width: 480px) 45vw, (max-width: 1024px) 40vw, 240px"
                            className="object-cover"
                            onError={() =>
                              setFailed((f) => ({ ...f, [m.id]: true }))
                            }
                            priority={i < 2}
                          />
                        )}
                        {/* caption printed over the photo */}
                        <div
                          aria-hidden="true"
                          className="absolute inset-x-0 bottom-0 h-2/5"
                          style={{
                            background:
                              'linear-gradient(to top, oklch(0.26 0.05 250 / 0.78), transparent)',
                          }}
                        />
                        <div className="absolute inset-x-0 bottom-0 flex items-baseline justify-between gap-2 px-3 pb-2.5">
                          <p className="truncate font-serif text-sm italic text-primary-foreground sm:text-base">
                            {m.title}
                          </p>
                          {m.year && (
                            <span className="shrink-0 font-mono text-[0.55rem] tracking-[0.22em] text-accent sm:text-[0.6rem]">
                              {m.year}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* floor reflection */}
                    <div
                      aria-hidden="true"
                      className="relative mt-1 overflow-hidden rounded-xl opacity-20"
                      style={{
                        height: size.h * 0.26,
                        transform: 'scaleY(-1)',
                        maskImage:
                          'linear-gradient(to top, transparent 6%, oklch(0 0 0) 100%)',
                        WebkitMaskImage:
                          'linear-gradient(to top, transparent 6%, oklch(0 0 0) 100%)',
                      }}
                    >
                      {!failed[m.id] && (
                        <Image
                          src={m.src || '/placeholder.svg'}
                          alt=""
                          fill
                          sizes="(max-width: 480px) 45vw, 240px"
                          className="object-cover object-bottom"
                        />
                      )}
                    </div>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* fade the reflections into the stage floor */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 -bottom-6 mx-auto h-28 max-w-4xl blur-md"
            style={{
              background:
                'linear-gradient(to top, oklch(0.91 0.042 238) 35%, transparent 100%)',
            }}
          />
        </div>

        {/* ── active caption ───────────────────────────────────── */}
        <div className="relative mt-6 min-h-36 text-center sm:mt-8 sm:min-h-32">
          <AnimatePresence mode="wait">
            <motion.div
              key={active.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              {active.year && (
                <p className="font-mono text-[0.6rem] uppercase tracking-[0.4em] text-accent-foreground">
                  {active.year}
                </p>
              )}
              <h3 className="mt-3 font-serif text-2xl italic text-foreground sm:text-3xl">
                {active.title}
              </h3>
              {active.caption && (
                <p className="mx-auto mt-2 max-w-md text-pretty px-2 text-sm leading-relaxed text-muted-foreground">
                  {active.caption}
                </p>
              )}
              {active.meta && (
                <p className="mt-2 font-mono text-[0.65rem] tracking-[0.16em] text-muted-foreground/70">
                  {active.meta}
                </p>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── controls ─────────────────────────────────────────── */}
        <div className="mt-8 flex items-center justify-center gap-5 sm:gap-6">
          <HeartNavButton
            label="Previous memory"
            onClick={() => go(-1)}
            dir="left"
          />

          <ul className="flex items-center gap-2.5 sm:gap-3">
            {items.map((m, i) => (
              <li key={m.id}>
                <button
                  type="button"
                  onClick={() => goTo(i)}
                  aria-label={`Show ${m.title}`}
                  className={`block rotate-45 transition-all duration-500 ${
                    activeIndex === i
                      ? 'size-2 bg-accent'
                      : 'size-1.5 bg-accent/30 hover:bg-accent/60'
                  }`}
                />
              </li>
            ))}
          </ul>

          <HeartNavButton label="Next memory" onClick={() => go(1)} dir="right" />
        </div>

        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="rounded-full border border-accent/50 px-6 py-3 text-[0.62rem] uppercase tracking-[0.3em] text-accent-foreground transition-colors hover:bg-accent hover:text-primary-foreground sm:px-7 sm:text-[0.65rem]"
          >
            View full size
          </button>
        </div>
      </div>

      <MediaLightbox
        item={open ? active : null}
        onClose={() => setOpen(false)}
        onPrev={() => go(-1)}
        onNext={() => go(1)}
      />
    </section>
  )
}
