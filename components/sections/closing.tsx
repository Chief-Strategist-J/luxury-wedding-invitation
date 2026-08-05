'use client'

import Image from 'next/image'
import { motion } from 'motion/react'
import { GoldDivider, Petals, Sparkles } from '@/components/decor'
import { wedding, weddingDateLine } from '@/lib/wedding-config'

export function Closing() {
  return (
    <footer className="relative isolate overflow-hidden px-5 py-24 text-center sm:py-32">
      <Image
        src="/media/gathbandhan.png"
        alt=""
        fill
        className="absolute inset-0 -z-10 object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/50 to-accent/40" />
      <Petals count={14} className="opacity-70" />
      <Sparkles count={18} className="opacity-70" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 mx-auto flex max-w-2xl flex-col items-center gap-6"
      >
        <p className="text-[0.68rem] font-medium tracking-[0.42em] text-accent-foreground/70 uppercase">
          Together with our families
        </p>

        <h2 className="font-serif text-4xl leading-tight text-foreground text-balance sm:text-6xl">
          {wedding.groom}
          <span className="mx-3 text-primary">&amp;</span>
          {wedding.bride}
        </h2>

        <GoldDivider className="w-48" />

        <p className="max-w-lg text-pretty font-serif text-xl italic leading-relaxed text-muted-foreground">
          &ldquo;And when the seven vows are spoken, may our love remain as bright as the diyas that
          witnessed them.&rdquo;
        </p>

        <div className="flex flex-col items-center gap-1">
          <p className="text-sm tracking-[0.3em] text-foreground uppercase">{weddingDateLine}</p>
          <p className="text-sm text-muted-foreground">{wedding.venue.name}</p>
          <p className="text-sm text-muted-foreground">{wedding.venue.city}</p>
        </div>

        <p className="mt-6 text-[0.7rem] tracking-[0.34em] text-accent-foreground/70 uppercase">
          {wedding.hashtag}
        </p>
      </motion.div>
    </footer>
  )
}
