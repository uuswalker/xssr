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
  title: "Pasang WiFi Solo Murah 2026 | XL Home (XL SATU Fiber) Tanpa FUP",
  description:
    "Promo pasang WiFi Solo murah 2026 mulai 185rb/bln (kategori 100 ribuan) dari XL Home (d/h XL SATU Fiber). 100% Tanpa FUP, gratis biaya pasang, daftar online via sales resmi.",
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

