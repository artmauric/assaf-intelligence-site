import { useEffect, useRef, useState } from 'react'
import { gsap, comMovimento } from '../lib/movimento.js'
import { Logo } from './Logo.jsx'

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
        <h1>Um site à altura do seu negócio.</h1>
        <p>Sites, cartões digitais e lojas virtuais para clínicas, escritórios, barbearias e comércios locais. Design de estúdio, feito para o celular e com preço fechado.</p>
        <div className="botoes">
          <a className="botao botao-lima" href="#contato">Pedir orçamento</a>
          <a className="botao botao-contorno" href="#pacotes">Ver pacotes e preços</a>
        </div>
        <small>Pacotes a partir de R$ 397, ou monte o seu a partir de R$ 297.</small>
      </div>
    </section>
  )
}
