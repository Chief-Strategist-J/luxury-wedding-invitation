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
// NOTE: text/chapter are no longer rendered on top of the image —
// the story text is already baked into chapter-1..4.png. They're
// kept here only for the alt text / accessibility label.
export const story = [
  {
    chapter: 'A Beautiful Beginning',
    text: 'Every beautiful journey begins with a moment we never planned. Two lives, two families, and two different paths came together in the most unexpected way. What started with a simple meeting slowly became a bond filled with laughter, understanding, and countless little moments that made our hearts feel at home.',
    image: chapter1,
  },
  {
    chapter: 'Two Hearts, One Journey',
    text: 'With every conversation, every celebration, and every shared dream, our bond grew stronger. We discovered joy in the simplest moments and found comfort in knowing that no matter where life took us, we would always have each other. Somewhere along the way, we realized that the best journeys are the ones taken together.',
    image: chapter2,
  },
  {
    chapter: 'When Families Become One',
    text: 'Love brought two hearts together, but blessings brought two families closer. With the warmth of our loved ones, the laughter of our families, and traditions passed down through generations, our journey became a celebration of something much greater — two families coming together to create one beautiful new beginning.',
    image: chapter3,
  },
  {
    chapter: 'The Beginning of Forever',
    text: 'And now, with hearts full of gratitude and dreams filled with hope, we step into a new chapter of our lives. Surrounded by the people who mean the most to us, we invite you to celebrate the laughter, love, rituals, and memories that will make this day unforgettable. Our forever begins here — and we would be honored to have you with us.',
    image: chapter4,
  },
] as const