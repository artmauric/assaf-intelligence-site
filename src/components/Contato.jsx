import { useState } from 'react'
import { CONTEUDO, DEPOIMENTOS, DUVIDAS, EMPRESA, PACOTES, TIPOS_NEGOCIO, WHATS_NUMERO } from '../content.js'
import { mensagemOrcamento } from '../lib/orcamento.js'
import { linkZap, temNumero } from '../lib/zap.js'

export function Contato({ pacote, setPacote, resumo }) {
  const [nome, setNome] = useState('')
  const [negocio, setNegocio] = useState('')
  const [tipo, setTipo] = useState(TIPOS_NEGOCIO[0])
  const [aceite, setAceite] = useState(false)
  const [erro, setErro] = useState('')
  const [link, setLink] = useState('')

  const enviar = (e) => {
    e.preventDefault()
    const limpo = nome.trim()
    if (!limpo) return setErro('Escreva seu nome para continuar.')
    if (!aceite) return setErro('Marque a caixa de concordância para continuar.')
    if (!temNumero) return setErro('O número de WhatsApp da empresa ainda não foi configurado no site.')
    setErro('')
    const destino = linkZap(mensagemOrcamento({ nome: limpo, negocio: negocio.trim(), tipo, pacote, resumo }))
    setLink(destino)
    try { window.open(destino, '_blank', 'noopener') } catch { /* o link abaixo do formulário continua disponível */ }
  }

  return (
    <>
      {DEPOIMENTOS.length > 0 && (
        <section className="secao">
          <h2>{CONTEUDO.depoimentos.titulo}</h2>
          <div className="depoimentos">
            {DEPOIMENTOS.map((d) => <figure key={d.autor}><blockquote>{d.texto}</blockquote><figcaption>{d.autor}</figcaption></figure>)}
          </div>
        </section>
      )}

      <section className="secao duvidas" id="duvidas">
        <h2>{CONTEUDO.duvidas.titulo}</h2>
        <div>
          {DUVIDAS.filter((d) => d.r).map((d) => (
            <details key={d.p}><summary>{d.p}</summary><p>{d.r}</p></details>
          ))}
        </div>
      </section>

      <section className="secao contato" id="contato">
        <div>
          <h2>{CONTEUDO.contato.titulo}</h2>
          <p className="intro">{CONTEUDO.contato.texto}</p>
          {temNumero && <p>WhatsApp: +{WHATS_NUMERO}</p>}
        </div>
        <form onSubmit={enviar} noValidate>
          <label>Seu nome<input value={nome} onChange={(e) => setNome(e.target.value)} autoComplete="name" required /></label>
          <label>Nome do seu negócio<input value={negocio} onChange={(e) => setNegocio(e.target.value)} /></label>
          <label>Tipo de negócio
            <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
              {TIPOS_NEGOCIO.map((t) => <option key={t}>{t}</option>)}
            </select>
          </label>
          <label>Pacote de interesse
            <select value={pacote} onChange={(e) => setPacote(e.target.value)}>
              {PACOTES.map((p) => <option key={p.nome}>{p.nome}</option>)}
              <option>Monte o seu</option>
              <option>Ainda não sei</option>
            </select>
          </label>
          <label className="aceite">
            <input type="checkbox" checked={aceite} onChange={(e) => setAceite(e.target.checked)} required />
            <span>Concordo que a {EMPRESA.nome} use meu nome e os dados do meu negócio apenas para responder a este pedido de orçamento, conforme a <a href="#privacidade">Política de Privacidade</a>.</span>
          </label>
          {erro && <p className="erro" role="alert">{erro}</p>}
          <button className="botao botao-tema" type="submit">Montar mensagem para o WhatsApp</button>
          {link && <a className="botao botao-contorno" href={link} target="_blank" rel="noopener">Abrir WhatsApp</a>}
          <small>Este site não armazena seus dados. Eles vão apenas na mensagem que você mesmo envia.</small>
        </form>
      </section>

      <section className="secao privacidade" id="privacidade">
        <h3>Política de Privacidade (resumo)</h3>
        <p>{CONTEUDO.contato.privacidade}</p>
      </section>
    </>
  )
}
