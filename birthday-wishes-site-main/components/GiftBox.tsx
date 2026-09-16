"use client"
import { useEffect, useState } from 'react'
import { useInteractive } from '../context/InteractiveProvider'
import content from '../data/content.json'
import { withBasePath } from '../lib/assetPath'

const { chapter, title, intro, buttonLabel, buttonLabelOpening, tapToOpenLabel, letterText } = content.gift

export default function GiftBox() {
  const [opened, setOpened] = useState(false)
  const [envelopeReady, setEnvelopeReady] = useState(false)
  const [letterOpened, setLetterOpened] = useState(false)
  const [text, setText] = useState('')
  const { celebrate } = useInteractive()

  useEffect(() => {
    if (!opened) return
    const timeout = window.setTimeout(() => setEnvelopeReady(true), 900)
    return () => window.clearTimeout(timeout)
  }, [opened])

  useEffect(() => {
    if (!letterOpened) return
    let i = 0
    const interval = window.setInterval(() => {
      setText(letterText.slice(0, i))
      i += 1
      if (i > letterText.length) {
        window.clearInterval(interval)
      }
    }, 28)
    return () => window.clearInterval(interval)
  }, [letterOpened])

  function handleOpen() {
    setOpened(true)
    celebrate()
  }

  return (
    <section id="gift" className="py-24">
      <div className="max-w-5xl mx-auto px-6 text-center">
        <div className="text-sm uppercase tracking-[0.4em] text-[#D6488F] mb-4">{chapter}</div>
        <h2 className="text-4xl md:text-5xl font-semibold text-gradient-friendship mb-6">{title}</h2>
        <p className="mx-auto mb-12 max-w-2xl text-[#6B2247]/80 leading-8">{intro}</p>

        {!envelopeReady && !letterOpened && (
          <>
            <button
              onClick={handleOpen}
              disabled={opened}
              aria-label={buttonLabel}
              className="mx-auto flex h-56 w-full items-center justify-center disabled:cursor-default"
            >
              <img
                src={withBasePath('/photos/Frieren-gift.jpg')}
                alt="Gift"
                className={`h-40 w-40 rounded-3xl object-cover shadow-glow animate-gift-float ${opened ? 'animate-shake-letter' : ''}`}
              />
            </button>
            <button
              onClick={handleOpen}
              disabled={opened}
              className="mt-6 rounded-full bg-gradient-to-r from-fuchsia-500 via-pink-400 to-rose-500 px-8 py-3 text-sm font-semibold text-black shadow-[0_20px_40px_rgba(255,107,157,0.22)] transition hover:scale-[1.02] hover:brightness-110 disabled:cursor-default disabled:hover:scale-100 disabled:hover:brightness-100"
            >
              {opened ? buttonLabelOpening : buttonLabel}
            </button>
          </>
        )}

        {envelopeReady && !letterOpened && (
          <button
            onClick={() => setLetterOpened(true)}
            aria-label={tapToOpenLabel}
            className="mx-auto flex h-56 flex-col items-center justify-center gap-3 animate-pop-up"
          >
            <img
              src={withBasePath('/photos/Frieren-gift.jpg')}
              alt="Opened gift"
              className="h-24 w-24 rounded-2xl object-cover shadow-glow animate-gift-float"
            />
            <span className="rounded-full bg-white/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[#B23A73] shadow-glow">
              {tapToOpenLabel}
            </span>
          </button>
        )}

        {letterOpened && (
          <div
            className="mt-2 rounded-[1.5rem] border border-[#E8C4D6] p-10 text-left whitespace-pre-wrap font-letter text-lg leading-9 text-[#5B2347] min-h-[220px] shadow-[0_30px_70px_rgba(229,106,179,0.18)] animate-pop-up"
            style={{
              background: 'repeating-linear-gradient(#FFFBF6 0px, #FFFBF6 34px, #F6E3EC 35px)',
            }}
          >
            {text}
          </div>
        )}
      </div>
    </section>
  )
}
