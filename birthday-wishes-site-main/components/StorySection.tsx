"use client"
import { useEffect, useRef, useState } from 'react'
import content from '../data/content.json'
import { withBasePath } from '../lib/assetPath'

const { chapter, title, slides } = content.story
const EDGE_THRESHOLD = 4

export default function StorySection(){
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
    <section id="story" className="py-24">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-sm uppercase tracking-[0.4em] text-[#D6488F] mb-4">{chapter}</div>
        <h2 className="text-4xl md:text-5xl font-semibold text-gradient-friendship mb-10">{title}</h2>
        <img
          src={withBasePath('/photos/kakashi-guy.gif')}
          alt="Kakashi friendship moment"
          className="mb-10 w-full max-w-2xl rounded-3xl object-cover shadow-glow"
        />
        <div className="relative">
          <div
            ref={scrollerRef}
            className="no-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-2"
          >
            {slides.map((slide, index) => (
              <div
                key={index}
                data-card
                className="group relative shrink-0 basis-full snap-start overflow-hidden rounded-[2rem] border border-white/10 bg-card p-8 sm:p-10 shadow-glow transition duration-500 hover:-translate-y-1 sm:basis-[calc(50%-10px)] lg:basis-[calc(33.333%-14px)]"
              >
                <div className="flex h-full min-h-[220px] flex-col justify-center">
                  <div className="mb-4 text-xl font-semibold text-[#6B2247]">{slide.title}</div>
                  <p className="text-[#6B2247]/80 leading-8">{slide.description}</p>
                  <div className="mt-6 h-[2px] w-24 rounded-full bg-gradient-to-r from-pink-400 via-rose-400 to-fuchsia-500 opacity-80" />
                </div>
              </div>
            ))}
          </div>
          <button
            aria-label="Previous story"
            onClick={() => scrollByCard(-1)}
            disabled={atStart}
            className="absolute left-0 top-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[#E56AB3]/30 bg-white/85 text-xl text-[#6B2247] shadow-glow backdrop-blur-xl transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white/85"
          >
            ‹
          </button>
          <button
            aria-label="Next story"
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
