"use client"
import { useEffect, useRef, useState } from 'react'
import content from '../data/content.json'

const { chapter, title, intro, items } = content.reasons
const EDGE_THRESHOLD = 4

export default function ReasonsSection() {
  const [atStart, setAtStart] = useState(true)
  const [atEnd, setAtEnd] = useState(false)
  const scrollerRef = useRef<HTMLDivElement | null>(null)

  function updateEdges(){
    const el = scrollerRef.current
    if (!el) return
    setAtStart(el.scrollLeft <= EDGE_THRESHOLD)
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - EDGE_THRESHOLD)
  }

  useEffect(() => {
    const el = scrollerRef.current
    if (!el) return
    updateEdges()
    el.addEventListener('scroll', updateEdges, { passive: true })
    window.addEventListener('resize', updateEdges)
    return () => {
      el.removeEventListener('scroll', updateEdges)
      window.removeEventListener('resize', updateEdges)
    }
  }, [])

  function scrollByCard(direction: 1 | -1){
    const el = scrollerRef.current
    if (!el) return
    const card = el.querySelector<HTMLElement>('[data-card]')
    const amount = (card ? card.offsetWidth + 20 : el.clientWidth) * direction
    el.scrollBy({ left: amount, behavior: 'smooth' })
  }

  return (
    <section id="reasons" data-reveal className="py-24">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-sm uppercase tracking-[0.4em] text-[#D6488F] mb-4">{chapter}</div>
        <div className="mb-10 space-y-4">
          <h2 className="text-4xl md:text-5xl font-semibold text-gradient-friendship">{title}</h2>
          <p className="max-w-2xl text-[#6B2247]/75 leading-8">{intro}</p>
        </div>
        <div className="relative">
          <div
            ref={scrollerRef}
            className="no-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-2"
          >
            {items.map((reason, index) => (
              <div
                key={index}
                data-card
                className="relative shrink-0 basis-full snap-start rounded-[2rem] border border-white/10 bg-card p-8 text-left shadow-glow sm:basis-[calc(50%-10px)] lg:basis-[calc(33.333%-14px)]"
              >
                <div className="flex h-full min-h-[220px] flex-col justify-center space-y-6">
                  <div className="text-3xl font-semibold text-[#6B2247]">{reason.title}</div>
                  <p className="text-[#6B2247]/80 leading-8">{reason.description}</p>
                  {reason.tag && (
                    <span className="inline-block w-fit rounded-full border border-[#E56AB3]/25 bg-white/60 px-4 py-2 text-sm text-[#6B2247]/80">{reason.tag}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
          <button
            aria-label="Previous reason"
            onClick={() => scrollByCard(-1)}
            disabled={atStart}
            className="absolute left-0 top-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[#E56AB3]/30 bg-white/85 text-xl text-[#6B2247] shadow-glow backdrop-blur-xl transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white/85"
          >
            ‹
          </button>
          <button
            aria-label="Next reason"
            onClick={() => scrollByCard(1)}
            disabled={atEnd}
            className="absolute right-0 top-1/2 flex h-11 w-11 translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[#E56AB3]/30 bg-white/85 text-xl text-[#6B2247] shadow-glow backdrop-blur-xl transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white/85"
          >
            ›
          </button>
        </div>
      </div>
    </section>
  )
}
