/* ===== CONFIGURAR AQUI =====
   Número com país + DDD, só números. Ex.: 5511999999999 */
export const WHATS_NUMERO = ''

// Campos vazios não aparecem no site. Preencha para publicar.
export const EMPRESA = {
  nome: 'Assaf Inteligence',
  razaoSocial: 'Assaf Inteligence Consultoria Ltda.',
  email: '',
  cidade: '',
  cnpj: '',
}
/* =========================== */

export const SERVICOS = [
  { nome: 'Cartão digital', texto: 'Uma página para o link da bio do Instagram, com serviços, horário, endereço e botão de WhatsApp.', demo: 'barbearia' },
  { nome: 'Site do seu negócio', texto: 'Apresenta sua empresa e seus serviços e mostra como o cliente chega até você.', demo: 'odonto' },
  { nome: 'Loja virtual', texto: 'Venda pela internet, com carrinho e pagamento online. Você mesmo cadastra os produtos pelo celular.', demo: 'loja' },
  { nome: 'Cadastro de clientes', texto: 'Uma lista organizada dos seus clientes, para lembrar os retornos e não perder contatos.', demo: 'estetica' },
  { nome: 'Google Meu Negócio', texto: 'Seu negócio aparece no mapa do Google, com horário, fotos e telefone.', demo: 'advocacia' },
  { nome: 'Melhoria de processos', texto: 'Trocamos o caderno e as planilhas confusas por algo simples e organizado.', demo: 'odonto' },
]

export const PACOTES = [
  { nome: 'Cartão Digital', para: 'Para quem precisa de um bom link na bio.', preco: 'R$ 397', separado: 'R$ 537',
    itens: ['1 página pronta para o celular', 'Botão de WhatsApp', 'Formulário de orçamento', 'Configuração do Google Meu Negócio'] },
  { nome: 'Essencial', para: 'Para apresentar bem o seu negócio.', preco: 'R$ 890', separado: 'R$ 897',
    itens: ['Até 4 páginas', 'Tudo o que vem no Cartão Digital', 'Página de serviços e localização', 'Ajuda para colocar o site no ar'] },
  { nome: 'Profissional', para: 'Para aparecer mais e receber mais agendamentos.', preco: 'R$ 1.590', separado: 'R$ 1.777', destaque: 'Mais completo para serviços',
    itens: ['Até 8 páginas', 'Tudo o que vem no Essencial', 'Galeria de fotos', 'Agendamento online', 'Treinamento de 1 hora'] },
  { nome: 'Premium', para: 'Site e loja virtual juntos.', preco: 'R$ 2.490', aPartirDe: true, separado: 'R$ 3.217',
    itens: ['Tudo o que vem no Profissional', 'Loja virtual com até 30 produtos', 'Cadastro de clientes simples', '30 dias de suporte após a entrega'] },
]

export const PASSOS = [
  { nome: 'Conversa', texto: 'Você conta como funciona o seu negócio e o que o cliente precisa encontrar.' },
  { nome: 'Proposta', texto: 'Você recebe por escrito o pacote, o preço fechado e o prazo.' },
  { nome: 'Criação', texto: 'Montamos o site, e você aprova tudo pelo celular antes da publicação.' },
  { nome: 'No ar', texto: 'Publicamos o site e mostramos como você mesmo atualiza textos e fotos.' },
]

export const DEMOS = [
  { id: 'odonto', marca: 'Sorriso Leve', tipo: 'Clínica odontológica', texto: 'Tratamentos, primeira consulta passo a passo e agendamento pelo WhatsApp.' },
  { id: 'barbearia', marca: 'Navalha Velha', tipo: 'Barbearia', texto: 'Serviços, galeria de cortes e horários de atendimento.' },
  { id: 'estetica', marca: 'Ateliê Pele & Cia', tipo: 'Clínica de estética', texto: 'Procedimentos, ambiente e agendamento rápido.' },
  { id: 'advocacia', marca: 'Moura Advocacia', tipo: 'Escritório de advocacia', texto: 'Áreas de atuação e formulário de primeiro contato, dentro das regras da OAB.' },
  { id: 'loja', marca: 'Empório da Vila', tipo: 'Loja virtual', texto: 'Catálogo com carrinho funcionando, retirada na loja ou entrega no bairro.' },
]

export const NICHOS = ['Dentistas e clínicas odontológicas', 'Clínicas de estética', 'Salões de beleza', 'Barbearias', 'Advogados', 'Psicólogos', 'Comércio local', 'Prestadores de serviço']

// Publique apenas depoimentos reais, com autorização por escrito: { texto, autor }
export const DEPOIMENTOS = []

// Perguntas com resposta null ficam fora do site até serem preenchidas.
export const DUVIDAS = [
  { p: 'Preciso entender de tecnologia?', r: 'Não. Você recebe um passo a passo simples para trocar textos, fotos e preços pelo celular.' },
  { p: 'Qual é a diferença entre um cartão digital e um site?', r: 'O cartão digital tem uma página só e é ótimo para o link do Instagram. O site tem várias páginas e aparece melhor no Google.' },
  { p: 'Quanto custa para manter o site no ar?', r: null },
  { p: 'Em quanto tempo o site fica pronto?', r: null },
  { p: 'Posso mudar de pacote depois?', r: null },
]

export const TIPOS_NEGOCIO = ['Dentista / clínica odontológica', 'Clínica de estética', 'Salão de beleza / barbearia', 'Advocacia', 'Psicologia', 'Loja / comércio local', 'Outro']
