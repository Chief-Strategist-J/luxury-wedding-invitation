import { AnimatePresence, motion } from 'motion/react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { GoldDivider, Petals, Sparkles } from '@/components/decor'
import { useMusic } from '@/components/music-provider'

type Spark = { id: number; x: number; y: number; a: number; d: number }

/** Little sparkle trail that follows every tap / scroll (website-style magic dust) */
function useTouchSparkles() {
  const [sparks, setSparks] = useState<Spark[]>([])
  const idRef = useRef(0)

  const spawn = useCallback((x: number, y: number, count = 10) => {
    const batch: Spark[] = Array.from({ length: count }).map((_, i) => ({
      id: idRef.current++,
      x,
      y,
      a: (i / count) * Math.PI * 2 + Math.random(),
      d: 26 + Math.random() * 46,
    }))
    setSparks((s) => [...s.slice(-60), ...batch])
    window.setTimeout(() => {
      setSparks((s) => s.filter((k) => !batch.some((b) => b.id === k.id)))
    }, 1100)
  }, [])

  useEffect(() => {
    const onDown = (e: PointerEvent) => spawn(e.clientX, e.clientY, 12)
    const onScroll = () =>
      spawn(
        window.innerWidth * (0.2 + Math.random() * 0.6),
        window.innerHeight * (0.15 + Math.random() * 0.7),
        6,
      )
    window.addEventListener('pointerdown', onDown)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('touchmove', onScroll, { passive: true })
    return () => {
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('touchmove', onScroll)
    }
  }, [spawn])

  const layer = (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[90]">
      {sparks.map((s) => (
        <motion.span
          key={s.id}
          className="absolute size-1.5 rounded-full"
          style={{
            left: s.x,
            top: s.y,
            background: 'oklch(0.95 0.07 88)',
            boxShadow: '0 0 8px 2px oklch(0.9 0.09 86 / 0.85)',
          }}
          initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
          animate={{
            x: Math.cos(s.a) * s.d,
            y: Math.sin(s.a) * s.d - 14,
            opacity: 0,
            scale: 0.3,
          }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      ))}
    </div>
  )

  return layer
}

/**
 * Screen 2 + 3: locked invitation (heart lock) and the cinematic 3D opening.
 * NOTHING is revealed here — no names, no date, no countdown.
 *
 * Only ONE unlock animation plays: the card cover swinging open (with its
 * own unlocking A&K heart). The base card stays visible underneath (just
 * non-interactive) so nothing disappears, and neither the button nor the
 * flap ever shows an "Opening..." label — only the swing itself communicates it.
 * underneath simply goes still and fades slightly the moment it's tapped,
 * so nothing duplicates once the flap swings away.
 */
export function LockedInvitation({ onOpened }: { onOpened: () => void }) {
  const [opening, setOpening] = useState(false)
  const { start } = useMusic()
  const sparkleLayer = useTouchSparkles()

  function handleOpen() {
    if (opening) return
    setOpening(true)
    start() // music begins here — never on load
    // swing plays for ~3s total (0.55s delay + 3.2s swing), then hand off to the next page
    setTimeout(onOpened, 3000)
  }

  return (
    <motion.div
      className="fixed inset-0 z-[60] overflow-hidden"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      style={{
        background:
          'transparent',
        perspective: '1400px',
      }}
    >
      <Petals count={16} />
      <Sparkles count={16} />
      {sparkleLayer}

      {/* golden light burst during opening */}
      <AnimatePresence>
        {opening && (
          <motion.div
            className="pointer-events-none absolute inset-0 z-30"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.95, 0.35] }}
            transition={{ duration: 2.4, times: [0, 0.55, 1] }}
            style={{
              background:
                'radial-gradient(60% 45% at 50% 52%, oklch(0.97 0.07 88 / 0.95) 0%, transparent 70%)',
            }}
          />
        )}
      </AnimatePresence>

      {/* wider side padding here (px-8) is what gives the card real breathing room on phones */}
      <div className="relative z-20 flex h-full items-center justify-center px-8 py-8">
        <motion.div
          className="relative w-full max-w-[19rem]"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* ─ invitation card — natural height instead of a forced square, so it isn't overly tall ─
              stays visible (just non-interactive) while the flap swings open on top,
              so the "Tap to Open" card itself is never removed from view. */}
          <motion.div
            className="relative flex flex-col items-center justify-center overflow-hidden rounded-2xl border border-accent/35 px-8 py-9 shadow-[0_40px_90px_-40px_oklch(0.55_0.07_240/0.55)]"
            style={{
              background:
                'radial-gradient(115% 80% at 50% 8%, oklch(0.995 0.006 90) 0%, oklch(0.955 0.022 235) 42%, oklch(0.885 0.045 238) 100%)',
              pointerEvents: opening ? 'none' : 'auto',
            }}
          >
            {/* soft glow behind the heart lock */}
            <div
              aria-hidden="true"
              className="absolute left-1/2 top-[34%] size-48 -translate-x-1/2 -translate-y-1/2 rounded-full blur-2xl"
              style={{
                background:
                  'radial-gradient(circle, oklch(0.93 0.06 88 / 0.6), transparent 70%)',
              }}
            />

            {/* ─ heart lock: tap the lock itself to open ─ */}
            <div style={{ perspective: '700px' }}>
              <motion.button
                type="button"
                onClick={handleOpen}
                disabled={opening}
                aria-label="Tap the heart lock to open the invitation"
                className="relative block rounded-full outline-none focus-visible:ring-2 focus-visible:ring-accent/70"
                style={{ transformStyle: 'preserve-3d' }}
                whileTap={{ scale: 0.94 }}
                animate={
                  opening
                    ? { y: 0, scale: 1 }
                    : { y: [0, -7, 0], scale: [1, 1.03, 1] }
                }
                transition={
                  opening
                    ? { duration: 0.4 }
                    : {
                        duration: 3.4,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: 'easeInOut',
                      }
                }
              >
                <HeartLock opening={opening} />
              </motion.button>
            </div>

            <div className="relative mt-6 text-center">
              <p className="font-serif text-[1.4rem] font-light italic leading-snug text-foreground/85">
                A Beautiful Story Awaits...
              </p>
              <GoldDivider className="mt-4" />
            </div>

            {/* TAP TO OPEN (same action as tapping the lock) — fades away once
                opening starts instead of relabeling to "Opening", so the flap's
                own text is the only "opening" message shown */}
            <motion.div
              className="mt-6 flex justify-center"
              animate={{ opacity: opening ? 0 : 1 }}
              transition={{ duration: 0.4 }}
            >
              <button
                type="button"
                onClick={handleOpen}
                disabled={opening}
                className="group relative overflow-hidden rounded-full border border-accent/60 bg-gradient-to-b from-[oklch(0.95_0.05_88)] to-[oklch(0.86_0.08_82)] px-8 py-3.5 text-[0.68rem] font-medium uppercase tracking-[0.34em] text-accent-foreground shadow-[0_14px_30px_-14px_oklch(0.7_0.09_82/0.8)] transition-transform active:scale-[0.97] disabled:opacity-70"
                style={{ animation: 'soft-glow 2.8s ease-in-out infinite' }}
              >
                <span className="relative z-10">Tap to Open</span>
                <span
                  aria-hidden="true"
                  className="absolute inset-y-0 w-1/3 bg-white/45 blur-md"
                  style={{ animation: 'shimmer-sweep 3.2s ease-in-out infinite' }}
                />
              </button>
            </motion.div>
          </motion.div>

          {/* ─ card cover that swings open in 3D — shows the A&K heart lock unlocking
              + the same message. This is the ONLY unlock animation shown. ─ */}
          <AnimatePresence>
            {opening && (
              <motion.div
                className="absolute inset-0 origin-left overflow-hidden rounded-2xl border border-accent/50 bg-gradient-to-br from-[oklch(0.94_0.03_235)] via-[oklch(0.98_0.012_90)] to-[oklch(0.9_0.045_238)] px-8 py-9 shadow-[0_30px_70px_-30px_oklch(0.5_0.08_240/0.6)]"
                initial={{ rotateY: 0 }}
                animate={{ rotateY: -155 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 3.2, delay: 0.55, ease: [0.65, 0, 0.35, 1] }}
                style={{ transformStyle: 'preserve-3d', backfaceVisibility: 'hidden' }}
              >
                <div className="flex h-full flex-col items-center justify-center gap-5 text-center">
                  <OpeningHeartLock />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
  )
}

/* ── Golden HEART lock with A&K monogram — always the idle/static version now,
   the unlocking motion lives only in OpeningHeartLock inside the flap ─────── */
function HeartLock({ opening }: { opening: boolean }) {
  return (
    <div className="relative flex flex-col items-center">
      {/* shackle — pops open the moment the card is tapped, so the heart
          reads as unlocked here too (matching the flap's unlocked heart) */}
      <motion.div
        className="relative z-0 h-9 w-12 rounded-t-full border-[5px] border-b-0"
        style={{
          borderColor: 'oklch(0.82 0.09 82)',
          boxShadow: 'inset 0 2px 3px oklch(1 0 0 / 0.7)',
          transformOrigin: 'right bottom',
        }}
        animate={
          opening
            ? { rotate: -55, x: 9, y: -7 }
            : { rotate: 0, x: 0, y: 0 }
        }
        transition={{ duration: 0.6, ease: 'easeInOut' }}
      />

      {/* heart body */}
      <div className="relative -mt-2 size-[7.5rem]">
        <svg viewBox="0 0 100 100" className="size-full" aria-hidden="true">
          <defs>
            <linearGradient id="heartGold" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="oklch(0.97 0.05 90)" />
              <stop offset="45%" stopColor="oklch(0.86 0.09 82)" />
              <stop offset="100%" stopColor="oklch(0.74 0.1 74)" />
            </linearGradient>
          </defs>
          <path
            d="M50 92S8 66 8 38.5C8 24 18.5 15 30 15c8.5 0 15.5 4.8 20 12 4.5-7.2 11.5-12 20-12 11.5 0 22 9 22 23.5C92 66 50 92 50 92z"
            fill="url(#heartGold)"
            stroke="oklch(0.7 0.09 74 / 0.7)"
            strokeWidth="1.2"
          />
          {/* inner outline */}
          <path
            d="M50 84S16 62 16 39.5C16 28.5 24 21.5 32 21.5c6.5 0 12 4 18 11 6-7 11.5-11 18-11 8 0 16 7 16 18C84 62 50 84 50 84z"
            fill="none"
            stroke="oklch(1 0 0 / 0.55)"
            strokeWidth="1"
          />
          {/* highlight */}
          <ellipse
            cx="34"
            cy="35"
            rx="9"
            ry="6"
            fill="oklch(1 0 0 / 0.45)"
            transform="rotate(-25 34 35)"
          />
          {/* A & K monogram */}
          <text
            x="50"
            y="58"
            textAnchor="middle"
            fontFamily="'Cormorant Garamond', serif"
            fontSize="27"
            fill="oklch(0.42 0.06 68)"
            letterSpacing="1"
          >
            A
            <tspan fontSize="17" fill="oklch(0.55 0.07 70)" dx="1">
              &amp;
            </tspan>
            <tspan dx="1">K</tspan>
          </text>
          {/* tiny keyhole — stem disappears once unlocked, matching the flap's open look */}
          <circle cx="50" cy="68" r="3.2" fill="oklch(0.55 0.07 70)" />
          {!opening && (
            <path
              d="M50 70.5v5"
              stroke="oklch(0.55 0.07 70)"
              strokeWidth="2.6"
              strokeLinecap="round"
            />
          )}
        </svg>
      </div>
    </div>
  )
}

/* ── A&K heart lock shown inside the flap while it swings open — shackle springs undone ── */
function OpeningHeartLock() {
  return (
    <div className="relative flex flex-col items-center">
      {/* soft glow */}
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-1/2 size-40 -translate-x-1/2 -translate-y-1/2 rounded-full blur-2xl"
        style={{
          background: 'radial-gradient(circle, oklch(0.93 0.06 88 / 0.55), transparent 70%)',
        }}
      />

      {/* shackle popping open */}
      <motion.div
        className="relative z-0 h-9 w-12 rounded-t-full border-[5px] border-b-0"
        style={{
          borderColor: 'oklch(0.82 0.09 82)',
          boxShadow: 'inset 0 2px 3px oklch(1 0 0 / 0.7)',
          transformOrigin: 'right bottom',
        }}
        initial={{ rotate: 0, x: 0, y: 0 }}
        animate={{ rotate: [0, -12, -55], x: [0, 2, 8], y: [0, -1, -6] }}
        transition={{ duration: 1.6, delay: 0.5, times: [0, 0.35, 1], ease: 'easeInOut' }}
      />

      {/* heart body */}
      <motion.div
        className="relative -mt-2 size-[7.5rem]"
        initial={{ scale: 0.9, opacity: 0.6 }}
        animate={{ scale: [0.9, 1.08, 1], opacity: 1 }}
        transition={{ duration: 1.6, delay: 0.75, ease: [0.34, 1.56, 0.64, 1] }}
      >
        <svg viewBox="0 0 100 100" className="size-full" aria-hidden="true">
          <defs>
            <linearGradient id="openingHeartGold" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="oklch(0.97 0.05 90)" />
              <stop offset="45%" stopColor="oklch(0.86 0.09 82)" />
              <stop offset="100%" stopColor="oklch(0.74 0.1 74)" />
            </linearGradient>
          </defs>
          <path
            d="M50 92S8 66 8 38.5C8 24 18.5 15 30 15c8.5 0 15.5 4.8 20 12 4.5-7.2 11.5-12 20-12 11.5 0 22 9 22 23.5C92 66 50 92 50 92z"
            fill="url(#openingHeartGold)"
            stroke="oklch(0.7 0.09 74 / 0.7)"
            strokeWidth="1.2"
          />
          <path
            d="M50 84S16 62 16 39.5C16 28.5 24 21.5 32 21.5c6.5 0 12 4 18 11 6-7 11.5-11 18-11 8 0 16 7 16 18C84 62 50 84 50 84z"
            fill="none"
            stroke="oklch(1 0 0 / 0.55)"
            strokeWidth="1"
          />
          <ellipse
            cx="34"
            cy="35"
            rx="9"
            ry="6"
            fill="oklch(1 0 0 / 0.45)"
            transform="rotate(-25 34 35)"
          />
          <text
            x="50"
            y="58"
            textAnchor="middle"
            fontFamily="'Cormorant Garamond', serif"
            fontSize="27"
            fill="oklch(0.42 0.06 68)"
            letterSpacing="1"
          >
            A
            <tspan fontSize="17" fill="oklch(0.55 0.07 70)" dx="1">
              &amp;
            </tspan>
            <tspan dx="1">K</tspan>
          </text>
          {/* keyhole open (no bottom stem — unlocked look) */}
          <circle cx="50" cy="68" r="3.2" fill="oklch(0.55 0.07 70)" />
        </svg>
      </motion.div>
    </div>
  )
}