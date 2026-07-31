'use client'

import { AnimatePresence, motion } from 'motion/react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { GoldDivider } from '@/components/decor'
import { wedding, weddingDateParts } from '@/lib/wedding-config'

/* ── heart geometry, reused as the scratch mask ── */
const HEART_PATH =
  'M50 92C50 92 8 66 8 38.5 8 24.4 18.6 15 30.6 15c8.4 0 15.3 4.7 19.4 11.7C54.1 19.7 61 15 69.4 15 81.4 15 92 24.4 92 38.5 92 66 50 92 50 92Z'

const HEART_MASK = `url("data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path d="${HEART_PATH}" fill="#000"/></svg>`,
)}")`

const MONTHS_SHORT = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]

function shortMonth(raw: string | number) {
  const s = String(raw).trim()
  const asNum = Number(s)
  if (!Number.isNaN(asNum) && asNum >= 1 && asNum <= 12) return MONTHS_SHORT[asNum - 1]
  const hit = MONTHS_SHORT.find((m) => s.toLowerCase().startsWith(m.toLowerCase()))
  return hit ?? s.slice(0, 3)
}

function monthIndex(raw: string | number) {
  const s = String(raw).trim()
  const asNum = Number(s)
  if (!Number.isNaN(asNum) && asNum >= 1 && asNum <= 12) return asNum - 1
  const i = MONTHS_SHORT.findIndex((m) => s.toLowerCase().startsWith(m.toLowerCase()))
  return i < 0 ? 0 : i
}

/* the wedding moment, rebuilt from the configured date parts */
function weddingTarget() {
  return new Date(
    Number(weddingDateParts.year),
    monthIndex(weddingDateParts.month),
    Number(weddingDateParts.day),
    10,
    0,
    0,
  ).getTime()
}

function splitRemaining(ms: number) {
  const clamped = Math.max(0, ms)
  const s = Math.floor(clamped / 1000)
  return {
    days: Math.floor(s / 86400),
    hours: Math.floor((s % 86400) / 3600),
    minutes: Math.floor((s % 3600) / 60),
    seconds: s % 60,
  }
}

/* ── live countdown, shown under the revealed date ── */
function DateCountdown() {
  const [left, setLeft] = useState(() => splitRemaining(weddingTarget() - Date.now()))

  useEffect(() => {
    const target = weddingTarget()
    const id = window.setInterval(
      () => setLeft(splitRemaining(target - Date.now())),
      1000,
    )
    return () => window.clearInterval(id)
  }, [])

  const cells = [
    { v: left.days, l: 'Days' },
    { v: left.hours, l: 'Hrs' },
    { v: left.minutes, l: 'Min' },
    { v: left.seconds, l: 'Sec' },
  ]

  return (
    <motion.div
      className="mt-6 flex flex-col items-center"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
    >
      <p
        className="text-[0.58rem] uppercase tracking-[0.34em]"
        style={{ color: 'oklch(0.55 0.07 70)' }}
      >
        Counting Every Heartbeat
      </p>
      <div className="mt-3 flex items-stretch gap-2 sm:gap-3">
        {cells.map((c, i) => (
          <motion.div
            key={c.l}
            className="flex min-w-[3.4rem] flex-col items-center rounded-xl border px-3 py-2 backdrop-blur-sm sm:min-w-[3.9rem]"
            initial={{ opacity: 0, scale: 0.86 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.45 + i * 0.09, duration: 0.6 }}
            style={{
              borderColor: 'oklch(0.82 0.09 82 / 0.8)',
              background:
                'linear-gradient(160deg, oklch(1 0 0 / 0.78), oklch(0.93 0.05 84 / 0.6))',
              boxShadow: '0 10px 24px -18px oklch(0.6 0.09 74 / 0.75)',
            }}
          >
            <span
              className="font-serif text-xl font-light leading-none tabular-nums sm:text-2xl"
              style={{ color: 'oklch(0.42 0.06 68)' }}
            >
              {String(c.v).padStart(2, '0')}
            </span>
            <span
              className="mt-1 text-[0.44rem] uppercase tracking-[0.22em]"
              style={{ color: 'oklch(0.55 0.07 70)' }}
            >
              {c.l}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
/* golden confetti burst, fired from the left/right edge once the date is fully revealed */
function CelebrationBurst({ side, top = '40%' }: { side: 'left' | 'right'; top?: string }) {
  const dirSign = side === 'left' ? 1 : -1
  const originX = side === 'left' ? '4%' : '96%'
  const shapes = ['❀', '✦', '✧', '●', '❁', '✺']
  const colors = [
    'var(--gold)',
    'oklch(0.66 0.14 38)',
    'oklch(0.82 0.09 82)',
    'oklch(0.62 0.16 18)',
    'oklch(0.88 0.07 90)',
  ]

  const particles = useMemo(
    () =>
      Array.from({ length: 18 }).map((_, i) => {
        const angle = (Math.random() * 110 - 55) * (Math.PI / 180)
        const dist = 110 + Math.random() * 190
        return {
          x: Math.cos(angle) * dist * dirSign,
          y: -Math.abs(Math.sin(angle) * dist) - Math.random() * 50,
          drop: 50 + Math.random() * 50,
          delay: Math.random() * 0.3,
          duration: 1.5 + Math.random() * 0.7,
          rotate: dirSign * (110 + Math.random() * 200),
          shape: shapes[i % shapes.length],
          color: colors[i % colors.length],
          scale: 0.7 + Math.random() * 0.6,
        }
      }),
    [dirSign],
  )

  return (
    <motion.div
      className="pointer-events-none absolute inset-0 z-50 overflow-hidden"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      {particles.map((p, i) => (
        <motion.span
          key={i}
          className="absolute text-lg sm:text-2xl"
          style={{ left: originX, top, color: p.color }}
          initial={{ x: 0, y: 0, opacity: 0, scale: 0.3, rotate: 0 }}
          animate={{
            x: p.x,
            y: [0, p.y, p.y + p.drop],
            opacity: [0, 1, 1, 0],
            scale: [0.3, p.scale, p.scale * 0.9],
            rotate: p.rotate,
          }}
          transition={{ duration: p.duration, delay: p.delay, ease: 'easeOut' }}
        >
          {p.shape}
        </motion.span>
      ))}
    </motion.div>
  )
}

/*
 * Static background — the revealdate.png template image, shown as-is
 * with no animation, tint, or overlay on top of it.
 */
function RevealBackground() {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 z-0"
      style={{
        backgroundImage: 'url(/media/revealdate.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    />
  )
}

/**
 * Screen 5 — the date lives inside three scratchable hearts.
 * Names stay visible; when all three hearts are scratched the story
 * continues on its own (no button, no scroll prompt).
 */
export function ScratchReveal({
  onDone,
  embedded = false,
}: {
  onDone: () => void
  embedded?: boolean
}) {
  const [open, setOpen] = useState<[boolean, boolean, boolean]>([false, false, false])
  const allOpen = open.every(Boolean)
  const doneRef = useRef(false)
  const [burstKey, setBurstKey] = useState(0)

  const markOpen = useCallback((i: number) => {
    setOpen((prev) => {
      if (prev[i]) return prev
      const next = [...prev] as [boolean, boolean, boolean]
      next[i] = true
      return next
    })
  }, [])

  /* the date is revealed -> a 2nd burst near the countdown at 2s -> onDone at 4s */
  useEffect(() => {
    if (!allOpen || doneRef.current) return
    doneRef.current = true
    const burstTimer = window.setTimeout(() => setBurstKey((k) => k + 1), 2000)
    const doneTimer = window.setTimeout(onDone, 4000)
    return () => {
      window.clearTimeout(burstTimer)
      window.clearTimeout(doneTimer)
    }
  }, [allOpen, onDone])

  const parts = [
    { value: String(weddingDateParts.day), label: 'Day' },
    { value: shortMonth(weddingDateParts.month), label: 'Month' },
    { value: String(weddingDateParts.year), label: 'Year' },
  ]

  return (
    <motion.div
      className={
        embedded
          ? 'absolute inset-0 z-40 flex flex-col items-center justify-start overflow-hidden px-5 pt-12 sm:pt-16'
          : 'fixed inset-0 z-[52] flex flex-col items-center justify-start overflow-hidden px-5 pt-12 sm:pt-16'
      }
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -24 }}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* revealdate.png background, sits behind everything */}
      <RevealBackground />

      {/* celebration bursts: 1st near the hearts (burstKey 0), 2nd near the countdown (burstKey 1) */}
      <AnimatePresence>
        {allOpen && (
          <div key={burstKey}>
            <CelebrationBurst side="left" top={burstKey === 0 ? '40%' : '78%'} />
            <CelebrationBurst side="right" top={burstKey === 0 ? '40%' : '78%'} />
          </div>
        )}
      </AnimatePresence>
      <div className="relative z-10 flex w-full max-w-md flex-col items-center text-center">
        {/* ── || श्री गणेशाय नमः || — golden invocation ── */}
        <motion.p
          className="text-[0.8rem] font-medium tracking-[0.08em] sm:text-base"
          style={{ color: 'var(--gold)' }}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.8 }}
        >
          || श्री गणेशाय नमः ||
        </motion.p>

        {/* ── invitation line, normal (non-gold) text color ── */}
        <motion.p
          className="mt-3 text-[0.62rem] text-muted-foreground tracking-[0.28em] sm:text-xs"
          style={{ color: 'oklch(0.4 0.03 60)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 1, ease: 'easeOut' }}
        >
          You are invited to
          <br />
          the wedding of
        </motion.p>

        {/* ── names: always visible, never scratched ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.9 }}
        >
          <p className="mt-3 font-serif text-[2rem] font-light leading-tight text-foreground drop-shadow-[0_2px_10px_oklch(1_0_0/0.7)] sm:text-4xl">
            {wedding.groom}
            <span className="mx-2" style={{ color: 'oklch(0.74 0.1 76)' }}>
              &hearts;
            </span>
            {wedding.bride}
          </p>
          <GoldDivider className="mt-4" />
          <p className="mt-3 text-[0.7rem] font-medium uppercase tracking-[0.3em] text-gold-gradient">
            {wedding.hashtag}
          </p>
        </motion.div>

        {/* ── the three date hearts, arranged in a V: Day / Month on top, Year below-center ── */}
        <div className="mt-9 flex flex-col items-center">
          <div className="flex items-end justify-center gap-5 sm:gap-8">
            <HeartScratch
              value={parts[0].value}
              label={parts[0].label}
              delay={0.5}
              opened={open[0]}
              onOpen={() => markOpen(0)}
            />
            <HeartScratch
              value={parts[1].value}
              label={parts[1].label}
              delay={0.66}
              opened={open[1]}
              onOpen={() => markOpen(1)}
            />
          </div>
          <div className="-mt-3 sm:-mt-4">
            <HeartScratch
              value={parts[2].value}
              label={parts[2].label}
              delay={0.82}
              opened={open[2]}
              onOpen={() => markOpen(2)}
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          {allOpen ? (
            <motion.div
              key="saved"
              className="flex flex-col items-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9 }}
            >
              <p className="mt-3 font-serif text-lg font-light italic text-foreground/85">
                Save Our Date &mdash; We Cannot Wait...
              </p>
              <DateCountdown />
            </motion.div>
          ) : (
            <motion.p
              key="hint"
              className="mt-7 max-w-[15rem] text-[0.6rem] uppercase leading-relaxed tracking-[0.18em] text-muted-foreground sm:max-w-none sm:text-[0.65rem] sm:tracking-[0.24em]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              Scratch each heart with your finger
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

/* ── a single heart-shaped scratch panel ── */
function HeartScratch({
  value,
  label,
  delay,
  opened,
  onOpen,
}: {
  value: string
  label: string
  delay: number
  opened: boolean
  onOpen: () => void
}) {
  const wrapRef = useRef<HTMLDivElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const drawing = useRef(false)
  const last = useRef<{ x: number; y: number } | null>(null)
  const tick = useRef(0)
  const [progress, setProgress] = useState(0)

  /* golden foil, clipped to the heart by the CSS mask — matches the lock theme */
  const paint = useCallback(
    (canvas: HTMLCanvasElement) => {
      const ctx = canvas.getContext('2d')
      if (!ctx) return
      const { width: w, height: h } = canvas
      ctx.globalCompositeOperation = 'source-over'
      const g = ctx.createLinearGradient(0, 0, w, h)
      g.addColorStop(0, '#faf1d8')
      g.addColorStop(0.35, '#f0dba8')
      g.addColorStop(0.6, '#e6c589')
      g.addColorStop(1, '#d3a95f')
      ctx.fillStyle = g
      ctx.fillRect(0, 0, w, h)

      /* soft sparkles of light instead of the old diagonal lines */
      const rand = (n: number) => {
        const s = Math.sin(n * 12.9898) * 43758.5453
        return s - Math.floor(s)
      }
      for (let i = 0; i < 30; i++) {
        const x = rand(i + 1) * w
        const y = rand(i + 7.3) * h
        const r = 1.4 + rand(i + 3.1) * 3.4
        const halo = ctx.createRadialGradient(x, y, 0, x, y, r * 3.4)
        halo.addColorStop(0, `rgba(255,255,255,${0.5 + rand(i + 5.7) * 0.4})`)
        halo.addColorStop(0.45, 'rgba(255,248,232,0.24)')
        halo.addColorStop(1, 'rgba(255,255,255,0)')
        ctx.fillStyle = halo
        ctx.beginPath()
        ctx.arc(x, y, r * 3.4, 0, Math.PI * 2)
        ctx.fill()

        /* tiny four-point glint */
        ctx.strokeStyle = `rgba(255,255,255,${0.35 + rand(i + 9.4) * 0.4})`
        ctx.lineWidth = 0.9
        ctx.beginPath()
        ctx.moveTo(x - r, y)
        ctx.lineTo(x + r, y)
        ctx.moveTo(x, y - r)
        ctx.lineTo(x, y + r)
        ctx.stroke()
      }

      const sheen = ctx.createLinearGradient(0, h, w, 0)
      sheen.addColorStop(0, 'rgba(255,255,255,0)')
      sheen.addColorStop(0.5, 'rgba(255,255,255,0.5)')
      sheen.addColorStop(0.7, 'rgba(255,255,255,0)')
      ctx.fillStyle = sheen
      ctx.fillRect(0, 0, w, h)

      const c = ctx as CanvasRenderingContext2D & { letterSpacing?: string }
      c.textAlign = 'center'
      c.letterSpacing = '3px'
      c.font = `500 ${Math.max(8, Math.round(w * 0.085))}px Jost, sans-serif`
      c.fillStyle = 'rgba(120,88,42,0.72)'
      c.fillText(label.toUpperCase(), w / 2, h * 0.52)
    },
    [label],
  )

  useEffect(() => {
    const canvas = canvasRef.current
    const wrap = wrapRef.current
    if (!canvas || !wrap) return
    const setup = () => {
      const r = wrap.getBoundingClientRect()
      canvas.width = Math.max(1, Math.round(r.width))
      canvas.height = Math.max(1, Math.round(r.height))
      paint(canvas)
      setProgress(0)
    }
    setup()
    const ro = new ResizeObserver(setup)
    ro.observe(wrap)
    return () => ro.disconnect()
  }, [paint])

  const measure = useCallback(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return
    const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height)
    let clear = 0
    let total = 0
    for (let i = 3; i < data.length; i += 4 * 16) {
      total++
      if (data[i] < 40) clear++
    }
    if (total) setProgress(clear / total)
  }, [])

  useEffect(() => {
    /* just a couple of strokes anywhere on the heart is enough — the rest opens on its own */
    if (!opened && progress >= 0.12) onOpen()
  }, [progress, opened, onOpen])

  const scratch = useCallback((x: number, y: number) => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return
    ctx.globalCompositeOperation = 'destination-out'
    ctx.lineWidth = 34
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    const l = last.current
    if (l) {
      ctx.beginPath()
      ctx.moveTo(l.x, l.y)
      ctx.lineTo(x, y)
      ctx.stroke()
    }
    ctx.beginPath()
    ctx.arc(x, y, 17, 0, Math.PI * 2)
    ctx.fill()
    last.current = { x, y }
  }, [])

  function pointFrom(e: React.PointerEvent) {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }
    const r = canvas.getBoundingClientRect()
    return {
      x: ((e.clientX - r.left) / r.width) * canvas.width,
      y: ((e.clientY - r.top) / r.height) * canvas.height,
    }
  }

  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, y: 26, scale: 0.85 }}
      animate={{
        opacity: 1,
        y: 0,
        /* the heart grows just a touch once its number is revealed */
        scale: opened ? 1.06 : 1,
      }}
      transition={{ delay, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* dhak-dhak heartbeat — softly before the scratch, fuller after */}
      <motion.div
        className="relative"
        animate={{
          scale: opened ? [1, 1.06, 1.005, 1.04, 1] : [1, 1.045, 1.005, 1.03, 1],
        }}
        transition={{
          duration: opened ? 1.25 : 1.6,
          times: [0, 0.16, 0.34, 0.5, 1],
          repeat: Number.POSITIVE_INFINITY,
          ease: 'easeInOut',
          delay: delay + 0.2,
        }}
      >
      {/* glow behind the heart */}
      <motion.span
        aria-hidden="true"
        className="pointer-events-none absolute -inset-4 rounded-full blur-xl"
        animate={{ opacity: opened ? 0.85 : 0.35 }}
        style={{
          background:
            'radial-gradient(closest-side, oklch(0.93 0.06 88 / 0.6), transparent)',
        }}
      />

      <div
        ref={wrapRef}
        className="relative size-24 touch-none select-none sm:size-28"
        style={{
          maskImage: HEART_MASK,
          WebkitMaskImage: HEART_MASK,
          maskSize: '100% 100%',
          WebkitMaskSize: '100% 100%',
          maskRepeat: 'no-repeat',
          WebkitMaskRepeat: 'no-repeat',
        }}
      >
        {/* the value hidden underneath */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center pb-3"
          style={{
            background:
              'linear-gradient(155deg, oklch(0.97 0.05 90), oklch(0.86 0.09 82) 55%, oklch(0.74 0.1 74))',
          }}
        >
          <span
            className={
              label === 'Month'
                ? 'font-serif text-sm font-medium tracking-[0.04em] sm:text-lg'
                : 'font-serif text-lg font-light sm:text-xl'
            }
            style={{ color: 'oklch(0.42 0.06 68)' }}
          >
            {value}
          </span>
          <span
            className="mt-0.5 text-[0.45rem] uppercase tracking-[0.24em]"
            style={{ color: 'oklch(0.55 0.07 70)' }}
          >
            {label}
          </span>
        </div>

        {/* the foil */}
        <motion.canvas
          ref={canvasRef}
          className="absolute inset-0 size-full touch-none cursor-grab"
          animate={{ opacity: opened ? 0 : 1 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          style={{ pointerEvents: opened ? 'none' : 'auto' }}
          onPointerDown={(e) => {
            e.currentTarget.setPointerCapture(e.pointerId)
            drawing.current = true
            last.current = null
            const p = pointFrom(e)
            scratch(p.x, p.y)
            measure()
          }}
          onPointerMove={(e) => {
            if (!drawing.current) return
            const p = pointFrom(e)
            scratch(p.x, p.y)
            tick.current += 1
            if (tick.current % 3 === 0) measure()
          }}
          onPointerUp={() => {
            drawing.current = false
            last.current = null
            measure()
          }}
          onPointerLeave={() => {
            if (drawing.current) measure()
            drawing.current = false
            last.current = null
          }}
        />
      </div>

      {/* heart outline on top */}
      <svg
        aria-hidden="true"
        viewBox="0 0 100 100"
        className="pointer-events-none absolute inset-0 size-full"
      >
        <path
          d={HEART_PATH}
          fill="none"
          stroke="oklch(0.7 0.09 74 / 0.85)"
          strokeWidth="1.6"
        />
      </svg>

      {/* sparkle decor when the heart opens */}
      <AnimatePresence>
        {opened && (
          <motion.div
            className="pointer-events-none absolute inset-0"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.span
              className="absolute inset-0"
              initial={{ opacity: 0.9, scale: 0.5 }}
              animate={{ opacity: 0, scale: 1.9 }}
              transition={{ duration: 1.4, ease: 'easeOut' }}
              style={{
                background:
                  'radial-gradient(circle at 50% 50%, oklch(0.93 0.07 88 / 0.9), transparent 65%)',
              }}
            />
            {Array.from({ length: 10 }).map((_, i) => (
              <motion.span
                key={i}
                className="absolute left-1/2 top-1/2 text-[0.6rem]"
                style={{ color: i % 2 ? 'oklch(0.8 0.1 80)' : 'var(--gold)' }}
                initial={{ x: 0, y: 0, opacity: 1, scale: 0.5 }}
                animate={{
                  x: Math.cos((i / 10) * Math.PI * 2) * (44 + (i % 3) * 12),
                  y: Math.sin((i / 10) * Math.PI * 2) * (44 + (i % 3) * 12) - 16,
                  opacity: 0,
                  scale: 1.15,
                  rotate: i % 2 ? 40 : -40,
                }}
                transition={{ duration: 1.6, delay: 0.05 * i, ease: 'easeOut' }}
              >
                {i % 2 ? '\u2665' : '\u2726'}
              </motion.span>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      </motion.div>
      <span className="sr-only">{`${label}: ${value}`}</span>
    </motion.div>
  )
}