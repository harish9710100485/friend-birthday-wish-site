"use client"
import { useEffect, useRef, useState } from 'react'
import { Howl } from 'howler'
import { useInteractive } from '../context/InteractiveProvider'
import content from '../data/content.json'
import { withBasePath } from '../lib/assetPath'

const { chapter, title, intro, caption, audioSrc } = content.voice

export default function VoiceMessage(){
  const howl = useRef<Howl | null>(null)
  const [playing, setPlaying] = useState(false)
  const { duckAmbient, restoreAmbient } = useInteractive()

  useEffect(() => {
    howl.current = new Howl({
      src: [withBasePath(audioSrc)],
      onend: () => {
        setPlaying(false)
        restoreAmbient()
      },
    })
    return () => { howl.current?.unload() }
  }, [])

  function toggle(){
    if (!howl.current) return
    if (playing) {
      howl.current.pause()
      setPlaying(false)
      restoreAmbient()
    } else {
      duckAmbient()
      howl.current.play()
      setPlaying(true)
    }
  }

  return (
    <section id="voice" data-reveal className="py-24">
      <div className="max-w-2xl mx-auto px-6 text-center">
        <div className="text-sm uppercase tracking-[0.4em] text-[#D7B56D] mb-4">{chapter}</div>
        <h2 className="text-4xl md:text-5xl font-semibold text-gradient-friendship mb-8">{title}</h2>
        <p className="mx-auto mb-8 max-w-md text-[#C9B997]/80">{intro}</p>
        <button
          onClick={toggle}
          className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-[linear-gradient(135deg,#d7b56d,#f0dca0)] text-3xl text-[#161812] shadow-glow transition hover:scale-105"
        >
          {playing ? '∥' : '▸'}
        </button>
        <p className="mt-6 text-[#C9B997]">{caption}</p>
      </div>
    </section>
  )
}
