import { useEffect, useRef } from 'react'
import { gsap, comMovimento } from '../lib/movimento.js'
import { CONTEUDO } from '../content.js'

const TEXTO = CONTEUDO.manifesto.texto

export function Manifesto() {
  const raiz = useRef(null)

  useEffect(() => comMovimento(() => {
    gsap.fromTo(raiz.current.querySelectorAll('span'), { opacity: 0.16 }, {
      opacity: 1, stagger: 0.1, ease: 'none',
      scrollTrigger: { trigger: raiz.current, start: 'top 70%', end: 'bottom 72%', scrub: true },
    })
  }), [])

  return (
    <section className="manifesto">
      <p ref={raiz} aria-label={TEXTO}>
        {TEXTO.split(' ').map((palavra, i) => <span key={i} aria-hidden="true">{palavra} </span>)}
      </p>
    </section>
  )
}
