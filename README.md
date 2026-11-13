# XL Home Solo Raya (xlhomesolo.com)

Repositori resmi untuk platform pendaftaran, informasi jangkauan, dan edukasi pasang baru **XL Home Fiber** (d/h XL SATU Fiber) serta **WiFi Rumah Tanpa Kabel (FWA)** di wilayah **Solo Raya**.

🌐 **Website Produksi:** [https://xlhomesolo.com](https://xlhomesolo.com)  
📱 **WhatsApp Sales Resmi:** [wa.me/xlhomesolo](https://wa.me/xlhomesolo) (`0877-7899-9141`)

---

## 🚀 Gambaran Umum & Wilayah Layanan

Website ini melayani konsultasi dan pendaftaran pasang baru internet rumah resmi untuk **5 Daerah Tingkat II Solo Raya** yang mencakup **79 Kecamatan** dan **50+ Kawasan Perumahan / Klaster**:

1. **Kota Surakarta (Solo)** — Banjarsari, Jebres, Laweyan, Pasar Kliwon, Serengan.
2. **Kabupaten Sukoharjo** — Solo Baru, Grogol, Kartasura, Baki, Mojolaban, Gentan, dll.
3. **Kabupaten Karanganyar** — Colomadu, Jaten, Tasikmadu, Gondangrejo, Kebakkramat, dll.
4. **Kabupaten Boyolali** — Ngemplak, Banyudono, Teras, Mojosongo, Sawit, Sambi, dll.
5. **Kabupaten Klaten** — Delanggu, Polanharjo, Ceper, Klaten Utara, Klaten Tengah, dll.

---

## 🛠️ Tech Stack & Arsitektur

* **Framework:** [Next.js 16](https://nextjs.org/) (App Router) + Turbopack + [React 19](https://react.dev/).
* **Language:** TypeScript 5.
* **Rendering Strategy:** Full Static Site Generation (SSG / Pre-rendered 177+ static routes) untuk kecepatan muat kilat, TTFB rendah, dan optimasi Core Web Vitals (LCP/CLS/INP).
* **Styling:** Modular Responsive CSS, berfokus pada *mobile-first experience* (diuji presisi pada viewport 360px hingga layar desktop 1920px).
* **SEO Engine:**
  * Programmatic Local SEO untuk seluruh kota, kecamatan, dan rute perumahan.
  * Skema terstruktur JSON-LD lengkap (`Article`, `BreadcrumbList`, `Product`, `FAQPage`, `Organization`, `LocalBusiness`).
  * Sitemap XML otomatis dan arsitektur *internal linking* bertingkat (Silo / Hub & Spoke).

---

## 🧲 Fitur Interaktif & Lead Magnets

Platform ini dilengkapi berbagai alat bantu interaktif untuk memudahkan calon pelanggan memilih paket:

1. **Tes Kecepatan (Speedtest):** Menggunakan integrasi klien terbuka *Measurement Lab (ndt7-js)* untuk pengujian kecepatan unduh & unggah secara objektif.
2. **Kalkulator Kebutuhan Mbps:** Menghitung total kebutuhan bandwidth riil berdasarkan jumlah pengguna, aktivitas streaming 4K, video call WFH, dan perangkat smart home.
3. **Kuis Interaktif Fiber vs Wireless:** Membantu pengguna memilih antara koneksi kabel optik FTTH atau modem nirkabel FWA plug-and-play.
4. **Cek Jaringan & Coverage GPS:** Formulir interaktif dengan fitur *live geolocation*, integrasi *WebMCP tool*, dan koneksi langsung ke WhatsApp tim teknisi lapangan.
5. **Simulator FUP:** Alat komparasi transparansi batas kuota vs koneksi 100% *True Unlimited* tanpa penurunan kecepatan.

---

## 🛡️ Kaidah Kritis & Guardrails Otomatis (Cara Kerja Repo)

Repo ini memiliki mekanisme pengawasan mutu otomatis sebelum setiap proses rilis:

### 1. Contact Integrity Guard (`scripts/guard-contacts.mjs`)
* Script pre-build wajib yang memindai seluruh file proyek secara otomatis sebelum `next build`.
* **Zero Tolerance:** Memastikan tidak ada nomor telepon pihak ketiga atau kontak kompetitor yang bocor ke publik.
* **Whitelist Kontak Resmi:** HANYA mengizinkan sales resmi: `0877-7899-9141` (`wa.me/xlhomesolo` / `wa.me/6287778999141`).

### 2. Aturan Transparansi Biaya Pasang
* **Paket Starter 20 Mbps:** Wajib mencantumkan biaya pasang Rp 100.000 (di luar paket & belum PPN).
* **Bebas Biaya Instalasi (Gratis Rp 0):** HANYA berlaku untuk paket kecepatan **≥ 250 Mbps**.
* **Anti-Pungli:** Mengedukasi pelanggan bahwa pembayaran tagihan HANYA dilakukan melalui Virtual Account (VA) resmi XL Home setelah internet aktif dan terverifikasi.

### 3. Single Source of Truth
* Data paket, harga, kecepatan, dan kuota FWA terpusat di `lib/paket.ts`.
* Nomor kontak dan konfigurasi domain terpusat di `lib/site.ts`.

---

## 💻 Panduan Menjalankan Proyek

### Prasyarat
* Node.js v20.9+ (disarankan v22, sesuai CI)
* npm

### Instalasi & Menjalankan Lokal

```bash
# Clone repository
git clone https://github.com/uuswalker/xssr.git
cd xssr

# Install dependensi
npm install

# Jalankan server pengembangan lokal
npm run dev
```

Buka peramban di `http://localhost:3000`.

### Build Produksi & Validasi

```bash
# Menjalankan guard contacts + static export
npm run build

# Menjalankan preview hasil build lokal
npm run start
```

---

## 📂 Struktur Direktori

```text
├── app/                  # Rute App Router Next.js (halaman geo, artikel, tools, SEO)
├── components/           # Komponen React (PaketSection, InfoSections, CekLokasi, Footer, dll.)
│   ├── animations/       # Animasi UI (Marquee, dll.)
│   ├── home/             # Komponen halaman beranda
│   ├── kota/             # Template halaman kota & kabupaten
│   └── tools/            # Komponen alat interaktif (Speedtest, Kalkulator, Kuis, dll.)
├── lib/                  # Single Source of Truth & Logic (paket.ts, site.ts, artikel.ts, geo-pages.ts)
├── public/               # Aset statis publik (gambar, icon, video webm/mp4, Web Vitals, robots.txt)
├── scripts/              # guard-contacts.mjs, Code.gs (webhook lead), worker Cloudflare, parser data coverage
└── .github/workflows/    # CI: guard contacts, lint, build (termasuk typecheck)
```

---

## 🔐 Secret & Konfigurasi Worker

Worker `coverage-api` (`scripts/cloudflare_worker_optimized.js`, konfigurasi `wrangler.toml`) **tidak boleh** menyimpan kunci di source code.

```bash
# Set / rotasi kunci admin (disimpan sebagai Cloudflare secret)
npx wrangler secret put ADMIN_KEY
```

* Endpoint `/api/admin/*` hanya aktif jika `ADMIN_KEY` terpasang dan header `x-admin-key` cocok.
* Data mentah (`data-mentah/`, `gsc_*.csv`) di-ignore dari git; simpan secara lokal.

---

## 📄 Lisensi & Hak Cipta

Copyright © 2026 **XL Home Solo Raya**. Dikelola oleh Tim Sales Resmi Solo Raya. Seluruh hak cipta dilindungi undang-undang.
