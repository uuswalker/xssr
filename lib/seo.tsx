import type { Metadata } from "next";
import { IS_STAGING, SITE_DOMAIN, SITE_NAME } from "./site";

export interface FaqItem {
  q: string;
  a: string;
}

interface PageSeo {
  title: string;
  description: string;
  path: string;
  image?: string;
}

/** Metadata per halaman — paritas dengan <head> xssr. */
export function pageMetadata({ title, description, path, image }: PageSeo): Metadata {
  const url = `${SITE_DOMAIN}${path}`;
  const ogImage = image || "/images/promo-wifi-rumah-koneksi-pasti.webp";
  return {
    title,
    description,
    alternates: { canonical: url },
    robots: { index: true, follow: true },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      title,
      description,
      url,
      images: [{ url: ogImage }],
    },
  };
}

export function jsonLdWebsite() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    alternateName: "XL SATU Solo",
    url: `${SITE_DOMAIN}/`,
    inLanguage: "id",
    publisher: { "@id": `${SITE_DOMAIN}/#business` },
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_DOMAIN}/?s={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function jsonLdLocalBusiness() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${SITE_DOMAIN}/#business`,
    name: SITE_NAME,
    alternateName: ["XL SATU Solo", "First Media Solo", "XL Home Solo"],
    description:
      "Reseller resmi XL SATU (fiber optic & wireless internet) untuk wilayah Solo Raya: Kota Solo, Sukoharjo, Karanganyar, Klaten, dan Boyolali. Internet rumah unlimited tanpa FUP mulai Rp 185.000/bulan.",
    url: `${SITE_DOMAIN}/`,
    telephone: "+6287778999141",
    image: `${SITE_DOMAIN}/images/promo-wifi-rumah-koneksi-pasti.webp`,
    priceRange: "Rp185.000 – Rp399.000/bulan",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Surakarta",
      addressLocality: "Surakarta",
      addressRegion: "Jawa Tengah",
      postalCode: "57100",
      addressCountry: "ID",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: -7.57533,
      longitude: 110.82481,
    },
    areaServed: [
      { "@type": "City", name: "Surakarta" },
      { "@type": "City", name: "Solo" },
      { "@type": "City", name: "Sukoharjo" },
      { "@type": "City", name: "Karanganyar" },
      { "@type": "City", name: "Klaten" },
      { "@type": "City", name: "Boyolali" },
    ],
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
      opens: "08:00",
      closes: "21:00",
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Paket Internet XL SATU",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: { "@type": "Service", name: "XL SATU Fiber 20 Mbps" },
          price: "185000",
          priceCurrency: "IDR",
          priceSpecification: { "@type": "UnitPriceSpecification", billingDuration: "P1M" },
        },
        {
          "@type": "Offer",
          itemOffered: { "@type": "Service", name: "XL SATU Fiber 100 Mbps" },
          price: "245000",
          priceCurrency: "IDR",
          priceSpecification: { "@type": "UnitPriceSpecification", billingDuration: "P1M" },
        },
        {
          "@type": "Offer",
          itemOffered: { "@type": "Service", name: "XL SATU Fiber 250 Mbps" },
          price: "229000",
          priceCurrency: "IDR",
          priceSpecification: { "@type": "UnitPriceSpecification", billingDuration: "P1M" },
        },
      ],
    },
    sameAs: [
      "https://satu.xl.co.id",
      "https://share.google/98sEij0jKY6VsIwcP",
      "https://maps.app.goo.gl/exTMsZCCVmCvtZzs9",
    ],
  };
}

/** Varian kota — paritas template-kota.html (sameAs hanya domain sendiri). */
export function jsonLdLocalBusinessKota(path: string, areaServed: unknown) {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${SITE_DOMAIN}/#business`,
    name: SITE_NAME,
    url: `${SITE_DOMAIN}${path}`,
    telephone: "+6287778999141",
    image: `${SITE_DOMAIN}/images/promo-wifi-rumah-koneksi-pasti.webp`,
    priceRange: "Rp185.000 – Rp399.000/bulan",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Surakarta",
      addressRegion: "Jawa Tengah",
      postalCode: "57100",
      addressCountry: "ID",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: -7.57533,
      longitude: 110.82481,
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
      opens: "08:00",
      closes: "21:00",
    },
    areaServed,
    sameAs: ["https://xlsatusolo.com"],
  };
}

export function jsonLdFaq(faqs: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

/** Render <script type="application/ld+json"> dari objek schema. */
export function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
