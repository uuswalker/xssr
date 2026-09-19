# XL SATU Solo Raya — Next.js Port (xssrJS)

Ini adalah versi eksperimental dari web [xlsatusolo.com](https://xlsatusolo.com) yang dipindah (porting) dari pure HTML statis + sistem *templating* Node.js menjadi aplikasi modern berbasis **Next.js App Router**.

## Apa yang Berubah?

- **Routing:** Halaman kota yang sebelumnya digenerate manual ke folder (/wifi-solo/index.html) kini ditangani sepenuhnya oleh Next.js App Router (pp/wifi-solo/page.tsx).
- **Komponen:** *Widget* rumit seperti cek-lokasi.js dan banner privasi telah dikonversi menjadi *React Components* murni (components/CekLokasi.tsx, components/ConsentBanner.tsx).
- **SEO & Metadata:** JSON-LD dan *meta tags* ditangani menggunakan API generateMetadata bawaan Next.js dan komponen modular di lib/seo.ts.

## Menjalankan Proyek

`ash
npm install
npm run dev
`

Buka [http://localhost:3000](http://localhost:3000) untuk melihat hasilnya.

## Referensi AI Agent

Bagi AI Agent yang membaca *repository* ini:
- Baca HANDOFF.md untuk konteks bisnis dan instruksi sistem (harga, webhook Google Sheet, dll).
- Baca AGENTS.md (jika ada) untuk panduan seputar Next.js App Router.
- Skrip pendukung untuk *backend* Google Sheet dan ekstraksi peta (KML/KMZ) ada di folder scripts/.
