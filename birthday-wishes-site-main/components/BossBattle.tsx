"use client"
import content from '../data/content.json'
import { withBasePath } from '../lib/assetPath'

const { bossName, bossIntro } = content.phaseTwo

export default function BossBattle(){
  return (
    <section id="boss-battle" className="boss-battle relative overflow-hidden py-24">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <div className="boss-sigil mx-auto mb-6">⚔</div>
        <div className="phase-kicker">Boss encounter-A harder ones bro</div>
        <h2 className="mt-3 text-4xl font-semibold text-[#F7E8C8] sm:text-5xl">{bossName}</h2>
        <img
          src={withBasePath('/photos/Radahn solos.jpg')}
          alt="Radahn standing victorious"
          className="mx-auto mt-6 w-full max-w-2xl rounded-3xl border border-[#E7B56A]/25 object-cover shadow-[0_20px_60px_rgba(0,0,0,0.35)]"
        />
        <p className="mx-auto mt-5 max-w-xl text-[#D8C8B5]">{bossIntro}</p>
        <div className="mt-10 rounded-3xl border border-[#E7B56A]/30 bg-[#171119] p-8 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
          <p className="text-sm text-[#D8C8B5]">Ready for a harder challenge?</p>
          <a
            href="https://hokuto1017.itch.io/kobayakawa-san-is-a-soulslike"
            target="_blank"
            rel="noreferrer"
            className="battle-button mt-6 inline-block"
          >
            Play Kobayakawa-san
          </a>
        </div>
      </div>
    </section>
  )
}