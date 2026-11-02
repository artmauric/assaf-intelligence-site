import { useEffect, useRef, useState } from 'react'
import { gsap } from '../lib/movimento.js'
import { CONTEUDO, NICHOS, SERVICOS } from '../content.js'

const foto = (id) => `${import.meta.env.BASE_URL}shots/${id}.webp`

export function Servicos() {
  const previa = useRef(null)
  const mover = useRef(null)
  const [demo, setDemo] = useState(null)

  useEffect(() => {
    mover.current = {
      x: gsap.quickTo(previa.current, 'x', { duration: 0.5, ease: 'power3' }),
      y: gsap.quickTo(previa.current, 'y', { duration: 0.5, ease: 'power3' }),
    }
  }, [])

  const aoMover = (e) => {
    mover.current.x(e.clientX + 24)
    mover.current.y(e.clientY - 110)
  }

  return (
    <section className="secao" id="servicos">
      <h2>{CONTEUDO.servicos.titulo}</h2>
      <ul className="servicos" onPointerMove={aoMover} onPointerLeave={() => setDemo(null)}>
        {SERVICOS.map((s) => (
          <li key={s.nome} onPointerEnter={() => setDemo(s.demo)}>
            <h3>{s.nome}</h3>
            <p>{s.texto}</p>
          </li>
        ))}
      </ul>
      <div className={demo ? 'previa visivel' : 'previa'} ref={previa} aria-hidden="true">
        {demo && <img src={foto(demo)} alt="" />}
      </div>
      <p className="nichos">Atendemos {NICHOS.map((n) => n.toLowerCase()).join(', ').replace(/, ([^,]*)$/, ' e $1')}.</p>
    </section>
  )
}
