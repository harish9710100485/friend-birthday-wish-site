"use client"
import { useEffect, useRef, useState } from 'react'
import { useInteractive } from '../context/InteractiveProvider'
import content from '../data/content.json'
import { withBasePath } from '../lib/assetPath'

const BLOW_THRESHOLD = 45
const { chapter, title, image, intro, micButtonLabel, blowButtonLabel, listeningLabel, micDeniedText, wishText } = content.cake

export default function CakeSection(){
  const [blown, setBlown] = useState(false)
  const [listening, setListening] = useState(false)
  const [micDenied, setMicDenied] = useState(false)
  const { celebrate } = useInteractive()
  const audioCtxRef = useRef<AudioContext | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const rafRef = useRef<number>(0)

  function handleBlow(){
    setBlown(true)
    celebrate()
    stopListening()
  }

  function stopListening(){
    setListening(false)
    cancelAnimationFrame(rafRef.current)
    streamRef.current?.getTracks().forEach((track) => track.stop())
    audioCtxRef.current?.close()
    audioCtxRef.current = null
    streamRef.current = null
  }

  async function startListening(){
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream
      const audioCtx = new AudioContext()
      audioCtxRef.current = audioCtx
      const source = audioCtx.createMediaStreamSource(stream)
      const analyser = audioCtx.createAnalyser()
      analyser.fftSize = 512
      source.connect(analyser)
      const data = new Uint8Array(analyser.frequencyBinCount)

      setListening(true)

      function poll(){
        analyser.getByteFrequencyData(data)
        const volume = data.reduce((sum, value) => sum + value, 0) / data.length
        if (volume > BLOW_THRESHOLD) {
          handleBlow()
          return
        }
        rafRef.current = requestAnimationFrame(poll)
      }
      poll()
    } catch {
      setMicDenied(true)
    }
  }

  useEffect(() => () => stopListening(), [])

  return (
    <section id="cake" className="py-24">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <div className="text-sm uppercase tracking-[0.4em] text-[#D6488F] mb-4">{chapter}</div>
        <h2 className="text-4xl md:text-5xl font-semibold text-gradient-friendship mb-4">{title}</h2>
        <p className="mx-auto mb-10 max-w-2xl text-[#6B2247]/80">{intro}</p>
        <div className="inline-flex flex-col items-center gap-6">
          <div className="bg-card rounded-[2rem] p-6 shadow-glow border border-white/10">
            <div className="cake-photo-scene">
              <img src={withBasePath(image)} alt="Birthday cake" className="cake-photo" />
              <div className="cake-photo-candles">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="cake-candle">
                    <span className="cake-wick" />
                    <span className={`cake-flame ${blown ? 'cake-flame-out' : ''}`} />
                    {blown && <span className="cake-smoke" style={{ animationDelay: `${i * 150}ms` }} />}
                  </div>
                ))}
              </div>
            </div>
          </div>
          {!blown && (
            <div className="flex flex-wrap items-center justify-center gap-4">
              {!listening && (
                <button
                  onClick={startListening}
                  className="rounded-full border border-[#E56AB3]/30 bg-white/60 px-8 py-3 text-sm font-semibold text-[#6B2247] transition hover:bg-white/80"
                >
                  {micButtonLabel}
                </button>
              )}
              <button
                onClick={handleBlow}
                className="rounded-full bg-gradient-to-r from-pink-400 via-rose-500 to-fuchsia-500 px-8 py-3 text-sm font-semibold text-black shadow-[0_20px_40px_rgba(255,107,157,0.18)] transition hover:scale-[1.02] hover:brightness-110"
              >
                {listening ? listeningLabel : blowButtonLabel}
              </button>
            </div>
          )}
          {micDenied && <p className="text-sm text-[#8A6478]">{micDeniedText}</p>}
        </div>
        {blown && <p className="mt-10 text-lg text-[#B23A73]">{wishText}</p>}
      </div>
    </section>
  )
}
