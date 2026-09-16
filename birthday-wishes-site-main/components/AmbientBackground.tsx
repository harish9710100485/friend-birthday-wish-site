"use client"
import { useInteractive } from '../context/InteractiveProvider'

export default function AmbientBackground(){
  const { phase } = useInteractive()
  const isPhaseTwo = phase === 2

  return (
    <div className={`fixed inset-0 -z-10 overflow-hidden ${isPhaseTwo ? 'bg-[#0d0b10]' : 'bg-[#FFF9EF]'}`}>
      <div className={`absolute -top-[10%] left-[-15%] h-[70vh] w-[70vh] rounded-full blur-2xl animate-drift-slow ${isPhaseTwo ? 'bg-[radial-gradient(circle,_rgba(214,75,75,0.18),_transparent_70%)]' : 'bg-[radial-gradient(circle,_rgba(154,214,210,0.7),_transparent_70%)]'}`} />
      <div className={`absolute top-[5%] right-[-20%] h-[80vh] w-[80vh] rounded-full blur-2xl animate-drift-slower ${isPhaseTwo ? 'bg-[radial-gradient(circle,_rgba(231,181,106,0.12),_transparent_70%)]' : 'bg-[radial-gradient(circle,_rgba(255,190,137,0.55),_transparent_70%)]'}`} />
      <div className={`absolute bottom-[-20%] left-[10%] h-[65vh] w-[65vh] rounded-full blur-2xl animate-drift-slow ${isPhaseTwo ? 'bg-[radial-gradient(circle,_rgba(91,42,43,0.22),_transparent_70%)]' : 'bg-[radial-gradient(circle,_rgba(120,190,202,0.4),_transparent_70%)]'}`} />
      <div className={`absolute bottom-[10%] right-[5%] h-[55vh] w-[55vh] rounded-full blur-2xl animate-drift-slower ${isPhaseTwo ? 'bg-[radial-gradient(circle,_rgba(231,181,106,0.1),_transparent_70%)]' : 'bg-[radial-gradient(circle,_rgba(255,218,131,0.45),_transparent_70%)]'}`} />
      <div className={`absolute inset-0 ${isPhaseTwo ? 'bg-[linear-gradient(180deg,_rgba(13,11,16,0.2)_0%,_rgba(13,11,16,0.45)_40%,_rgba(13,11,16,0.85)_100%)]' : 'bg-[linear-gradient(180deg,_rgba(255,255,255,0.35)_0%,_rgba(255,249,239,0.1)_35%,_rgba(255,249,239,0.5)_100%)]'}`} />
    </div>
  )
}
