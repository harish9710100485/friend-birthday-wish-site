"use client"
import { useEffect, useState } from 'react'

const STAR_COUNT = 20

type Star = { id: number; size: number; left: number; top: number; opacity: number; color: string }

export default function FloatingStars() {
  const [stars, setStars] = useState<Star[]>([])
  const [pointer, setPointer] = useState({ x: 0, y: 0 })
  const [viewport, setViewport] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const palette = ['#f5d28b', '#d6b070', '#9db5c9', '#f0eec9']
    setStars(
      Array.from({ length: STAR_COUNT }, (_, index) => ({
        id: index,
        size: 3 + Math.random() * 5,
        left: 6 + Math.random() * 88,
        top: 8 + Math.random() * 84,
        opacity: 0.25 + Math.random() * 0.6,
        color: palette[index % palette.length],
      }))
    )
    setViewport({ width: window.innerWidth, height: window.innerHeight })

    function onMove(event: PointerEvent) {
      setPointer({ x: event.clientX, y: event.clientY })
    }
    window.addEventListener('pointermove', onMove)
    return () => window.removeEventListener('pointermove', onMove)
  }, [])

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {stars.map((star) => {
        const dx = pointer.x - (viewport.width * star.left) / 100
        const dy = pointer.y - (viewport.height * star.top) / 100
        return (
          <div
            key={star.id}
            className="absolute rounded-full transition-transform duration-300"
            style={{
              width: `${star.size}px`,
              height: `${star.size}px`,
              left: `${star.left}%`,
              top: `${star.top}%`,
              opacity: star.opacity,
              transform: `translate(${dx * 0.02}px, ${dy * 0.02}px)`,
              background: `radial-gradient(circle, ${star.color} 0%, rgba(255,255,255,0.9) 35%, rgba(255,255,255,0) 70%)`,
              boxShadow: `0 0 16px ${star.color}`,
            }}
          />
        )
      })}
    </div>
  )
}
