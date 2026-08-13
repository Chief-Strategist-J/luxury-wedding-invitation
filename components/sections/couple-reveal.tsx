'use client'

import { motion } from 'motion/react'
import { Eyebrow, GoldDivider, Petals, Sparkles } from '@/components/decor'
import { wedding } from '@/lib/wedding-config'

function Letters({ word, delay = 0 }: { word: string; delay?: number }) {
  return (
    <span className="inline-flex">
      {word.split('').map((ch, i) => (
        <motion.span
          key={`${ch}-${i}`}
          initial={{ opacity: 0, y: 26, filter: 'blur(6px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true }}
          transition={{
            delay: delay + i * 0.07,
            duration: 0.8,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="inline-block"
        >
          {ch}
        </motion.span>
      ))}
    </span>
  )
}

export function CoupleReveal() {
  return (
    <section
      id="home"
      className="relative isolate flex w-full flex-col items-center overflow-hidden px-2 pb-10 pt-4 sm:px-4 sm:pb-14 sm:pt-6"
      style={{
        background:
          'radial-gradient(110% 70% at 50% 0%, oklch(0.99 0.008 90) 0%, oklch(0.96 0.02 235) 40%, oklch(0.9 0.045 238) 100%)',
      }}
    >
      <Petals count={16} />
      <Sparkles count={16} />

      <div className="relative z-10 w-full max-w-xl">
        {/* palace arch frame */}
        <div className="relative mx-auto w-full">
          <div
            className="relative rounded-t-[999px] border border-accent/40 p-[5px] sm:p-[7px]"
            style={{
              background:
                'linear-gradient(180deg, oklch(0.99 0.02 90 / 0.9), oklch(0.94 0.03 236 / 0.5))',
            }}
          >
            <motion.div
              className="relative overflow-hidden rounded-t-[999px] rounded-b-2xl"
              initial={{ opacity: 0, scale: 0.94 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="relative aspect-[3/4.3] w-full">
                {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
                <video
                  className="absolute inset-0 size-full object-cover"
        src="/media/Bride_and_groom_enter_palace_202607290130.mp4"
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="auto"
                  aria-hidden="true"
                />

                {/* readability gradient so the overlaid text stays legible on any frame */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0"
                  style={{
                    background:
                      'linear-gradient(180deg, oklch(0.1 0.02 240 / 0.55) 0%, transparent 30%, transparent 42%, oklch(0.12 0.02 240 / 0.55) 68%, oklch(0.1 0.02 240 / 0.85) 100%)',
                  }}
                />

                {/* new-beginning text, overlaid directly on the video, fading in at the top */}
                <div className="absolute inset-x-0 top-0 flex flex-col items-center gap-1.5 px-4 pt-5 text-center">
                  <motion.p
                    className="font-serif text-2xl font-light italic leading-tight text-white drop-shadow-[0_2px_10px_oklch(0.1_0.02_240/0.6)] sm:text-3xl"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6, duration: 1.1 }}
                  >
                    A New Beginning
                  </motion.p>
                  <motion.span
                    className="text-[0.65rem] font-medium uppercase tracking-[0.35em] text-[oklch(0.92_0.06_86)] drop-shadow-[0_2px_8px_oklch(0.1_0.02_240/0.6)] sm:text-xs"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.9, duration: 1.1 }}
                  >
                    Two Hearts, One Journey
                  </motion.span>
                </div>

                {/* families line, names, gold divider and hashtag — all overlaid on the video */}
                <div className="absolute inset-x-0 bottom-0 flex flex-col items-center px-4 pb-6 text-center sm:pb-8">
                  <Eyebrow className="text-[oklch(0.94_0.05_88)] drop-shadow-[0_2px_8px_oklch(0.1_0.02_240/0.7)]">
                    Together with our families
                  </Eyebrow>

                  <h1 className="mt-3 font-serif text-4xl font-light leading-[1.05] tracking-tight text-white drop-shadow-[0_3px_14px_oklch(0.1_0.02_240/0.75)] sm:text-6xl">
                    <Letters word={wedding.groom} />
                    <motion.span
                      className="mx-2.5 inline-block text-accent sm:mx-4"
                      initial={{ scale: 0, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{
                        delay: 0.6,
                        duration: 0.7,
                        ease: 'backOut',
                      }}
                    >
                      &hearts;
                    </motion.span>
                    <Letters word={wedding.bride} delay={0.75} />
                  </h1>

                  <GoldDivider className="mt-4" />

                  <motion.div
                    className="mt-4 flex justify-center"
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 1.3, duration: 0.9 }}
                  >
                    <span
                      className="inline-flex items-center rounded-full border border-accent/60 px-4 py-1.5 shadow-[0_8px_24px_-10px_oklch(0.7_0.09_82/0.7)] sm:px-5 sm:py-2"
                      style={{
                        background:
                          'linear-gradient(180deg, var(--gold-soft) 0%, var(--gold) 100%)',
                      }}
                    >
                      <span className="text-xs font-medium uppercase tracking-[0.32em] text-[oklch(0.34_0.04_62)] sm:text-sm">
                        {wedding.hashtag}
                      </span>
                    </span>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* the invitation line stays below the video, exactly as before */}
        <motion.p
          className="mx-auto mt-6 max-w-md text-pretty text-center text-sm leading-relaxed text-muted-foreground"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 1.5, duration: 1 }}
        >
          We invite you to share in the joy of our wedding, in a hall full of
          flowers, candlelight and the people we love most.
        </motion.p>
      </div>
    </section>
  )
}
