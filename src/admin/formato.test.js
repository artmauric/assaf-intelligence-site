import test from 'node:test'
import assert from 'node:assert/strict'
import { conferirFormato } from './formato.js'
import dados from '../content.json' with { type: 'json' }

const copia = () => structuredClone(dados)

test('o conteúdo atual passa na conferência', () => {
  assert.equal(conferirFormato(copia(), dados), '')
})

test('aceita listas com mais ou menos itens', () => {
  const novo = copia()
  novo.pacotes.itens.pop()
  novo.duvidas.itens.push({ p: 'Nova?', r: 'Sim.' })
  assert.equal(conferirFormato(novo, dados), '')
})

test('recusa preço em texto ou negativo', () => {
  const novo = copia()
  novo.pacotes.itens[0].valor = '397'
  assert.match(conferirFormato(novo, dados), /valor precisa ser um número/)
  novo.pacotes.itens[0].valor = -1
  assert.match(conferirFormato(novo, dados), /maior que zero/)
})

test('recusa campo que falta ou sobra', () => {
  const novo = copia()
  delete novo.hero.titulo
  assert.match(conferirFormato(novo, dados), /hero\.titulo está faltando/)
  const outro = copia()
  outro.hero.extra = 'x'
  assert.match(conferirFormato(outro, dados), /hero\.extra não existe/)
})

test('lista que começa vazia aceita grupos de textos', () => {
  const novo = copia()
  novo.depoimentos.itens = [{ texto: 'Ótimo!', autor: 'Ana' }]
  assert.equal(conferirFormato(novo, dados), '')
  novo.depoimentos.itens = [{ texto: 1 }]
  assert.match(conferirFormato(novo, dados), /só textos/)
})
