'use client'

import { AnimatePresence, motion } from 'motion/react'
import { useMusic } from '@/components/music-provider'

export function MusicControl({ visible }: { visible?: boolean }) {
  const { playing, toggle, armed } = useMusic()
  const show = visible ?? armed

  return (
    <AnimatePresence>
      {show && (
        <motion.button
          type="button"
          onClick={toggle}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.6 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          aria-label={playing ? 'Turn music off' : 'Turn music on'}
          aria-pressed={playing}
          className="fixed bottom-5 right-4 z-50 flex size-12 items-center justify-center rounded-full border border-accent/50 bg-card/85 shadow-[0_8px_28px_-10px_oklch(0.6_0.06_240/0.5)] backdrop-blur-md transition-colors hover:bg-card sm:bottom-7 sm:right-7"
        >
          {/* soft gold halo */}
          <span
            aria-hidden="true"
            className="absolute inset-0 rounded-full"
            style={{ animation: 'soft-glow 3.5s ease-in-out infinite' }}
          />
          {/* rotating ring while playing */}
          <span
            aria-hidden="true"
            className="absolute inset-[3px] rounded-full border border-dashed border-accent/45"
            style={
              playing
                ? { animation: 'spin-slow 9s linear infinite' }
                : undefined
            }
          />
          {playing ? (
            <span className="flex items-end gap-[3px]" aria-hidden="true">
              {[0, 1, 2, 3].map((i) => (
                <motion.span
                  key={i}
                  className="w-[2.5px] rounded-full bg-accent-foreground/75"
                  animate={{ height: [5, 14, 7, 12, 5] }}
                  transition={{
                    duration: 1.1 + i * 0.18,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: 'easeInOut',
                  }}
                />
              ))}
            </span>
          ) : (
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="size-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 18V5l10-2v13" className="text-accent-foreground/80" />
              <circle cx="6" cy="18" r="3" />
              <circle cx="16" cy="16" r="3" />
              <path d="M3 3l18 18" className="text-muted-foreground" />
            </svg>
          )}
          <span className="sr-only">
            {playing ? 'Music on — tap to turn off' : 'Music off — tap to turn on'}
          </span>
        </motion.button>
      )}
    </AnimatePresence>
  )
}
