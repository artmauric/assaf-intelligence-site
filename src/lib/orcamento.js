import dados from '../content.json' with { type: 'json' }

const { monte, pacotes } = dados
export const BASE = monte.base
export const PRECO_PAGINA = monte.precoPagina
export const MAX_PAGINAS = monte.maxPaginas
export const EXTRAS = monte.extras

export const real = (n) => 'R$ ' + n.toLocaleString('pt-BR')

const pacote = (nome) => pacotes.itens.find((p) => p.nome === nome)

// Sugere um pacote fechado só quando ele cobre tudo o que foi escolhido e sai mais barato
function sugerir(total, paginas, tem) {
  const semLojaCrm = !tem('loja') && !tem('crm')
  const semFotosAgenda = !tem('ag') && !tem('gal')
  const regras = [
    ['Cartão Digital', paginas === 0 && semLojaCrm && semFotosAgenda, 'já inclui esses itens e sai mais em conta.'],
    ['Essencial', paginas <= 3 && semLojaCrm && semFotosAgenda, 'já inclui esses itens e sai mais em conta.'],
    ['Profissional', paginas <= 7 && semLojaCrm, 'já inclui esses itens e sai mais em conta.'],
    ['Premium', paginas <= 7, 'já inclui esses itens.'],
  ]
  for (const [nome, cobre, fim] of regras) {
    const p = pacote(nome)
    if (p && cobre && total > p.valor) return `O ${nome} (${p.aPartirDe ? 'a partir de ' : ''}${real(p.valor)}) ${fim}`
  }
  return ''
}

export function calcular(paginas, marcados) {
  const tem = (id) => marcados.includes(id)
  let total = BASE
  const linhas = [monte.itemBase + ': ' + real(BASE)]
  if (paginas > 0) {
    total += paginas * PRECO_PAGINA
    linhas.push((paginas === 1 ? '1 página extra: ' : paginas + ' páginas extras: ') + real(paginas * PRECO_PAGINA))
  }
  for (const e of EXTRAS) {
    if (tem(e.id)) { total += e.preco; linhas.push(e.nome + ': ' + real(e.preco)) }
  }
  return {
    total,
    linhas,
    dica: sugerir(total, paginas, tem),
    resumo: 'Monte o seu:\n- ' + linhas.join('\n- ') + '\nTotal: ' + real(total),
  }
}

export function mensagemOrcamento({ nome, negocio, tipo, pacote, resumo }) {
  let texto = 'Olá! Quero um orçamento.\nNome: ' + nome + '\nNegócio: ' + negocio + '\nTipo: ' + tipo + '\nPacote: ' + pacote
  if (pacote === 'Monte o seu') texto += '\n' + resumo
  return texto
}
