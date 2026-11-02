// Confere se o conteúdo novo tem o mesmo formato do atual, para o painel nunca salvar algo que quebre o site.
// Devolve '' quando está tudo certo, ou a descrição do primeiro problema.
export function conferirFormato(novo, modelo, caminho = 'conteúdo') {
  if (Array.isArray(modelo)) {
    if (!Array.isArray(novo)) return `${caminho} precisa ser uma lista`
    for (const [i, item] of novo.entries()) {
      const erro = modelo.length
        ? conferirFormato(item, modelo[0], `${caminho}[${i}]`)
        : textosSoltos(item, `${caminho}[${i}]`)
      if (erro) return erro
    }
    return ''
  }
  if (modelo && typeof modelo === 'object') {
    if (!novo || typeof novo !== 'object' || Array.isArray(novo)) return `${caminho} precisa ser um grupo de campos`
    const faltando = Object.keys(modelo).find((k) => !(k in novo))
    if (faltando) return `${caminho}.${faltando} está faltando`
    const sobrando = Object.keys(novo).find((k) => !(k in modelo))
    if (sobrando) return `${caminho}.${sobrando} não existe no site`
    for (const k of Object.keys(modelo)) {
      const erro = conferirFormato(novo[k], modelo[k], `${caminho}.${k}`)
      if (erro) return erro
    }
    return ''
  }
  if (typeof novo !== typeof modelo) return `${caminho} precisa ser ${nomeTipo(modelo)}`
  if (typeof novo === 'number' && !(Number.isFinite(novo) && novo >= 0)) return `${caminho} precisa ser um número igual ou maior que zero`
  return ''
}

// Listas que começam vazias (ex.: depoimentos) aceitam textos ou grupos de textos
function textosSoltos(item, caminho) {
  if (typeof item === 'string') return ''
  if (item && typeof item === 'object' && !Array.isArray(item) && Object.values(item).every((v) => typeof v === 'string')) return ''
  return `${caminho} precisa ter só textos`
}

const nomeTipo = (v) => ({ string: 'um texto', number: 'um número', boolean: 'sim ou não' })[typeof v] || typeof v
