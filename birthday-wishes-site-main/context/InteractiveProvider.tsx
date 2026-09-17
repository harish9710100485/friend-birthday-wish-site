"use client"
import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { Howl } from 'howler'
import { fireConfetti } from '../utils/confetti'
import useKonami from '../hooks/useKonami'
import { initLenis } from '../lib/lenis'
import { withBasePath } from '../lib/assetPath'
import content from '../data/content.json'

type Ctx = {
  celebrate: () => void
  phase: 1 | 2
  startPhaseTwo: () => void
  ambientPlaying: boolean
  toggleAmbient: () => void
  duckAmbient: () => void
  restoreAmbient: () => void
  foundMoon: boolean
  foundHeart: boolean
  hintTarget: 'moon' | 'heart' | null
  requestHint: () => void
  markFound: (which: 'moon' | 'heart') => void
  resetEggs: () => void
}
const C = createContext<Ctx | undefined>(undefined)

export function useInteractive(){
  const c = useContext(C)
  if (!c) throw new Error('useInteractive must be inside InteractiveProvider')
  return c
}

export default function InteractiveProvider({ children }: { children: React.ReactNode }){
  const celebrate = useCallback(()=>{ fireConfetti() }, [])
  const soundRef = useRef<Howl | null>(null)
  const wasDucked = useRef(false)
  const pauseTimeout = useRef<number | null>(null)
  const [phase, setPhase] = useState<1 | 2>(1)
  const [ambientPlaying, setAmbientPlaying] = useState(false)
  const [foundMoon, setFoundMoon] = useState(false)
  const [foundHeart, setFoundHeart] = useState(false)
  const [hintTarget, setHintTarget] = useState<'moon' | 'heart' | null>(null)

  const requestHint = useCallback(() => {
    setHintTarget(!foundMoon ? 'moon' : !foundHeart ? 'heart' : null)
  }, [foundMoon, foundHeart])

  const markFound = useCallback((which: 'moon' | 'heart') => {
    if (which === 'moon') setFoundMoon(true)
    else setFoundHeart(true)
    setHintTarget(null)
  }, [])

  const resetEggs = useCallback(() => {
    setFoundMoon(false)
    setFoundHeart(false)
    setHintTarget(null)
  }, [])

  const startPhaseTwo = useCallback(() => setPhase(2), [])

  useKonami(()=>{ celebrate() })
  useEffect(()=>{ initLenis() }, [])

  useEffect(() => {
    const src = content.hero.audioSrc
    if (!src) return
    const sound = new Howl({ src: [withBasePath(src)], volume: 0, loop: true })
    soundRef.current = sound

    // Browsers block non-gesture audio autoplay. Attempt immediately, then
    // fall back to starting on the visitor's first genuine click/tap/keypress.
    // ambientPlaying is set explicitly here (not via a generic 'play' listener)
    // so it only reflects this one-time autoplay confirmation — manual toggles
    // below set it themselves, immediately, instead of waiting on Howler events.
    sound.once('play', () => {
      sound.fade(0, 0.7, 2500)
      setAmbientPlaying(true)
      window.removeEventListener('pointerdown', tryPlay)
      window.removeEventListener('keydown', tryPlay)
    })

    const tryPlay = () => { if (!sound.playing()) sound.play() }
    tryPlay()
    window.addEventListener('pointerdown', tryPlay)
    window.addEventListener('keydown', tryPlay)

    return () => {
      window.removeEventListener('pointerdown', tryPlay)
      window.removeEventListener('keydown', tryPlay)
      sound.unload()
    }
  }, [])

  const toggleAmbient = useCallback(() => {
    const sound = soundRef.current
    if (!sound) return
    if (pauseTimeout.current) {
      window.clearTimeout(pauseTimeout.current)
      pauseTimeout.current = null
    }
    if (sound.playing()) {
      setAmbientPlaying(false)
      sound.fade(sound.volume(), 0, 1000)
      pauseTimeout.current = window.setTimeout(() => sound.pause(), 1000)
    } else {
      setAmbientPlaying(true)
      sound.play()
      sound.fade(0, 0.7, 1200)
    }
  }, [])

  const duckAmbient = useCallback(() => {
    const sound = soundRef.current
    if (!sound || !sound.playing()) return
    wasDucked.current = true
    setAmbientPlaying(false)
    sound.fade(sound.volume(), 0, 400)
    window.setTimeout(() => sound.stop(), 400)
  }, [])

  const restoreAmbient = useCallback(() => {
    const sound = soundRef.current
    if (!sound || !wasDucked.current) return
    wasDucked.current = false
    setAmbientPlaying(true)
    sound.play()
    sound.fade(0, 0.7, 800)
  }, [])

  const value = useMemo(
    () => ({ phase, startPhaseTwo, celebrate, ambientPlaying, toggleAmbient, duckAmbient, restoreAmbient, foundMoon, foundHeart, hintTarget, requestHint, markFound, resetEggs }),
    [phase, startPhaseTwo, celebrate, ambientPlaying, toggleAmbient, duckAmbient, restoreAmbient, foundMoon, foundHeart, hintTarget, requestHint, markFound, resetEggs]
  )

  return (
    <C.Provider value={value}>
      {children}
    </C.Provider>
  )
}
