import { EMPRESA } from '../content.js'
import { propsZap } from '../lib/zap.js'
import { Logo } from './Logo.jsx'

export function Rodape() {
  return (
    <footer className="rodape">
      <h2>Seu próximo cliente já está procurando você no celular.</h2>
      <div className="botoes">
        <a className="botao botao-lima" {...propsZap}>Falar no WhatsApp</a>
        <a className="botao botao-contorno" href="#pacotes">Ver pacotes</a>
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
