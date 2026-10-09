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
  title: "Pasang WiFi Solo Raya Tanpa FUP | XL HOME",
  description:
    "🔥 Promo Pasang WiFi Solo Raya Bulan Ini: Internet Fiber 100% Unlimited TANPA FUP mulai 185rb/bln. Daftar pagi, sore dipasang! Tim Sales lokal cepat tanggap. Cek area sekarang.",
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

