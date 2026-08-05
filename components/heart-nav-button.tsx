'use client'

import { cn } from '@/lib/utils'

const HEART =
  'M12 21.2s-6.9-4.4-9.2-8.3C.4 9.6 2.1 5.4 5.9 4.5c2.3-.5 4.5.6 6.1 2.5 1.6-1.9 3.8-3 6.1-2.5 3.8.9 5.5 5.1 3.1 8.4-2.3 3.9-9.2 8.3-9.2 8.3Z'

/**
 * Heart-shaped carousel/lightbox nav button.
 * The old version was a plain gold circle — this replaces the circle with a
 * heart outline that fills with gold on hover/press, and uses a noticeably
 * smaller chevron inside.
 */
export function HeartNavButton({
  label,
  onClick,
  dir,
  size = 'md',
  className,
}: {
  label: string
  onClick: () => void
  dir: 'left' | 'right'
  /** `sm` is for the fullscreen lightbox, `md` for the carousel row. */
  size?: 'sm' | 'md'
  className?: string
}) {
  const box = size === 'sm' ? 'size-9' : 'size-11'
  const chevron = size === 'sm' ? 'size-[11px]' : 'size-3'

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={cn(
        'group relative flex items-center justify-center text-accent-foreground transition-transform duration-300 hover:scale-110 active:scale-95',
        box,
        className,
      )}
    >
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className="absolute inset-0 size-full drop-shadow-[0_2px_6px_oklch(0.45_0.08_240/0.25)]"
        fill="none"
      >
        <path
          d={HEART}
          className="fill-card transition-all duration-300 group-hover:fill-accent"
          stroke="var(--gold, oklch(0.8 0.11 85))"
          strokeWidth="1"
          strokeLinejoin="round"
        />
      </svg>
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className={cn(
          'relative -translate-y-[6%] transition-colors duration-300 group-hover:text-primary-foreground',
          chevron,
        )}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d={dir === 'left' ? 'M15 5l-7 7 7 7' : 'M9 5l7 7-7 7'} />
      </svg>
    </button>
  )
}
