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

declare global {
  interface Window {
    YT?: any
    onYouTubeIframeAPIReady?: () => void
  }
}

export function MusicProvider({ children }: { children: React.ReactNode }) {
  const [playing, setPlaying] = useState(false)
  const [armed, setArmed] = useState(false)
  const playerRef = useRef<any>(null)
  const readyRef = useRef(false)
  const wantPlayRef = useRef(false)
  const containerId = 'yt-wedding-audio'

  // Load the YouTube IFrame API once
  useEffect(() => {
    let cancelled = false

    function createPlayer() {
      if (cancelled || playerRef.current || !window.YT?.Player) return
      playerRef.current = new window.YT.Player(containerId, {
        videoId: wedding.music.youtubeId,
        playerVars: {
          autoplay: 0,
          controls: 0,
          disablekb: 1,
          fs: 0,
          loop: 1,
          playlist: wedding.music.youtubeId,
          modestbranding: 1,
          playsinline: 1,
          rel: 0,
        },
        events: {
          onReady: (e: any) => {
            readyRef.current = true
            try {
              e.target.unMute()
              e.target.setVolume(42)
            } catch {}
            if (wantPlayRef.current) {
              e.target.playVideo()
            }
          },
          onStateChange: (e: any) => {
            const YT = window.YT
            if (!YT) return
            if (e.data === YT.PlayerState.PLAYING) setPlaying(true)
            if (
              e.data === YT.PlayerState.PAUSED ||
              e.data === YT.PlayerState.ENDED
            ) {
              setPlaying(false)
            }
          },
        },
      })
    }

    if (window.YT?.Player) {
      createPlayer()
    } else {
      const prev = window.onYouTubeIframeAPIReady
      window.onYouTubeIframeAPIReady = () => {
        prev?.()
        createPlayer()
      }
      if (!document.getElementById('yt-iframe-api')) {
        const s = document.createElement('script')
        s.id = 'yt-iframe-api'
        s.src = 'https://www.youtube.com/iframe_api'
        s.async = true
        document.body.appendChild(s)
      }
    }

    return () => {
      cancelled = true
    }
  }, [])

  const start = useCallback(() => {
    setArmed(true)
    wantPlayRef.current = true
    const p = playerRef.current
    if (p && readyRef.current) {
      try {
        p.unMute()
        p.setVolume(42)
        p.playVideo()
      } catch {}
    }
    setPlaying(true)
  }, [])

  const toggle = useCallback(() => {
    const p = playerRef.current
    if (!p || !readyRef.current) {
      wantPlayRef.current = !wantPlayRef.current
      setPlaying(wantPlayRef.current)
      return
    }
    try {
      const state = p.getPlayerState?.()
      const isPlaying = state === window.YT?.PlayerState?.PLAYING
      if (isPlaying) {
        // pauseVideo keeps the exact playback position
        p.pauseVideo()
        setPlaying(false)
        wantPlayRef.current = false
      } else {
        p.unMute()
        p.playVideo()
        setPlaying(true)
        wantPlayRef.current = true
      }
    } catch {}
  }, [])

  const duck = useCallback((on: boolean) => {
    const p = playerRef.current
    if (!p || !readyRef.current) return
    try {
      p.setVolume(on ? 8 : 42)
    } catch {}
  }, [])

  return (
    <MusicContext.Provider value={{ playing, armed, start, toggle, duck }}>
      {/* Hidden, persistent audio source — never remounts, so the song never restarts */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed -left-[9999px] top-0 h-[1px] w-[1px] overflow-hidden opacity-0"
      >
        <div id={containerId} />
      </div>
      {children}
    </MusicContext.Provider>
  )
}
