import test from 'node:test';
import assert from 'node:assert/strict';
import { CATEGORIES, detectCategory, respond } from '../src/chatbot.js';

test('there are exactly four chatbot categories', () => {
  const keys = Object.keys(CATEGORIES);
  assert.deepEqual(keys.sort(), ['hiburan', 'matematika', 'sains', 'umum']);
  for (const cat of Object.values(CATEGORIES)) {
    assert.ok(cat.label);
    assert.ok(cat.emoji);
  }
});

test('matematika: evaluates expressions via "hitung"', () => {
  const res = respond('hitung 12 * (3 + 4)');
  assert.equal(res.category, 'matematika');
  assert.match(res.text, /84/);

  const bare = respond('2 + 2');
  assert.equal(bare.category, 'matematika');
  assert.match(bare.text, /4/);
});

test('matematika: understands formulas and pi', () => {
  assert.equal(respond('rumus luas lingkaran').category, 'matematika');
  assert.match(respond('rumus luas lingkaran').text, /π/);
  assert.equal(respond('apa itu bilangan prima').category, 'matematika');
});

test('sains: answers science questions', () => {
  const foto = respond('apa itu fotosintesis?');
  assert.equal(foto.category, 'sains');
  assert.match(foto.text, /kloroplas/i);

  assert.equal(respond('jelaskan gravitasi').category, 'sains');
  assert.equal(respond('planet apa saja di tata surya').category, 'sains');
  assert.equal(respond('berapa kecepatan cahaya').category, 'sains');
});

test('umum: greetings, identity, help, and time', () => {
  const halo = respond('halo');
  assert.equal(halo.category, 'umum');
  assert.match(halo.text, /NEXA/);

  assert.equal(respond('siapa kamu').category, 'umum');
  assert.match(respond('bantuan').text, /Matematika/);

  const jam = respond('jam berapa sekarang');
  assert.equal(jam.category, 'umum');
  assert.match(jam.text, /WIB/);
});

test('hiburan: jokes, facts, recommendations, motivation', () => {
  assert.equal(respond('beri aku lelucon').category, 'hiburan');
  assert.equal(respond('fakta unik dong').category, 'hiburan');
  assert.equal(respond('rekomendasi film').category, 'hiburan');
  assert.match(respond('beri motivasi').text, /semangat|konsisten/i);
});

test('empty input returns a prompt instead of crashing', () => {
  const res = respond('');
  assert.equal(res.category, 'umum');
  assert.match(res.text, /ketik/i);
});

test('unknown input falls back gracefully', () => {
  const res = respond('zzzqqq sesuatu yang tidak dikenal');
  assert.equal(res.category, 'umum');
  assert.match(res.text, /belum yakin|bantuan/i);
});

test('detectCategory maps text to the right category', () => {
  assert.equal(detectCategory('apa itu atom'), 'sains');
  assert.equal(detectCategory('halo dunia'), 'umum');
  assert.equal(detectCategory('lelucon dong'), 'hiburan');
  assert.equal(detectCategory('rumus keliling persegi'), 'matematika');
});
