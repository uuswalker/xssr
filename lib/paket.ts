import { waLink } from "./site";

// Data paket — disalin 1:1 dari xssr@ec66035 index.html.

export interface FiberTier {
  name: string;
  subtitle: string;
  headerClass: "value" | "smart" | "family";
  badge?: string;
  speedMax: number;
  barWidth: number;
  barGradient: string;
  barDotColor: string;
  speedNote: string;
  boosterNote?: string;
  tags: string[];
  feats: { img: string; text: string }[];
  price: string;
  waText: string;
}

const IMG = "/images/xl-cdn/";
const F_DEV5 = IMG + "post-ac9c1ffe.webp";
const F_INST = IMG + "post-f9963b35.webp";
const F_DEV10 = IMG + "post-52c191fd.webp";
const F_FREE = IMG + "post-e7c772b8.webp";
const F_DEV12 = IMG + "post-65c6fd67.webp";
const F_FREE2 = IMG + "post-4409f8f4.webp";

export const FIBER_TIERS: FiberTier[] = [
  {
    name: "XL Satu Starter — 20 Mbps",
    subtitle: "Internet Only",
    headerClass: "value",
    speedMax: 20,
    barWidth: 20,
    barGradient: "linear-gradient(90deg,#0d9e7a,#037e64)",
    barDotColor: "#037e64",
    speedNote: "Ideal untuk browsing & sosmed",
    tags: ["Browsing", "Media Sosial", "Streaming SD"],
    feats: [
      { img: F_DEV5, text: "Hingga 5 Perangkat" },
      { img: F_INST, text: "Biaya Instalasi Rp 100.000" },
    ],
    price: "Rp 185.000",
    waText: "Saya minat paket XL Satu Starter 20 Mbps Rp185.000",
  },
  {
    name: "XL Satu Spark — 250 Mbps",
    subtitle: "Internet Only",
    headerClass: "smart",
    badge: "Best Seller",
    speedMax: 250,
    barWidth: 74,
    barGradient: "linear-gradient(90deg,#1a8ac0,#2ba8e0)",
    barDotColor: "#1a8ac0",
    speedNote: "Ideal untuk streaming & WFH",
    boosterNote: "*Normal 100 Mbps + Speed Booster hingga 250 Mbps (promo periode tertentu)",
    tags: ["Streaming HD", "Gaming Online", "WFH"],
    feats: [
      { img: F_DEV10, text: "Hingga 10 Perangkat" },
      { img: F_FREE, text: "Gratis Biaya Instalasi" },
    ],
    price: "Rp 229.000",
    waText: "Saya minat paket XL Satu Spark 250 Mbps Rp229.000",
  },
  {
    name: "XL Satu Spark - 300 Mbps",
    subtitle: "Internet Only",
    headerClass: "family",
    speedMax: 300,
    barWidth: 78,
    barGradient: "linear-gradient(90deg,#6b2fa0,#9b4fd4)",
    barDotColor: "#9b4fd4",
    speedNote: "Ideal untuk streaming 4K & gaming",
    boosterNote: "*Normal 200 Mbps + Speed Booster hingga 300 Mbps (promo periode tertentu)",
    tags: ["Streaming 4K", "Gaming Pro", "Video Call HD"],
    feats: [
      { img: F_DEV12, text: "Hingga 12 Perangkat" },
      { img: F_FREE2, text: "Gratis Biaya Instalasi" },
    ],
    price: "Rp 239.000",
    waText: "Saya minat paket XL Satu Spark 300 Mbps Rp239.000",
  },
  {
    name: "XL Satu Spark — 400 Mbps",
    subtitle: "Internet Only",
    headerClass: "value",
    speedMax: 400,
    barWidth: 82,
    barGradient: "linear-gradient(90deg,#0d9e7a,#037e64)",
    barDotColor: "#037e64",
    speedNote: "Ideal untuk multi-streaming & smart home",
    boosterNote: "*Normal 300 Mbps + Speed Booster hingga 400 Mbps (promo periode tertentu)",
    tags: ["Multi-streaming", "Gaming Pro", "Smart Home"],
    feats: [
      { img: F_DEV5, text: "Hingga 16 Perangkat" },
      { img: F_INST, text: "Gratis Biaya Instalasi" },
    ],
    price: "Rp 299.000",
    waText: "Saya minat paket XL Satu Spark 400 Mbps Rp299.000",
  },
  {
    name: "XL Satu Spark - 500 Mbps",
    subtitle: "Internet Only",
    headerClass: "smart",
    speedMax: 500,
    barWidth: 86,
    barGradient: "linear-gradient(90deg,#1a8ac0,#2ba8e0)",
    barDotColor: "#1a8ac0",
    speedNote: "Ideal untuk power user & konten kreator",
    tags: ["Power User", "Cloud Gaming", "Konten Kreator"],
    feats: [
      { img: F_DEV10, text: "Hingga 20 Perangkat" },
      { img: F_FREE, text: "Gratis Biaya Instalasi" },
    ],
    price: "Rp 399.000",
    waText: "Saya minat paket XL Satu Spark 500 Mbps Rp399.000",
  },
  {
    name: "XL Satu Spark — 1000 Mbps",
    subtitle: "Internet Only",
    headerClass: "family",
    speedMax: 1000,
    barWidth: 96,
    barGradient: "linear-gradient(90deg,#6b2fa0,#9b4fd4)",
    barDotColor: "#9b4fd4",
    speedNote: "Kecepatan penuh 1000 Mbps",
    tags: ["Enterprise", "Data Center", "Ultra HD"],
    feats: [
      { img: F_DEV12, text: "Unlimited Perangkat" },
      { img: F_FREE2, text: "Gratis Biaya Instalasi" },
    ],
    price: "Rp 899.000",
    waText: "Saya minat paket XL Satu Spark 1000 Mbps Rp899.000",
  },
];

export interface TahunanTier {
  name: string;
  headerGradient: string;
  speed: string;
  booster: string;
  kuota: string;
  members: string;
  before: string;
  price: string;
  perMonth: string;
  save: string;
  waText: string;
}

export const TAHUNAN_TIERS: TahunanTier[] = [
  {
    name: "Basic Smart",
    headerGradient: "linear-gradient(135deg, #1e1b4b 0%, #7c3aed 100%)",
    speed: "50 Mbps",
    booster: "75 Mbps",
    kuota: "10 GB",
    members: "2 Member",
    before: "Rp 2.988.000",
    price: "Rp 2.490.000",
    perMonth: "≈ Rp207.500/bulan",
    save: "Hemat Rp498rb/tahun",
    waText: "Saya minat paket Tahunan Basic Smart 50 Mbps Rp2.490.000",
  },
  {
    name: "Basic Family",
    headerGradient: "linear-gradient(135deg, #1e1b4b 0%, #6d28d9 100%)",
    speed: "100 Mbps",
    booster: "150 Mbps",
    kuota: "25 GB",
    members: "2 Member",
    before: "Rp 3.828.000",
    price: "Rp 3.190.000",
    perMonth: "≈ Rp265.800/bulan",
    save: "Hemat Rp638rb/tahun",
    waText: "Saya minat paket Tahunan Basic Family 100 Mbps Rp3.190.000",
  },
  {
    name: "Basic Superuser",
    headerGradient: "linear-gradient(135deg, #312e81 0%, #7c3aed 100%)",
    speed: "150 Mbps",
    booster: "200 Mbps",
    kuota: "50 GB",
    members: "3 Member",
    before: "Rp 4.428.000",
    price: "Rp 3.690.000",
    perMonth: "≈ Rp307.500/bulan",
    save: "Hemat Rp738rb/tahun",
    waText: "Saya minat paket Tahunan Basic Superuser 150 Mbps Rp3.690.000",
  },
];

export interface WirelessTier {
  speed: number;
  badge?: string;
  icon: string;
  label: string;
  price: string;
  note: string;
  waText: string;
}

export const WIRELESS_ADVANCE: WirelessTier[] = [
  {
    speed: 50,
    badge: "Hemat 25%",
    icon: "fas fa-gauge",
    label: "Advance Payment — Bayar 3 Dapat 4",
    price: "Rp 650.000",
    note: "untuk 4 bulan • ≈ Rp162.500/bulan",
    waText: "Saya minat XL Satu Wireless 50 Mbps Advance Rp650.000",
  },
  {
    speed: 100,
    badge: "Hemat 10%",
    icon: "fas fa-gauge-high",
    label: "Advance Payment — Bayar 3 Dapat 4",
    price: "Rp 790.000",
    note: "untuk 4 bulan • ≈ Rp197.500/bulan",
    waText: "Saya minat XL Satu Wireless 100 Mbps Advance Rp790.000",
  },
];

export const WIRELESS_MONTHLY: WirelessTier[] = [
  {
    speed: 100,
    icon: "fas fa-gauge-high",
    label: "Monthly Plan",
    price: "Rp 219.500",
    note: "/bulan",
    waText: "Saya minat XL Satu Wireless Monthly 100 Mbps Rp219.500",
  },
];

export function tierWa(t: { waText: string }): string {
  return waLink(t.waText);
}
