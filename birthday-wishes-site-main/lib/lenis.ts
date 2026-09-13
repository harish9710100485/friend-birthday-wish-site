import Lenis from 'lenis'

let lenis: any = null

export function initLenis(){
  if (typeof window === 'undefined') return null
  if (lenis) return lenis
  lenis = new Lenis({ duration: 1.2, easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) })
  function raf(t: number){ lenis.raf(t); requestAnimationFrame(raf) }
  requestAnimationFrame(raf)
  return lenis
}

export function getLenis(){ return lenis }
