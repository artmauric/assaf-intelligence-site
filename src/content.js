// Todo o conteúdo editável fica em content.json; edite pelo painel em /admin (npm run dev).
// Campos vazios não aparecem no site.
import dados from './content.json' with { type: 'json' }

export const CONTEUDO = dados
export const EMPRESA = dados.empresa
// Número com país + DDD, só números. Ex.: 5511999999999
export const WHATS_NUMERO = dados.empresa.whatsapp
export const SERVICOS = dados.servicos.itens
export const NICHOS = dados.servicos.nichos
export const DEMOS = dados.exemplos.demos
export const PACOTES = dados.pacotes.itens
export const PASSOS = dados.processo.passos
// Publique apenas depoimentos reais, com autorização por escrito
export const DEPOIMENTOS = dados.depoimentos.itens
export const DUVIDAS = dados.duvidas.itens
export const TIPOS_NEGOCIO = dados.contato.tiposNegocio
