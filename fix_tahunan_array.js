const fs = require('fs');

let code = fs.readFileSync('lib/paket.ts', 'utf8');

const replacement = `export const TAHUNAN_TIERS: TahunanTier[] = [
  {
    name: "Basic Smart",
    headerGradient: "linear-gradient(135deg, #1e1b4b 0%, #7c3aed 100%)",
    speed: "50 Mbps",
    booster: "75 Mbps",
    speedMax: "50",
    barWidth: 35,
    boosterNote: "*Normal 50 Mbps + Speed Booster hingga 75 Mbps",
    kuota: "10 GB",
    members: "2 Member",
    before: "Rp 2.988.000",
    price: "Rp 2.490.000",
    perMonth: "≈ Rp207.500/bulan",
    save: "Hemat Rp498rb/tahun",
    waText: "Saya minat paket Tahunan Basic Smart 50 Mbps Rp2.490.000",
    tags: ["Browsing", "Media Sosial", "Streaming HD"],
    feats: [
      { img: F_DEV10, text: "Hingga 10 Perangkat" },
      { img: F_FREE, text: "Gratis Biaya Instalasi" },
    ],
  },
  {
    name: "Basic Family",
    headerGradient: "linear-gradient(135deg, #1e1b4b 0%, #6d28d9 100%)",
    speed: "100 Mbps",
    booster: "150 Mbps",
    speedMax: "100",
    barWidth: 50,
    boosterNote: "*Normal 100 Mbps + Speed Booster hingga 150 Mbps",
    kuota: "25 GB",
    members: "2 Member",
    before: "Rp 3.828.000",
    price: "Rp 3.190.000",
    perMonth: "≈ Rp265.800/bulan",
    save: "Hemat Rp638rb/tahun",
    waText: "Saya minat paket Tahunan Basic Family 100 Mbps Rp3.190.000",
    tags: ["Streaming HD", "Gaming Online", "WFH"],
    feats: [
      { img: F_DEV12, text: "Hingga 12 Perangkat" },
      { img: F_FREE2, text: "Gratis Biaya Instalasi" },
    ],
  },
  {
    name: "Basic Superuser",
    headerGradient: "linear-gradient(135deg, #312e81 0%, #7c3aed 100%)",
    speed: "150 Mbps",
    booster: "200 Mbps",
    speedMax: "150",
    barWidth: 65,
    boosterNote: "*Normal 150 Mbps + Speed Booster hingga 200 Mbps",
    kuota: "50 GB",
    members: "3 Member",
    before: "Rp 4.428.000",
    price: "Rp 3.690.000",
    perMonth: "≈ Rp307.500/bulan",
    save: "Hemat Rp738rb/tahun",
    waText: "Saya minat paket Tahunan Basic Superuser 150 Mbps Rp3.690.000",
    tags: ["Power User", "Cloud Gaming", "Multi-streaming"],
    feats: [
      { img: F_DEV5, text: "Hingga 16 Perangkat" },
      { img: F_INST, text: "Gratis Biaya Instalasi" },
    ],
  },
];`;

const startIndex = code.indexOf('export const TAHUNAN_TIERS: TahunanTier[] = [');
const endIndex = code.indexOf('];', startIndex) + 2;

code = code.substring(0, startIndex) + replacement + code.substring(endIndex);

fs.writeFileSync('lib/paket.ts', code);
console.log('Fixed TAHUNAN_TIERS array');
