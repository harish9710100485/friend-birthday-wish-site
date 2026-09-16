"use client"
import { useEffect, useState } from 'react'
import { useInteractive } from '../context/InteractiveProvider'

const PARTICLE_COUNT = 22
const RISE_GLYPHS = ['✨', '💖', '🎉', '🌼']
const FLUTTER_GLYPHS = ['🦋']
const PHASE_TWO_DEFAULT_GLYPHS = ['✨', '⭐', '🎈', '🌼']

type Particle = {
  id: number
  left: number
  size: number
  duration: number
  delay: number
  glyph: string
  anim: 'animate-float-up' | 'animate-flutter-up'
}

export default function FloatingHearts(){
  const [particles, setParticles] = useState<Particle[]>([])
  const { phase } = useInteractive()
  const isPhaseTwo = phase === 2

  useEffect(() => {
    setParticles(
      Array.from({ length: PARTICLE_COUNT }, (_, index) => {
        const isFlutter = index % 4 === 0
        const glyphs = isPhaseTwo ? PHASE_TWO_DEFAULT_GLYPHS : isFlutter ? FLUTTER_GLYPHS : RISE_GLYPHS
        return {
          id: index,
          left: Math.random() * 100,
          size: isFlutter ? 18 + Math.random() * 8 : 10 + Math.random() * 14,
          duration: isFlutter ? 16 + Math.random() * 8 : 12 + Math.random() * 10,
          delay: Math.random() * -24,
          glyph: glyphs[index % glyphs.length],
          anim: isFlutter ? 'animate-flutter-up' : 'animate-float-up',
        }
      })
    )
  }, [isPhaseTwo])

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden opacity-100">
      {particles.map((particle) => (
        <span
          key={particle.id}
          className={`absolute bottom-[-10%] ${isPhaseTwo ? 'opacity-50' : 'opacity-100'} ${particle.anim}`}
          style={{
            left: `${particle.left}%`,
            fontSize: `${particle.size}px`,
            animationDuration: `${particle.duration}s`,
            animationDelay: `${particle.delay}s`,
            color: isPhaseTwo ? '#d8c8b5' : '#4a1b3b',
            textShadow: isPhaseTwo ? '0 0 10px rgba(231, 181, 106, 0.18)' : '0 0 12px rgba(191, 133, 165, 0.25)',
          }}
        >
          {particle.glyph}
        </span>
      ))}
    </div>
  )
}
