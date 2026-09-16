"use client"
import { useEffect, useMemo, useState } from 'react'
import { useInteractive } from '../../context/InteractiveProvider'
import AmbientAudioToggle from '../../components/AmbientAudioToggle'
import FloatingStars from '../../components/FloatingStars'
import GiftBox from '../../components/GiftBox'
import CakeSection from '../../components/CakeSection'
import StorySection from '../../components/StorySection'
import Timeline from '../../components/Timeline'
import PolaroidGallery from '../../components/PolaroidGallery'
import ReasonsSection from '../../components/ReasonsSection'
import VoiceMessage from '../../components/VoiceMessage'
import Ending from '../../components/Ending'
import BossBattle from '../../components/BossBattle'
import EasterEggs from '../../components/EasterEggs'
import ScrollNav from '../../components/ScrollNav'
import content from '../../data/content.json'
import { withBasePath } from '../../lib/assetPath'

const { loadingSteps, title: heroTitle, subtitle: heroSubtitle, audioLabel: heroAudioLabel } = content.hero
const { chapter: phaseTwoChapter, title: phaseTwoTitle, intro: phaseTwoIntro, enterLabel: phaseTwoEnterLabel, audioLabel: phaseTwoAudioLabel } = content.phaseTwo

export default function Page(){
  const { phase, startPhaseTwo, ambientPlaying, toggleAmbient } = useInteractive()
  const [step, setStep] = useState(0)
  const [ready, setReady] = useState(false)
  const loadingLabel = useMemo(() => loadingSteps[step], [step])

  useEffect(() => {
    if (ready) return
    let i = 0
    const interval = window.setInterval(() => {
      i += 1
      if (i < loadingSteps.length) {
        setStep(i)
      } else {
        window.clearInterval(interval)
        setReady(true)
      }
    }, 900)
    return () => window.clearInterval(interval)
  }, [ready])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('section-visible')
        })
      },
      { threshold: 0.18 }
    )

    document.querySelectorAll('[data-reveal]').forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [phase])

  return (
    <main className="relative min-h-screen text-[#193B4A]">
      <FloatingStars />
      <EasterEggs />
      <ScrollNav />
      <AmbientAudioToggle />
      <section id="welcome" className="min-h-screen relative overflow-hidden px-6 pt-24 pb-10 flex flex-col justify-center">
        <div className="relative mx-auto flex w-full max-w-6xl flex-col justify-center gap-8 text-center">
          <div className="mx-auto inline-flex items-center justify-center rounded-full border border-[#E56AB3]/30 bg-white/60 px-5 py-2 text-xs uppercase tracking-[0.45em] text-[#B23A73] shadow-glow backdrop-blur-xl">
            {loadingLabel}
          </div>
          <div className="space-y-6">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold tracking-tight text-gradient-friendship text-shadow-lg">{heroTitle}</h1>
            <img
              src={withBasePath('/photos/Geralt Happy Birthday GIF.gif')}
              alt="Geralt birthday celebration"
              className="mx-auto w-full max-w-xl rounded-3xl object-cover shadow-glow"
            />
            <p className="mx-auto max-w-3xl text-lg leading-8 text-[#6B2247]/85">{heroSubtitle}</p>
          </div>
          <div className="mx-auto flex items-center justify-center">
            <button
              className="rounded-full bg-accent px-8 py-3 text-sm font-semibold text-[#3D0F28] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
              disabled={!ready}
              onClick={() => document.getElementById('story')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Tap to Begin
            </button>
          </div>
          <div className="mx-auto mt-6 w-full max-w-md">
            <div className="rounded-[2rem] border border-white/10 bg-card p-6 text-left shadow-glow backdrop-blur-xl">
              <div className="text-sm uppercase tracking-[0.35em] text-[#D6488F] mb-3">{ambientPlaying ? 'Now playing' : 'Paused'}</div>
              <div className="flex items-center gap-3">
                <button
                  aria-label={ambientPlaying ? 'Pause' : 'Play'}
                  onClick={toggleAmbient}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-pink-400 text-base font-semibold text-black transition hover:brightness-110"
                >
                  {ambientPlaying ? '❚❚' : '▶'}
                </button>
                <span className="text-sm opacity-80">{phase === 2 ? phaseTwoAudioLabel : heroAudioLabel}</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      <StorySection />
      <Timeline />
      <ReasonsSection />
      <PolaroidGallery />
      {phase === 1 ? (
        <section id="phase-two" className="phase-gate relative overflow-hidden py-32">
          <div className="mx-auto max-w-3xl px-6 text-center">
            <div className="phase-kicker">{phaseTwoChapter}</div>
            <h2 className="mt-4 text-4xl font-semibold text-[#F7E8C8] sm:text-6xl">{phaseTwoTitle}</h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-[#D8C8B5]">{phaseTwoIntro}</p>
            <button className="battle-button mt-10" onClick={() => { startPhaseTwo(); window.setTimeout(() => document.getElementById('boss-battle')?.scrollIntoView({ behavior: 'smooth' }), 50) }}>{phaseTwoEnterLabel}</button>
          </div>
        </section>
      ) : (
        <div className="phase-two">
          <section id="phase-two" className="phase-banner py-20">
            <div className="mx-auto max-w-3xl px-6 text-center">
              <div className="phase-kicker">{phaseTwoChapter}</div>
              <h2 className="mt-4 text-4xl font-semibold text-[#F7E8C8] sm:text-6xl">{phaseTwoTitle}</h2>
              <p className="mx-auto mt-5 max-w-xl text-[#D8C8B5]">{phaseTwoAudioLabel}</p>
            </div>
          </section>
          <BossBattle />
          <VoiceMessage />
          <GiftBox />
          <CakeSection />
          <Ending />
        </div>
      )}
      {phase === 1 && (
        <div className="phase-one-finale">
          <VoiceMessage />
          <GiftBox />
          <CakeSection />
          <Ending />
        </div>
      )}
    </main>
  )
}
