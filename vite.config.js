import { readFile, writeFile } from 'node:fs/promises'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { conferirFormato } from './src/admin/formato.js'

const CONTEUDO = new URL('./src/content.json', import.meta.url)

// Painel em /admin: só existe no "npm run dev" e grava direto em src/content.json
function painelAdmin() {
  return {
    name: 'painel-admin',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use((req, _res, next) => {
        if (req.url === '/admin' || req.url === '/admin/') req.url = '/admin.html'
        next()
      })
      server.middlewares.use('/api/conteudo', async (req, res) => {
        const responder = (status, corpo) => {
          res.statusCode = status
          res.setHeader('Content-Type', 'application/json; charset=utf-8')
          res.end(typeof corpo === 'string' ? corpo : JSON.stringify(corpo))
        }
        if (req.method === 'GET') return responder(200, await readFile(CONTEUDO, 'utf8'))
        if (req.method !== 'PUT') return responder(405, { erro: 'Use GET ou PUT.' })
        // Outro site aberto no navegador não consegue mandar este cabeçalho nem vir de localhost
        const origem = req.headers.origin || ''
        if (req.headers['x-painel'] !== '1' || (origem && !/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origem))) {
          return responder(403, { erro: 'Pedido recusado.' })
        }
        let texto = ''
        for await (const parte of req) texto += parte
        let novo
        try {
          novo = JSON.parse(texto)
        } catch {
          return responder(400, { erro: 'O conteúdo enviado não é um JSON válido.' })
        }
        const atual = JSON.parse(await readFile(CONTEUDO, 'utf8'))
        const erro = conferirFormato(novo, atual)
        if (erro) return responder(400, { erro })
        await writeFile(CONTEUDO, JSON.stringify(novo, null, 2) + '\n')
        responder(200, { ok: true })
      })
    },
  }
}

export default defineConfig({
  base: './',
  plugins: [react(), painelAdmin()],
})
