/**
 * Calculator engine.
 * A safe recursive-descent expression parser (no eval) that supports
 * + - * / ^ %, parentheses, unary minus and a small set of functions.
 */

const CONSTANTS = {
  pi: Math.PI,
  e: Math.E,
};

const FUNCTIONS = {
  sqrt: Math.sqrt,
  abs: Math.abs,
  sin: (x) => Math.sin(x),
  cos: (x) => Math.cos(x),
  tan: (x) => Math.tan(x),
  log: Math.log10,
  ln: Math.log,
  round: Math.round,
  floor: Math.floor,
  ceil: Math.ceil,
};

function tokenize(input) {
  const tokens = [];
  const src = String(input).replace(/\s+/g, '').toLowerCase();
  let i = 0;

  while (i < src.length) {
    const ch = src[i];

    if (/[0-9.]/.test(ch)) {
      let num = '';
      let dots = 0;
      while (i < src.length && /[0-9.]/.test(src[i])) {
        if (src[i] === '.' && ++dots > 1) throw new Error('Invalid number format');
        num += src[i++];
      }
      if (num === '.') throw new Error('Invalid number format');
      tokens.push({ type: 'number', value: parseFloat(num) });
      continue;
    }

    if (/[a-z]/.test(ch)) {
      let name = '';
      while (i < src.length && /[a-z]/.test(src[i])) name += src[i++];
      if (name in CONSTANTS) {
        tokens.push({ type: 'number', value: CONSTANTS[name] });
      } else if (name in FUNCTIONS) {
        tokens.push({ type: 'function', value: name });
      } else {
        throw new Error(`Unknown symbol: ${name}`);
      }
      continue;
    }

    if ('+-*/^%()'.includes(ch)) {
      tokens.push({ type: ch });
      i++;
      continue;
    }

    throw new Error(`Unexpected character: ${src[i]}`);
  }

  return tokens;
}

export function evaluate(expression) {
  if (typeof expression !== 'string' || !expression.trim()) {
    throw new Error('Empty expression');
  }

  const tokens = tokenize(expression);
  let pos = 0;

  const peek = () => tokens[pos];
  const consume = (type) => {
    const token = tokens[pos];
    if (!token || token.type !== type) {
      throw new Error(`Expected ${type}`);
    }
    pos++;
    return token;
  };

  function parseExpression() {
    let value = parseTerm();
    while (peek() && (peek().type === '+' || peek().type === '-')) {
      const op = tokens[pos++].type;
      const rhs = parseTerm();
      value = op === '+' ? value + rhs : value - rhs;
    }
    return value;
  }

  function parseTerm() {
    let value = parsePower();
    while (peek() && (peek().type === '*' || peek().type === '/' || peek().type === '%')) {
      const op = tokens[pos++].type;
      const rhs = parsePower();
      if (op === '*') value *= rhs;
      else if (op === '/') {
        if (rhs === 0) throw new Error('Division by zero');
        value /= rhs;
      } else {
        if (rhs === 0) throw new Error('Division by zero');
        value %= rhs;
      }
    }
    return value;
  }

  function parsePower() {
    const base = parseUnary();
    if (peek() && peek().type === '^') {
      pos++;
      const exponent = parsePower();
      return base ** exponent;
    }
    return base;
  }

  function parseUnary() {
    if (peek() && peek().type === '-') {
      pos++;
      return -parseUnary();
    }
    if (peek() && peek().type === '+') {
      pos++;
      return parseUnary();
    }
    return parsePrimary();
  }

  function parsePrimary() {
    const token = peek();
    if (!token) throw new Error('Unexpected end of expression');

    if (token.type === 'number') {
      pos++;
      return token.value;
    }

    if (token.type === 'function') {
      pos++;
      consume('(');
      const arg = parseExpression();
      consume(')');
      return FUNCTIONS[token.value](arg);
    }

    if (token.type === '(') {
      pos++;
      const value = parseExpression();
      consume(')');
      return value;
    }

    throw new Error(`Unexpected token: ${token.type}`);
  }

  const result = parseExpression();
  if (pos !== tokens.length) throw new Error('Unexpected trailing input');
  if (!Number.isFinite(result)) throw new Error('Result is not a finite number');
  return result;
}

export function formatResult(value) {
  if (!Number.isFinite(value)) return 'Error';
  const rounded = Math.round(value * 1e10) / 1e10;
  return String(rounded);
}

export { FUNCTIONS, CONSTANTS };
