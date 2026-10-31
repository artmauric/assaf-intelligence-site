import test from 'node:test'
import assert from 'node:assert/strict'
import { calcular, mensagemOrcamento } from './orcamento.js'

test('sem itens, cobra só a base', () => {
  const r = calcular(0, [])
  assert.equal(r.total, 297)
  assert.equal(r.dica, '')
})

test('soma páginas e extras', () => {
  const r = calcular(2, ['ag', 'crm'])
  assert.equal(r.total, 297 + 240 + 250 + 450)
  assert.ok(r.linhas.includes('2 páginas extras: R$ 240'))
})

test('sugere o Cartão Digital quando ele cobre os itens', () => {
  assert.match(calcular(0, ['form', 'gmn']).dica, /Cartão Digital/)
})

test('não sugere pacote que não cobre a loja', () => {
  assert.equal(calcular(0, ['loja']).total, 1287)
  assert.equal(calcular(0, ['loja']).dica, '')
})

test('sugere o Profissional quando há agendamento e o total passa dele', () => {
  assert.match(calcular(7, ['ag', 'gal', 'form', 'gmn']).dica, /Profissional/)
})

test('sugere o Premium acima do preço dele', () => {
  assert.match(calcular(1, ['loja', 'crm', 'ag', 'gal', 'gmn', 'form']).dica, /Premium/)
})

test('resumo do Monte o seu só entra na mensagem desse pacote', () => {
  const base = { nome: 'Ana', negocio: 'X', tipo: 'Outro', resumo: 'Monte o seu:\n- item' }
  assert.ok(mensagemOrcamento({ ...base, pacote: 'Monte o seu' }).endsWith('- item'))
  assert.ok(!mensagemOrcamento({ ...base, pacote: 'Essencial' }).includes('- item'))
})
