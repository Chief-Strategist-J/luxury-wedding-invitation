'use client'

import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from 'motion/react'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { Eyebrow, GoldDivider, HeartMark, Petals, Sparkles } from '@/components/decor'
import { cn } from '@/lib/utils'

/* ────────────────────────────────────────────────────────────────
   Celebration schedule. Everything the section needs lives here, so
   this file is fully self-contained. Drop in your own `image` paths
   or add a `video` ({ src, poster }) to any event and the layout
   handles the rest. Only Sangeet and Reception carry video.

   Dress code = three named colours (with hex swatches) + one
   English attire line, styled like a printed invitation card.
   ──────────────────────────────────────────────────────────────── */
type CelebrationVideo = { src: string; poster?: string; title?: string }

type DressColor = { name: string; hex: string }

type Celebration = {
  name: string
  day: string
  date: string
  time: string
  venue: string
  description: string
  /** Attire line, English only — e.g. "Traditional Indian / Indo-Western". */
  dressAttire: string
  /** Exactly three colours: printed as "Maroon · Gold · Cream". */
  dressColors: DressColor[]
  mapQuery: string
  image: string
  video?: CelebrationVideo
}

const celebrations: Celebration[] = [
  {
    name: 'Ganesh Sthapna',
    day: 'Thursday',
    date: '10 December 2026',
    time: '3:00 PM',
    venue: 'Family Residence, Ahmedabad',
    description:
      'We begin with prayers to Lord Ganesha, the remover of obstacles, inviting his blessings upon every moment that follows.',
    dressAttire: 'Traditional Indian',
    dressColors: [
      { name: 'Vermilion', hex: '#B33A2A' },
      { name: 'Gold', hex: '#C9A24B' },
      { name: 'Ivory', hex: '#F2E9DA' },
    ],
    mapQuery: 'Ahmedabad, Gujarat',
    image: '/media/ganesh-sthapna.png',
  },
  {
    name: 'Lagan Vadhavanu Muhurat',
    day: 'Thursday',
    date: '10 December 2026',
    time: '6:00 PM',
    venue: 'Family Residence, Ahmedabad',
    description:
      'The auspicious hour is fixed and the wedding rites are set in motion, marking the sacred beginning of the union.',
    dressAttire: 'Traditional Indian',
    dressColors: [
      { name: 'Ivory', hex: '#F4EFE3' },
      { name: 'Gold', hex: '#C9A24B' },
      { name: 'Champagne', hex: '#DFC79A' },
    ],
    mapQuery: 'Ahmedabad, Gujarat',
    image: '/media/lagan-muhrat.jpeg',
  },
  {
    name: 'Haldi',
    day: 'Friday',
    date: '11 December 2026',
    time: '9:00 AM',
    venue: 'Family Residence, Ahmedabad',
    description:
      'Turmeric, laughter and golden light — a morning of blessings smeared with love before the vows.',
    dressAttire: 'Indian Casual / Breezy Cottons',
    dressColors: [
      { name: 'Marigold', hex: '#E8A81C' },
      { name: 'Saffron', hex: '#F0C557' },
      { name: 'Cream', hex: '#F6EEDC' },
    ],
    mapQuery: 'Ahmedabad, Gujarat',
    image: '/media/haldi-1.jpeg',
  },
  {
    name: 'Sangeet',
    day: 'Friday',
    date: '11 December 2026',
    time: '7:00 PM',
    venue: 'Banquet Hall, Ahmedabad',
    description:
      'A night of music, dance and celebration as both families come together to sing our story into the stars.',
    dressAttire: 'Indo-Western / Evening Glamour',
    dressColors: [
      { name: 'Emerald', hex: '#1F6B54' },
      { name: 'Sapphire', hex: '#2A4C8F' },
      { name: 'Champagne', hex: '#DFC79A' },
    ],
    mapQuery: 'Ahmedabad, Gujarat',
    image: '/images/celebrations/sangeet.png',
    video: {
      src: '/media/sangit-ceremony.mp4',
      poster: '/images/celebrations/sangeet.png',
      title: 'Sangeet',
    },
  },
  {
    name: 'Baraat',
    day: 'Saturday',
    date: '12 December 2026',
    time: '4:00 PM',
    venue: 'Departs to Satellite, Ahmedabad',
    description:
      'The groom’s joyful procession sets off with dhol and dance, making its way to Satellite, Ahmedabad.',
    dressAttire: 'Traditional Indian / Indo-Western',
    dressColors: [
      { name: 'Royal Blue', hex: '#27447E' },
      { name: 'Gold', hex: '#C9A24B' },
      { name: 'Coral', hex: '#E08A70' },
    ],
    mapQuery: 'Satellite, Ahmedabad, Gujarat',
    image: '/media/baraat.jpeg',
  },
  {
    name: 'Hastamelap',
    day: 'Saturday',
    date: '12 December 2026',
    time: '9:00 PM',
    venue: 'Satellite, Ahmedabad',
    description:
      'Two hands, two hearts and seven sacred vows — the moment our lives are joined as one.',
    dressAttire: 'Traditional Indian',
    dressColors: [
      { name: 'Maroon', hex: '#6E2230' },
      { name: 'Gold', hex: '#C9A24B' },
      { name: 'Cream', hex: '#F3E7D6' },
    ],
    mapQuery: 'Satellite, Ahmedabad, Gujarat',
    image: '/images/celebrations/hastmelap-1.jpeg',
  },
  {
    name: 'Reception',
    day: 'Sunday',
    date: '13 December 2026',
    time: '7:00 PM',
    venue: 'Banquet, Ahmedabad',
    description:
      'An elegant evening to celebrate with everyone we love, as we step into this new chapter together.',
    dressAttire: 'Formal / Cocktail Elegance',
    dressColors: [
      { name: 'Midnight', hex: '#1E2A44' },
      { name: 'Silver', hex: '#C3C9D4' },
      { name: 'Blush', hex: '#E8CBC9' },
    ],
    mapQuery: 'Ahmedabad, Gujarat',
    image: '/images/celebrations/reception.png',
      video: {
      src: '/media/reception-ceremory.mp4',
      poster: '/images/celebrations/reception.png',
      title: 'Reception',
    },
  },
]

const TOTAL = celebrations.length

function mapsHref(query: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`
}

/* ── Dress code block, printed like an invitation card ─────────
   DRESS CODE  →  overlapping colour swatches  →  "Maroon · Gold ·
   Cream"  →  attire line in small caps.                        */
function DressCode({
  colors,
  attire,
  alignRight,
}: {
  colors: DressColor[]
  attire: string
  alignRight?: boolean
}) {
  return (
    <div
      className={cn(
        'flex flex-col gap-2',
        alignRight ? 'items-start md:items-end' : 'items-start',
      )}
    >
      <span className="text-[0.6rem] font-medium uppercase tracking-[0.42em] text-accent-foreground/80">
        Dress Code
      </span>

      {/* colour cluster: three separate swatches with two soft petals */}
      <div
        className={cn(
          'relative inline-flex items-center gap-2.5',
          alignRight && 'md:flex-row-reverse',
        )}
        aria-hidden="true"
      >
        <span
          className="absolute -left-5 top-3.5 size-2.5 rounded-full"
          style={{ backgroundColor: 'oklch(0.95 0.02 25 / 0.85)' }}
        />
        <span
          className="absolute -right-5 top-4 size-2 rounded-full"
          style={{ backgroundColor: 'oklch(0.96 0.02 85 / 0.9)' }}
        />
        {colors.map((color) => (
          <span
            key={color.name}
            className="relative size-4 rounded-full ring-1 ring-inset ring-[oklch(1_0_0/0.45)]"
            style={{
              backgroundColor: color.hex,
              boxShadow:
                '0 0 0 1px oklch(0.8 0.05 85 / 0.55), 0 1px 4px oklch(0.4 0.05 60 / 0.22)',
            }}
          />
        ))}
      </div>

      <p className="font-serif text-sm italic leading-none text-foreground/85">
        {colors.map((c) => c.name).join(' · ')}
      </p>
      <p className="text-[0.58rem] uppercase leading-relaxed tracking-[0.22em] text-foreground/60">
        {attire}
      </p>
    </div>
  )
}

/** Shared ornament shown above every ceremony name. */
const SEAL_IMAGE = '/media/wedding-logo.jpg'

/** Gold-ringed common motif — same for every event, no label text. */
function EventSeal() {
  return (
    <span className="relative inline-block size-11 shrink-0 overflow-hidden rounded-full border border-accent/50 bg-card shadow-[0_6px_16px_-10px_oklch(0.45_0.08_240/0.7)]">
      <Image
        src={SEAL_IMAGE || '/placeholder.svg'}
        alt=""
        fill
        sizes="44px"
        aria-hidden="true"
        className="object-cover"
      />
    </span>
  )
}

function ChipIcon({ kind }: { kind: 'calendar' | 'clock' | 'nav' }) {
  const paths = {
    calendar: (
      <>
        <rect x="4" y="5" width="16" height="16" rx="2" />
        <path d="M8 3v4M16 3v4M4 10h16" />
      </>
    ),
    clock: (
      <>
        <circle cx="12" cy="12" r="8" />
        <path d="M12 8v4l3 2" />
      </>
    ),
    nav: <path d="M12 3l8 18-8-5-8 5z" />,
  }
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-3.5 shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[kind]}
    </svg>
  )
}

/** Muted looping preview that keeps playing at all times — never pauses. */
function AutoVideo({ video, name }: { video: CelebrationVideo; name: string }) {
  const ref = useRef<HTMLVideoElement | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const keepPlaying = () => {
      el.play().catch(() => {})
    }

    keepPlaying()
    el.addEventListener('pause', keepPlaying)
    return () => el.removeEventListener('pause', keepPlaying)
  }, [])

  return (
    <video
      ref={ref}
      src={video.src}
      poster={video.poster}
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      aria-label={name}
      className="absolute inset-0 size-full object-cover transition-transform duration-[900ms] ease-out group-hover/media:scale-[1.08]"
    />
  )
}

function EventRow({
  c,
  index,
  active,
  onPlay,
}: {
  c: Celebration
  index: number
  active: number
  onPlay: (v: CelebrationVideo) => void
}) {
  const imageFirst = index % 2 === 0
  const reached = index <= active

  const media = (
    <div className="group/media relative">
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[22px] border border-accent/40 bg-card shadow-[0_30px_60px_-34px_oklch(0.45_0.08_240/0.55)] transition-[transform,box-shadow,border-color] duration-500 ease-out group-hover/media:-translate-y-1.5 group-hover/media:border-accent group-hover/media:shadow-[0_40px_70px_-30px_oklch(0.45_0.08_240/0.65)]">
        {c.video ? (
          <AutoVideo video={c.video} name={c.name} />
        ) : (
          <Image
            src={c.image || '/placeholder.svg'}
            alt={c.name}
            fill
            sizes="(max-width: 768px) 88vw, 420px"
            className="object-cover transition-transform duration-[900ms] ease-out group-hover/media:scale-[1.08]"
          />
        )}

        {/* soft gold wash that fades in on hover */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[oklch(0.45_0.06_240/0.45)] via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover/media:opacity-100"
        />
        {/* light sweep across the frame on hover */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 skew-x-12 bg-gradient-to-r from-transparent via-[oklch(1_0_0/0.35)] to-transparent transition-transform duration-[900ms] ease-out group-hover/media:translate-x-[420%]"
        />

        {c.video && (
          <button
            type="button"
            onClick={() => onPlay(c.video!)}
            aria-label={`Watch ${c.name}`}
            className="absolute inset-0 cursor-pointer rounded-[22px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
          />
        )}
      </div>
    </div>
  )

  const text = (
    <div className={imageFirst ? 'md:text-left' : 'md:text-right'}>
      <div className={imageFirst ? '' : 'md:flex md:justify-end'}>
        <EventSeal />
      </div>
      <h3 className="mt-3 font-serif text-2xl font-light leading-tight text-foreground sm:text-3xl">
        {c.name}
      </h3>

      {/* day / date / time as separate icon chips */}
      <div className={`mt-3 flex flex-wrap items-center gap-2 ${imageFirst ? '' : 'md:justify-end'}`}>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/40 bg-card/70 px-3 py-1 text-[0.62rem] uppercase tracking-[0.18em] text-accent-foreground/85">
          <ChipIcon kind="calendar" />
          {c.day}, {c.date}
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/40 bg-card/70 px-3 py-1 text-[0.62rem] uppercase tracking-[0.18em] text-accent-foreground/85">
          <ChipIcon kind="clock" />
          {c.time}
        </span>
      </div>

      <p className="mt-3 text-pretty font-serif text-base italic leading-snug text-foreground/80">
        {c.description}
      </p>

      {/* dress code, invitation-card style */}
      <div className="mt-5">
        <DressCode
          colors={c.dressColors}
          attire={c.dressAttire}
          alignRight={!imageFirst}
        />
      </div>

      {/* directions styled as a filled pill button */}
      <div className={`mt-5 flex ${imageFirst ? '' : 'md:justify-end'}`}>
        <a
          href={mapsHref(c.mapQuery)}
          target="_blank"
          rel="noopener noreferrer"
          className="group/dir inline-flex items-center gap-2 rounded-full border border-accent/45 bg-accent/10 px-4 py-2 text-[0.62rem] font-medium uppercase tracking-[0.2em] text-accent-foreground transition-colors hover:border-accent hover:text-foreground"
        >
          <span className="flex size-5 items-center justify-center rounded-full bg-accent/20 text-accent-foreground">
            <ChipIcon kind="nav" />
          </span>
          <span className="max-w-[13rem] truncate normal-case tracking-normal">{c.venue}</span>
          <span className="opacity-70 transition-transform group-hover/dir:translate-x-0.5">&rarr;</span>
        </a>
      </div>
    </div>
  )

  return (
    <motion.li
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-100px' }}
      className="relative"
    >
      {/* heart marker sitting on the centre line */}
      <motion.span
        className="absolute left-[18px] top-1 z-10 -translate-x-1/2 md:left-1/2"
        variants={{
          hidden: { opacity: 0, scale: 0.4 },
          show: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: 'easeOut', delay: 0.15 } },
        }}
      >
        <HeartMark filled={reached} active={index === active} />
      </motion.span>

      <div className="grid items-center gap-5 pl-12 md:grid-cols-2 md:gap-14 md:pl-0">
        <motion.div
          className={imageFirst ? 'md:order-1 md:pr-6' : 'md:order-2 md:pl-6'}
          variants={{
            hidden: { opacity: 0, x: imageFirst ? -64 : 64 },
            show: { opacity: 1, x: 0, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } },
          }}
        >
          {media}
        </motion.div>
        <motion.div
          className={imageFirst ? 'md:order-2 md:pl-6' : 'md:order-1 md:pr-6'}
          variants={{
            hidden: { opacity: 0, x: imageFirst ? 48 : -48, y: 16 },
            show: { opacity: 1, x: 0, y: 0, transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.12 } },
          }}
        >
          {text}
        </motion.div>
      </div>
    </motion.li>
  )
}

function VideoLightbox({
  video,
  onClose,
}: {
  video: CelebrationVideo | null
  onClose: () => void
}) {
  if (!video) return null
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-[oklch(0.2_0.03_240/0.72)] p-5 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full max-w-3xl overflow-hidden rounded-2xl border border-accent/40 bg-card"
        onClick={(e) => e.stopPropagation()}
      >
        <video
          src={video.src}
          poster={video.poster}
          controls
          autoPlay
          className="aspect-video w-full bg-black"
        />
        <button
          type="button"
          onClick={onClose}
          aria-label="Close video"
          className="absolute right-3 top-3 flex size-9 items-center justify-center rounded-full border border-accent/50 bg-card/90 text-accent-foreground transition-colors hover:bg-accent hover:text-primary-foreground"
        >
          <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
      </div>
    </motion.div>
  )
}

export function Celebrations() {
  const container = useRef<HTMLOListElement | null>(null)
  const [active, setActive] = useState(0)
  const [video, setVideo] = useState<CelebrationVideo | null>(null)

  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start center', 'end center'],
  })

  const fill = useTransform(scrollYProgress, [0, 1], [0, 1])
  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    setActive(Math.min(Math.max(Math.round(p * (TOTAL - 1)), 0), TOTAL - 1))
  })

  return (
    <section
      id="celebrations"
      className="relative isolate w-full overflow-hidden px-5 py-24 sm:px-8 sm:py-32"
      style={{
        background:
          'linear-gradient(200deg, oklch(0.91 0.042 238) 0%, oklch(0.97 0.016 234) 40%, oklch(0.99 0.014 90) 100%)',
      }}
    >
      <Petals count={10} />
      <Sparkles count={12} />

      <div className="relative z-10 mx-auto max-w-5xl">
        <div className="text-center">
          <Eyebrow>Seven days of joy</Eyebrow>
          <h2 className="mt-4 font-serif text-4xl font-light italic text-foreground sm:text-6xl">
            Our Wedding Celebrations
          </h2>
          <GoldDivider className="mt-6" />
        </div>

        {/* heart timeline */}
        <div className="relative mt-16 sm:mt-20">
          {/* centre line track + scroll-driven fill */}
          <span
            aria-hidden="true"
            className="absolute bottom-0 left-[18px] top-[22px] w-[2px] rounded-full bg-accent/20 md:left-1/2 md:-translate-x-1/2"
          />
          <motion.span
            aria-hidden="true"
            style={{ scaleY: fill }}
            className="absolute bottom-0 left-[18px] top-[22px] w-[2px] origin-top rounded-full bg-gradient-to-b from-accent to-accent/60 md:left-1/2 md:-translate-x-1/2"
          />

          <ol ref={container} className="flex flex-col gap-16 sm:gap-24">
            {celebrations.map((c, i) => (
              <EventRow
                key={c.name}
                c={c}
                index={i}
                active={active}
                onPlay={setVideo}
              />
            ))}
          </ol>
        </div>
      </div>

      <VideoLightbox video={video} onClose={() => setVideo(null)} />
    </section>
  )
}
