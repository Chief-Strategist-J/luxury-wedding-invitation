'use client'

import Image from 'next/image'
import { motion } from 'motion/react'
import { MapPin, Navigation, Clock } from 'lucide-react'
import { Eyebrow, GoldDivider, SectionShell, FloralSprig } from '@/components/decor'
import { wedding, weddingDateLine } from '@/lib/wedding-config'

export function Venue() {
  return (
    <SectionShell
      id="venue"
      background={
        <>
          <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/40 to-background" />
          <FloralSprig className="absolute -left-10 bottom-0 w-52 opacity-40 sm:w-72" />
        </>
      }
    >
      <div className="flex flex-col items-center gap-4 text-center">
        <Eyebrow>The Destination</Eyebrow>
        <h2 className="font-serif text-4xl leading-tight text-foreground text-balance sm:text-5xl">
          Where it all happens
        </h2>
        <GoldDivider className="w-40" />
      </div>

      <div className="mt-14 grid gap-8 lg:grid-cols-[1.15fr_1fr] lg:items-stretch">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="group relative overflow-hidden rounded-[2rem] border border-primary/25 bg-card shadow-[0_24px_60px_-40px_rgba(120,95,40,0.55)]"
        >
          <Image
            src="/media/venue.png"
            alt={`${wedding.venue.name} venue exterior`}
            width={1200}
            height={800}
            className="h-72 w-full object-cover transition-transform duration-[1.4s] group-hover:scale-105 sm:h-full"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-foreground/40 via-transparent to-transparent" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col justify-center gap-7 rounded-[2rem] border border-primary/25 bg-card/80 p-8 text-center backdrop-blur-sm sm:p-10"
        >
          <div className="flex flex-col items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-primary">
              <MapPin className="h-5 w-5" aria-hidden="true" />
            </span>
            <h3 className="font-serif text-3xl text-foreground text-balance">
              {wedding.venue.name}
            </h3>
            <p className="text-sm tracking-[0.24em] text-muted-foreground uppercase">
              {wedding.venue.city}
            </p>
          </div>

          <GoldDivider className="mx-auto w-32" />

          <div className="flex flex-col items-center gap-2">
            <span className="flex items-center gap-2 text-sm tracking-[0.2em] text-accent-foreground/80 uppercase">
              <Clock className="h-4 w-4" aria-hidden="true" />
              Wedding Day
            </span>
            <p className="font-serif text-2xl text-foreground">{weddingDateLine}</p>
            <p className="text-sm text-muted-foreground">Baraat 6:00 PM &middot; Pheras 7:00 PM</p>
          </div>

          <a
            href={wedding.venue.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mx-auto inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-7 py-3 text-xs font-medium tracking-[0.28em] text-accent-foreground uppercase transition-colors hover:bg-primary/20"
          >
            <Navigation className="h-4 w-4" aria-hidden="true" />
            Open in Maps
          </a>
        </motion.div>
      </div>
    </SectionShell>
  )
}
