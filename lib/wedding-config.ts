const chapter1 = '/media/chapter-1.png'
const chapter2 = '/media/chapter-2.png'
const chapter3 = '/media/chapter-3.png'
const chapter4 = '/media/chapter-4.png'

// ─────────────────────────────────────────────────────────────
// Single source of truth for the whole invitation.
// Change values here and the entire website updates.
// ─────────────────────────────────────────────────────────────

export const wedding = {
  groom: 'Arnav',
  groomFull: 'Arnav Patel',
  groomFather: 'Rajeshbhai Ganeshbhai Patel',
  groomMother: 'Mittalben Rajeshbhai Patel',

  bride: 'Kiara',
  brideFull: 'Kiara Patel',
  brideFather: 'Vikrambhai Pravinbhai Patel',
  brideMother: 'Meeraben Vikrambhai Patel',

  hashtag: '#AriaraKiShaadi',

  /** The ONE date that powers the date reveal + countdown. */
  date: '2026-12-12T19:00:00+05:30',

  venue: {
    name: 'The Leela Palace Gardens',
    city: 'Ahmedabad, Gujarat',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Ahmedabad,Gujarat',
  },

  /** YouTube background music (Shorts / video id). */
  music: {
    youtubeId: 'rSmbLLTHRBc',
    title: 'Our Wedding Song',
  },
} as const

const d = new Date(wedding.date)

export const weddingDateParts = {
  day: String(d.getDate()).padStart(2, '0'),
  month: d.toLocaleString('en-US', { month: 'long' }),
  year: String(d.getFullYear()),
  weekday: d.toLocaleString('en-US', { weekday: 'long' }),
}

export const weddingDateLine = `${weddingDateParts.day} ${weddingDateParts.month} ${weddingDateParts.year}`

// ── Media ────────────────────────────────────────────────────
export type MediaItem = {
  id: string
  type: 'image' | 'video'
  src: string
  /** Poster frame, used when `type === 'video'`. */
  poster?: string
  title: string
  caption?: string
  orientation: 'portrait' | 'landscape'
  /** Year badge printed on the memory card (optional). */
  year?: string
  /** Small line under the caption, e.g. place + date (optional). */
  meta?: string
  /** Month (1-12) inside the year — used only to sort memories. */
  month?: number
}

/**
 * Story timeline — kept in strict chronological order, one year after the
 * other (2019 → 2026) with at most two memories inside a single year.
 * 2019 "First Date" is always the very first frame of the ring.
 *
 * The Memories ring renders only `type === 'image'`, the video entries stay
 * here so the films/lightbox keep working.
 */
export const memories: MediaItem[] = [
  // ── 2019 ───────────────────────────────────────────────────
  {
    id: 'first-date',
    type: 'image',
    src: '/media/first-date.png',
    title: 'First Date',
    caption:
      'Two coffees, one shared dessert and a conversation that refused to end.',
    orientation: 'portrait',
    year: '2019',
    month: 2,
    meta: 'Blue Tokai, Ahmedabad · 14 Feb',
  },
  // ── 2020 ───────────────────────────────────────────────────
  {
    id: 'rainy-day',
    type: 'image',
    src: '/media/rainy-day.png',
    title: 'Rainy Day',
    caption:
      'One umbrella, endless laughter and the kind of rain we never wanted to end.',
    orientation: 'portrait',
    year: '2020',
    month: 7,
    meta: 'Marine Drive · July',
  },
  // ── 2021 ───────────────────────────────────────────────────
  {
    id: 'road-trip',
    type: 'image',
    src: '/media/road-trip.png',
    title: 'The Road Trip',
    caption:
      'Wrong turns, one playlist on repeat, and a sunset we still talk about.',
    orientation: 'portrait',
    year: '2021',
    month: 11,
    meta: 'Saputara Ghats · Nov',
  },
  // ── 2022 ───────────────────────────────────────────────────
  {
    id: 'sunrise',
    type: 'image',
    src: '/media/sunrise.png',
    title: 'Sunrise Adventure',
    caption:
      'We woke before the world did, just to watch the first rays paint the mountains together.',
    orientation: 'portrait',
    year: '2022',
    month: 4,
    meta: 'Mount Abu · 5:45 AM',
  },
  // ── 2023 ───────────────────────────────────────────────────
  {
    id: 'lantern-night',
    type: 'image',
    src: '/media/lantern.png',
    title: 'Lantern Wishes',
    caption:
      'With every lantern we released, our dreams found their way to the stars.',
    orientation: 'portrait',
    year: '2023',
    month: 10,
    meta: 'Lakeside Festival · Evening',
  },
  {
    id: 'proposal',
    type: 'image',
    src: '/media/proposal.png',
    title: 'The Proposal',
    caption: 'Fairy lights, shaking hands and a yes before the question ended.',
    orientation: 'portrait',
    year: '2023',
    month: 12,
    meta: 'Rooftop at home · 09 Dec',
  },
  // ── 2024 ───────────────────────────────────────────────────
  {
    id: 'engagement',
    type: 'image',
    src: '/media/engagement.png',
    title: 'Engagement',
    caption: 'Rings exchanged, both families finally in one loud, happy room.',
    orientation: 'portrait',
    year: '2024',
    month: 1,
    meta: 'The Grand Hall · 21 Jan',
  },
  {
    id: 'surprise-birthday',
    type: 'image',
    src: '/media/surprise-birthday.png',
    title: 'Surprise Birthday',
    caption: 'The smile on your face was worth every secret we kept.',
    orientation: 'portrait',
    year: '2024',
    month: 8,
    meta: 'Private Rooftop · 18 August',
  },
  // ── 2025 ───────────────────────────────────────────────────
  {
    id: 'first-dance',
    type: 'image',
    src: '/media/first-dance.png',
    title: 'The First Dance',
    caption: 'Under a thousand candles, the world went quiet.',
    orientation: 'portrait',
    year: '2025',
    month: 12,
    meta: 'Crystal Ballroom · 11 Dec',
  },
  // ── 2026 ───────────────────────────────────────────────────
   {
    id: 'lake-boat-ride',
    type: 'image',
    src: '/media/lake-boat-ride.png',
    title: 'Lake Boat Ride',
    caption: 'The water was calm, but our hearts were full of excitement.',
    orientation: 'portrait',
    year: '2026',
    month: 9,
    meta: 'Udaipur Lake · Evening',
  },
]

/**
 * Memory images sorted strictly year → month, so the ring can never show
 * 2025 sitting next to 2021 even if the list above is reordered by hand.
 */
export const memoryFrames: MediaItem[] = memories
  .filter((m) => m.type === 'image')
  .slice()
  .sort((a, b) => {
    const ya = Number(a.year ?? 0)
    const yb = Number(b.year ?? 0)
    if (ya !== yb) return ya - yb
    return (a.month ?? 0) - (b.month ?? 0)
  })

/** Every year present in the timeline, in order: 2019 … 2026. */
export const memoryYears: string[] = Array.from(
  new Set(memoryFrames.map((m) => m.year ?? '')),
).filter(Boolean)


// ── Story ────────────────────────────────────────────────────
// The story copy is already baked into /media/chapter-1..4.png,
// so only the image list lives here (used for the stacked scroll).
export const storyChapters = [
  { image: chapter1, label: 'A Beautiful Beginning' },
  { image: chapter2, label: 'Two Hearts, One Journey' },
  { image: chapter3, label: 'When Families Become One' },
  { image: chapter4, label: 'The Beginning of Forever' },
] as const
