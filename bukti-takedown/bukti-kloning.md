# Bukti Kloning xlsatusoloraya.com

## Identitas Domain Pelanggar
- Domain : xlsatusoloraya.com
- IP     : 195.88.211.70 (range 195.88.211.0/24 — ArenHost, Sidoarjo)
- Nameserver : srv1.arenhost.com / srv2.arenhost.com
- Registrar  : CV. Jogjacamp (IDWebHost) — abuse@resellercamp.com
- Registrasi : 7 September 2026 (setelah push besar xlsatusolo.com)
- Expiry     : 7 September 2027

## Kontak Pelaku (dari isi situs kloning)
- WhatsApp : 0878-6933-6227 (asli kami: 0877-7899-9141)
- Email    : adminxlsatusolo@gmail.com
- Facebook : Prisca_Solo_Raya
- Alamat   : Jl. Bhayangkara No.81, Penumping, Laweyan, Surakarta (57141)

## Elemen yang Disalin (bukti unik hanya milik kami)
1. Struktur homepage & teks paket (Starter 20/50, Spark 250-1000 Mbps, harga Rp185.000-Rp900.000, "belum termasuk PPN")
2. Program Paket Tahunan Bayar 10 Dapat 12 (Basic Smart/Family/Superuser)
3. Program Wireless Advance (Hemat 25%, ≈Rp162.500/bulan)
4. FAQ homepage (identik, nomor WA diganti)
5. Seluruh halaman kota & artikel (wifi-surakarta, wifi-tanpa-fup-unlimited, dll)

## Bukti Sumber (asli di repo kami)
- Repo : https://github.com/uuswalker/xssr
- Live : https://xlsatusolo.com
- Commit terakhir: 1724d9d (16 Sep 2026)

## Dokumen Terkirim
- [ ] 1. DMCA ke ArenHost (support@arenhost.id + cc admin@arenhost.id) — 17 Sep 2026
- [ ] 2. Laporan ke Registrar IDWebHost (abuse@resellercamp.com)
- [ ] 3. Laporan ke Google (takedown/legal)
- [ ] 4. Laporan ke XL (penyalahgunaan merek "XL SATU")
- [ ] 5. Wayback Machine archive (manual: web.archive.org/save/...)

## Screenshot
(Lampirkan screenshot xlsatusoloraya.com sebelum hilang — bisa via keyboard lalu simpan di folder ini)

## Forensik kode live mereka (17 Sep 2026 — bukti salinan mentah)
- Versi yang dicloning = versi lama awal September: theme-color `#1a56db`
  (kita `#037e64`), tanpa `og:site_name`, path relatif, tanpa watermark/
  honeypot/klausul — semua proteksi 16–17 Sep tidak ada di mereka.
- LUPA DIGANTI #1: `cek-lokasi.js` mereka masih berisi
  `NOMOR_WA_SALES = "6287778999141"` (nomor kita!) → pengunjung yang submit
  form di situs pelaku justru diarahkan ke WhatsApp kita.
- LUPA DIGANTI #2: GA4 `G-9R0LKSXL8Y` + Ads `AW-938834270` masih milik kita →
  traffic mereka mengotori GA4 kita + menembakkan conversion palsu ke akun Ads kita.
- Webhook mereka URL sendiri (`AKfycbzKgSJ1...`) — form mereka tidak mengalir ke sheet kita.
- Kesimpulan: pelaku hanya find-replace permukaan (nomor di HTML, email, FB,
  alamat, schema telephone) tanpa memahami kode. Tidak mungkin klaim karya mandiri.

## Blunder pelaku (forensik 17 Sep 2026 — situsnya cacat & kontradiktif)
1. Schema `telephone` halaman /wifi-klaten/ = `+628778999141` (nomor KITA) —
   Google membaca itu sebagai nomor bisnis resmi mereka.
2. `NOMOR_WA_SALES` di cek-lokasi.js mereka = `6287778999141` (nomor KITA) —
   submit form di situs pelaku membuka chat ke WA kita.
3. GA4 `G-9R0LKSXL8Y` + Ads `AW-938834270` masih milik kita (2x di tiap halaman).
4. Footer "Copyright Ac 2026" — karakter © rusak akibat find-replace serampangan.
5. `og:image` path relatif → preview share WA/FB/Twitter kosong.
6. Artefak HTTrack `../../cdnjs.cloudflare.com/...` → CSS Font Awesome 404,
   ikon situs kemungkinan besar mati.
7. Tanpa sitemap.xml dan robots.txt (keduanya 404).
8. Email andalan `adminxlsatusolo@gmail.com` menempel nama domain kita =
   impersonation tertulis tangannya sendiri.
9. FAQ koar "sales resmi 0878-..." sementara schema+JS menunjuk nomor kita —
   situsnya kontradiksi dengan dirinya sendiri.