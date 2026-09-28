# Design System

Panduan desain yang menggabungkan dua referensi:

- **Warna** dari antarmuka Claude (dark mode): hitam hangat, netral gelap, dan aksen oranye tanah liat (clay).
- **Font** dari OpenCode: monospace di seluruh UI, terasa seperti terminal / developer tool.

> Catatan: nilai hex diambil dengan memperkirakan warna dari screenshot, jadi bisa berbeda tipis dari nilai aslinya. Sesuaikan jika kamu punya token resmi.

---

## 1. Prinsip Desain

1. **Gelap dan hangat.** Latar hampir hitam dengan nuansa hangat, bukan biru-dingin.
2. **Satu aksen.** Oranye clay dipakai hemat untuk elemen yang perlu perhatian (logo, tombol utama, fokus).
3. **Monospace sebagai identitas.** Semua teks memakai font monospace, dari judul sampai label kecil.
4. **Datar dan tipis.** Pemisah berupa garis 1px, tanpa bayangan tebal atau gradien.
5. **Lega.** Banyak ruang kosong, teks pendek dan mudah dipindai.

---

## 2. Warna

### 2.1 Palet Inti

| Token | Hex | Kegunaan |
|---|---|---|
| `--bg` | `#161615` | Latar halaman utama |
| `--surface` | `#1F1E1D` | Kartu, input, panel |
| `--surface-hover` | `#2A2927` | Hover pada surface, tab tidak aktif |
| `--surface-active` | `#3A3937` | Tab/chip aktif, item terpilih |
| `--border` | `#3D3C39` | Garis pemisah dan outline 1px |
| `--text` | `#FAF9F5` | Teks utama, judul |
| `--text-muted` | `#A3A199` | Teks sekunder, placeholder, deskripsi |
| `--text-faint` | `#6E6C66` | Marker `[*]`, ikon redup, teks nonaktif |
| `--accent` | `#D97757` | Aksen utama (clay/oranye) |
| `--accent-hover` | `#E58A6B` | Hover pada aksen |
| `--link` | `#7AA9EE` | Tautan (contoh: "Upgrade") |

### 2.2 Tombol Terang (kontras tinggi)

Terinspirasi tombol "Download" pada OpenCode: tombol terang di atas latar gelap.

| Token | Hex | Kegunaan |
|---|---|---|
| `--btn-light-bg` | `#F0EEEA` | Latar tombol primer terang |
| `--btn-light-text` | `#161615` | Teks pada tombol terang |

### 2.3 Aturan Pemakaian

- Teks utama di atas `--bg` memakai `--text`; teks pendukung memakai `--text-muted`.
- Aksen `--accent` maksimal untuk 1 elemen menonjol per layar.
- Jangan memakai putih murni `#FFFFFF` atau hitam murni `#000000`.
- Rasio kontras teks minimal 4.5:1 (WCAG AA).

---

## 3. Tipografi

### 3.1 Font

```css
--font-mono: "IBM Plex Mono", ui-monospace, SFMono-Regular, "SF Mono",
             Menlo, Consolas, "Liberation Mono", monospace;
```

Font pada OpenCode terlihat sebagai monospace dengan karakter geometris yang bersih; **IBM Plex Mono** adalah padanan terdekat dan mudah didapat dari Google Fonts. Semua teks memakai `--font-mono`, termasuk judul besar (tidak memakai serif seperti di Claude).

### 3.2 Skala

| Peran | Ukuran | Bobot | Line-height | Catatan |
|---|---|---|---|---|
| Hero / judul halaman | `32px` | 500 | 1.2 | Letter-spacing `-0.02em` |
| Judul seksi | `16px` | 700 | 1.4 | Contoh: "What is OpenCode?" |
| Body | `14px` | 400 | 1.7 | Warna `--text-muted` |
| Label kuat (nama fitur) | `14px` | 700 | 1.7 | Warna `--text` |
| Navigasi | `14px` | 400 | 1.4 | Warna `--text` |
| Chip / tombol kecil | `13px` | 500 | 1.2 | |
| Caption / meta | `12px` | 400 | 1.4 | Warna `--text-faint` |

### 3.3 Aturan

- Tidak ada huruf miring untuk teks panjang.
- Hindari huruf kapital semua kecuali logo atau label pendek.
- Lebar baris nyaman: 60 sampai 80 karakter.

---

## 4. Spacing, Radius, Border

**Spacing (kelipatan 4px)**

| Token | Nilai |
|---|---|
| `--space-1` | 4px |
| `--space-2` | 8px |
| `--space-3` | 12px |
| `--space-4` | 16px |
| `--space-5` | 24px |
| `--space-6` | 32px |
| `--space-7` | 48px |
| `--space-8` | 64px |

**Radius**

| Token | Nilai | Dipakai di |
|---|---|---|
| `--radius-sm` | 4px | Tombol nav, item kecil |
| `--radius-md` | 8px | Chip, tombol |
| `--radius-lg` | 14px | Input besar, kartu |

**Border:** `1px solid var(--border)`. Tanpa shadow; kedalaman dibuat dari perbedaan warna surface.

---

## 5. Komponen

### 5.1 Header / Navigasi

- Tinggi ±64px, padding horizontal 48px.
- Logo di kiri, tautan di tengah-kanan dengan jarak 32px, tombol aksi di ujung kanan.
- Garis bawah 1px `--border` sebagai pemisah dari konten.

### 5.2 Input Besar (prompt box)

```css
.input {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 16px;
  color: var(--text);
  font: 14px/1.6 var(--font-mono);
}
.input::placeholder { color: var(--text-muted); }
.input:focus-within { border-color: var(--accent); }
```

- Baris bawah berisi tombol `+`, toggle mode, dan kontrol di sisi kanan.

### 5.3 Segmented Toggle (contoh: Chat | Cowork)

- Kontainer `--surface-hover`, radius 8px, padding 2px.
- Segmen aktif: latar `--surface-active`, teks `--text`.
- Segmen tidak aktif: transparan, teks `--text-muted`.

### 5.4 Chip Aksi (Write, Learn, Code, ...)

```css
.chip {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 8px 12px;
  background: var(--surface-hover);
  color: var(--text);
  border: 0;
  border-radius: 8px;
  font: 500 13px var(--font-mono);
}
.chip:hover { background: var(--surface-active); }
```

- Ikon garis tipis 16px di kiri, warna `--text-muted`.

### 5.5 Tombol

| Varian | Latar | Teks | Border |
|---|---|---|---|
| Primer terang | `--btn-light-bg` | `--btn-light-text` | none |
| Aksen | `--accent` | `#161615` | none |
| Sekunder | transparan | `--text` | 1px `--border` |

Radius 8px, padding `10px 16px`, teks 14px bobot 500.

### 5.6 Daftar Fitur (gaya OpenCode)

Setiap baris: marker `[*]`, nama fitur tebal, lalu deskripsi.

```html
<li><span class="marker">[*]</span> <strong>LSP enabled</strong> <span>Deskripsi singkat</span></li>
```

- `.marker` memakai `--text-faint`.
- `<strong>` memakai `--text`, bobot 700.
- Deskripsi memakai `--text-muted`.
- Jarak antar baris ±24px.

### 5.7 Tautan

Warna `--link`, garis bawah tipis (`text-underline-offset: 3px`). Hover: naikkan kecerahan sedikit.

### 5.8 Badge Status (contoh: "Free plan · Upgrade")

Pil kecil, latar `--surface`, teks `--text-muted`, pemisah titik `·`, aksi berupa tautan `--link`.

---

## 6. Layout

- Konten utama rata tengah, lebar maksimum kolom teks 640px.
- Hero berada sekitar sepertiga dari atas layar.
- Urutan visual: judul → input → chip aksi (jarak 24 sampai 32px antar blok).
- Breakpoint: `640px`, `1024px`, `1280px`. Di layar kecil, padding horizontal turun menjadi 16px dan nav berubah menjadi menu ikon.

---

## 7. Ikon dan Logo

- Ikon garis (outline) 1.5px, ukuran 16 atau 20px, warna `--text-muted`.
- Logo Claude-style: bintang/asterisk dengan `--accent`, ditempatkan di sisi kiri judul hero.
- Logo teks bergaya piksel (seperti OpenCode) boleh dipakai di header, warna `--text`.

---

## 8. Motion

- Durasi 120 sampai 200ms, easing `ease-out`.
- Hanya transisi warna, opacity, dan border; hindari animasi besar.
- Hormati `prefers-reduced-motion`.

---

## 9. Token CSS Siap Pakai

```css
@import url("https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;700&display=swap");

:root {
  /* Warna */
  --bg: #161615;
  --surface: #1f1e1d;
  --surface-hover: #2a2927;
  --surface-active: #3a3937;
  --border: #3d3c39;
  --text: #faf9f5;
  --text-muted: #a3a199;
  --text-faint: #6e6c66;
  --accent: #d97757;
  --accent-hover: #e58a6b;
  --link: #7aa9ee;
  --btn-light-bg: #f0eeea;
  --btn-light-text: #161615;

  /* Tipografi */
  --font-mono: "IBM Plex Mono", ui-monospace, SFMono-Regular, Menlo,
               Consolas, "Liberation Mono", monospace;

  /* Radius */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 14px;
}

html, body {
  background: var(--bg);
  color: var(--text);
  font: 400 14px/1.7 var(--font-mono);
  -webkit-font-smoothing: antialiased;
}
```

---

## 10. Do dan Don't

**Do**
- Pakai monospace untuk semua teks.
- Pakai garis 1px untuk memisahkan area.
- Batasi aksen oranye pada satu fokus per layar.

**Don't**
- Jangan campur font serif atau sans-serif.
- Jangan pakai bayangan tebal, gradien, atau warna neon.
- Jangan pakai putih atau hitam murni.
