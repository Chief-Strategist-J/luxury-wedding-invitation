'use client'

import { motion } from 'motion/react'
import { GoldDivider, Petals, Sparkles } from '@/components/decor'
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
      className="relative isolate flex h-[100svh] w-full items-end justify-center overflow-hidden"
    >
      {/* full-screen video */}
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

      {/* readability wash */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, oklch(0.12 0.02 240 / 0.55) 0%, oklch(0.12 0.02 240 / 0.1) 30%, oklch(0.12 0.02 240 / 0.45) 62%, oklch(0.1 0.02 240 / 0.85) 100%)',
        }}
      />

      <Petals count={14} />
      <Sparkles count={14} />

      {/* top line */}
      <div className="absolute inset-x-0 top-0 z-10 flex flex-col items-center gap-2 px-5 pt-6 text-center sm:pt-8">
        <motion.p
          className="font-serif text-2xl font-light italic leading-tight text-white drop-shadow-[0_2px_10px_oklch(0.1_0.02_240/0.7)] sm:text-3xl"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 1.1 }}
        >
          A New Beginning
        </motion.p>
        <motion.span
          className="text-[0.65rem] font-medium uppercase tracking-[0.35em] text-[oklch(0.92_0.06_86)] drop-shadow-[0_2px_8px_oklch(0.1_0.02_240/0.7)] sm:text-xs"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.7, duration: 1.1 }}
        >
          Two Hearts, One Journey
        </motion.span>
      </div>

      {/* names overlaid on the video */}
      <div className="relative z-10 w-full max-w-3xl px-5 pb-10 text-center sm:px-8 sm:pb-14">
        <motion.span
          className="inline-block text-[0.6rem] font-medium uppercase tracking-[0.4em] text-[oklch(0.93_0.05_86)] drop-shadow-[0_2px_8px_oklch(0.1_0.02_240/0.7)] sm:text-[0.7rem]"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          Together with our families
        </motion.span>

        <h1 className="mt-3 font-serif text-4xl font-light leading-[1.05] tracking-tight text-white drop-shadow-[0_3px_16px_oklch(0.1_0.02_240/0.75)] sm:text-6xl">
          <Letters word={wedding.groom} />
          <motion.span
            className="mx-3 inline-block text-[oklch(0.9_0.09_84)] sm:mx-5"
            initial={{ scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6, duration: 0.7, ease: 'backOut' }}
          >
            &hearts;
          </motion.span>
          <Letters word={wedding.bride} delay={0.75} />
        </h1>

        <GoldDivider className="mt-5" />

        <motion.div
          className="mt-5 flex justify-center"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 1.2, duration: 0.9 }}
        >
          <span
            className="inline-flex items-center rounded-full border border-[oklch(0.72_0.09_82)] px-5 py-2 shadow-[0_10px_26px_-12px_oklch(0.1_0.02_240/0.85)] sm:px-6"
            style={{
              background:
                'linear-gradient(180deg, oklch(0.88 0.09 88) 0%, oklch(0.78 0.1 80) 55%, oklch(0.7 0.09 76) 100%)',
            }}
          >
            <span className="text-xs font-medium uppercase tracking-[0.4em] text-[oklch(0.34_0.04_62)] sm:text-sm">
              {wedding.hashtag}
            </span>
          </span>
        </motion.div>

        <motion.p
          className="mx-auto mt-4 max-w-md text-pretty text-xs leading-relaxed text-white/85 drop-shadow-[0_2px_8px_oklch(0.1_0.02_240/0.8)] sm:text-sm"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 1.4, duration: 1 }}
        >
          We invite you to share in the joy of our wedding, in a hall full of
          flowers, candlelight and the people we love most.
        </motion.p>
      </div>
    </section>
  )
}
