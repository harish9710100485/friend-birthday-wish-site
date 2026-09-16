"use client"
import { useEffect, useState } from 'react'
import { useInteractive } from '../context/InteractiveProvider'
import content from '../data/content.json'
import { withBasePath } from '../lib/assetPath'

const MAX_HEALTH = 100
const MAX_PLAYER_HEALTH = 3
const { bossName, bossIntro, attackLabel, chargedAttackLabel, victory, defeat } = content.phaseTwo
const TECHNIQUES = [
  {
    name: 'Parry → Riposte',
    school: 'Dark Souls',
    icon: '⚔',
    damage: 35,
    description: 'Parry the impossible. Step forward. Riposte. No panic, no mercy.'
  },
  {
    name: 'Mikiri Counter',
    school: 'Sekiro',
    icon: '◈',
    damage: 40,
    description: 'Step into the thrust. Break their posture. Hesitation is defeat.'
  },
  {
    name: 'Visceral Attack',
    school: 'Bloodborne',
    icon: '✦',
    damage: 45,
    description: 'Stagger the beast. Close the distance. Tear the nightmare apart.'
  }
];

export default function BossBattle(){
  const [bossHealth, setBossHealth] = useState(MAX_HEALTH)
  const [playerHealth, setPlayerHealth] = useState(MAX_PLAYER_HEALTH)
  const [cooldown, setCooldown] = useState(false)
  const [activeTechnique, setActiveTechnique] = useState(0)
  const [won, setWon] = useState(false)
  const [lost, setLost] = useState(false)
  const { celebrate } = useInteractive()

  useEffect(() => {
    if (won || lost) return
    const timer = window.setInterval(() => {
      setPlayerHealth((health) => {
        if (health <= 1) {
          setLost(true)
          return 0
        }
        return health - 1
      })
    }, 1800)
    return () => window.clearInterval(timer)
  }, [won, lost])

  function strike(damage: number){
    if (cooldown || won || lost) return
    setCooldown(true)
    window.setTimeout(() => setCooldown(false), damage > 20 ? 1200 : 650)
    setBossHealth((health) => {
      const nextHealth = Math.max(0, health - damage)
      if (nextHealth === 0) {
        setWon(true)
        celebrate()
      }
      return nextHealth
    })
  }

  function restart(){
    setBossHealth(MAX_HEALTH)
    setPlayerHealth(MAX_PLAYER_HEALTH)
    setCooldown(false)
    setWon(false)
    setLost(false)
  }

  return (
    <section id="boss-battle" className="boss-battle relative overflow-hidden py-24">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <div className="boss-sigil mx-auto mb-6">⚔</div>
        <div className="phase-kicker">Boss encounter</div>
        <h2 className="mt-3 text-4xl font-semibold text-[#F7E8C8] sm:text-5xl">{bossName}</h2>
        <img
          src={withBasePath('/photos/Radahn solos.jpg')}
          alt="Radahn standing victorious"
          className="mx-auto mt-6 w-full max-w-2xl rounded-3xl border border-[#E7B56A]/25 object-cover shadow-[0_20px_60px_rgba(0,0,0,0.35)]"
        />
        <p className="mx-auto mt-5 max-w-xl text-[#D8C8B5]">{bossIntro}</p>
        <div className="arsenal-card mt-8 text-left">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="phase-kicker">Choose your discipline</div>
              <p className="mt-2 text-sm text-[#D8C8B5]">Borrowed legends. Your own fight.</p>
            </div>
            <span className="arsenal-mark">✧</span>
          </div>
          <div className="mt-5 grid gap-2 sm:grid-cols-3">
            {TECHNIQUES.map((technique, index) => (
              <button
                key={technique.name}
                className={`technique-card ${activeTechnique === index ? 'technique-card-active' : ''}`}
                onClick={() => setActiveTechnique(index)}
                aria-pressed={activeTechnique === index}
              >
                <span className="text-2xl">{technique.icon}</span>
                <span className="mt-2 block text-xs font-bold uppercase tracking-[0.12em]">{technique.name}</span>
                <span className="mt-1 block text-[0.65rem] uppercase tracking-[0.14em] text-[#E7B56A]">{technique.school}</span>
              </button>
            ))}
          </div>
          <p className="mt-4 text-sm italic text-[#D8C8B5]">{TECHNIQUES[activeTechnique].description}</p>
        </div>
        <div className="boss-arena mt-10">
          <div className="boss-mark">☠</div>
          <div className="mt-6 text-left">
            <div className="mb-2 flex justify-between text-xs uppercase tracking-[0.25em] text-[#E7B56A]"><span>Warden vitality</span><span>{bossHealth}%</span></div>
            <div className="health-track"><div className="health-fill" style={{ width: `${bossHealth}%` }} /></div>
          </div>
          <div className="mt-6 flex justify-center gap-2 text-xl" aria-label={`${playerHealth} lives remaining`}>
            {Array.from({ length: MAX_PLAYER_HEALTH }, (_, index) => <span key={index} className={index < playerHealth ? 'text-[#D64B4B]' : 'text-[#62494A]'}>◆</span>)}
          </div>
          <p className="mt-3 text-xs uppercase tracking-[0.18em] text-[#D8C8B5]">Your resolve: {playerHealth}/{MAX_PLAYER_HEALTH} · the warden strikes every 1.8 seconds</p>
          <p className="mt-3 text-sm text-[#E7B56A]">Choose a technique, then use Strike for a quick hit or Charged Strike for more damage and a longer cooldown.</p>
          {!won && !lost && (
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <button className="battle-button" disabled={cooldown} onClick={() => strike(TECHNIQUES[activeTechnique].damage)}>{attackLabel}</button>
              <button className="battle-button battle-button-heavy" disabled={cooldown} onClick={() => strike(TECHNIQUES[activeTechnique].damage + 10)}>{chargedAttackLabel}</button>
            </div>
          )}
          {!won && !lost && cooldown && <p className="mt-4 text-xs uppercase tracking-[0.2em] text-[#D64B4B]">Recovering...</p>}
          {(won || lost) && (
            <div className="mt-8">
              <p className="phase-kicker">{won ? 'Boss defeated' : 'You fell'}</p>
              <p className="mt-2 text-lg text-[#F7E8C8]">{won ? victory : defeat}</p>
            </div>
          )}
          {lost && <button className="battle-button mt-6" onClick={restart}>Rise again</button>}
        </div>
      </div>
    </section>
  )
}