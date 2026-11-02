import { useCallback, useEffect, useState } from 'react'

const SECOES = {
  empresa: 'Empresa e contato',
  hero: 'Topo da página',
  manifesto: 'Manifesto',
  servicos: 'Serviços',
  exemplos: 'Exemplos',
  pacotes: 'Pacotes e preços',
  monte: 'Monte o seu',
  processo: 'Como funciona',
  depoimentos: 'Depoimentos',
  duvidas: 'Dúvidas',
  contato: 'Formulário de contato',
  rodape: 'Rodapé',
}

const ROTULOS = {
  titulo: 'Título', texto: 'Texto', botaoPrincipal: 'Botão principal', botaoSecundario: 'Botão secundário',
  nome: 'Nome', razaoSocial: 'Razão social', whatsapp: 'WhatsApp (país + DDD + número, só números. Ex.: 5511999999999)',
  email: 'E-mail', cidade: 'Cidade', cnpj: 'CNPJ', itens: 'Itens', demo: 'Imagem de prévia', nichos: 'Tipos de cliente atendidos',
  demos: 'Sites de demonstração', marca: 'Nome do negócio fictício', tipo: 'Tipo de negócio', id: 'Identificador',
  para: 'Para quem é', valor: 'Preço (R$)', valorSeparado: 'Preço dos itens separados (R$)', aPartirDe: 'Mostrar "a partir de" antes do preço',
  destaque: 'Selo de destaque (vazio = sem destaque)', aviso: 'Aviso abaixo dos pacotes', itemBase: 'Nome do item base',
  base: 'Preço base (R$)', precoPagina: 'Preço por página extra (R$)', maxPaginas: 'Máximo de páginas extras',
  extras: 'Itens adicionais', preco: 'Preço (R$)', passos: 'Passos', p: 'Pergunta', r: 'Resposta (vazio = pergunta escondida)',
  tiposNegocio: 'Tipos de negócio no formulário', privacidade: 'Política de privacidade (resumo)', autor: 'Nome, negócio e cidade',
}

const DICAS = {
  'pacotes.itens.nome': 'A sugestão do "Monte o seu" usa os nomes Cartão Digital, Essencial, Profissional e Premium.',
  'depoimentos.itens': 'Publique só depoimentos reais, com autorização por escrito.',
  'exemplos.demos': 'Os sites de exemplo são arquivos prontos: aqui você muda só os textos.',
}

// Listas vazias precisam de um molde para o botão "Adicionar"
const MOLDES = { 'depoimentos.itens': { texto: '', autor: '' } }
// Listas que não podem ganhar nem perder itens pelo painel
const TRAVADAS = ['exemplos.demos']

const rotulo = (chave) => ROTULOS[chave] || chave
const semIndices = (caminho) => caminho.filter((p) => typeof p === 'string').join('.')
const textoLongo = (chave, valor) => ['texto', 'r', 'privacidade', 'para'].includes(chave) || valor.length > 70

function vazio(modelo) {
  if (Array.isArray(modelo)) return []
  if (modelo && typeof modelo === 'object') return Object.fromEntries(Object.entries(modelo).map(([k, v]) => [k, vazio(v)]))
  return typeof modelo === 'number' ? 0 : typeof modelo === 'boolean' ? false : ''
}

function definir(raiz, caminho, valor) {
  if (!caminho.length) return valor
  const [primeiro, ...resto] = caminho
  const copia = Array.isArray(raiz) ? [...raiz] : { ...raiz }
  copia[primeiro] = definir(raiz[primeiro], resto, valor)
  return copia
}

export function Painel() {
  const [dados, setDados] = useState(null)
  const [secao, setSecao] = useState('hero')
  const [sujo, setSujo] = useState(false)
  const [estado, setEstado] = useState({ tipo: '', texto: '' })

  useEffect(() => {
    fetch('/api/conteudo')
      .then((r) => r.json())
      .then(setDados)
      .catch(() => setEstado({ tipo: 'erro', texto: 'Não consegui ler o conteúdo. Rode "npm run dev" e abra /admin de novo.' }))
  }, [])

  const mudar = useCallback((caminho, valor) => {
    setDados((d) => definir(d, caminho, valor))
    setSujo(true)
    setEstado({ tipo: '', texto: '' })
  }, [])

  const salvar = useCallback(async () => {
    setEstado({ tipo: '', texto: 'Salvando…' })
    try {
      const r = await fetch('/api/conteudo', { method: 'PUT', headers: { 'Content-Type': 'application/json', 'X-Painel': '1' }, body: JSON.stringify(dados) })
      const corpo = await r.json()
      if (!r.ok) throw new Error(corpo.erro)
      setSujo(false)
      setEstado({ tipo: 'ok', texto: 'Salvo. O site aberto em outra aba já mostra a mudança.' })
    } catch (e) {
      setEstado({ tipo: 'erro', texto: 'Não salvou: ' + (e.message || 'servidor fora do ar') })
    }
  }, [dados])

  useEffect(() => {
    const atalho = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') { e.preventDefault(); if (sujo) salvar() }
    }
    const sair = (e) => { if (sujo) e.preventDefault() }
    addEventListener('keydown', atalho)
    addEventListener('beforeunload', sair)
    return () => { removeEventListener('keydown', atalho); removeEventListener('beforeunload', sair) }
  }, [sujo, salvar])

  if (!dados) return <main className="painel-carregando"><p>{estado.texto || 'Carregando…'}</p></main>

  const ids = dados.exemplos.demos.map((d) => d.id)

  return (
    <div className="painel">
      <aside className="painel-menu">
        <a className="painel-logo" href="/" target="_blank" rel="noopener">Assaf.<i>In</i> <small>painel</small></a>
        <nav aria-label="Seções do site">
          {Object.keys(SECOES).filter((k) => k in dados).map((k) => (
            <button key={k} type="button" aria-current={secao === k} onClick={() => setSecao(k)}>{SECOES[k]}</button>
          ))}
        </nav>
      </aside>

      <main className="painel-conteudo">
        <header className="painel-topo">
          <h1>{SECOES[secao]}</h1>
          <div className="painel-acoes">
            <a href="/" target="_blank" rel="noopener">Ver site</a>
            <button type="button" className="painel-salvar" disabled={!sujo} onClick={salvar}>{sujo ? 'Salvar alterações' : 'Tudo salvo'}</button>
          </div>
        </header>
        {estado.texto && <p className={'painel-estado ' + estado.tipo} role="status">{estado.texto}</p>}
        <Campo caminho={[secao]} valor={dados[secao]} mudar={mudar} ids={ids} />
      </main>
    </div>
  )
}

function Campo({ caminho, valor, mudar, ids }) {
  const chave = caminho.findLast((p) => typeof p === 'string')
  const id = caminho.join('-')
  const dica = DICAS[semIndices(caminho)]

  if (Array.isArray(valor)) return <Lista caminho={caminho} valor={valor} mudar={mudar} ids={ids} />

  if (valor && typeof valor === 'object') {
    return (
      <div className="painel-grupo">
        {Object.entries(valor).map(([k, v]) => <Campo key={k} caminho={[...caminho, k]} valor={v} mudar={mudar} ids={ids} />)}
      </div>
    )
  }

  if (typeof valor === 'boolean') {
    return (
      <label className="painel-check" htmlFor={id}>
        <input id={id} type="checkbox" checked={valor} onChange={(e) => mudar(caminho, e.target.checked)} />
        {rotulo(chave)}
      </label>
    )
  }

  let controle
  if (typeof valor === 'number') {
    controle = <input id={id} type="number" min="0" step="1" value={valor} onChange={(e) => mudar(caminho, e.target.value === '' ? 0 : Math.max(0, Number(e.target.value)))} />
  } else if (chave === 'id') {
    controle = <input id={id} value={valor} readOnly />
  } else if (chave === 'demo') {
    controle = <select id={id} value={valor} onChange={(e) => mudar(caminho, e.target.value)}>{ids.map((i) => <option key={i}>{i}</option>)}</select>
  } else if (textoLongo(chave, valor)) {
    controle = <textarea id={id} rows={Math.min(8, Math.max(3, Math.ceil(valor.length / 70)))} value={valor} onChange={(e) => mudar(caminho, e.target.value)} />
  } else {
    controle = <input id={id} value={valor} onChange={(e) => mudar(caminho, e.target.value)} />
  }

  return (
    <div className="painel-campo">
      <label htmlFor={id}>{rotulo(chave)}</label>
      {controle}
      {dica && <small>{dica}</small>}
    </div>
  )
}

function Lista({ caminho, valor, mudar, ids }) {
  const nomeLista = semIndices(caminho)
  const travada = TRAVADAS.includes(nomeLista)
  const deTextos = valor.length ? typeof valor[0] === 'string' : !MOLDES[nomeLista]
  const mover = (i, d) => {
    const nova = [...valor]
    ;[nova[i], nova[i + d]] = [nova[i + d], nova[i]]
    mudar(caminho, nova)
  }
  const remover = (i) => mudar(caminho, valor.filter((_, k) => k !== i))
  const adicionar = () => {
    let item = valor.length ? vazio(valor[0]) : vazio(MOLDES[nomeLista] ?? '')
    if (item && typeof item === 'object' && 'id' in item) item = { ...item, id: 'item-' + Date.now().toString(36) }
    mudar(caminho, [...valor, item])
  }
  const titulo = (item, i) => (typeof item === 'object' && (item.nome || item.p || item.marca || item.autor)) || `Item ${i + 1}`
  // preventDefault: dentro do <summary>, o clique também abriria ou fecharia o item
  const botoes = (i) => !travada && (
    <span className="painel-ordem">
      <button type="button" aria-label="Subir" disabled={i === 0} onClick={(e) => { e.preventDefault(); mover(i, -1) }}>↑</button>
      <button type="button" aria-label="Descer" disabled={i === valor.length - 1} onClick={(e) => { e.preventDefault(); mover(i, 1) }}>↓</button>
      <button type="button" aria-label="Remover" className="painel-remover" onClick={(e) => { e.preventDefault(); remover(i) }}>Remover</button>
    </span>
  )

  return (
    <fieldset className="painel-lista">
      <legend>{rotulo(caminho.findLast((p) => typeof p === 'string'))}</legend>
      {DICAS[nomeLista] && <small>{DICAS[nomeLista]}</small>}
      {valor.length === 0 && <p className="painel-vazio">Nenhum item ainda.</p>}
      {valor.map((item, i) => deTextos ? (
        <div className="painel-linha" key={i}>
          <input aria-label={`${rotulo(caminho.at(-1))} ${i + 1}`} value={item} onChange={(e) => mudar([...caminho, i], e.target.value)} />
          {botoes(i)}
        </div>
      ) : (
        <details className="painel-item" key={i} open={valor.length <= 2}>
          <summary><span>{titulo(item, i)}</span>{botoes(i)}</summary>
          <Campo caminho={[...caminho, i]} valor={item} mudar={mudar} ids={ids} />
        </details>
      ))}
      {!travada && <button type="button" className="painel-adicionar" onClick={adicionar}>+ Adicionar</button>}
    </fieldset>
  )
}
