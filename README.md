# NEXA — Kalkulator + Chatbot 4 Kategori + Mini Internet

Aplikasi web satu halaman yang menggabungkan tiga fitur dalam satu antarmuka:

1. **📐 Kalkulator** — kalkulator ilmiah dengan parser ekspresi sendiri (tanpa `eval`).
2. **💬 Chatbot 4 Kategori** — Matematika, Sains, Umum, dan Hiburan.
3. **🌐 Mini Internet** — browser simulasi dengan mesin pencari dan situs kurasi lokal.

Dibangun dengan **JavaScript murni (ES Modules)** tanpa framework, tanpa build step, dan tanpa dependensi eksternal.

---

## 🚀 Menjalankan

```bash
npm start
```

Lalu buka **http://localhost:3000**.

Untuk port lain:

```powershell
$env:PORT=8080; npm start
```

> Tidak perlu `npm install` — proyek ini nol dependensi.

---

## 📐 1. Kalkulator

Parser ekspresi rekursif-descending yang aman (tidak memakai `eval`).

| Fitur | Contoh |
| :--- | :--- |
| Aritmetika dasar | `1 + 2 * 3` → `7` |
| Kurung | `(1 + 2) * 3` → `9` |
| Pangkat (right-associative) | `2 ^ 3 ^ 2` → `512` |
| Modulo | `10 % 3` → `1` |
| Unary minus | `-(2 + 3)` → `-5` |
| Fungsi | `sqrt(16)`, `sin(0)`, `log(100)`, `ln(e)`, `abs(-7)` |
| Konstanta | `pi`, `e` |

Dukungan keyboard: angka & operator langsung, `Enter` = hitung, `Backspace` = hapus, `Esc` = clear.

---

## 💬 2. Chatbot 4 Kategori

| Kategori | Contoh pertanyaan |
| :--- | :--- |
| 📐 **Matematika** | `hitung 12*(3+4)`, `rumus luas lingkaran`, `bilangan prima` |
| 🔬 **Sains** | `apa itu fotosintesis`, `jelaskan gravitasi`, `planet tata surya` |
| 💬 **Umum** | `halo`, `siapa kamu`, `bantuan`, `jam berapa sekarang` |
| 🎲 **Hiburan** | `beri lelucon`, `fakta unik`, `rekomendasi film`, `motivasi` |

- Deteksi kategori otomatis berbasis pola (`detectCategory`).
- Ekspresi matematika murni (mis. `2 + 2`) otomatis dihitung.
- Fallback ramah jika pertanyaan tidak dikenali.
- Tombol kategori di sidebar menyaring jawaban bot.

---

## 🌐 3. Mini Internet

Browser simulasi dengan riwayat navigasi (back/forward/home):

- **🔎 NEXA Search** — pencarian lintas situs & halaman.
- **📚 NEXA Wiki** — Fotosintesis, Tata Surya, Sejarah Internet.
- **⛅ NEXA Cuaca** — prakiraan simulasi Jakarta, Bandung, Surabaya, Makassar.
- **📰 NEXA Berita** — headline teknologi & sains kurasi.

Ketik kata kunci di address bar (mis. `planet`) untuk mencari, atau ketik alamat situs (mis. `wiki.nexa`).

---

## 🧪 Automated Tests

Menggunakan Node.js native test runner (`node:test` + `node:assert`), **20 tes, 100% lulus**.

```bash
npm test
```

| File | Cakupan |
| :--- | :--- |
| `tests/calculator.test.js` | Presedensi operator, pangkat, unary, fungsi, konstanta, error handling |
| `tests/chatbot.test.js` | 4 kategori, deteksi kategori, evaluasi matematika, fallback |
| `tests/miniInternet.test.js` | Katalog situs, pencarian, riwayat browser |

---

## 📁 Struktur

```text
kalkulator-chatbot/
├── index.html              # UI 3 tab
├── styles.css              # Tema dark + responsif
├── server.js               # Static HTTP server (nol dependensi)
├── src/
│   ├── calculator.js       # Tokenizer + recursive-descent parser
│   ├── chatbot.js          # Intent engine 4 kategori
│   ├── miniInternet.js     # Situs kurasi, search, browser history
│   └── app.js              # Wiring UI
└── tests/                  # 20 tes otomatis
```

---

## 🛠️ Teknologi

- JavaScript ES Modules (browser + Node.js)
- HTML5 & CSS3 (grid, custom properties, responsif)
- Node.js `http` module untuk static server
- `node:test` untuk pengujian

---

## 📄 Lisensi

MIT
