'use client'

import { AnimatePresence, motion } from 'motion/react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { GoldDivider, Petals, Sparkles } from '@/components/decor'
import { wedding, weddingDateParts } from '@/lib/wedding-config'

/** Screen 5: the main WOW interaction. Everything is hidden until scratched. */
export function ScratchReveal({ onDone }: { onDone: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const wrapRef = useRef<HTMLDivElement | null>(null)
  const drawingRef = useRef(false)
  const lastRef = useRef<{ x: number; y: number } | null>(null)
  const tickRef = useRef(0)
  const [progress, setProgress] = useState(0)
  const burst = progress >= 0.65

  /* paint the luxury foil surface */
  const paintFoil = useCallback((canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const { width: w, height: h } = canvas
    const g = ctx.createLinearGradient(0, 0, w, h)
    g.addColorStop(0, '#e9d9a8')
    g.addColorStop(0.25, '#f7ecc9')
    g.addColorStop(0.5, '#d9c184')
    g.addColorStop(0.75, '#f9f1d8')
    g.addColorStop(1, '#dcc48c')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, w, h)

    // ornamental diamond lattice
    ctx.strokeStyle = 'rgba(255,255,255,0.5)'
    ctx.lineWidth = 1
    const step = 34
    for (let x = -h; x < w + h; x += step) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x + h, h)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(x, h)
      ctx.lineTo(x + h, 0)
      ctx.stroke()
    }
    // soft sheen
    const sheen = ctx.createLinearGradient(0, h, w, 0)
    sheen.addColorStop(0, 'rgba(255,255,255,0)')
    sheen.addColorStop(0.45, 'rgba(255,255,255,0.45)')
    sheen.addColorStop(0.6, 'rgba(255,255,255,0)')
    ctx.fillStyle = sheen
    ctx.fillRect(0, 0, w, h)

    const c = ctx as CanvasRenderingContext2D & { letterSpacing?: string }
    c.font = `500 ${Math.round(w * 0.045)}px Jost, sans-serif`
    c.fillStyle = 'rgba(120,95,40,0.72)'
    c.textAlign = 'center'
    c.letterSpacing = '6px'
    c.fillText('SCRATCH TO REVEAL', w / 2, h * 0.54)
    c.font = `italic ${Math.round(w * 0.055)}px 'Cormorant Garamond', serif`
    c.fillStyle = 'rgba(120,95,40,0.55)'
    c.letterSpacing = '1px'
    c.fillText('use your finger', w / 2, h * 0.63)
  }, [])

  /* size the canvas to its wrapper */
  useEffect(() => {
    const canvas = canvasRef.current
    const wrap = wrapRef.current
    if (!canvas || !wrap) return
    const setup = () => {
      const r = wrap.getBoundingClientRect()
      canvas.width = Math.max(1, Math.round(r.width))
      canvas.height = Math.max(1, Math.round(r.height))
      paintFoil(canvas)
      setProgress(0)
    }
    setup()
    const ro = new ResizeObserver(setup)
    ro.observe(wrap)
    return () => ro.disconnect()
  }, [paintFoil])

  const measure = useCallback(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return
    const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height)
    let clear = 0
    let total = 0
    for (let i = 3; i < data.length; i += 4 * 24) {
      total++
      if (data[i] < 40) clear++
    }
    if (total) setProgress(clear / total)
  }, [])

  const scratch = useCallback((x: number, y: number) => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return
    ctx.globalCompositeOperation = 'destination-out'
    ctx.lineWidth = 46
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    const last = lastRef.current
    ctx.beginPath()
    if (last) {
      ctx.moveTo(last.x, last.y)
      ctx.lineTo(x, y)
      ctx.stroke()
    }
    ctx.arc(x, y, 23, 0, Math.PI * 2)
    ctx.fill()
    lastRef.current = { x, y }
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
      className="fixed inset-0 z-[52] overflow-y-auto overscroll-contain"
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      style={{
        background:
          'linear-gradient(180deg, oklch(0.9 0.05 236) 0%, oklch(0.96 0.02 234) 45%, oklch(0.99 0.008 90) 100%)',
      }}
    >
      {/* dreamy clouds */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        {[
          { t: '8%', l: '-6%', s: 260, o: 0.85 },
          { t: '26%', l: '58%', s: 320, o: 0.7 },
          { t: '58%', l: '10%', s: 380, o: 0.6 },
          { t: '76%', l: '62%', s: 240, o: 0.75 },
        ].map((c, i) => (
          <div
            key={i}
            className="absolute rounded-full blur-2xl"
            style={{
              top: c.t,
              left: c.l,
              width: c.s,
              height: c.s * 0.5,
              opacity: c.o,
              background:
                'radial-gradient(closest-side, oklch(1 0 0 / 0.95), transparent)',
              animation: `gentle-float ${9 + i * 2}s ease-in-out infinite`,
            }}
          />
        ))}
      </div>

      <Petals count={14} />
      <Sparkles count={burst ? 34 : 12} />

      <div className="relative z-10 mx-auto flex min-h-full w-full max-w-md flex-col items-center justify-center px-5 py-12">
        <motion.p
          className="mb-6 text-center font-serif text-xl font-light italic leading-relaxed text-foreground/80 sm:text-2xl"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.9 }}
        >
          Something Beautiful Is Waiting To Be Revealed...
        </motion.p>

        {/* floating 3D card */}
        <motion.div
          className="relative w-full"
          initial={{ opacity: 0, y: 40, rotateX: 14 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ delay: 0.45, duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          style={{ perspective: '1200px' }}
        >
          <div
            className="relative rounded-3xl p-[2px] shadow-[0_44px_80px_-38px_oklch(0.5_0.07_240/0.6)]"
            style={{
              background:
                'linear-gradient(140deg, oklch(0.9 0.07 88), oklch(0.99 0.02 90), oklch(0.82 0.09 80))',
              animation: 'gentle-float 7s ease-in-out infinite',
            }}
          >
            <div className="relative overflow-hidden rounded-[22px] bg-gradient-to-b from-card to-secondary/50">
              <div
                ref={wrapRef}
                className="relative aspect-[3/4] w-full touch-none select-none"
              >
                {/* ── hidden content underneath ── */}
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-6 text-center">
                  <motion.div
                    animate={{ opacity: progress > 0.12 ? 1 : 0, scale: progress > 0.12 ? 1 : 0.92 }}
                    transition={{ duration: 0.7 }}
                  >
                    <p className="font-serif text-[2.1rem] font-light leading-tight text-foreground sm:text-4xl">
                      {wedding.groom}
                      <span className="mx-2 text-accent">&hearts;</span>
                      {wedding.bride}
                    </p>
                  </motion.div>

                  <motion.div
                    animate={{ opacity: progress > 0.34 ? 1 : 0, y: progress > 0.34 ? 0 : 10 }}
                    transition={{ duration: 0.7 }}
                  >
                    <GoldDivider />
                    <p className="mt-3 text-sm font-medium uppercase tracking-[0.3em] text-gold-gradient">
                      {wedding.hashtag}
                    </p>
                  </motion.div>

                  <motion.div
                    className="mt-2 flex items-end justify-center gap-3"
                    animate={{ opacity: progress > 0.5 ? 1 : 0, y: progress > 0.5 ? 0 : 14 }}
                    transition={{ duration: 0.8 }}
                  >
                    <span className="font-serif text-4xl font-light text-foreground">
                      {weddingDateParts.day}
                    </span>
                    <span className="pb-1 font-serif text-xl font-light uppercase tracking-[0.22em] text-accent-foreground">
                      {weddingDateParts.month}
                    </span>
                    <span className="font-serif text-4xl font-light text-foreground">
                      {weddingDateParts.year}
                    </span>
                  </motion.div>
                </div>

                {/* ── scratch surface ── */}
                <canvas
                  ref={canvasRef}
                  className="absolute inset-0 size-full cursor-grab rounded-[20px] touch-none"
                  onPointerDown={(e) => {
                    e.currentTarget.setPointerCapture(e.pointerId)
                    drawingRef.current = true
                    lastRef.current = null
                    const p = pointFrom(e)
                    scratch(p.x, p.y)
                  }}
                  onPointerMove={(e) => {
                    if (!drawingRef.current) return
                    const p = pointFrom(e)
                    scratch(p.x, p.y)
                    tickRef.current += 1
                    if (tickRef.current % 6 === 0) measure()
                  }}
                  onPointerUp={() => {
                    drawingRef.current = false
                    lastRef.current = null
                    measure()
                  }}
                  onPointerLeave={() => {
                    if (drawingRef.current) measure()
                    drawingRef.current = false
                    lastRef.current = null
                  }}
                />

                {/* sparkle explosion */}
                <AnimatePresence>
                  {burst && (
                    <motion.div
                      className="pointer-events-none absolute inset-0"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <motion.div
                        className="absolute inset-0"
                        initial={{ opacity: 0.95, scale: 0.4 }}
                        animate={{ opacity: 0, scale: 1.6 }}
                        transition={{ duration: 1.6, ease: 'easeOut' }}
                        style={{
                          background:
                            'radial-gradient(circle at 50% 50%, oklch(0.98 0.06 90 / 0.95), transparent 65%)',
                        }}
                      />
                      {Array.from({ length: 22 }).map((_, i) => {
                        const a = (i / 22) * Math.PI * 2
                        return (
                          <motion.span
                            key={i}
                            className="absolute left-1/2 top-1/2 size-1.5 rounded-full bg-accent"
                            style={{ boxShadow: '0 0 10px 3px oklch(0.88 0.09 86 / 0.8)' }}
                            initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                            animate={{
                              x: Math.cos(a) * 150,
                              y: Math.sin(a) * 190,
                              opacity: 0,
                              scale: 0.4,
                            }}
                            transition={{ duration: 1.5, delay: i * 0.02, ease: 'easeOut' }}
                          />
                        )
                      })}
                      {Array.from({ length: 8 }).map((_, i) => (
                        <motion.span
                          key={`h${i}`}
                          className="absolute left-1/2 top-1/2 text-accent"
                          initial={{ x: 0, y: 0, opacity: 1 }}
                          animate={{
                            x: (i % 2 ? 1 : -1) * (30 + i * 16),
                            y: -120 - i * 14,
                            opacity: 0,
                          }}
                          transition={{ duration: 2.2, delay: 0.1 + i * 0.09 }}
                        >
                          &hearts;
                        </motion.span>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </motion.div>

        {/* progress + continue */}
        <div className="mt-7 flex w-full flex-col items-center gap-4">
          <div className="h-px w-40 overflow-hidden bg-accent/25">
            <div
              className="h-full bg-accent transition-[width] duration-300"
              style={{ width: `${Math.min(100, Math.round(progress * 145))}%` }}
            />
          </div>
          <AnimatePresence>
            {burst ? (
              <motion.button
                key="continue"
                type="button"
                onClick={onDone}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-full border border-accent/60 bg-card/85 px-8 py-3.5 text-[0.68rem] font-medium uppercase tracking-[0.32em] text-accent-foreground shadow-[0_12px_28px_-14px_oklch(0.7_0.09_82/0.7)] backdrop-blur transition-transform active:scale-[0.97]"
              >
                Enter Our World
              </motion.button>
            ) : (
              <motion.p
                key="hint"
                className="text-[0.65rem] uppercase tracking-[0.3em] text-muted-foreground"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                Scratch to reveal
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  )
}
