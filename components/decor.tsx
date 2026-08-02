'use client'

import { useEffect, useMemo, useState } from 'react'
import { cn } from '@/lib/utils'

/* ── Floating flower petals ───────────────────────────────── */
export function Petals({
  count = 14,
  className,
}: {
  count?: number
  className?: string
}) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const petals = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        left: (i * 97) % 100,
        delay: (i * 1.37) % 12,
        duration: 11 + ((i * 3.1) % 9),
        size: 7 + ((i * 5) % 9),
        drift: ((i % 5) - 2) * 46,
        hue: i % 3,
      })),
    [count],
  )

  if (!mounted) return null

  return (
    <div
      aria-hidden="true"
      className={cn(
        'pointer-events-none absolute inset-0 overflow-hidden',
        className,
      )}
    >
      {petals.map((p, i) => (
        <span
          key={i}
          className="absolute top-0 block rounded-[100%_0_100%_0]"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size * 1.5,
            background:
              p.hue === 0
                ? 'oklch(0.98 0.01 90 / 0.95)'
                : p.hue === 1
                  ? 'oklch(0.9 0.045 20 / 0.8)'
                  : 'oklch(0.9 0.05 235 / 0.85)',
            boxShadow: '0 1px 6px oklch(0.75 0.06 240 / 0.35)',
            ['--drift' as string]: `${p.drift}px`,
            animation: `petal-fall ${p.duration}s linear ${p.delay}s infinite`,
          }}
        />
      ))}
    </div>
  )
}

/* ── Golden sparkle dust ──────────────────────────────────── */
export function Sparkles({
  count = 18,
  className,
}: {
  count?: number
  className?: string
}) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const dots = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        left: (i * 61) % 100,
        top: (i * 43) % 100,
        delay: (i * 0.71) % 6,
        duration: 4 + ((i * 1.3) % 5),
        size: 2 + ((i * 3) % 4),
        drift: ((i % 4) - 1.5) * 24,
      })),
    [count],
  )

  if (!mounted) return null

  return (
    <div
      aria-hidden="true"
      className={cn(
        'pointer-events-none absolute inset-0 overflow-hidden',
        className,
      )}
    >
      {dots.map((d, i) => (
        <span
          key={i}
          className="absolute block rounded-full bg-accent"
          style={{
            left: `${d.left}%`,
            top: `${d.top}%`,
            width: d.size,
            height: d.size,
            boxShadow: '0 0 10px 2px oklch(0.86 0.09 85 / 0.75)',
            ['--drift' as string]: `${d.drift}px`,
            animation: `sparkle-float ${d.duration}s ease-in-out ${d.delay}s infinite`,
          }}
        />
      ))}
    </div>
  )
}

/* ── Confetti burst (paper piece explosion) ───────────────── */
export function ConfettiBurst({
  count = 90,
  originX = '50%',
  originY = '0%',
  loop = true,
  className,
}: {
  count?: number
  originX?: string
  originY?: string
  loop?: boolean
  className?: string
}) {
   const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const pieces = useMemo(
    () =>
       Array.from({ length: count }, (_, i) => {
        const angle = ((i * 137.5) % 360) * (Math.PI / 180)
        const spread = 40 + ((i * 53) % 300)
        return {
          id: i,
          x: Math.cos(angle) * spread,
          y: 200 + ((i * 29) % 260),
          rotate: ((i % 2 === 0 ? 1 : -1) * (i * 47)) % 720,
          delay: (i * 0.13) % 2.5,
          duration: 1.8 + ((i * 0.07) % 1.4),
          size: 6 + ((i * 3) % 8),
          hue: i % 6,
          shape: i % 2 === 0 ? 'rect' : 'circle',
        }
      }),
    [count],
  )

  if (!mounted) return null

 const colors = [
    'oklch(0.75 0.18 25)',
    'oklch(0.8 0.16 85)',
    'oklch(0.7 0.15 200)',
    'oklch(0.72 0.2 320)',
    'oklch(0.85 0.12 60)',
    'oklch(0.68 0.19 250)',
  ]

 return (
    <div
      aria-hidden="true"
      className={cn(
        'pointer-events-none absolute inset-0 overflow-hidden',
        className,
      )}
    >
      {pieces.map((p) => (
        <span
          key={p.id}
          className="absolute block"
          style={{
            left: originX,
            top: originY,
            width: p.shape === 'rect' ? p.size : p.size * 0.8,
            height: p.shape === 'rect' ? p.size * 0.4 : p.size * 0.8,
            backgroundColor: colors[p.hue],
            borderRadius: p.shape === 'circle' ? '50%' : '2px',
            opacity: 0,
            ['--cx' as string]: `${p.x}px`,
            ['--cy' as string]: `${p.y}px`,
            ['--crot' as string]: `${p.rotate}deg`,
            animation: `confetti-burst ${p.duration}s cubic-bezier(0.16,1,0.3,1) ${p.delay}s ${loop ? 'infinite' : '1'}`,
            animationFillMode: 'forwards',
          }}
        />
      ))}
    </div>
  )
}

/* ── Thin gold divider with a diamond ─────────────────────── */
export function GoldDivider({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn('flex items-center justify-center gap-3', className)}
    >
      <span className="gold-rule h-px w-16 sm:w-24" />
      <span className="size-1.5 rotate-45 bg-accent" />
      <span className="gold-rule h-px w-16 sm:w-24" />
    </div>
  )
}

/* ── Ornamental gold corner flourish ──────────────────────── */
export function GoldCorner({
  position = 'tl',
  className,
}: {
  position?: 'tl' | 'tr' | 'bl' | 'br'
  className?: string
}) {
  const rotate = {
    tl: 'rotate-0',
    tr: 'rotate-90',
    br: 'rotate-180',
    bl: '-rotate-90',
  }[position]

  const place = {
    tl: 'left-3 top-3',
    tr: 'right-3 top-3',
    bl: 'bottom-3 left-3',
    br: 'bottom-3 right-3',
  }[position]

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 100 100"
      className={cn('absolute size-16 sm:size-20', place, rotate, className)}
      fill="none"
    >
      <path
        d="M4 46C4 24 24 4 46 4"
        stroke="var(--gold)"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <path
        d="M12 52C12 30 30 12 52 12"
        stroke="var(--gold-soft)"
        strokeWidth="0.8"
        strokeLinecap="round"
      />
      <path
        d="M24 20c8-2 14 2 13 8-1 5-8 6-11 2s0-9 6-11"
        stroke="var(--gold)"
        strokeWidth="1"
        strokeLinecap="round"
      />
      <circle cx="46" cy="6" r="2" fill="var(--gold)" />
      <circle cx="6" cy="46" r="2" fill="var(--gold)" />
    </svg>
  )
}

/* ── Decorative floral sprig ──────────────────────────────── */
export function FloralSprig({
  className,
  flip,
}: {
  className?: string
  flip?: boolean
}) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 200 120"
      className={cn(className, flip && 'scale-x-[-1]')}
      fill="none"
    >
      <path
        d="M8 112C48 104 84 82 108 52c14-18 30-32 52-40"
        stroke="var(--gold)"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      {[
        [36, 96, 11, 'oklch(0.99 0.008 90)'],
        [64, 82, 9, 'oklch(0.9 0.05 235)'],
        [92, 62, 13, 'oklch(0.99 0.008 90)'],
        [118, 42, 8, 'oklch(0.9 0.045 20)'],
        [142, 26, 10, 'oklch(0.94 0.03 235)'],
      ].map(([cx, cy, r, fill], i) => (
        <g key={i}>
          <circle
            cx={cx as number}
            cy={cy as number}
            r={r as number}
            fill={fill as string}
            stroke="var(--gold-soft)"
            strokeWidth="0.7"
          />
          <circle
            cx={cx as number}
            cy={cy as number}
            r={(r as number) / 3}
            fill="var(--gold-soft)"
          />
        </g>
      ))}
      {[
        [52, 104],
        [80, 74],
        [106, 52],
        [132, 34],
      ].map(([x, y], i) => (
        <path
          key={i}
          d={`M${x} ${y}c-9 3-14 10-13 17 8 1 15-4 18-12z`}
          fill="oklch(0.9 0.04 150 / 0.55)"
        />
      ))}
    </svg>
  )
}

/* ── Reusable section shell with soft blue washes ─────────── */
export function SectionShell({
  id,
  children,
  className,
  background,
}: {
  id?: string
  children: React.ReactNode
  className?: string
  background?: React.ReactNode
}) {
  return (
    <section
      id={id}
      className={cn(
        'relative isolate w-full overflow-hidden px-5 py-20 sm:px-8 sm:py-28',
        className,
      )}
    >
      {background}
      <div className="relative z-10 mx-auto w-full max-w-6xl">{children}</div>
    </section>
  )
}

/* ── Small caps eyebrow label ─────────────────────────────── */
export function Eyebrow({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <p
      className={cn(
        'text-[0.68rem] font-medium uppercase tracking-[0.42em] text-accent-foreground/70',
        className,
      )}
    >
      {children}
    </p>
  )
}