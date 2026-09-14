"use client"
import { useEffect, useRef, useState } from 'react'
import { useInteractive } from '../context/InteractiveProvider'
import content from '../data/content.json'

const { moonMessage: moonMessageText, heartNote: heartNoteText } = content.easterEggs

export default function EasterEggs(){
  const [moonMessage, setMoonMessage] = useState(false)
  const [heartNote, setHeartNote] = useState(false)
  const [visible, setVisible] = useState(false)
  const pressTimer = useRef<number | null>(null)
  const { phase, hintTarget, markFound } = useInteractive()

  useEffect(() => {
    function updateVisibility(){
      const distanceFromBottom = document.documentElement.scrollHeight - (window.scrollY + window.innerHeight)
      setVisible(distanceFromBottom <= 80)
    }

    updateVisibility()
    window.addEventListener('scroll', updateVisibility, { passive: true })
    window.addEventListener('resize', updateVisibility)
    return () => {
      window.removeEventListener('scroll', updateVisibility)
      window.removeEventListener('resize', updateVisibility)
    }
  }, [])

  function startPress(){
    pressTimer.current = window.setTimeout(() => {
      setHeartNote(true)
      markFound('heart')
    }, 600)
  }

  function cancelPress(){
    if (pressTimer.current) {
      window.clearTimeout(pressTimer.current)
      pressTimer.current = null
    }
  }

  return (
    <div aria-hidden={!visible} className={`fixed inset-0 z-30 transition-opacity duration-500 ${visible ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'}`}>
      <button
        aria-label="moon"
        tabIndex={visible ? 0 : -1}
        className={`pointer-events-auto fixed right-6 bottom-6 text-2xl opacity-60 transition hover:opacity-100 ${hintTarget === 'moon' ? 'animate-hint-zoom' : ''}`}
        onClick={() => {
          setMoonMessage(true)
          markFound('moon')
        }}
      >
        {phase === 2 ? '◈' : '🌙'}
      </button>
      <button
        aria-label="friendship note"
        tabIndex={visible ? 0 : -1}
        className={`pointer-events-auto fixed left-6 bottom-6 text-2xl opacity-60 transition hover:opacity-100 ${hintTarget === 'heart' ? 'animate-heart-squeeze' : ''}`}
        onMouseDown={startPress}
        onMouseUp={cancelPress}
        onMouseLeave={cancelPress}
        onTouchStart={startPress}
        onTouchEnd={cancelPress}
      >
      {phase === 2 ? '⚔' : '🤝'}
      </button>

      {moonMessage && (
        <div className="pointer-events-auto fixed inset-0 flex items-center justify-center bg-black/70 p-6">
          <div className="max-w-md rounded-[2rem] border border-white/10 bg-card p-8 text-center shadow-glow">
            <p className="text-lg leading-8 text-[#4A1B3B]">{moonMessageText}</p>
            <button onClick={() => setMoonMessage(false)} className="mt-6 rounded-full border border-[#E56AB3]/30 bg-white/60 px-6 py-2 text-sm text-[#6B2247] hover:bg-white/80">Close</button>
          </div>
        </div>
      )}

      {heartNote && (
        <div className="pointer-events-auto fixed inset-0 flex items-center justify-center bg-black/70 p-6">
          <div className="max-w-md rounded-[2rem] border border-white/10 bg-card p-8 text-center shadow-glow">
            <p className="text-lg leading-8 text-[#4A1B3B]">{heartNoteText}</p>
            <button onClick={() => setHeartNote(false)} className="mt-6 rounded-full border border-[#E56AB3]/30 bg-white/60 px-6 py-2 text-sm text-[#6B2247] hover:bg-white/80">Close</button>
          </div>
        </div>
      )}
    </div>
  )
}
