import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Hero from "@/components/home/Hero";
import PaketSection from "@/components/home/PaketSection";
import InfoSections from "@/components/home/InfoSections";
import Faq from "@/components/home/Faq";
import WaFloat from "@/components/WaFloat";
import { FAQ_HOME } from "@/lib/faq-home";
import {
  JsonLd,
  jsonLdFaq,
  jsonLdLocalBusiness,
  jsonLdWebsite,
  pageMetadata,
} from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Pasang WiFi Solo Raya Tanpa FUP | XL SATU Internet Rumah",
  description:
    "Pasang WiFi Solo Raya: internet rumah fiber optic unlimited tanpa FUP, 20-1000 Mbps mulai Rp 185.000/bulan. Cek ketersediaan & instalasi via WhatsApp sales.",
  path: "/",
});

import ScrollReveal from "@/components/animations/ScrollReveal";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <ScrollReveal delay={0.1}>
          <Hero />
        </ScrollReveal>
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
