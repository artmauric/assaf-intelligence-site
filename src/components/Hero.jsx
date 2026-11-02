import { useEffect, useRef, useState } from 'react'
import { gsap, comMovimento } from '../lib/movimento.js'
import { Logo } from './Logo.jsx'
import { CONTEUDO, PACOTES } from '../content.js'
import { BASE, real } from '../lib/orcamento.js'

const { hero } = CONTEUDO
const menorPacote = Math.min(...PACOTES.map((p) => p.valor))

export function Hero() {
  const raiz = useRef(null)
  const canvas = useRef(null)
  const vaga = useRef(null)
  const [semGl, setSemGl] = useState(false)

  useEffect(() => {
    let metal
    let cancelado = false
    const revert = comMovimento(() => {
      gsap.from('.hero-texto > *', { y: 28, opacity: 0, duration: 0.9, stagger: 0.08, ease: 'power3.out', delay: 0.1 })
      gsap.to('.hero-texto', { yPercent: -14, opacity: 0, ease: 'none', scrollTrigger: { trigger: '.camadas', start: 'top top', end: '+=70%', scrub: true } })
    })
    Promise.all([import('../gl/metal.js'), document.fonts.load('800 expanded 100px Archivo')])
      .then(([{ criarMetal }]) => {
        if (cancelado) return
        metal = criarMetal({ canvas: canvas.current, vaga: vaga.current, raiz: raiz.current })
        gsap.to({ v: 0 }, {
          v: 1, ease: 'none',
          onUpdate() { metal.definirRolagem(this.targets()[0].v) },
          scrollTrigger: { trigger: '.camadas', start: 'top top', end: '+=100%', scrub: true },
        })
      })
      .catch(() => setSemGl(true))
    return () => {
      cancelado = true
      revert()
      metal?.destruir()
    }
  }, [])

  return (
    <section className={semGl ? 'hero sem-gl' : 'hero'} id="inicio" ref={raiz}>
      <canvas ref={canvas} aria-hidden="true" />
      <div className="hero-texto">
        <div className="hero-letras" ref={vaga} aria-hidden="true"><Logo /></div>
        <h1>{hero.titulo}</h1>
        <p>{hero.texto}</p>
        <div className="botoes">
          <a className="botao botao-tema" href="#contato">{hero.botaoPrincipal}</a>
          <a className="botao botao-contorno" href="#pacotes">{hero.botaoSecundario}</a>
        </div>
        <small>Pacotes a partir de {real(menorPacote)}, ou monte o seu a partir de {real(BASE)}.</small>
      </div>
    </section>
  )
}
