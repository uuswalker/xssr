import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Hero from "@/components/home/Hero";
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
  title: "Pasang WiFi Solo Raya Tanpa FUP | XL SATU Solo Raya",
  description:
    "Pasang WiFi Solo Raya: internet rumah fiber optic unlimited tanpa FUP, 20-1000 Mbps mulai Rp 185.000/bulan. Cek ketersediaan & instalasi via WhatsApp sales.",
  path: "/",
});

const ScrollReveal = dynamic(() => import("@/components/animations/ScrollReveal"));
import Marquee from "@/components/animations/Marquee";

import { preload } from "react-dom";

export default function Home() {
  preload("/images/promo-wifi-rumah-koneksi-pasti-mobile.webp", {
    as: "image",
    imageSrcSet: "/images/promo-wifi-rumah-koneksi-pasti-mobile.webp 500w, /images/promo-wifi-rumah-koneksi-pasti.webp 1080w",
    imageSizes: "(max-width: 768px) 500px, 1080px",
    fetchPriority: "high",
  });
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Marquee />
        <ScrollReveal delay={0.1}>
          <PaketSection />
        </ScrollReveal>
        <ScrollReveal delay={0.1}>
          <InfoSections />
        </ScrollReveal>
        <ScrollReveal delay={0.1}>
          <Faq faqs={FAQ_HOME} />
        </ScrollReveal>
        <WaFloat />
      </main>
      <Footer />
      <JsonLd data={jsonLdWebsite()} />
      <JsonLd data={jsonLdLocalBusiness()} />
      <JsonLd data={jsonLdFaq(FAQ_HOME)} />
    </>
  );
}
