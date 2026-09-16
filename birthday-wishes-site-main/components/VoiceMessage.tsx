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
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const { duckAmbient, restoreAmbient } = useInteractive()

  useEffect(() => {
    howl.current = new Howl({
      src: [withBasePath(audioSrc)],
      html5: true,
      onload: () => {
        setLoading(false)
        setError(false)
      },
      onplay: () => {
        setLoading(false)
        setPlaying(true)
      },
      onend: () => {
        setPlaying(false)
        restoreAmbient()
      },
      onloaderror: () => {
        setLoading(false)
        setError(true)
      },
      onplayerror: () => {
        setLoading(false)
        setError(true)
        restoreAmbient()
      },
    })
    return () => { howl.current?.unload() }
  }, [restoreAmbient])

  function toggle(){
    if (!howl.current) return
    if (playing) {
      howl.current.pause()
      setPlaying(false)
      restoreAmbient()
    } else {
      setError(false)
      setLoading(true)
      duckAmbient()
      howl.current.load()
      howl.current.play()
    }
  }

  return (
    <section id="voice" data-reveal className="py-24">
      <div className="max-w-2xl mx-auto px-6 text-center">
        <div className="text-sm uppercase tracking-[0.4em] text-[#D6488F] mb-4">{chapter}</div>
        <h2 className="text-4xl md:text-5xl font-semibold text-gradient-friendship mb-8">{title}</h2>
        <img
          src={withBasePath('/photos/duo.jpg')}
          alt="Two friends sharing a moment"
          className="mx-auto mb-8 aspect-video w-full max-w-xl rounded-3xl object-cover shadow-glow"
        />
        <p className="mx-auto mb-8 max-w-md text-[#6B2247]/80">{intro}</p>
        <button
          onClick={toggle}
          disabled={loading}
          aria-label={loading ? 'Loading message' : playing ? 'Pause message' : 'Play message'}
          className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-pink-400 via-fuchsia-500 to-rose-400 text-3xl text-black shadow-glow transition hover:scale-105 disabled:cursor-wait disabled:opacity-60"
        >
          {loading ? '…' : playing ? '❚❚' : '▶'}
        </button>
        <p className="mt-4 text-sm text-[#8A6478]">
          {error ? 'The message could not load. Press play to try again.' : loading ? 'Loading your message…' : playing ? 'Playing your message' : 'Press play to hear your message'}
        </p>
        <p className="mt-6 text-[#8A6478]">{caption}</p>
      </div>
    </section>
  )
}
