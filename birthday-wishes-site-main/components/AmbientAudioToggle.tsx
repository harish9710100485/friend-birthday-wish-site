"use client"
import { useInteractive } from '../context/InteractiveProvider'

export default function AmbientAudioToggle(){
  const { ambientPlaying, toggleAmbient } = useInteractive()

  return (
    <button
      aria-label={ambientPlaying ? 'Pause music' : 'Play music'}
      onClick={toggleAmbient}
      className="fixed left-6 bottom-6 z-40 flex h-12 w-12 items-center justify-center rounded-full border border-[#D7B56D]/30 bg-[#12161a]/80 text-[#F5E8CB] shadow-glow backdrop-blur-xl transition hover:bg-[#1a201c]"
    >
      <span className="text-lg">{ambientPlaying ? '∥' : '▸'}</span>
    </button>
  )
}
