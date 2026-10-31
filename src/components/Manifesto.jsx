import { useEffect, useRef } from 'react'
import { gsap, comMovimento } from '../lib/movimento.js'

const TEXTO = 'Seu cliente decide em segundos se confia em você, quase sempre olhando para a tela do celular. Cuidamos desse primeiro contato com o capricho de uma marca grande, e com o preço combinado antes de começar.'

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
