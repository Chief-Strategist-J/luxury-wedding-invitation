'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import { wedding } from '@/lib/wedding-config'

type MusicContextValue = {
  /** Is the song currently playing */
  playing: boolean
  /** Has the user opened the invitation (music armed) */
  armed: boolean
  /** Called once, when the user taps "Tap to Open" */
  start: () => void
  /** Toggle on / off — remembers exact playback position */
  toggle: () => void
  /** Lower the song volume while a video plays, then restore it */
  duck: (on: boolean) => void
}

const MusicContext = createContext<MusicContextValue>({
  playing: false,
  armed: false,
  start: () => {},
  toggle: () => {},
  duck: () => {},
})

export function useMusic() {
  return useContext(MusicContext)
}

export function MusicProvider({ children }: { children: React.ReactNode }) {
  const [playing, setPlaying] = useState(false)
  const [armed, setArmed] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Load the Music
useEffect(() => {
  const audio = new Audio("/audio/Arnav & Kiara Wedding.mp3")

  audio.loop = true
  audio.volume = 0.42

  audioRef.current = audio

  return () => {
    audio.pause()
  }
}, [])
 const start = useCallback(() => {
  setArmed(true)

  audioRef.current?.play()

  setPlaying(true)
}, [])

const toggle = useCallback(() => {
  if (!audioRef.current) return

  if (audioRef.current.paused) {
    audioRef.current.play()
    setPlaying(true)
  } else {
    audioRef.current.pause()
    setPlaying(false)
  }
}, [])

const duck = useCallback((on: boolean) => {
  if (!audioRef.current) return

  audioRef.current.volume = on ? 0.08 : 0.42
}, [])

  return (
    <MusicContext.Provider value={{ playing, armed, start, toggle, duck }}>
      {/* Hidden, persistent audio source — never remounts, so the song never restarts */}
      {children}
    </MusicContext.Provider>
  )
}
