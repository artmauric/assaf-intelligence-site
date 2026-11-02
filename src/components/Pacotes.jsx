import { PACOTES } from '../content.js'
import { EXTRAS, MAX_PAGINAS, PRECO_PAGINA, real } from '../lib/orcamento.js'

export function Pacotes({ aoEscolher, paginas, setPaginas, marcados, setMarcados, orcamento }) {
  const alternar = (id) => setMarcados(marcados.includes(id) ? marcados.filter((m) => m !== id) : [...marcados, id])

  return (
    <section className="secao" id="pacotes">
      <div className="pacotes-topo">
        <h2>Você sabe quanto vai pagar antes de começar</h2>
        <p className="intro">Cada pacote sai mais barato do que contratar os mesmos itens separadamente.</p>
      </div>

      <div className="pacotes">
        {PACOTES.map((p) => (
          <article key={p.nome} className={p.destaque ? 'pacote destaque' : 'pacote'}>
            {p.destaque && <span className="selo">★ {p.destaque}</span>}
            <h3>{p.nome}</h3>
            <div className="preco">{p.aPartirDe && <small>a partir de</small>}{p.preco}</div>
            <small className="separado">Com os itens separados: {p.separado}</small>
            <ul>{p.itens.map((i) => <li key={i}>{i}</li>)}</ul>
            <a className={p.destaque ? 'botao botao-tema' : 'botao botao-contorno'} href="#contato" onClick={() => aoEscolher(p.nome)}>Quero o {p.nome}</a>
            <p className="para">{p.para}</p>
          </article>
        ))}
      </div>
      <p className="aviso">Domínio, hospedagem e taxas de pagamento online são cobrados à parte.</p>

      <div className="monte" id="monte">
        <div>
          <h2>Monte o seu</h2>
          <p className="intro">Comece com uma página com botão de WhatsApp por R$ 297 e adicione só o que precisar.</p>
          <div className="opcoes">
            <div className="opcao">
              <span className="opcao-nome"><b>Páginas extras</b><small>Ex.: serviços, sobre e contato</small></span>
              <span className="quantidade">
                <button type="button" aria-label="Remover uma página" disabled={paginas === 0} onClick={() => setPaginas(paginas - 1)}>−</button>
                <output aria-label="Páginas extras">{paginas}</output>
                <button type="button" aria-label="Adicionar uma página" disabled={paginas === MAX_PAGINAS} onClick={() => setPaginas(paginas + 1)}>+</button>
              </span>
              <span className="opcao-preco">{real(PRECO_PAGINA)} cada</span>
            </div>
            {EXTRAS.map((e) => (
              <label className="opcao" key={e.id}>
                <input type="checkbox" checked={marcados.includes(e.id)} onChange={() => alternar(e.id)} />
                <span className="opcao-nome"><b>{e.nome}</b><small>{e.texto}</small></span>
                <span className="opcao-preco">{real(e.preco)}</span>
              </label>
            ))}
          </div>
        </div>
        <aside className="resumo" aria-live="polite">
          <h3>Seu pacote</h3>
          <div className="total">{real(orcamento.total)}</div>
          <ul>{orcamento.linhas.map((l) => <li key={l}>{l}</li>)}</ul>
          {orcamento.dica && <p className="dica">{orcamento.dica}</p>}
          <a className="botao botao-tema" href="#contato" onClick={() => aoEscolher('Monte o seu')}>Enviar este pacote</a>
          <small>O valor final é confirmado na conversa.</small>
        </aside>
      </div>
    </section>
  )
}
