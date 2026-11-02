import { CONTEUDO, PASSOS } from '../content.js'

export function Processo() {
  return (
    <section className="secao processo">
      <h2>{CONTEUDO.processo.titulo}</h2>
      <ol>
        {PASSOS.map((p) => (
          <li key={p.nome}>
            <h3>{p.nome}</h3>
            <p>{p.texto}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}
