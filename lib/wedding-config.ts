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
  poster?: string
  title: string
  caption?: string
  orientation: 'portrait' | 'landscape'
}

export const memories: MediaItem[] = [
  {
    id: 'ballroom',
    type: 'image',
    src: '/media/ballroom-dance.jpeg',
    title: 'The First Dance',
    caption: 'Under a thousand candles, the world went quiet.',
    orientation: 'portrait',
  },
  {
    id: 'sangeet',
    type: 'video',
    src: '/media/sangeet-dance.mp4',
    poster: '/media/ballroom-dance.jpeg',
    title: 'Sangeet Night',
    caption: 'Music, laughter and a floor full of family.',
    orientation: 'portrait',
  },
  {
    id: 'invite-photo',
    type: 'image',
    src: '/media/invitation-ceremony.jpeg',
    title: 'Lagan Lekhan',
    caption: 'The first card, written with blessings.',
    orientation: 'portrait',
  },
  {
    id: 'haldi',
    type: 'video',
    src: '/media/haldi-celebration.mp4',
    poster: '/media/invitation-ceremony.jpeg',
    title: 'Haldi Ceremony',
    caption: 'Turmeric, marigolds and golden light.',
    orientation: 'portrait',
  },
  {
    id: 'couple',
    type: 'image',
    src: '/media/couple-portrait.png',
    title: 'Arnav & Kiara',
    caption: 'Two hearts, one beautiful story.',
    orientation: 'portrait',
  },
  {
    id: 'invite-video',
    type: 'video',
    src: '/media/invitation-ceremony.mp4',
    poster: '/media/invitation-ceremony.jpeg',
    title: 'Invitation Ceremony',
    caption: 'Placing the first invitation at His feet.',
    orientation: 'portrait',
  },
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
export const story = [
  {
    chapter: 'The Beginning',
    text: 'Some stories begin with a moment — a glance across a crowded room in Ahmedabad, and a conversation that never really ended.',
    image: '/media/invitation-ceremony.jpeg',
  },
  {
    chapter: 'The Journey',
    text: 'Some moments become memories — late night drives, festival lights, endless chai and a thousand ordinary days made golden.',
    video: '/media/haldi-celebration.mp4',
    poster: '/media/invitation-ceremony.jpeg',
  },
  {
    chapter: 'The Moment',
    text: 'Some memories become forever — one question, one trembling yes, and two families that became one.',
    image: '/media/ballroom-dance.jpeg',
  },
  {
    chapter: 'Forever',
    text: 'And now, our forever begins — with your blessings, in a hall full of flowers and the people we love most.',
    video: '/media/sangeet-dance.mp4',
    poster: '/media/ballroom-dance.jpeg',
  },
] as const