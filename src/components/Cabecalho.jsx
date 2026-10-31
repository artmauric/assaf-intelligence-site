import { useState } from 'react'

const LINKS = [
  ['#servicos', 'Serviços'],
  ['#exemplos', 'Exemplos'],
  ['#pacotes', 'Pacotes'],
  ['#monte', 'Monte o seu'],
  ['#duvidas', 'Dúvidas'],
]

export function Cabecalho() {
  const [aberto, setAberto] = useState(false)
  return (
    <header className="cabecalho">
      <a className="logo" href="#inicio">Assaf</a>
      <nav className="nav-links" aria-label="Principal">
        {LINKS.map(([href, nome]) => <a key={href} href={href}>{nome}</a>)}
      </nav>
      <a className="botao botao-contorno nav-cta" href="#contato">Pedir orçamento</a>
      <button className="menu-botao" type="button" aria-expanded={aberto} aria-controls="menu-celular" onClick={() => setAberto(!aberto)}>
        {aberto ? 'Fechar' : 'Menu'}
      </button>
      {aberto && (
        <nav className="menu-celular" id="menu-celular" aria-label="Menu do celular" onClick={() => setAberto(false)}>
          {LINKS.map(([href, nome]) => <a key={href} href={href}>{nome}</a>)}
          <a href="#contato">Pedir orçamento</a>
        </nav>
      )}
    </header>
  )
}
