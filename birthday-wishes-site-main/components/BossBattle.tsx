"use client"
import { useEffect, useState } from 'react'
import { useInteractive } from '../context/InteractiveProvider'
import content from '../data/content.json'

const MAX_HEALTH = 100
const MAX_PLAYER_HEALTH = 3
const { bossName, bossIntro, attackLabel, chargedAttackLabel, victory, defeat } = content.phaseTwo

export default function BossBattle(){
  const [bossHealth, setBossHealth] = useState(MAX_HEALTH)
  const [playerHealth, setPlayerHealth] = useState(MAX_PLAYER_HEALTH)
  const [cooldown, setCooldown] = useState(false)
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
        <p className="mx-auto mt-5 max-w-xl text-[#D8C8B5]">{bossIntro}</p>
        <div className="boss-arena mt-10">
          <div className="boss-mark">☠</div>
          <div className="mt-6 text-left">
            <div className="mb-2 flex justify-between text-xs uppercase tracking-[0.25em] text-[#E7B56A]"><span>Warden vitality</span><span>{bossHealth}%</span></div>
            <div className="health-track"><div className="health-fill" style={{ width: `${bossHealth}%` }} /></div>
          </div>
          <div className="mt-6 flex justify-center gap-2 text-xl" aria-label={`${playerHealth} lives remaining`}>
            {Array.from({ length: MAX_PLAYER_HEALTH }, (_, index) => <span key={index} className={index < playerHealth ? 'text-[#D64B4B]' : 'text-[#62494A]'}>◆</span>)}
          </div>
          {!won && !lost && (
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <button className="battle-button" disabled={cooldown} onClick={() => strike(12)}>{attackLabel}</button>
              <button className="battle-button battle-button-heavy" disabled={cooldown} onClick={() => strike(25)}>{chargedAttackLabel}</button>
            </div>
          )}
          {(won || lost) && <p className="mt-8 text-lg text-[#F7E8C8]">{won ? victory : defeat}</p>}
          {lost && <button className="battle-button mt-6" onClick={restart}>Rise again</button>}
        </div>
      </div>
    </section>
  )
}