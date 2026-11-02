import test from 'node:test';
import assert from 'node:assert/strict';
import { evaluate, formatResult } from '../src/calculator.js';

test('basic arithmetic respects operator precedence', () => {
  assert.equal(evaluate('1 + 2 * 3'), 7);
  assert.equal(evaluate('(1 + 2) * 3'), 9);
  assert.equal(evaluate('10 - 6 / 2'), 7);
  assert.equal(evaluate('2 ^ 3 ^ 2'), 512); // right associative
});

test('unary minus and modulo work', () => {
  assert.equal(evaluate('-5 + 3'), -2);
  assert.equal(evaluate('-(2 + 3)'), -5);
  assert.equal(evaluate('10 % 3'), 1);
});

test('functions and constants are supported', () => {
  assert.equal(evaluate('sqrt(16)'), 4);
  assert.equal(evaluate('abs(-7)'), 7);
  assert.ok(Math.abs(evaluate('sin(0)')) < 1e-12);
  assert.ok(Math.abs(evaluate('cos(0)') - 1) < 1e-12);
  assert.equal(evaluate('log(100)'), 2);
  assert.ok(Math.abs(evaluate('ln(e)') - 1) < 1e-12);
  assert.ok(Math.abs(evaluate('pi') - Math.PI) < 1e-12);
});

test('decimal numbers and formatting', () => {
  assert.equal(evaluate('0.1 + 0.2'), 0.30000000000000004);
  assert.equal(formatResult(0.1 + 0.2), '0.3');
  assert.equal(formatResult(1 / 3), '0.3333333333');
});

test('invalid input throws helpful errors', () => {
  assert.throws(() => evaluate(''), /Empty expression/);
  assert.throws(() => evaluate('2 / 0'), /Division by zero/);
  assert.throws(() => evaluate('2 +'), /Unexpected end/);
  assert.throws(() => evaluate('foo(2)'), /Unknown symbol/);
  assert.throws(() => evaluate('2 @ 3'), /Unexpected character/);
  assert.throws(() => evaluate('(2 + 3'), /Expected \)/);
  assert.throws(() => evaluate('1.2.3'), /Invalid number/);
});

test('functions are exported and callable directly', async () => {
  const mod = await import('../src/calculator.js');
  assert.equal(mod.FUNCTIONS.sqrt(81), 9);
  assert.ok(Math.abs(mod.CONSTANTS.pi - Math.PI) < 1e-12);
});
