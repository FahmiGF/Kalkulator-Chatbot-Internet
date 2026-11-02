/**
 * Mini Internet — browser simulasi dengan situs kurasi lokal.
 * Semua halaman adalah data statis; pencarian mencocokkan judul,
 * tag, dan isi halaman.
 */

export const SITES = [
  {
    id: 'nexa-search',
    title: 'NEXA Search',
    url: 'nexa://search',
    icon: '🔎',
    description: 'Mesin pencari mini untuk seluruh konten internet kurasi.',
    tags: ['search', 'pencarian', 'home'],
  },
  {
    id: 'wiki',
    title: 'NEXA Wiki',
    url: 'wiki.nexa',
    icon: '📚',
    description: 'Ensiklopedia ringkas tentang sains, sejarah, dan teknologi.',
    tags: ['wiki', 'ensiklopedia', 'pengetahuan'],
    pages: [
      {
        title: 'Fotosintesis',
        body: 'Fotosintesis adalah proses tumbuhan hijau mengubah energi cahaya menjadi energi kimia. Reaksi utamanya: 6CO₂ + 6H₂O + cahaya → C₆H₁₂O₆ + 6O₂. Proses ini terjadi di kloroplas dan menjadi dasar hampir semua rantai makanan di Bumi.',
        tags: ['biologi', 'tumbuhan', 'sains'],
      },
      {
        title: 'Tata Surya',
        body: 'Tata surya berisi Matahari dan 8 planet: Merkurius, Venus, Bumi, Mars, Jupiter, Saturnus, Uranus, dan Neptunus. Matahari menyumbang 99,86% massa total tata surya.',
        tags: ['astronomi', 'planet', 'sains'],
      },
      {
        title: 'Sejarah Internet',
        body: 'Internet berawal dari ARPANET pada 1969. Protokol TCP/IP diperkenalkan 1983, World Wide Web diciptakan Tim Berners-Lee pada 1989, dan sejak itu internet berkembang menjadi jaringan global.',
        tags: ['teknologi', 'sejarah', 'internet'],
      },
    ],
  },
  {
    id: 'weather',
    title: 'NEXA Cuaca',
    url: 'cuaca.nexa',
    icon: '⛅',
    description: 'Prakiraan cuaca simulasi untuk kota-kota besar Indonesia.',
    tags: ['cuaca', 'weather', 'prakiraan'],
    pages: [
      { title: 'Jakarta', body: 'Cerah berawan, 31°C, kelembapan 74%, angin 12 km/jam dari barat. Peluang hujan 20%.', tags: ['jakarta', 'cuaca'] },
      { title: 'Bandung', body: 'Berawan, 24°C, kelembapan 81%, angin 8 km/jam. Peluang hujan 45% sore hari.', tags: ['bandung', 'cuaca'] },
      { title: 'Surabaya', body: 'Cerah, 33°C, kelembapan 68%, angin 15 km/jam. Peluang hujan 10%.', tags: ['surabaya', 'cuaca'] },
      { title: 'Makassar', body: 'Hujan ringan, 29°C, kelembapan 85%, angin 10 km/jam. Peluang hujan 70%.', tags: ['makassar', 'cuaca'] },
    ],
  },
  {
    id: 'news',
    title: 'NEXA Berita',
    url: 'berita.nexa',
    icon: '📰',
    description: 'Headline teknologi dan sains dari kurasi redaksi mini.',
    tags: ['berita', 'news', 'teknologi'],
    pages: [
      { title: 'AI Generatif Makin Efisien', body: 'Model bahasa generasi baru diklaim mampu berjalan di perangkat lokal dengan konsumsi daya jauh lebih rendah, membuka jalan asisten pribadi offline.', tags: ['ai', 'teknologi'] },
      { title: 'Panel Surya Rekor Efisiensi', body: 'Peneliti melaporkan sel surya tandem perovskite-silikon mencapai efisiensi 34,6% di laboratorium, melampaui batas teoritis sel silikon tunggal.', tags: ['energi', 'sains'] },
      { title: 'Misi Bulan Baru', body: 'Konsorsium antariksa menyiapkan misi tanpa awak untuk memetakan cadangan es di kutub selatan Bulan pada 2027.', tags: ['antariksa', 'sains'] },
    ],
  },
];

export function listSites() {
  return SITES.map(({ id, title, url, icon, description }) => ({ id, title, url, icon, description }));
}

export function getSite(id) {
  return SITES.find((site) => site.id === id) || null;
}

export function search(query) {
  const q = String(query ?? '').trim().toLowerCase();
  if (!q) return [];

  const results = [];
  for (const site of SITES) {
    if (
      site.title.toLowerCase().includes(q) ||
      site.description.toLowerCase().includes(q) ||
      site.tags.some((tag) => tag.toLowerCase().includes(q))
    ) {
      results.push({ siteId: site.id, title: site.title, snippet: site.description, kind: 'site' });
    }
    for (const page of site.pages || []) {
      if (
        page.title.toLowerCase().includes(q) ||
        page.body.toLowerCase().includes(q) ||
        page.tags.some((tag) => tag.toLowerCase().includes(q))
      ) {
        results.push({
          siteId: site.id,
          title: page.title,
          snippet: page.body,
          kind: 'page',
        });
      }
    }
  }
  return results;
}

export class BrowserHistory {
  constructor() {
    this.stack = [];
    this.index = -1;
  }

  visit(url) {
    if (!url) return;
    if (this.stack[this.index] === url) return;
    this.stack = this.stack.slice(0, this.index + 1);
    this.stack.push(url);
    this.index = this.stack.length - 1;
  }

  back() {
    if (this.index > 0) this.index--;
    return this.current();
  }

  forward() {
    if (this.index < this.stack.length - 1) this.index++;
    return this.current();
  }

  current() {
    return this.index >= 0 ? this.stack[this.index] : null;
  }

  get canGoBack() {
    return this.index > 0;
  }

  get canGoForward() {
    return this.index < this.stack.length - 1;
  }
}
