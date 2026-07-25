'use client'

import { AnimatePresence, motion } from 'motion/react'
import Image from 'next/image'
import { useEffect, useRef } from 'react'
import { useMusic } from '@/components/music-provider'
import type { MediaItem } from '@/lib/wedding-config'

export function MediaLightbox({
  item,
  onClose,
}: {
  item: MediaItem | null
  onClose: () => void
}) {
  const { playing, toggle } = useMusic()
  const resumeRef = useRef(false)

  // Pause the song while a video plays, then resume from the same position.
  useEffect(() => {
    if (item?.type === 'video' && playing) {
      resumeRef.current = true
      toggle()
    }
    if (!item && resumeRef.current) {
      resumeRef.current = false
      toggle()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item])

  useEffect(() => {
    if (!item) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [item, onClose])

  return (
    <AnimatePresence>
      {item && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={item.title}
          className="fixed inset-0 z-[80] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          style={{
            background:
              'radial-gradient(90% 70% at 50% 40%, oklch(0.97 0.02 235 / 0.94), oklch(0.86 0.05 238 / 0.96))',
            backdropFilter: 'blur(10px)',
          }}
        >
          <motion.div
            className="relative w-full max-w-md overflow-hidden rounded-3xl border border-accent/45 bg-card shadow-[0_50px_100px_-40px_oklch(0.45_0.08_240/0.6)]"
            initial={{ scale: 0.9, y: 24, rotateX: 8 }}
            animate={{ scale: 1, y: 0, rotateX: 0 }}
            exit={{ scale: 0.92, y: 20, opacity: 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-[9/16] w-full bg-secondary/40">
              {item.type === 'image' ? (
                <Image
                  src={item.src || '/placeholder.svg'}
                  alt={item.caption ?? item.title}
                  fill
                  sizes="(max-width: 640px) 100vw, 480px"
                  className="object-cover"
                />
              ) : (
                <video
                  src={item.src}
                  poster={item.poster}
                  controls
                  autoPlay
                  playsInline
                  className="size-full object-cover"
                />
              )}
            </div>
            <div className="flex items-center justify-between gap-4 px-5 py-4">
              <div>
                <p className="font-serif text-lg italic text-foreground">
                  {item.title}
                </p>
                {item.caption && (
                  <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                    {item.caption}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="flex size-9 shrink-0 items-center justify-center rounded-full border border-accent/50 text-accent-foreground transition-colors hover:bg-accent/10"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="size-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  aria-hidden="true"
                >
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
