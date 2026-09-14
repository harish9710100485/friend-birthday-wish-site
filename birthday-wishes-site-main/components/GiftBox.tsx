"use client"
import { useEffect, useState } from 'react'
import { useInteractive } from '../context/InteractiveProvider'
import content from '../data/content.json'

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
        <div className="text-sm uppercase tracking-[0.4em] text-[#D7B56D] mb-4">{chapter}</div>
        <h2 className="text-4xl md:text-5xl font-semibold text-gradient-friendship mb-6">{title}</h2>
        <p className="mx-auto mb-12 max-w-2xl text-[#C9B997]/80 leading-8">{intro}</p>

        {!envelopeReady && !letterOpened && (
          <>
            <button
              onClick={handleOpen}
              disabled={opened}
              aria-label={buttonLabel}
              className="mx-auto flex h-56 w-full items-center justify-center disabled:cursor-default"
            >
              <span className={`text-[130px] leading-none text-[#D7B56D] drop-shadow-[0_0_26px_rgba(215,181,109,0.55)] ${opened ? 'animate-shake-letter' : ''}`}>⚔</span>
            </button>
            <button
              onClick={handleOpen}
              disabled={opened}
              className="mt-6 rounded-full border border-[#D7B56D]/30 bg-[linear-gradient(135deg,#12161a,#2a241b)] px-8 py-3 text-sm font-semibold text-[#F5E8CB] shadow-[0_20px_40px_rgba(215,181,109,0.18)] transition hover:scale-[1.02] hover:brightness-110 disabled:cursor-default disabled:hover:scale-100 disabled:hover:brightness-100"
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
            <span className="text-7xl text-[#D7B56D] animate-shake-letter drop-shadow-[0_0_20px_rgba(215,181,109,0.45)]">✦</span>
            <span className="rounded-full border border-[#D7B56D]/20 bg-[#12161a]/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[#F5E8CB] shadow-glow">
              {tapToOpenLabel}
            </span>
          </button>
        )}

        {letterOpened && (
          <div
            className="mt-2 rounded-[1.5rem] border border-[#D7B56D]/20 p-10 text-left whitespace-pre-wrap font-letter text-lg leading-9 text-[#F5E8CB] min-h-[220px] shadow-[0_30px_70px_rgba(215,181,109,0.12)] animate-pop-up"
            style={{
              background: 'repeating-linear-gradient(#171b1d 0px, #171b1d 34px, #1d1e1a 35px)',
            }}
          >
            {text}
          </div>
        )}
      </div>
    </section>
  )
}
