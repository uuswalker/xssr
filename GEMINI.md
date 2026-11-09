# Default Workspace Rules & Autonomous Skills Policy

Dokumen ini mendefinisikan perilaku standar otomatis (default behavior) untuk setiap interaksi di proyek `xlhomesolo.com` (`xssr`). User **tidak perlu menyebutkan nama skill secara manual** — agen wajib mengadopsi prinsip ketiga skill ini secara otomatis:

---

## 1. Superpowers Engineering Standards (Selalu Aktif untuk Coding & Debugging)
Setiap tugas teknis, penambahan fitur, atau perbaikan bug wajib mengikuti disiplin engineering:
- **Systematic Debugging First**: Cari dan pahami akar penyebab masalah (root cause) dengan bukti nyata sebelum mengubah kode. Dilarang "menebak-nebak" perbaikan.
- **Rencana Terstruktur (Writing Plans)**: Untuk perubahan multi-file atau arsitektur, buat rencana langkah bertahap yang logis sebelum mengeksekusi.
- **Verifikasi Sebelum Selesai (Verification-Before-Completion)**: Sebelum menyatakan pekerjaan selesai, selalu jalankan verifikasi:
  - `npm run build` (Next.js SSG Turbopack)
  - `Contact Integrity Guard` (`scripts/guard-contacts.mjs`)
  - Tidak ada broken link atau layout overflow.

---

## 2. UI/UX Pro Max Standards (Selalu Aktif untuk Frontend, Styling, & Komponen)
Setiap perubahan yang menyentuh antarmuka pengguna (UI/UX) wajib mematuhi standar desain:
- **Mobile-First & Touch Interaction**:
  - Touch target minimal 44×44px dengan spacing memadai.
  - Bebas horizontal overflow pada layar mobile kecil (360px).
- **Text & Dropdown Protection**:
  - Hindari teks alamat/autocomplete terpotong (`white-space: normal`, `word-break: break-word`).
  - Elemen floating/sticky (seperti promo popup atau strip alamat) tidak boleh menutupi input formulir yang sedang aktif.
- **Konsistensi Visual & Brand**:
  - Pertahankan palet warna resmi XL Home (Primary Blue, Accent Green, clean typography, badge status coverage yang tegas).

---

## 3. Caveman Communication Mode (Default Komunikasi Padat & Efisien)
Agen secara default berkomunikasi secara to-the-point, ringkas, dan fokus pada substansi teknis:
- **Answer First**: Tampilkan jawaban / hasil / tindakan terlebih dahulu, baru alasan atau penjelasan penting.
- **No Filler**: Hilangkan kalimat pembuka/penutup klise (seperti *"Tentu saja! Saya akan dengan senang hati membantu Anda..."* atau *"Semoga penjelasan ini membantu!"*).
- **Kondisi Pengecualian (Kapan mode penjelasan lengkap digunakan)**:
  - Saat user secara eksplisit meminta analisis mendalam, perbandingan arsitektur, atau panduan strategi bisnis.
  - Saat memberikan konfirmasi tindakan berisiko tinggi (misal: migrasi database, penghapusan data, perubahan routing Cloudflare Worker).
  - Saat user mengajukan pertanyaan konseptual.

---

## 4. Kaidah Kritis Bisnis XL Home Solo (Non-Negotiable Guardrails)
- **Kontak Sales Resmi**: Wajib dan hanya `087778999141` (`wa.me/6287778999141`).
- **Skop Layanan**: HANYA melayani pasang baru (registrasi FTTH / homepass). Bukan pemindahan tiang / keluhan tiang.
- **Kaidah Biaya Pasang (Zero Misinformation)**: Paket Starter 20 Mbps (Rp 185.000) **ADA biaya pasang Rp 100.000** (di luar paket, belum termasuk PPN 11%). Promo **Bebas Biaya Instalasi (Gratis Rp 0)** HANYA berlaku untuk paket 250 Mbps ke atas. Dilarang keras mengklaim paket 20 Mbps gratis pasang!
- **Privasi Teknis**: Database ID / UUID Cloudflare D1 internal tidak boleh dibocorkan ke UI pengunjung.
