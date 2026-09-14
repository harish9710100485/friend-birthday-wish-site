"use client"
import { useEffect, useState } from 'react'
import { useInteractive } from '../context/InteractiveProvider'

const PARTICLE_COUNT = 22
const RISE_GLYPHS = ['✨', '⭐', '🎈', '🌼']
const FLUTTER_GLYPHS = ['🦋']

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

  useEffect(() => {
    setParticles(
      Array.from({ length: PARTICLE_COUNT }, (_, index) => {
        const isFlutter = index % 4 === 0
        const glyphs = phase === 2 ? ['⚔', '◆', '☠'] : isFlutter ? FLUTTER_GLYPHS : RISE_GLYPHS
        return {
          id: index,
          left: Math.random() * 100,
          size: isFlutter ? 20 + Math.random() * 10 : 12 + Math.random() * 16,
          duration: isFlutter ? 18 + Math.random() * 10 : 14 + Math.random() * 12,
          delay: Math.random() * -24,
          glyph: glyphs[index % glyphs.length],
          anim: isFlutter ? 'animate-flutter-up' : 'animate-float-up',
        }
      })
    )
  }, [phase])

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {particles.map((particle) => (
        <span
          key={particle.id}
          className={`absolute bottom-[-10%] opacity-0 ${particle.anim}`}
          style={{
            left: `${particle.left}%`,
            fontSize: `${particle.size}px`,
            animationDuration: `${particle.duration}s`,
            animationDelay: `${particle.delay}s`,
          }}
        >
          {particle.glyph}
        </span>
      ))}
    </div>
  )
}
