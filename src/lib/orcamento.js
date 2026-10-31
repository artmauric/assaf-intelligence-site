export const BASE = 297
export const PRECO_PAGINA = 120
export const MAX_PAGINAS = 10

export const EXTRAS = [
  { id: 'form', nome: 'Formulário de orçamento', texto: 'O cliente pede orçamento direto pelo site', preco: 90 },
  { id: 'gmn', nome: 'Google Meu Negócio', texto: 'Seu negócio no mapa do Google', preco: 150 },
  { id: 'gal', nome: 'Galeria de fotos', texto: 'Mostre seus trabalhos e o seu espaço', preco: 150 },
  { id: 'ag', nome: 'Agendamento online', texto: 'O cliente escolhe o dia e o horário', preco: 250 },
  { id: 'crm', nome: 'Cadastro de clientes', texto: 'Lista dos seus clientes e dos retornos', preco: 450 },
  { id: 'loja', nome: 'Loja virtual (até 30 produtos)', texto: 'Até 30 produtos, com carrinho', preco: 990 },
]

export const real = (n) => 'R$ ' + n.toLocaleString('pt-BR')

// Sugere um pacote fechado só quando ele cobre tudo o que foi escolhido e sai mais barato
function sugerir(total, paginas, tem) {
  const semLojaCrm = !tem('loja') && !tem('crm')
  const semFotosAgenda = !tem('ag') && !tem('gal')
  if (total > 397 && paginas === 0 && semLojaCrm && semFotosAgenda) return 'O Cartão Digital (R$ 397) já inclui esses itens e sai mais em conta.'
  if (total > 890 && paginas <= 3 && semLojaCrm && semFotosAgenda) return 'O Essencial (R$ 890) já inclui esses itens e sai mais em conta.'
  if (total > 1590 && paginas <= 7 && semLojaCrm) return 'O Profissional (R$ 1.590) já inclui esses itens e sai mais em conta.'
  if (total > 2490 && paginas <= 7) return 'O Premium (a partir de R$ 2.490) já inclui esses itens.'
  return ''
}

export function calcular(paginas, marcados) {
  const tem = (id) => marcados.includes(id)
  let total = BASE
  const linhas = ['Página com botão de WhatsApp: ' + real(BASE)]
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
