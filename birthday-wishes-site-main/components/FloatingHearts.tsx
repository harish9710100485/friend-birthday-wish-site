"use client"
import { useEffect, useState } from 'react'

const PARTICLE_COUNT = 18
const RISE_GLYPHS = ['✦', '✧', '◈', '⬢', '❖']
const FLUTTER_GLYPHS = ['✦', '✧']

type Particle = {
  id: number
  left: number
  size: number
  duration: number
  delay: number
  glyph: string
  anim: 'animate-float-up' | 'animate-flutter-up'
  color: string
}

export default function FloatingHearts(){
  const [particles, setParticles] = useState<Particle[]>([])

  useEffect(() => {
    const palette = ['#f7d791', '#d7b56d', '#c89e5a', '#9fb4bd', '#f2e7c8']
    setParticles(
      Array.from({ length: PARTICLE_COUNT }, (_, index) => {
        const isFlutter = index % 4 === 0
        const glyphs = isFlutter ? FLUTTER_GLYPHS : RISE_GLYPHS
        return {
          id: index,
          left: Math.random() * 100,
          size: isFlutter ? 18 + Math.random() * 10 : 12 + Math.random() * 16,
          duration: isFlutter ? 18 + Math.random() * 8 : 14 + Math.random() * 12,
          delay: Math.random() * -24,
          glyph: glyphs[index % glyphs.length],
          anim: isFlutter ? 'animate-flutter-up' : 'animate-float-up',
          color: palette[index % palette.length],
        }
      })
    )
  }, [])

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {particles.map((particle) => (
        <span
          key={particle.id}
          className={`absolute bottom-[-8%] opacity-0 ${particle.anim}`}
          style={{
            left: `${particle.left}%`,
            fontSize: `${particle.size}px`,
            animationDuration: `${particle.duration}s`,
            animationDelay: `${particle.delay}s`,
            color: particle.color,
            textShadow: '0 0 18px rgba(215, 181, 109, 0.75)',
          }}
        >
          {particle.glyph}
        </span>
      ))}
    </div>
  )
}
