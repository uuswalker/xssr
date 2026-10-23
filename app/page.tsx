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
  title: "Pasang WiFi Solo Murah Mulai 185rb ⚡ Provider Internet Terbaik Solo (XL Home)",
  description:
    "Promo pasang WiFi Solo 2026 mulai 185rb/bln! 100% Fiber Unlimited Tanpa FUP + Gratis Pasang Rp 0. Chat Sales Resmi Solo Raya WA: 0877-7899-9141 (Aktif 24 Jam).",
  path: "/",
});

const Marquee = dynamic(() => import("@/components/animations/Marquee"));
const ComparisonTable = dynamic(() => import("@/components/home/ComparisonTable"));

export default function Home() {
  return (
    <>
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
    </>
  );
}

