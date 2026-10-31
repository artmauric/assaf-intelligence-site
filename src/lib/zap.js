import { WHATS_NUMERO } from '../content.js'

export const temNumero = /^\d{12,13}$/.test(WHATS_NUMERO)
export const linkZap = (texto) => 'https://wa.me/' + WHATS_NUMERO + '?text=' + encodeURIComponent(texto)

// Sem número configurado, os botões levam ao formulário
export const propsZap = temNumero
  ? { href: linkZap('Olá! Vim pelo site e quero um orçamento.'), target: '_blank', rel: 'noopener' }
  : { href: '#contato' }
