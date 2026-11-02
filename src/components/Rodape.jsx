import { CONTEUDO, EMPRESA } from '../content.js'
import { propsZap } from '../lib/zap.js'
import { Logo } from './Logo.jsx'

export function Rodape() {
  return (
    <footer className="rodape">
      <h2>{CONTEUDO.rodape.titulo}</h2>
      <div className="botoes">
        <a className="botao botao-tema" {...propsZap}>{CONTEUDO.rodape.botaoPrincipal}</a>
        <a className="botao botao-contorno" href="#pacotes">{CONTEUDO.rodape.botaoSecundario}</a>
      </div>
      <div className="marca" aria-hidden="true"><Logo /></div>
      <div className="legal">
        <span>© {new Date().getFullYear()} {EMPRESA.razaoSocial}</span>
        {EMPRESA.cnpj && <span>CNPJ: {EMPRESA.cnpj}</span>}
        {EMPRESA.email && <a href={`mailto:${EMPRESA.email}`}>{EMPRESA.email}</a>}
        {EMPRESA.cidade && <span>{EMPRESA.cidade}</span>}
        <a href="#privacidade">Política de Privacidade</a>
      </div>
    </footer>
  )
}
