# Default Workspace Rules & Autonomous Skills Policy

Dokumen ini mendefinisikan aturan kerja otomatis (*default behavior*) dan katalog skill aktif untuk setiap interaksi AI Agent di proyek `xlhomesolo.com` (`xssr`).
**Agent wajib mengadopsi dan menerapkan skill-skill berikut secara otomatis tanpa menunggu instruksi manual.**

---

## 1. Superpowers Engineering & Verification Standards
*Aktif untuk setiap tugas coding, refactoring, bug fixing, dan penambahan fitur.*
- **Systematic Debugging First (`superpowers-systematic-debugging`)**: Telusuri dan pahami akar penyebab masalah (*root cause*) dengan bukti log/data sebelum mengubah kode. Dilarang berspekulasi atau menebak perbaikan.
- **Rencana Bertahap Terstruktur (`superpowers-writing-plans`, `superpowers-executing-plans`)**: Untuk perubahan arsitektur atau multi-file, susun langkah kerja logis sebelum dieksekusi.
- **Verifikasi Wajib Sebelum Selesai (`superpowers-verification-before-completion`)**:
  Sebelum menyatakan pekerjaan selesai, agen WAJIB menjalankan:
  1. `npm.cmd run build` (Next.js SSG Turbopack — harus exit code 0 tanpa error).
  2. `node scripts/guard-contacts.mjs` (Verifikasi nomor sales & WhatsApp resmi).
  3. Pengecekan tidak adanya broken links atau layout overflow.

---

## 2. Performance & Core Web Vitals Optimization
*Skill: `performance-optimization`, `lean-build`, `debug-optimize-lcp`, `chrome-devtools`*
- **Lighthouse 100 Benchmark**: Pertahankan performa, SEO, Best Practices, dan Aksesibilitas mendekati skor sempurna (lihat [lh-production.json](lh-production.json)).
- **LCP & Layout Stability**:
  - Gunakan font lokal `@fontsource/plus-jakarta-sans` dengan `font-display: swap`.
  - Pertahankan arsitektur Static Site Generation (SSG) App Router (React 19).
  - Hindari library JavaScript eksternal berat jika bisa diselesaikan dengan Pure Tailwind v4 / CSS.

---

## 3. UI/UX Pro Max & Anti-Slop Design Guidelines
*Skill: `ui-ux-pro-max`, `frontend-ui-engineering`, `hallmark`*
- **Mobile-First & Touch Interaction**:
  - Touch target minimal 44×44px dengan padding memadai.
  - Bebas horizontal overflow pada layar mobile kecil (360px).
- **Text & Dropdown Protection**:
  - Teks alamat dan autocomplete tidak boleh terpotong (`white-space: normal`, `word-break: break-word`).
  - Elemen sticky/floating tidak boleh menutupi input formulir yang aktif.
- **Konsistensi Brand & Anti-Slop Visual**:
  - Warna utama: Hijau XL SATU (`#037e64`) dan Putih/Abu Terang (`#f5f5f5`).
  - Dilarang membuat desain fiksi ilmiah (dark neon purple/cyan) atau teks gradasi berlebihan.
  - Ikonografi konsisten menggunakan `lucide-react`.

---

## 4. Lokasi, Geocoding & Coverage Check
*Skill: `google_maps_platform`, `h3-js`*
- Gunakan Google Maps Platform (Places Autocomplete & Geocoding) untuk input alamat calon pelanggan Solo Raya.
- Lakukan spatial indexing menggunakan `h3-js` untuk pencocokan ke database tiang/homepass.
- Privasi Teknis: **DILARANG membocorkan UUID/ID internal Cloudflare D1 ke antarmuka pengunjung.**

---

## 5. Web Analytics & Event Tracking (PostHog)
*Kredensial di `.env.local`: `NEXT_PUBLIC_POSTHOG_KEY`, `POSTHOG_PERSONAL_API_KEY`*
- Pasang tracking untuk event penting:
  - Klik CTA WhatsApp (`wa.me/6287778999141`).
  - Interaksi form cek coverage dan pemilihan paket.
- Pastikan inisialisasi PostHog dimuat secara *deferred* / *lazy* agar tidak menurunkan metrik LCP.

---

## 6. Competitive Intelligence (Firecrawl)
*Kredensial di `.env.local`: `FIRECRAWL_API_KEY`*
- Gunakan Firecrawl API untuk crawling promo/harga ISP kompetitor di Solo Raya (IndiHome, MyRepublic, Biznet) secara berkala untuk pembaruan strategi promo.

---

## 7. Security, Credential & Hardening Standards
*Skill: `security-and-hardening`*
- **Zero Credential Leak**: Semua token (`GITHUB_TOKEN`, `NPM_TOKEN`, `FIRECRAWL_API_KEY`, `POSTHOG_*`) hanya boleh berada di `.env.local` dan ter-ignore di `.gitignore`. Dilarang menaruh raw secret ke kode sumber atau repo.
- **Kaidah Bisnis Mutlak XL Home Solo**:
  - **Kontak Sales Resmi**: Wajib dan HANYA `087778999141` (`wa.me/6287778999141`).
  - **Skop Layanan**: HANYA melayani pasang baru FTTH (homepass).
  - **Biaya Pasang**: Paket 20 Mbps (Rp 185.000) **ADA biaya pasang Rp 100.000** (di luar paket, belum PPN). Promo **Bebas Biaya Pasang (Gratis Rp 0)** HANYA berlaku untuk paket 250 Mbps ke atas.

---

## 8. Caveman Communication Mode
*Skill: `caveman`*
- **Answer First**: Tampilkan hasil / jawaban / aksi teknis di awal kalimat.
- **No Filler**: Tanpa basa-basi dan kata pembuka/penutup generik.
- **Ringkas & Presisi**: Fokus pada substansi teknis dan instruksi yang dapat dieksekusi.
