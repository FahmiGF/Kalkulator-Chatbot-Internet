import { evaluate, formatResult } from './calculator.js';

/**
 * Chatbot dengan 4 kategori:
 *  1. matematika  - hitung ekspresi, rumus, konversi
 *  2. sains       - fisika, kimia, biologi, astronomi
 *  3. umum        - sapaan, jati diri, bantuan, waktu
 *  4. hiburan     - jokes, fakta unik, rekomendasi
 */

export const CATEGORIES = {
  matematika: { label: 'Matematika', emoji: '📐', color: '#3b82f6' },
  sains: { label: 'Sains', emoji: '🔬', color: '#10b981' },
  umum: { label: 'Umum', emoji: '💬', color: '#f59e0b' },
  hiburan: { label: 'Hiburan', emoji: '🎲', color: '#a855f7' },
};

const INTENTS = [
  // ---------------- matematika ----------------
  {
    category: 'matematika',
    patterns: [/^hitung\s+(.+)$/i, /^berapa\s+(.+)$/i, /^kalkulator\s+(.+)$/i],
    handle(match) {
      const expression = match[1].trim();
      // Only treat it as math when it actually parses; otherwise fall through
      // to the other categories (e.g. "berapa kecepatan cahaya" is science).
      if (!/[0-9)]/.test(expression)) return null;
      try {
        const value = evaluate(expression);
        return `Hasil dari \`${expression}\` adalah **${formatResult(value)}**.`;
      } catch {
        return null;
      }
    },
  },
  {
    category: 'matematika',
    patterns: [/rumus (luas|keliling) (persegi|lingkaran|segitiga)/i],
    handle(match) {
      const bentuk = match[2].toLowerCase();
      const jenis = match[1].toLowerCase();
      const rumus = {
        persegi: { luas: 'L = s × s', keliling: 'K = 4 × s' },
        lingkaran: { luas: 'L = π × r²', keliling: 'K = 2 × π × r' },
        segitiga: { luas: 'L = ½ × alas × tinggi', keliling: 'K = a + b + c' },
      };
      return `Rumus ${jenis} ${bentuk}: **${rumus[bentuk][jenis]}**`;
    },
  },
  {
    category: 'matematika',
    patterns: [/bilangan prima/i],
    handle() {
      return 'Bilangan prima adalah bilangan > 1 yang hanya habis dibagi 1 dan dirinya sendiri. Contoh: 2, 3, 5, 7, 11, 13, 17, 19, 23, 29.';
    },
  },
  {
    category: 'matematika',
    patterns: [/phi|π/i],
    handle() {
      return 'Nilai π (pi) ≈ **3.141592653589793**. Di kalkulator ini kamu bisa mengetik `pi`.';
    },
  },

  // ---------------- sains ----------------
  {
    category: 'sains',
    patterns: [/fotosintesis/i],
    handle() {
      return 'Fotosintesis adalah proses tumbuhan mengubah **CO₂ + H₂O + cahaya** menjadi **glukosa + O₂** di dalam kloroplas.';
    },
  },
  {
    category: 'sains',
    patterns: [/gravitasi/i],
    handle() {
      return 'Gravitasi bumi menarik benda dengan percepatan ≈ **9,8 m/s²**. Gaya tariknya: F = G·m₁·m₂/r².';
    },
  },
  {
    category: 'sains',
    patterns: [/air|h2o/i],
    handle() {
      return 'Air (H₂O) tersusun dari 2 atom hidrogen dan 1 atom oksigen. Titik beku 0 °C, titik didih 100 °C pada 1 atm.';
    },
  },
  {
    category: 'sains',
    patterns: [/planet|tata surya/i],
    handle() {
      return 'Tata surya punya 8 planet: **Merkurius, Venus, Bumi, Mars, Jupiter, Saturnus, Uranus, Neptunus**.';
    },
  },
  {
    category: 'sains',
    patterns: [/kecepatan cahaya|cahaya/i],
    handle() {
      return 'Kecepatan cahaya di ruang hampa ≈ **299.792.458 m/s** (≈ 3 × 10⁸ m/s).';
    },
  },
  {
    category: 'sains',
    patterns: [/atom/i],
    handle() {
      return 'Atom terdiri dari **proton (+)** dan **neutron** di inti, serta **elektron (−)** yang mengelilingi inti.';
    },
  },

  // ---------------- umum ----------------
  {
    category: 'umum',
    patterns: [/^(hai|halo|hello|hi|hey|assalamualaikum|pagi|siang|malam)\b/i],
    handle() {
      return 'Halo! 👋 Saya **NEXA**, chatbot dengan 4 kategori: 📐 Matematika, 🔬 Sains, 💬 Umum, 🎲 Hiburan. Mau tanya apa?';
    },
  },
  {
    category: 'umum',
    patterns: [/siapa (kamu|anda|nama kamu)|kamu siapa/i],
    handle() {
      return 'Saya **NEXA**, asisten mini yang menggabungkan kalkulator, chatbot 4 kategori, dan mini internet. Dibuat dengan JavaScript murni tanpa framework.';
    },
  },
  {
    category: 'umum',
    patterns: [/bantuan|help|bisa apa|fitur/i],
    handle() {
      return 'Saya bisa:\n• 📐 **Matematika** — coba `hitung 12*(3+4)`\n• 🔬 **Sains** — tanya `apa itu fotosintesis`\n• 💬 **Umum** — `jam berapa sekarang`\n• 🎲 **Hiburan** — `beri aku lelucon`\n• 🌐 Buka tab **Mini Internet** untuk browsing situs kurasi.';
    },
  },
  {
    category: 'umum',
    patterns: [/jam berapa|tanggal berapa|hari apa|waktu sekarang/i],
    handle() {
      const now = new Date();
      const hari = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'][now.getDay()];
      const jam = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
      const tanggal = now.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
      return `Sekarang **${hari}**, ${tanggal}, pukul **${jam}** WIB.`;
    },
  },
  {
    category: 'umum',
    patterns: [/terima kasih|makasih|thanks/i],
    handle() {
      return 'Sama-sama! 😊 Senang bisa membantu.';
    },
  },
  {
    category: 'umum',
    patterns: [/indonesia/i],
    handle() {
      return 'Indonesia adalah negara kepulauan dengan **17.000+ pulau**, ibu kota **Jakarta**, dan bahasa resmi **Bahasa Indonesia**.';
    },
  },

  // ---------------- hiburan ----------------
  {
    category: 'hiburan',
    patterns: [/lelucon|jokes|lawak|humor|bercanda/i],
    handle() {
      const jokes = [
        'Kenapa programmer suka kopi? Karena tanpa kopi, kodenya jadi *decaf*-fault. ☕',
        'Matahari itu bintang, tapi kenapa tidak pernah ikut konser? Karena ia selalu *shining* di siang hari. 🌞',
        'Kenapa komputer tidak bisa menang debat? Karena selalu kehabisan *argumen*. 💻',
        'Apa bedanya kalkulator dan kamu? Kalkulator bisa menghitung, tapi kamu bisa bikin aku tersenyum. 😄',
      ];
      return jokes[Math.floor(Math.random() * jokes.length)];
    },
  },
  {
    category: 'hiburan',
    patterns: [/fakta unik|fakta menarik|tahukah kamu/i],
    handle() {
      const facts = [
        'Madu tidak pernah basi — madu berusia 3.000 tahun masih bisa dimakan. 🍯',
        'Sehari di Venus lebih lama daripada setahun di Venus. 🪐',
        'Gurita punya 3 jantung dan darah berwarna biru. 🐙',
        'Pisang secara teknis adalah buah beri, tapi stroberi bukan. 🍌',
      ];
      return facts[Math.floor(Math.random() * facts.length)];
    },
  },
  {
    category: 'hiburan',
    patterns: [/rekomendasi|saran|film|musik|buku/i],
    handle() {
      return 'Rekomendasi cepat:\n• 🎬 Film: *Interstellar* (sains + emosi)\n• 🎵 Musik: lo-fi beats untuk fokus\n• 📚 Buku: *Sapiens* oleh Yuval Noah Harari\n• 🎮 Game: *Portal 2* (puzzle + humor)';
    },
  },
  {
    category: 'hiburan',
    patterns: [/motivasi|semangat|quotes/i],
    handle() {
      return '“Kesuksesan bukan tentang seberapa cepat kamu sampai, tapi seberapa konsisten kamu melangkah.” — tetap semangat! 🔥';
    },
  },
  {
    category: 'hiburan',
    patterns: [/warna favorit/i],
    handle() {
      return 'Warna favorit saya **biru elektrik** ⚡ — sama seperti tema Mini Internet ini!';
    },
  },
];

export function detectCategory(text) {
  const lower = String(text).toLowerCase();
  for (const intent of INTENTS) {
    if (intent.patterns.some((p) => p.test(lower))) return intent.category;
  }
  return 'umum';
}

export function respond(input) {
  const text = String(input ?? '').trim();
  if (!text) {
    return {
      category: 'umum',
      text: 'Silakan ketik pertanyaan dulu ya. Contoh: `hitung 2+2` atau `apa itu gravitasi`.',
    };
  }

  for (const intent of INTENTS) {
    for (const pattern of intent.patterns) {
      const match = text.match(pattern);
      if (match) {
        const answer = intent.handle(match);
        if (answer !== null && answer !== undefined) {
          return { category: intent.category, text: answer };
        }
      }
    }
  }

  // Fallback: kalau isinya ekspresi matematika murni, hitung otomatis.
  if (/^[\d\s+\-*/^%().]+$/.test(text)) {
    try {
      return {
        category: 'matematika',
        text: `Sepertinya itu ekspresi matematika. Hasilnya **${formatResult(evaluate(text))}**.`,
      };
    } catch {
      /* jatuh ke fallback biasa */
    }
  }

  return {
    category: 'umum',
    text: `Saya belum yakin dengan “${text}”. Coba tanyakan hal lain, atau ketik **bantuan** untuk melihat kemampuan saya.`,
  };
}
