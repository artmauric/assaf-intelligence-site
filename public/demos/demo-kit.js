/* Kit das demonstrações: dá função aos botões de agendar, WhatsApp e mapa,
   sem enviar nada para fora. Pega cores e fontes do próprio site. */
(() => {
  const $ = (s, el = document) => el.querySelector(s)
  const $$ = (s, el = document) => [...el.querySelectorAll(s)]
  const nome = (($('header .logo') || {}).textContent || document.title).trim().replace(/\s+/g, ' ')

  // Cor do botão principal do site, para o kit parecer parte dele
  // Só cor sólida e não clara: botões de vidro ou brancos deixariam o texto ilegível
  const corSolida = (b) => {
    const s = getComputedStyle(b)
    const rgb = (s.backgroundColor + ' ' + s.backgroundImage).match(/rgb\((\d+), (\d+), (\d+)\)/)
    return rgb && +rgb[1] + +rgb[2] + +rgb[3] < 640 ? rgb[0] : null
  }
  const principal = $$('a.btn, button.btn').find(corSolida)
  const estilo = principal ? getComputedStyle(principal) : null
  document.documentElement.style.setProperty('--dk-cor', principal ? corSolida(principal) : '#222')
  document.documentElement.style.setProperty('--dk-tinta', estilo ? estilo.color : '#fff')

  const css = document.createElement('style')
  css.textContent = `
  .dk-faixa{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-size:.78rem!important;padding-block:7px!important;line-height:1.3!important}
  .dk-janela{width:min(440px,calc(100vw - 24px));max-height:calc(100dvh - 24px);border:0;border-radius:20px;padding:0;color:#1b1b1f;background:#fff;box-shadow:0 30px 80px -20px rgba(0,0,0,.55);font-family:inherit}
  .dk-janela::backdrop{background:rgba(10,10,14,.55);backdrop-filter:blur(4px)}
  .dk-topo{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:18px 20px;border-bottom:1px solid #eee}
  .dk-topo h2{margin:0;font-size:1.1rem;font-family:inherit;letter-spacing:0;text-transform:none;color:inherit}
  .dk-fechar{width:36px;height:36px;border-radius:50%;border:1px solid #ddd;background:#fff;font-size:1.2rem;line-height:1;cursor:pointer;color:#333}
  .dk-corpo{display:grid;gap:14px;padding:18px 20px 20px}
  .dk-corpo label{display:grid;gap:6px;font-size:.9rem;font-weight:600}
  .dk-corpo input,.dk-corpo select{min-height:46px;padding:0 12px;border:1px solid #d9d9e0;border-radius:12px;font:inherit;font-size:1rem;background:#fafafb;color:#1b1b1f}
  .dk-chips{display:flex;flex-wrap:wrap;gap:8px}
  .dk-chip{min-height:40px;padding:0 14px;border-radius:999px;border:1px solid #d9d9e0;background:#fff;font:inherit;font-size:.9rem;cursor:pointer;color:#1b1b1f}
  .dk-chip[aria-pressed=true]{background:var(--dk-cor);border-color:var(--dk-cor);color:var(--dk-tinta)}
  .dk-chip:disabled{opacity:.35;text-decoration:line-through;cursor:not-allowed}
  .dk-acao{min-height:50px;border:0;border-radius:999px;background:var(--dk-cor);color:var(--dk-tinta);font:inherit;font-weight:700;font-size:1rem;cursor:pointer}
  .dk-nota{margin:0;font-size:.8rem;color:#6b6b76}
  .dk-erro{margin:0;color:#c0392b;font-weight:600;font-size:.9rem}
  .dk-ok{display:grid;gap:10px;text-align:center;padding:12px 4px}
  .dk-ok b{font-size:1.15rem}
  .dk-ok i{display:grid;place-items:center;width:56px;height:56px;margin:0 auto;border-radius:50%;background:var(--dk-cor);color:var(--dk-tinta);font-style:normal;font-size:1.6rem}
  .dk-chat{display:grid;gap:8px;min-height:180px;align-content:end;padding:14px;border-radius:14px;background:#efeae2}
  .dk-balao{max-width:82%;padding:8px 12px;border-radius:12px;background:#fff;font-size:.93rem;box-shadow:0 1px 1px rgba(0,0,0,.08)}
  .dk-balao.eu{justify-self:end;background:#d9fdd3}
  .dk-enviar{display:flex;gap:8px}.dk-enviar input{flex:1}
  .dk-aviso{position:fixed;left:50%;bottom:24px;z-index:9999;translate:-50% 0;max-width:calc(100vw - 32px);padding:12px 18px;border-radius:14px;background:#1b1b1f;color:#fff;font-size:.92rem;box-shadow:0 12px 30px -10px rgba(0,0,0,.5)}
  header.dk-rolou{box-shadow:0 10px 30px -18px rgba(0,0,0,.45)}
  header nav a[aria-current=true]{text-decoration:underline;text-underline-offset:6px;text-decoration-thickness:2px}
  `
  document.head.appendChild(css)

  // Faixa de aviso numa linha só
  const faixa = $('.demo, .demo-banner')
  if (faixa) {
    faixa.classList.add('dk-faixa')
    faixa.innerHTML = `<strong>Demonstração</strong> · site fictício da Assaf Intelligence`
  }

  function janela(titulo, corpo) {
    const d = document.createElement('dialog')
    d.className = 'dk-janela'
    d.innerHTML = `<div class="dk-topo"><h2>${titulo}</h2><button class="dk-fechar" type="button" aria-label="Fechar">×</button></div><div class="dk-corpo">${corpo}</div>`
    $('.dk-fechar', d).onclick = () => d.close()
    d.addEventListener('click', (e) => { if (e.target === d) d.close() })
    d.addEventListener('close', () => d.remove())
    document.body.appendChild(d)
    d.showModal()
    return d
  }

  let avisoTimer
  function avisar(texto) {
    $('.dk-aviso')?.remove()
    const a = Object.assign(document.createElement('div'), { className: 'dk-aviso', textContent: texto })
    a.setAttribute('role', 'status')
    document.body.appendChild(a)
    clearTimeout(avisoTimer)
    avisoTimer = setTimeout(() => a.remove(), 3500)
  }

  // Serviços lidos da própria página, para a agenda fazer sentido em cada demo
  const servicos = (() => {
    const secao = $$('section[id]').find((s) => /servic|tratament|procediment|area|ritual/i.test(s.id))
    const nomes = secao ? $$('h3', secao).map((h) => h.textContent.trim()).filter(Boolean) : []
    return nomes.length ? nomes.slice(0, 8) : ['Primeiro atendimento']
  })()

  function proximosDias() {
    const dias = []
    const d = new Date()
    while (dias.length < 6) {
      d.setDate(d.getDate() + 1)
      if (d.getDay() !== 0) dias.push(new Date(d))
    }
    return dias
  }
  const HORAS = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00']
  // Alguns horários aparecem ocupados para a agenda parecer real
  const ocupado = (dia, i) => (dia.getDate() * 7 + i * 3) % 5 === 0

  function abrirAgenda() {
    const dias = proximosDias()
    const fmt = (d) => d.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: '2-digit' })
    const d = janela('Agendar horário', `
      <label>Seu nome<input name="nome" autocomplete="name"></label>
      <label>Serviço<select name="servico">${servicos.map((s) => `<option>${s}</option>`).join('')}</select></label>
      <div><b style="font-size:.9rem">Dia</b><div class="dk-chips" data-grupo="dia">${dias.map((x, i) => `<button type="button" class="dk-chip" data-i="${i}" aria-pressed="false">${fmt(x)}</button>`).join('')}</div></div>
      <div><b style="font-size:.9rem">Horário</b><div class="dk-chips" data-grupo="hora"><span class="dk-nota">Escolha um dia primeiro.</span></div></div>
      <p class="dk-erro" role="alert" hidden></p>
      <button type="button" class="dk-acao">Confirmar agendamento</button>
      <p class="dk-nota">Demonstração: nenhum dado é enviado.</p>`)
    let dia = null
    let hora = null
    const grupoHora = $('[data-grupo=hora]', d)
    const marcar = (grupo, botao) => $$('.dk-chip', grupo).forEach((b) => b.setAttribute('aria-pressed', String(b === botao)))
    $$('[data-grupo=dia] .dk-chip', d).forEach((b) => b.onclick = () => {
      dia = dias[b.dataset.i]
      hora = null
      marcar(b.parentNode, b)
      grupoHora.innerHTML = HORAS.map((h, i) => `<button type="button" class="dk-chip" ${ocupado(dia, i) ? 'disabled' : ''} aria-pressed="false">${h}</button>`).join('')
      $$('.dk-chip', grupoHora).forEach((h) => h.onclick = () => { hora = h.textContent; marcar(grupoHora, h) })
    })
    $('.dk-acao', d).onclick = () => {
      const erro = $('.dk-erro', d)
      const quem = $('[name=nome]', d).value.trim()
      const falta = !quem ? 'Escreva seu nome.' : !dia ? 'Escolha um dia.' : !hora ? 'Escolha um horário.' : ''
      erro.textContent = falta
      erro.hidden = !falta
      if (falta) return
      $('.dk-corpo', d).innerHTML = `<div class="dk-ok"><i>✓</i><b>Horário reservado, ${quem.split(' ')[0]}!</b>
        <span>${$('[name=servico]', d)?.value || servicos[0]} em ${fmt(dia)}, às ${hora}.</span>
        <p class="dk-nota">No site real, você recebe a confirmação pelo WhatsApp.</p>
        <button type="button" class="dk-acao">Fechar</button></div>`
      $('.dk-ok .dk-acao', d).onclick = () => d.close()
    }
  }

  function abrirConversa() {
    const d = janela(nome, `
      <div class="dk-chat" aria-live="polite"><div class="dk-balao">Olá! Bem-vindo(a) à ${nome}. Como podemos ajudar?</div></div>
      <form class="dk-enviar"><input value="Olá! Vim pelo site e quero mais informações." aria-label="Mensagem"><button class="dk-acao" style="padding:0 18px">Enviar</button></form>
      <p class="dk-nota">Simulação: no site real, este botão abre o WhatsApp do negócio.</p>`)
    const chat = $('.dk-chat', d)
    const balao = (texto, eu) => chat.appendChild(Object.assign(document.createElement('div'), { className: eu ? 'dk-balao eu' : 'dk-balao', textContent: texto }))
    $('form', d).onsubmit = (e) => {
      e.preventDefault()
      const campo = $('input', d)
      if (!campo.value.trim()) return
      balao(campo.value.trim(), true)
      campo.value = ''
      setTimeout(() => balao('Recebemos sua mensagem! Respondemos em poucos minutos no horário de atendimento.'), 900)
    }
  }

  // Botões sem destino ganham função pelo que dizem
  $$('a[href="#"]').forEach((a) => {
    const texto = a.textContent.toLowerCase()
    a.addEventListener('click', (e) => {
      e.preventDefault()
      if (/whats|mensagem/.test(texto)) abrirConversa()
      else if (/mapa|chegar/.test(texto)) avisar('No site real, este botão abre o endereço no Google Maps.')
      else abrirAgenda()
    })
  })

  // Cabeçalho ganha sombra ao rolar e o menu marca a seção visível
  const topo = $('header')
  const aoRolar = () => topo?.classList.toggle('dk-rolou', scrollY > 8)
  addEventListener('scroll', aoRolar, { passive: true })
  aoRolar()

  const links = $$('header nav a[href^="#"]')
  const alvos = links.map((a) => document.getElementById(a.getAttribute('href').slice(1))).filter(Boolean)
  const secaoAtual = new IntersectionObserver((itens) => itens.forEach((i) => {
    if (i.isIntersecting) links.forEach((a) => a.setAttribute('aria-current', String(a.getAttribute('href') === '#' + i.target.id)))
  }), { rootMargin: '-45% 0px -50% 0px' })
  alvos.forEach((s) => secaoAtual.observe(s))
})()
