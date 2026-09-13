import confetti from 'canvas-confetti'

export function fireConfetti(){
  if (typeof window === 'undefined') return
  confetti({ particleCount: 120, spread: 160, startVelocity: 30, origin: { y: 0.6 } })
}
