import { useState } from 'react'
import { calcular } from './lib/orcamento.js'
import { Cabecalho } from './components/Cabecalho.jsx'
import { Hero } from './components/Hero.jsx'
import { Manifesto } from './components/Manifesto.jsx'
import { Servicos } from './components/Servicos.jsx'
import { Trabalhos } from './components/Trabalhos.jsx'
import { Pacotes } from './components/Pacotes.jsx'
import { Processo } from './components/Processo.jsx'
import { Contato } from './components/Contato.jsx'
import { Rodape } from './components/Rodape.jsx'
import { propsZap } from './lib/zap.js'

export function App() {
  const [pacote, setPacote] = useState('Profissional')
  const [paginas, setPaginas] = useState(0)
  const [marcados, setMarcados] = useState([])
  const orcamento = calcular(paginas, marcados)

  return (
    <>
      <Cabecalho />
      <main>
        <div className="camadas">
          <Hero />
          <Manifesto />
        </div>
        <div className="corpo">
          <Servicos />
          <Trabalhos />
          <Pacotes
            aoEscolher={setPacote}
            paginas={paginas}
            setPaginas={setPaginas}
            marcados={marcados}
            setMarcados={setMarcados}
            orcamento={orcamento}
          />
          <Processo />
          <Contato pacote={pacote} setPacote={setPacote} resumo={orcamento.resumo} />
        </div>
      </main>
      <Rodape />
      <a className="zap-flutuante" aria-label="Falar no WhatsApp" {...propsZap}>
        <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3Z" /></svg>
      </a>
    </>
  )
}
