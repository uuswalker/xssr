import { createHash } from "crypto";
import raw from "./data-kota.json";
import type { FaqItem } from "./seo";

// Data kota — salinan beku tools/data-kota.json xssr@ec66035.
// Logika komputasi meniru tools/generate.js 1:1.

export interface City {
  slug: string;
  skip_generate?: boolean;
  nama: string;
  nama_lengkap: string;
  nama_display: string;
  nama_h1: string;
  meta_description: string;
  meta_keywords: string;
  og_title: string;
  og_description: string;
  title: string;
  area_served_json: string;
  h1_kota: string;
  intro_strong: string;
  promo_badge: string;
  wireless_badge: string;
  wa_float_text: string;
  wa_widget_text: string;
  kecamatan_list: string[];
  kecamatan_count: number;
  has_fiber: boolean;
  has_wireless: boolean;
  paket_count: number | string;
  hero_intro: string;
  [key: string]: unknown;
}

const ALL = (raw as { cities: City[] }).cities;

/** Kota yang di-generate (wifi-solo skip_generate — halaman legacy, di luar scope v1). */
export const CITIES: City[] = ALL.filter((c) => !c.skip_generate);

export function getCity(slug: string): City | undefined {
  return CITIES.find((c) => c.slug === slug);
}

/** Token watermark per halaman — algoritma identik generate.js. */
export function wmToken(slug: string): string {
  return createHash("sha256").update("xlsatusolo:" + slug).digest("hex").slice(0, 8);
}

/** Daftar kecamatan natural: "A, B, C, dan D". */
export function kecamatanText(list: string[]): string {
  if (list.length === 0) return "";
  if (list.length === 1) return list[0];
  return list.slice(0, -1).join(", ") + ", dan " + list[list.length - 1];
}

/** Encode WA persis generate.js: encodeURIComponent kecuali koma literal. */
export function waEncode(s: string): string {
  return encodeURIComponent(s).replace(/%2C/g, ",");
}

/** 5 FAQ kota → FaqItem (untuk komponen Faq + JSON-LD). */
export function cityFaqs(c: City): FaqItem[] {
  const out: FaqItem[] = [];
  for (let i = 1; i <= 5; i++) {
    const q = c[`faq${i}_q`];
    const a = c[`faq${i}_a`];
    if (typeof q === "string" && typeof a === "string" && q && a) {
      out.push({ q, a });
    }
  }
  return out;
}

/** Label tipe koneksi kartu area (logika renderAreaCards generate.js). */
export function areaTipe(c: City): string {
  if (c.has_fiber && c.has_wireless) return "Fiber & Wireless";
  if (c.has_fiber) return "Fiber Optic";
  return "Wireless";
}

/** Decode entitas HTML pada title/meta dari JSON agar Metadata API tidak double-escape. */
export function decodeEntities(s: string): string {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}
