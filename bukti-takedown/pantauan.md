# Kit Pantauan Clone — cek berkala (mingguan)

## 1. Google Alerts (buat sekali di google.com/alerts, login akun Google)
Buat alert untuk frasa unik situs (pilih "Hasil terbaik", "Saat terjadi"):
- `"Bayar 10 Dapat 12" XL SATU`
- `"Wireless Advance" XL SATU`
- `"xlsatusolo"`
- `"0877-7899-9141"` (nomor WA sales — kalau muncul di domain lain = clone)
- `intitle:"XL SATU" "Solo Raya" -site:xlsatusolo.com`

## 2. Query Google manual (mingguan, mode incognito)
- `site:xlsatusoloraya.com` → harus NOL hasil permanen setelah takedown
- `"Paket Tahunan Bayar 10 Dapat 12"` → yang muncul harus xlsatusolo.com
- `"0878-6933-6227"` → nomor pelaku; kalau masih muncul, catat URL-nya
- `xl satu solo` / `xl satu sukoharjo` → pastikan posisi 1-3 tetap milik kita

## 3. Trap Log (otomatis)
- Buka Google Sheet → tab **Trap Log**. Setiap baris = ada bot/manusia membuka
  `/trap/` (yang tidak pernah dikunjungi pengunjung normal maupun Googlebot).
- Kalau muncul hit beruntun (puluhan baris/menit) = ada yang sedang mirror situs.
  Catat User-Agent + timestamp → lampirkan ke laporan abuse berikutnya.
- Catatan: Googlebot/Bingbot yang patuh robots.txt TIDAK akan muncul di sini.

## 4. Copyscape (bulanan, gratis terbatas)
- copyscape.com → tempel URL homepage + 2-3 URL artikel → cek duplikat baru.

## 5. GSC Performance (cek 30 Sep, lalu bulanan)
- Query `apakah xl satu ada fup` harus masuk top 5 (dari pos 9.68).
- CTR halaman FUP >4%, Mbps >3%.
- Kalau ada query aneh mengarah ke domain lain dengan konten identik = clone baru.
