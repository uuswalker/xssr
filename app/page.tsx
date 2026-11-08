import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Hero from "@/components/home/Hero";
import PageTransition from "@/components/animations/PageTransition";
import dynamic from "next/dynamic";
const PaketSection = dynamic(() => import("@/components/home/PaketSection"));
const InfoSections = dynamic(() => import("@/components/home/InfoSections"));
const Faq = dynamic(() => import("@/components/home/Faq"));
const WaFloat = dynamic(() => import("@/components/WaFloat"));
import { FAQ_HOME } from "@/lib/faq-home";
import {
  JsonLd,
  jsonLdFaq,
  jsonLdLocalBusiness,
  jsonLdWebsite,
  pageMetadata,
} from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Pasang WiFi Solo Murah Mulai 185 Ribu - Bebas FUP & Gratis Pasang 2026",
  description:
    "Promo resmi pasang WiFi Solo murah 100% Fiber Optic tanpa FUP. Paket internet rumah mulai Rp 185.000/bln + Gratis Instalasi. Chat Sales WA: 0877-7899-9141.",
  path: "/",
});

const PRODUCT_OFFER_JSONLD = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "Paket Pasang WiFi Solo Murah Tanpa FUP",
  description:
    "Layanan resmi pasang WiFi internet rumah murah di Solo dengan kecepatan tinggi 100% fiber optic tanpa batas FUP.",
  brand: {
    "@type": "Brand",
    name: "XL Home",
  },
  offers: {
    "@type": "Offer",
    url: "https://xlhomesolo.com/",
    priceCurrency: "IDR",
    price: "185000",
    priceValidUntil: "2026-12-31",
    availability: "https://schema.org/InStock",
    seller: {
      "@type": "Organization",
      name: "XL Home Solo Raya Official Sales",
    },
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.9",
    reviewCount: "187",
    bestRating: "5",
    worstRating: "1",
  },
};

const Marquee = dynamic(() => import("@/components/animations/Marquee"));
const ComparisonTable = dynamic(() => import("@/components/home/ComparisonTable"));

export default function Home() {
  return (
    <>
      <link
        rel="preload"
        as="image"
        href="/images/banner-xlsatu-jadi-xlhome.webp"
        type="image/webp"
        fetchPriority="high"
      />
      <Header />
      <PageTransition>
        <Hero />
        <Marquee />
        <PaketSection />
        <InfoSections />
        <ComparisonTable />
        <Faq faqs={FAQ_HOME} />
        <WaFloat />
      </PageTransition>
      <Footer />
      <JsonLd data={jsonLdWebsite()} />
      <JsonLd data={jsonLdLocalBusiness()} />
      <JsonLd data={jsonLdFaq(FAQ_HOME)} />
      <JsonLd data={PRODUCT_OFFER_JSONLD} />
    </>
  );
}
