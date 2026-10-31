import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export { gsap }

// Roda as animações só para quem não pediu menos movimento; devolve a limpeza.
export function comMovimento(animar) {
  const mm = gsap.matchMedia()
  mm.add('(prefers-reduced-motion: no-preference)', animar)
  return () => mm.revert()
}
