'use client'

import { motion } from 'motion/react'
import Image from 'next/image'
import {
  Eyebrow,
  FloralSprig,
  GoldDivider,
  Petals,
  Sparkles,
} from '@/components/decor'
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
      className="relative isolate flex min-h-[100svh] w-full items-center overflow-hidden px-5 pb-16 pt-24 sm:px-8"
      style={{
        background:
          'radial-gradient(110% 70% at 50% 0%, oklch(0.99 0.008 90) 0%, oklch(0.96 0.02 235) 40%, oklch(0.9 0.045 238) 100%)',
      }}
    >
      <Petals count={16} />
      <Sparkles count={16} />

      <div className="relative z-10 mx-auto w-full max-w-5xl">
        {/* palace arch frame */}
        <div className="relative mx-auto w-full max-w-md">
          <div
            className="relative rounded-t-[999px] border border-accent/40 p-[10px]"
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
              <div className="relative aspect-[3/4.1] w-full">
                <Image
                  src="/media/couple-portrait.png"
                  alt={`${wedding.groomFull} in an ivory sherwani and ${wedding.brideFull} in a blush pink bridal lehenga`}
                  fill
                  priority
                  sizes="(max-width: 640px) 100vw, 460px"
                  className="object-cover"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0"
                  style={{
                    background:
                      'linear-gradient(180deg, transparent 45%, oklch(0.97 0.02 235 / 0.85) 100%)',
                  }}
                />
              </div>
            </motion.div>
          </div>

          <FloralSprig className="absolute -left-10 bottom-0 w-32 opacity-90 sm:-left-16 sm:w-44" />
          <FloralSprig
            flip
            className="absolute -right-10 bottom-0 w-32 opacity-90 sm:-right-16 sm:w-44"
          />
        </div>

        {/* names */}
        <div className="relative mt-10 text-center">
          <Eyebrow>Together with our families</Eyebrow>

          <h1 className="mt-5 font-serif text-5xl font-light leading-[1.05] tracking-tight text-foreground sm:text-7xl">
            <Letters word={wedding.groom} />
            <motion.span
              className="mx-3 inline-block text-accent sm:mx-5"
              initial={{ scale: 0, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6, duration: 0.7, ease: 'backOut' }}
            >
              &hearts;
            </motion.span>
            <Letters word={wedding.bride} delay={0.75} />
          </h1>

          <GoldDivider className="mt-7" />

          <motion.p
            className="mt-6 text-sm font-medium uppercase tracking-[0.4em] text-gold-gradient sm:text-base"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 1.3, duration: 0.9 }}
          >
            {wedding.hashtag}
          </motion.p>

          <motion.p
            className="mx-auto mt-6 max-w-md text-pretty text-sm leading-relaxed text-muted-foreground"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 1.5, duration: 1 }}
          >
            We invite you to share in the joy of our wedding, in a hall full of
            flowers, candlelight and the people we love most.
          </motion.p>
        </div>
      </div>
    </section>
  )
}
