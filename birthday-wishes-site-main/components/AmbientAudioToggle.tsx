"use client"
import { useInteractive } from '../context/InteractiveProvider'

export default function AmbientAudioToggle(){
  const { ambientPlaying, toggleAmbient } = useInteractive()

  return (
    <button
      aria-label={ambientPlaying ? 'Pause music' : 'Play music'}
      onClick={toggleAmbient}
      className="fixed left-6 bottom-6 z-40 flex h-12 w-12 items-center justify-center rounded-full border border-[#E56AB3]/30 bg-white/70 text-[#6B2247] shadow-glow backdrop-blur-xl transition hover:bg-white/90"
    >
      <span className="text-lg">{ambientPlaying ? '❚❚' : '▶'}</span>
    </button>
  )
}
