import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)
// Em GPU fraca a entrada do hero não pode atrasar o texto junto com os quadros
gsap.ticker.lagSmoothing(0)

export { gsap }

// Roda as animações só para quem não pediu menos movimento; devolve a limpeza.
export function comMovimento(animar) {
  const mm = gsap.matchMedia()
  mm.add('(prefers-reduced-motion: no-preference)', animar)
  return () => mm.revert()
}
