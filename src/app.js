import { evaluate, formatResult } from './calculator.js';
import { CATEGORIES, respond } from './chatbot.js';
import { BrowserHistory, getSite, listSites, search } from './miniInternet.js';

/* ------------------------------------------------------------------ */
/* Tabs                                                                */
/* ------------------------------------------------------------------ */

const tabs = document.querySelectorAll('.tab');
const panels = document.querySelectorAll('.panel');

tabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    tabs.forEach((t) => {
      t.classList.remove('active');
      t.setAttribute('aria-selected', 'false');
    });
    panels.forEach((p) => p.classList.remove('active'));
    tab.classList.add('active');
    tab.setAttribute('aria-selected', 'true');
    document.getElementById(`panel-${tab.dataset.tab}`).classList.add('active');
  });
});

/* ------------------------------------------------------------------ */
/* Calculator                                                          */
/* ------------------------------------------------------------------ */

const expressionEl = document.getElementById('calcExpression');
const resultEl = document.getElementById('calcResult');

const calc = {
  expression: '',
  lastResult: '0',
};

function renderCalc() {
  expressionEl.textContent = calc.expression || '0';
  resultEl.textContent = calc.lastResult;
}

function calcInput(value) {
  calc.expression += value;
  renderCalc();
  previewCalc();
}

function previewCalc() {
  if (!calc.expression.trim()) return;
  try {
    calc.lastResult = formatResult(evaluate(calc.expression));
  } catch {
    calc.lastResult = '…';
  }
  renderCalc();
}

function calcEquals() {
  if (!calc.expression.trim()) return;
  try {
    const value = evaluate(calc.expression);
    calc.lastResult = formatResult(value);
    calc.expression = formatResult(value);
  } catch (err) {
    calc.lastResult = `Error: ${err.message}`;
  }
  renderCalc();
}

function calcClear() {
  calc.expression = '';
  calc.lastResult = '0';
  renderCalc();
}

function calcBackspace() {
  calc.expression = calc.expression.slice(0, -1);
  renderCalc();
  previewCalc();
}

document.querySelectorAll('.key').forEach((key) => {
  key.addEventListener('click', () => {
    const { value, action } = key.dataset;
    if (action === 'clear') calcClear();
    else if (action === 'backspace') calcBackspace();
    else if (action === 'equals') calcEquals();
    else if (value) calcInput(value);
  });
});

document.addEventListener('keydown', (e) => {
  const panel = document.getElementById('panel-calculator');
  if (!panel.classList.contains('active')) return;
  if (e.target.tagName === 'INPUT') return;

  if (/^[0-9.+\-*/^%()]$/.test(e.key)) {
    calcInput(e.key);
    e.preventDefault();
  } else if (e.key === 'Enter') {
    calcEquals();
    e.preventDefault();
  } else if (e.key === 'Backspace') {
    calcBackspace();
    e.preventDefault();
  } else if (e.key === 'Escape') {
    calcClear();
    e.preventDefault();
  }
});

renderCalc();

/* ------------------------------------------------------------------ */
/* Chatbot                                                             */
/* ------------------------------------------------------------------ */

const chatLog = document.getElementById('chatLog');
const chatForm = document.getElementById('chatForm');
const chatInput = document.getElementById('chatInput');
const catChips = document.querySelectorAll('.cat-chip');

const messages = [];
let activeCategory = 'semua';

function addMessage(role, text, category) {
  messages.push({ role, text, category });
  renderChat();
}

function renderChat() {
  chatLog.innerHTML = '';

  const visible = messages.filter(
    (m) => m.role === 'user' || activeCategory === 'semua' || m.category === activeCategory
  );

  for (const msg of visible) {
    const row = document.createElement('div');
    row.className = `msg ${msg.role}`;

    const avatar = document.createElement('div');
    avatar.className = 'avatar';
    avatar.textContent = msg.role === 'user' ? '🙂' : '🤖';

    const bubble = document.createElement('div');
    bubble.className = 'bubble';

    if (msg.role === 'bot' && msg.category) {
      const cat = CATEGORIES[msg.category];
      if (cat) {
        const tag = document.createElement('span');
        tag.className = 'tag';
        tag.style.background = `${cat.color}22`;
        tag.style.color = cat.color;
        tag.textContent = `${cat.emoji} ${cat.label}`;
        bubble.appendChild(tag);
        bubble.appendChild(document.createElement('br'));
      }
    }

    bubble.appendChild(document.createTextNode(formatText(msg.text)));
    row.append(avatar, bubble);
    chatLog.appendChild(row);
  }

  chatLog.scrollTop = chatLog.scrollHeight;
}

/**
 * Minimal markdown-ish formatter: **bold**, `code`, and newlines are
 * preserved by the bubble's white-space: pre-wrap.
 */
function formatText(text) {
  return String(text)
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/`(.+?)`/g, '$1');
}

function sendChat(text) {
  const trimmed = text.trim();
  if (!trimmed) return;

  addMessage('user', trimmed);
  chatInput.value = '';

  const reply = respond(trimmed);
  setTimeout(() => addMessage('bot', reply.text, reply.category), 180);
}

chatForm.addEventListener('submit', (e) => {
  e.preventDefault();
  sendChat(chatInput.value);
});

catChips.forEach((chip) => {
  chip.addEventListener('click', () => {
    catChips.forEach((c) => c.classList.remove('active'));
    chip.classList.add('active');
    activeCategory = chip.dataset.cat;
    renderChat();
  });
});

addMessage(
  'bot',
  'Halo! 👋 Saya **NEXA**. Saya punya 4 kategori: 📐 Matematika, 🔬 Sains, 💬 Umum, 🎲 Hiburan.\n\nCoba ketik `bantuan` untuk melihat contoh, atau klik kategori di kiri untuk menyaring jawaban.',
  'umum'
);

/* ------------------------------------------------------------------ */
/* Mini Internet                                                       */
/* ------------------------------------------------------------------ */

const browserBody = document.getElementById('browserBody');
const browserInput = document.getElementById('browserInput');
const browserForm = document.getElementById('browserForm');
const btnBack = document.getElementById('btnBack');
const btnForward = document.getElementById('btnForward');
const btnHome = document.getElementById('btnHome');

const history = new BrowserHistory();

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function renderHome() {
  browserInput.value = 'nexa://search';
  browserBody.innerHTML = '';
  browserBody.appendChild(el('h2', 'page-title', '🌐 NEXA Mini Internet'));
  browserBody.appendChild(
    el(
      'p',
      'page-url',
      'Jelajahi situs kurasi di bawah. Semua konten tersimpan lokal — tanpa koneksi eksternal.'
    )
  );

  const grid = el('div', 'site-grid');
  for (const site of listSites()) {
    const card = el('div', 'site-card');
    card.appendChild(el('div', 'icon', site.icon));
    card.appendChild(el('h3', '', site.title));
    card.appendChild(el('p', '', site.description));
    card.appendChild(el('span', 'url', site.url));
    card.addEventListener('click', () => openUrl(site.url));
    grid.appendChild(card);
  }
  browserBody.appendChild(grid);
  updateNav();
}

function renderSite(site) {
  browserInput.value = site.url;
  browserBody.innerHTML = '';
  browserBody.appendChild(el('h2', 'page-title', `${site.icon} ${site.title}`));
  browserBody.appendChild(el('p', 'page-url', site.url));

  if (site.id === 'nexa-search') {
    renderHome();
    return;
  }

  const list = el('div', 'page-list');
  for (const page of site.pages || []) {
    const item = el('div', 'page-item');
    item.appendChild(el('h3', '', page.title));
    item.appendChild(el('p', '', page.body));
    const tags = el('div', 'tags');
    for (const tag of page.tags || []) tags.appendChild(el('span', 'tag-pill', `#${tag}`));
    item.appendChild(tags);
    list.appendChild(item);
  }
  browserBody.appendChild(list);
  updateNav();
}

function renderSearch(query) {
  browserInput.value = query;
  browserBody.innerHTML = '';
  browserBody.appendChild(el('h2', 'page-title', `🔎 Hasil untuk “${query}”`));
  browserBody.appendChild(el('p', 'page-url', 'nexa://search'));

  const results = search(query);
  if (!results.length) {
    browserBody.appendChild(
      el('p', 'empty', 'Tidak ada hasil. Coba kata kunci lain seperti “sains”, “planet”, atau “cuaca”.')
    );
    updateNav();
    return;
  }

  const list = el('div', 'page-list');
  for (const result of results) {
    const item = el('div', 'page-item result-item');
    item.appendChild(el('div', 'kind', result.kind === 'page' ? 'Halaman' : 'Situs'));
    item.appendChild(el('h3', '', result.title));
    item.appendChild(el('p', '', result.snippet));
    item.addEventListener('click', () => openUrl(getSite(result.siteId).url));
    list.appendChild(item);
  }
  browserBody.appendChild(list);
  updateNav();
}

function openUrl(raw) {
  const url = String(raw || '').trim();
  if (!url) return;

  const site = listSites().find((s) => s.url === url || s.id === url);
  if (site) {
    history.visit(site.url);
    renderSite(getSite(site.id));
    return;
  }

  history.visit(url);
  renderSearch(url);
}

function updateNav() {
  btnBack.disabled = !history.canGoBack;
  btnForward.disabled = !history.canGoForward;
}

btnBack.addEventListener('click', () => {
  const url = history.back();
  if (url) openUrl(url);
});
btnForward.addEventListener('click', () => {
  const url = history.forward();
  if (url) openUrl(url);
});
btnHome.addEventListener('click', () => {
  history.visit('nexa://search');
  renderHome();
});

browserForm.addEventListener('submit', (e) => {
  e.preventDefault();
  openUrl(browserInput.value);
});

renderHome();

/* ------------------------------------------------------------------ */
/* Clock                                                               */
/* ------------------------------------------------------------------ */

const clockEl = document.getElementById('clock');
function tickClock() {
  clockEl.textContent = new Date().toLocaleString('id-ID', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}
tickClock();
setInterval(tickClock, 1000);
