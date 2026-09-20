const fs = require('fs');

let code = fs.readFileSync('lib/paket.ts', 'utf8');

// Replace TahunanTier interface
code = code.replace(
  /export interface TahunanTier \{[\s\S]*?waText: string;\n\s*\}/,
  `export interface TahunanTier {
  name: string;
  headerGradient: string;
  speed: string;
  booster: string;
  speedMax: string;
  barWidth: number;
  boosterNote: string;
  kuota: string;
  members: string;
  before: string;
  price: string;
  perMonth: string;
  save: string;
  waText: string;
  tags: string[];
  feats: { img: string; text: string }[];
}`
);

// Replace TAHUNAN_TIERS array
code = code.replace(
  /export const TAHUNAN_TIERS: TahunanTier\[\] = \[[\s\S]*?\}\,\n\s*\];/,
  `export const TAHUNAN_TIERS: TahunanTier[] = [
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
];`
);

fs.writeFileSync('lib/paket.ts', code);
console.log('Fixed lib/paket.ts');
