"use client"
import { useEffect, useRef, useState } from 'react'
import content from '../data/content.json'
import { withBasePath } from '../lib/assetPath'

const { chapter, title, photos } = content.gallery
const EDGE_THRESHOLD = 4

export default function PolaroidGallery(){
  const [active, setActive] = useState<number | null>(null)
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

  useEffect(() => {
    if (active === null) return
    function handleKeyDown(e: KeyboardEvent){
      if (e.key === 'Escape') setActive(null)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [active])

  return (
    <section id="gallery" className="py-24">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-sm uppercase tracking-[0.4em] text-[#D6488F] mb-4">{chapter}</div>
        <h2 className="text-4xl md:text-5xl font-semibold text-gradient-friendship mb-8">{title}</h2>
        <div className="relative">
          <div
            ref={scrollerRef}
            className="no-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-2"
          >
            {photos.map((photo, index) => (
              <button
                key={index}
                data-card
                onClick={() => setActive(index)}
                className="group relative shrink-0 basis-full snap-start overflow-hidden rounded-[2rem] border border-white/10 bg-card p-4 text-left shadow-glow transition hover:-translate-y-1 hover:shadow-[0_28px_80px_rgba(229,106,179,0.2)] sm:basis-[calc(50%-10px)] lg:basis-[calc(33.333%-14px)]"
              >
                <div className="relative overflow-hidden rounded-3xl bg-slate-950/60">
                  <img src={withBasePath(photo.src)} alt={photo.title} className="h-56 w-full object-cover transition duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                </div>
                <div className="mt-4 space-y-2">
                  <div className="text-lg font-semibold text-[#6B2247]">{photo.title}</div>
                  <p className="text-sm text-[#8A6478]">{photo.caption}</p>
                </div>
                <div className="absolute right-4 top-4 rounded-full bg-white/20 px-3 py-1 text-xs uppercase tracking-[0.25em] text-white opacity-90">
                  Tap to expand
                </div>
              </button>
            ))}
          </div>
          <button
            aria-label="Previous photos"
            onClick={() => scrollByCard(-1)}
            disabled={atStart}
            className="absolute left-0 top-[42%] flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[#E56AB3]/30 bg-white/85 text-xl text-[#6B2247] shadow-glow backdrop-blur-xl transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white/85"
          >
            ‹
          </button>
          <button
            aria-label="Next photos"
            onClick={() => scrollByCard(1)}
            disabled={atEnd}
            className="absolute right-0 top-[42%] flex h-11 w-11 translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[#E56AB3]/30 bg-white/85 text-xl text-[#6B2247] shadow-glow backdrop-blur-xl transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white/85"
          >
            ›
          </button>
        </div>
        {active !== null && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/75 p-6"
            onClick={() => setActive(null)}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative my-auto max-h-[90vh] max-w-5xl overflow-y-auto rounded-[2rem] border border-white/10 bg-[#07070a] p-6 shadow-[0_40px_120px_rgba(0,0,0,0.55)] transition-opacity duration-500 opacity-100"
            >
              <button onClick={() => setActive(null)} className="absolute right-4 top-4 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-sm text-white transition hover:bg-white/10">Close</button>
              <img src={withBasePath(photos[active].src)} alt={photos[active].title} className="mx-auto max-h-[65vh] w-auto max-w-full rounded-[1.5rem] object-contain" />
              <div className="mt-5 text-left">
                <h3 className="text-3xl font-semibold text-white">{photos[active].title}</h3>
                <p className="mt-3 text-slate-300/90 leading-8">{photos[active].caption}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
