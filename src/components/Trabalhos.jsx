import { useEffect, useRef, useState } from 'react'
import { DEMOS } from '../content.js'

const url = (id) => `${import.meta.env.BASE_URL}demos/${id}.html`
const foto = (id) => `${import.meta.env.BASE_URL}shots/${id}.webp`
const N = DEMOS.length

export function Trabalhos() {
  const canvas = useRef(null)
  const vidro = useRef(null)
  const dialogo = useRef(null)
  const toque = useRef(null)
  const [posicao, setPosicao] = useState(0)
  const [semGl, setSemGl] = useState(false)
  const [aberto, setAberto] = useState(false)
  const demo = DEMOS[((posicao % N) + N) % N]

  // Carrega a cena só quando a seção se aproxima da tela
  useEffect(() => {
    let cancelado = false
    const espera = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      espera.disconnect()
      import('../gl/vidro.js')
        .then(({ criarVidro }) => criarVidro({ canvas: canvas.current, ids: DEMOS.map((d) => d.id), indice: 0 }))
        .then((v) => { if (cancelado) v.destruir(); else vidro.current = v })
        .catch(() => setSemGl(true))
    }, { rootMargin: '600px' })
    espera.observe(canvas.current)
    return () => {
      cancelado = true
      espera.disconnect()
      vidro.current?.destruir()
    }
  }, [])

  const ir = (p) => {
    setPosicao(p)
    vidro.current?.irPara(p)
  }

  const abrir = () => {
    setAberto(true)
    dialogo.current.showModal()
  }

  const aoPressionar = (e) => {
    toque.current = { x: e.clientX, inicio: posicao, atual: posicao, moveu: false }
    e.currentTarget.setPointerCapture(e.pointerId)
  }
  const aoArrastar = (e) => {
    const t = toque.current
    if (!t || !vidro.current) return
    const dx = e.clientX - t.x
    if (Math.abs(dx) > 6) t.moveu = true
    t.atual = t.inicio - dx / vidro.current.largura()
    if (t.moveu) vidro.current.arrastar(t.atual)
  }
  const aoSoltar = () => {
    const t = toque.current
    toque.current = null
    if (!t) return
    if (t.moveu) ir(Math.round(t.atual))
    else abrir()
  }

  const aoTeclar = (e) => {
    if (e.key === 'ArrowLeft') ir(posicao - 1)
    if (e.key === 'ArrowRight') ir(posicao + 1)
    if (e.key === 'Enter') abrir()
  }

  return (
    <section className="secao" id="exemplos">
      <h2>Veja como o seu site pode ficar</h2>
      <p className="intro">Estes exemplos são demonstrações com nomes fictícios, criadas para mostrar o estilo do nosso trabalho. Não são clientes reais.</p>

      <div
        className={semGl ? 'vitrine sem-gl' : 'vitrine'}
        role="region"
        aria-roledescription="carrossel"
        aria-label="Sites de demonstração. Use as setas para trocar e Enter para abrir."
        tabIndex={0}
        onKeyDown={aoTeclar}
      >
        <canvas ref={canvas} aria-hidden="true" onPointerDown={aoPressionar} onPointerMove={aoArrastar} onPointerUp={aoSoltar} onPointerCancel={() => { toque.current = null }} />
        {semGl && <img src={foto(demo.id)} alt={`Página inicial da demonstração ${demo.marca}`} />}
      </div>

      <div className="vitrine-legenda">
        <div aria-live="polite">
          <h3>{demo.marca}</h3>
          <p>{demo.tipo}. {demo.texto}</p>
        </div>
        <div className="botoes">
          <button className="seta" type="button" aria-label="Exemplo anterior" onClick={() => ir(posicao - 1)}>‹</button>
          <button className="seta" type="button" aria-label="Próximo exemplo" onClick={() => ir(posicao + 1)}>›</button>
          <button className="botao botao-tema" type="button" onClick={abrir}>Ver o site</button>
        </div>
      </div>

      <dialog className="janela-demo" ref={dialogo} onClose={() => setAberto(false)} aria-label={`Demonstração ${demo.marca}`}>
        <div className="janela-barra">
          <strong>{demo.marca}, site de demonstração</strong>
          <a href={url(demo.id)} target="_blank" rel="noopener">Abrir em nova aba</a>
          <button type="button" onClick={() => dialogo.current.close()}>Fechar</button>
        </div>
        {aberto && <iframe src={url(demo.id)} title={`Demonstração ${demo.marca}`} />}
      </dialog>
    </section>
  )
}
