"use client"
import { useEffect, useRef } from 'react'
import { useInteractive } from '../context/InteractiveProvider'
import content from '../data/content.json'

type Particle = { x: number; y: number; vx: number; vy: number; life: number; color: string }

const COLORS = ['#167D8D', '#E77B58', '#F2A65A', '#FFD37A']
const { title, line1, line2 } = content.ending
const { hintPrompt, hintMoon, hintHeart, hintOneMore, hintAwesome, hintWaitingLabel } = content.easterEggs

export default function Ending(){
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const { foundMoon, foundHeart, hintTarget, requestHint, resetEggs } = useInteractive()

  const bothFound = foundMoon && foundHeart
  const oneFound = foundMoon !== foundHeart
  const waitingToFind = hintTarget !== null && !bothFound

  let hintText = hintPrompt
  if (bothFound) hintText = hintAwesome
  else if (hintTarget === 'moon') hintText = hintMoon
  else if (hintTarget === 'heart') hintText = hintHeart
  else if (oneFound) hintText = hintOneMore

  const hintButtonLabel = bothFound ? 'Start over' : waitingToFind ? hintWaitingLabel : 'Need a hint?'
  const handleHintClick = bothFound ? resetEggs : requestHint

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let width = (canvas.width = canvas.offsetWidth)
    let height = (canvas.height = canvas.offsetHeight)
    let particles: Particle[] = []
    let raf = 0

    function resize(){
      if (!canvas) return
      width = canvas.width = canvas.offsetWidth
      height = canvas.height = canvas.offsetHeight
    }

    function burst(x: number, y: number){
      const count = 40
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count
        const speed = 2 + Math.random() * 3
        particles.push({
          x, y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 1,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
        })
      }
    }

    function tick(){
      if (!ctx) return
      // Fully clear (not a translucent overlay) so the shared ambient
      // background stays visible behind the fireworks, matching every
      // other chapter instead of washing out to solid pink over time.
      ctx.clearRect(0, 0, width, height)
      particles = particles.filter((p) => p.life > 0)
      particles.forEach((p) => {
        p.x += p.vx
        p.y += p.vy
        p.vy += 0.02
        p.life -= 0.012
        ctx.globalAlpha = Math.max(p.life, 0)
        ctx.fillStyle = p.color
        ctx.beginPath()
        ctx.arc(p.x, p.y, 2.2, 0, Math.PI * 2)
        ctx.fill()
      })
      ctx.globalAlpha = 1
      raf = requestAnimationFrame(tick)
    }

    const interval = window.setInterval(() => {
      burst(Math.random() * width, height * (0.2 + Math.random() * 0.4))
    }, 900)

    window.addEventListener('resize', resize)
    raf = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('resize', resize)
      window.clearInterval(interval)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <section id="ending" className="relative min-h-screen overflow-hidden py-24 pb-32">
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      <div className="relative mx-auto flex max-w-3xl flex-col items-center justify-center gap-6 px-6 text-center">
        <div className="text-6xl text-[#D7B56D] drop-shadow-[0_0_18px_rgba(215,181,109,0.5)]">⚔</div>
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-semibold text-gradient-friendship">{title}</h2>
        <p className="text-xl text-[#F5E8CB]/90">{line1}</p>
        <p className="text-lg text-[#C9B997]">{line2}</p>

        <div className="mt-10 flex flex-col items-center gap-3">
          <p className="max-w-sm text-sm text-[#8A6478]">{hintText}</p>
          {waitingToFind ? (
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8A6478]/70">
              {hintButtonLabel}
            </span>
          ) : (
            <button
              onClick={handleHintClick}
              className="rounded-full border border-[#E56AB3]/30 bg-white/60 px-5 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#D6488F] transition hover:bg-white/80"
            >
              {hintButtonLabel}
            </button>
          )}
        </div>
      </div>
    </section>
  )
}
