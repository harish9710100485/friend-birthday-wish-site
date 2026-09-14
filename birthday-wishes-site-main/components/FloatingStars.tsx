"use client"
import { useEffect, useState } from 'react'

const STAR_COUNT = 16

type Star = { id: number; size: number; left: number; top: number; opacity: number }

export default function FloatingStars() {
  const [stars, setStars] = useState<Star[]>([])
  const [pointer, setPointer] = useState({ x: 0, y: 0 })
  const [viewport, setViewport] = useState({ width: 0, height: 0 })

  useEffect(() => {
    setStars(
      Array.from({ length: STAR_COUNT }, (_, index) => ({
        id: index,
        size: 3 + Math.random() * 4,
        left: 8 + Math.random() * 82,
        top: 8 + Math.random() * 82,
        opacity: 0.4 + Math.random() * 0.5,
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
            className="absolute rounded-full bg-[#FF8FC0] shadow-[0_0_18px_rgba(229,106,179,0.45)] transition-transform duration-300"
            style={{
              width: `${star.size}px`,
              height: `${star.size}px`,
              left: `${star.left}%`,
              top: `${star.top}%`,
              opacity: star.opacity,
              transform: `translate(${dx * 0.02}px, ${dy * 0.02}px)`,
            }}
          />
        )
      })}
    </div>
  )
}
