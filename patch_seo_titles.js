const fs = require('fs');

// 1. UPDATE KOTA TITLES
let dataKota = JSON.parse(fs.readFileSync('lib/data-kota.json', 'utf8'));

dataKota.cities.forEach(city => {
  if (city.slug === 'wifi-solo') {
    city.title = "Pasang WiFi Murah Solo 2026 | XL SATU Fiber 100% Tanpa FUP";
    city.meta_description = "Lagi cari WiFi murah di Solo? Pasang XL SATU fiber optic 100% tanpa FUP mulai Rp185rb/bln. Internet super kencang untuk keluarga.";
  } else if (city.slug === 'wifi-surakarta') {
    city.title = "Pasang WiFi Surakarta Murah 2026 | XL SATU Fiber Tanpa FUP";
    city.meta_description = "Promo WiFi Surakarta murah 100% tanpa FUP dari XL SATU. Melayani area Jebres, Banjarsari, Laweyan. Mulai Rp185rb/bulan, gratis instalasi.";
  } else if (city.slug === 'wifi-sukoharjo') {
    city.title = "Pasang WiFi Sukoharjo Murah 2026 | XL SATU Fiber Tanpa FUP";
    city.meta_description = "Promo WiFi murah Sukoharjo 2026 dari XL SATU (100% Tanpa FUP). Cover Grogol, Kartasura, Baki, Mojolaban. Internet rumah cepat mulai Rp185rb.";
  } else if (city.slug === 'wifi-karanganyar') {
    city.title = "Pasang WiFi Karanganyar Murah 2026 | XL SATU Fiber Tanpa FUP";
    city.meta_description = "Pasang WiFi murah Karanganyar 100% tanpa FUP kuota! XL SATU cover Colomadu, Jaten, Gondangrejo. Bebas lemot, harga mulai Rp185.000/bln.";
  } else if (city.slug === 'wifi-klaten') {
    city.title = "Pasang WiFi Klaten Murah 2026 | XL SATU Wireless Tanpa FUP";
    city.meta_description = "Cari WiFi Klaten murah dan cepat? XL SATU hadir dengan koneksi Wireless tanpa batas FUP. Cover Delanggu, Prambanan, Klaten Tengah.";
  } else if (city.slug === 'wifi-boyolali') {
    city.title = "Pasang WiFi Boyolali Murah 2026 | XL SATU Fiber Tanpa FUP";
    city.meta_description = "Pasang internet WiFi Boyolali murah dari XL SATU Fiber (Tanpa FUP). Terjangkau di Ngemplak, Banyudono, Teras, Mojosongo. Klik untuk cek area.";
  }
});
fs.writeFileSync('lib/data-kota.json', JSON.stringify(dataKota, null, 2));

// 2. UPDATE ARTIKEL TITLES
let artikel = fs.readFileSync('lib/artikel.ts', 'utf8');

const replacements = [
  {
    old: `title: "Kecepatan WiFi Ideal untuk Keluarga"`,
    new: `title: "Berapa Kecepatan WiFi Ideal untuk Keluarga? (Update 2026)"`
  },
  {
    old: `title: "WiFi 250 Mbps untuk Berapa Orang?"`,
    new: `title: "WiFi 250 Mbps untuk Berapa Orang? Ini Hitungan Pastinya!"`
  },
  {
    old: `title: "Berapa Mbps untuk Berapa Orang?"`,
    new: `title: "Berapa Mbps untuk Berapa Orang? Cek Kebutuhan WiFi Anda"`
  },
  {
    old: `title: "WiFi Tanpa FUP & Unlimited"`,
    new: `title: "Provider WiFi Tanpa FUP & 100% Unlimited di Solo Raya"`
  },
  {
    old: `title: "Internet Rakyat vs XL SATU"`,
    new: `title: "Internet Rakyat vs XL SATU: Mana WiFi Paling Worth It?"`
  }
];

replacements.forEach(rep => {
  artikel = artikel.replace(rep.old, rep.new);
});

fs.writeFileSync('lib/artikel.ts', artikel);
