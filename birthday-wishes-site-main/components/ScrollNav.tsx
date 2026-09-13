"use client"
import { useCallback, useState } from 'react'
import { getLenis } from '../lib/lenis'

const sections = [
  { id: 'welcome', label: 'Intro' },
  { id: 'story', label: 'Story' },
  { id: 'timeline', label: 'Timeline' },
  { id: 'reasons', label: 'Reasons' },
  { id: 'gallery', label: 'Gallery' },
  { id: 'voice', label: 'Voice' },
  { id: 'gift', label: 'Gift' },
  { id: 'cake', label: 'Cake' },
  { id: 'ending', label: 'Ending' }
]

export default function ScrollNav(){
  const [open, setOpen] = useState(false)

  const scrollTo = useCallback((id: string) => {
    const target = document.getElementById(id)
    if (!target) return
    const lenis = getLenis()
    if (lenis) {
      lenis.scrollTo(target)
    } else {
      target.scrollIntoView({ behavior: 'smooth' })
    }
    setOpen(false)
  }, [])

  return (
    <>
      <button
        aria-label="Open chapter menu"
        onClick={() => setOpen(true)}
        className="fixed right-6 bottom-6 z-40 flex h-12 w-12 items-center justify-center rounded-full border border-[#E56AB3]/30 bg-white/70 text-[#6B2247] shadow-glow backdrop-blur-xl transition hover:bg-white/90"
      >
        <span className="flex flex-col items-center gap-[3px]">
          <span className="h-[2px] w-4 rounded-full bg-current" />
          <span className="h-[2px] w-4 rounded-full bg-current" />
          <span className="h-[2px] w-4 rounded-full bg-current" />
        </span>
      </button>

      {open && (
        <div className="fixed inset-0 z-40 flex justify-end">
          <button
            aria-label="Close chapter menu"
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div className="relative flex h-full w-64 max-w-[80vw] flex-col gap-1 border-l border-white/10 bg-[#120a15]/95 p-6 pt-8 shadow-[-20px_0_60px_rgba(0,0,0,0.5)] backdrop-blur-2xl">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-xs uppercase tracking-[0.3em] text-pink-200">Chapters</span>
              <button aria-label="Close" onClick={() => setOpen(false)} className="text-lg text-slate-300 transition hover:text-white">✕</button>
            </div>
            {sections.map(section => (
              <button
                key={section.id}
                className="rounded-xl px-4 py-3 text-left text-sm font-medium uppercase tracking-[0.15em] text-slate-200/90 transition hover:bg-white/10 hover:text-white"
                onClick={() => scrollTo(section.id)}
              >
                {section.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  )
}
