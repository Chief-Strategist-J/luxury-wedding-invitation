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

  hashtag: '#AriaKiShaadi',

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
}

/**
 * Story timeline. The Memories ring renders only `type === 'image'`,
 * the video entries stay here so the films/lightbox keep working.
 */
export const memories: MediaItem[] = [
  {
    id: 'first-date',
    type: 'image',
    src: '/media/couple-portrait.png',
    title: 'First Date',
    caption:
      'Two coffees, one shared dessert and a conversation that refused to end.',
    orientation: 'portrait',
    year: '2019',
    meta: 'Blue Tokai, Ahmedabad · 14 Feb',
  },
  {
    id: 'road-trip',
    type: 'image',
    src: '/media/couple-portrait.png',
    title: 'The Road Trip',
    caption:
      'Wrong turns, one playlist on repeat, and a sunset we still talk about.',
    orientation: 'portrait',
    year: '2021',
    meta: 'Saputara Ghats · Nov',
  },
  {
    id: 'proposal',
    type: 'image',
     src: '/media/couple-portrait.png',
    title: 'The Proposal',
    caption: 'Fairy lights, shaking hands and a yes before the question ended.',
    orientation: 'portrait',
    year: '2023',
    meta: 'Rooftop at home · 09 Dec',
  },
  {
    id: 'engagement',
    type: 'image',
     src: '/media/couple-portrait.png',
    title: 'Engagement',
    caption: 'Rings exchanged, both families finally in one loud, happy room.',
    orientation: 'portrait',
    year: '2024',
    meta: 'The Grand Hall · 21 Jan',
  },
  {
    id: 'invite-photo',
    type: 'image',
     src: '/media/couple-portrait.png',
    title: 'Lagan Lekhan',
    caption: 'The first card, written with blessings.',
    orientation: 'portrait',
    year: '2026',
    meta: 'Patel Residence · 07 Dec',
  },
  {
    id: 'couple',
    type: 'image',
     src: '/media/couple-portrait.png',
    title: 'Arnav & Kiara',
    caption: 'Two hearts, one beautiful story.',
    orientation: 'portrait',
    year: '2026',
    meta: 'Grand Mandap · 12 Dec',
  },
  {
    id: 'ballroom',
    type: 'image',
    src: '/media/ballroom-dance.jpeg',
    title: 'The First Dance',
    caption: 'Under a thousand candles, the world went quiet.',
    orientation: 'portrait',
    year: '2026',
    meta: 'Crystal Ballroom · 11 Dec',
  },
 {
  id: 'rainy-day',
  type: 'image',
  src: '/media/couple-portrait.png',
  title: 'Rainy Day',
  caption:
    'One umbrella, endless laughter and the kind of rain we never wanted to end.',
  orientation: 'portrait',
  year: '2022',
  meta: 'Marine Drive · July',
},
  {
  id: 'stargazing',
  type: 'image',
   src: '/media/couple-portrait.png',
  title: 'Under the Stars',
  caption:
    'A quiet night, countless stars, and dreams that suddenly felt possible together.',
  orientation: 'portrait',
  year: '2023',
  meta: 'Rann of Kutch · Winter',
},
{
  id: 'sunrise',
  type: 'image',
   src: '/media/couple-portrait.png',
  title: 'Sunrise Adventure',
  caption:
    'We woke before the world did, just to watch the first rays paint the mountains together.',
  orientation: 'portrait',
  year: '2022',
  meta: 'Mount Abu · 5:45 AM',
}
]

// ── Celebrations ─────────────────────────────────────────────
export type Celebration = {
  name: string
  date: string
  time: string
  venue: string
  description: string
  media?: MediaItem
}

export const celebrations: Celebration[] = [
  {
    name: 'Ganesh Sthapna',
    date: '06 December 2026',
    time: '09:00 AM',
    venue: 'Patel Residence, Ahmedabad',
    description: 'Beginning every beautiful thing with His blessings.',
  },
  {
    name: 'Lagan Lekhan',
    date: '07 December 2026',
    time: '11:00 AM',
    venue: 'Patel Residence, Ahmedabad',
    description: 'The writing of the wedding invitation, by hand and by heart.',
    media: {
      id: 'c-lagan',
      type: 'video',
      src: '/media/invitation-ceremony.mp4',
      poster: '/media/invitation-ceremony.jpeg',
      title: 'Lagan Lekhan',
      orientation: 'portrait',
    },
  },
  {
    name: 'Mehndi',
    date: '09 December 2026',
    time: '04:00 PM',
    venue: 'Garden Courtyard, The Leela Palace Gardens',
    description: 'Henna, hushed secrets and a name hidden in the vines.',
  },
  {
    name: 'Haldi',
    date: '10 December 2026',
    time: '10:00 AM',
    venue: 'Poolside Lawn, The Leela Palace Gardens',
    description: 'A morning painted in turmeric gold and marigold laughter.',
    media: {
      id: 'c-haldi',
      type: 'video',
      src: '/media/haldi-celebration.mp4',
      poster: '/media/invitation-ceremony.jpeg',
      title: 'Haldi Ceremony',
      orientation: 'portrait',
    },
  },
  {
    name: 'Sangeet',
    date: '11 December 2026',
    time: '07:30 PM',
    venue: 'Crystal Ballroom, The Leela Palace Gardens',
    description: 'Chandeliers, choreography and one unforgettable first dance.',
    media: {
      id: 'c-sangeet',
      type: 'video',
      src: '/media/sangeet-dance.mp4',
      poster: '/media/ballroom-dance.jpeg',
      title: 'Sangeet Night',
      orientation: 'portrait',
    },
  },
  {
    name: 'Wedding',
    date: '12 December 2026',
    time: '07:00 PM',
    venue: 'Grand Mandap, The Leela Palace Gardens',
    description: 'Seven vows, seven steps, and forever after.',
  },
  {
    name: 'Bidai',
    date: '13 December 2026',
    time: '11:00 AM',
    venue: 'Palace Porch, The Leela Palace Gardens',
    description: 'A tearful goodbye that is really a beautiful hello.',
  },
]

// ── Story ────────────────────────────────────────────────────
// The story copy is already baked into /media/chapter-1..4.png,
// so only the image list lives here (used for the stacked scroll).
export const storyChapters = [
  { image: chapter1, label: 'A Beautiful Beginning' },
  { image: chapter2, label: 'Two Hearts, One Journey' },
  { image: chapter3, label: 'When Families Become One' },
  { image: chapter4, label: 'The Beginning of Forever' },
] as const
