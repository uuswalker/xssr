import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WaFloat from "@/components/WaFloat";
import Watermark from "@/components/Watermark";
import Faq from "@/components/home/Faq";
import { FiberPaket, TahunanPaket, WirelessPaket } from "@/components/home/PaketSection";
import { About, Hubungi, Kenapa, Myxl } from "@/components/home/InfoSections";
import ScrollReveal from "@/components/animations/ScrollReveal";
import Marquee from "@/components/animations/Marquee";
import { KecamatanBlock, KotaArea, KotaHero } from "@/components/kota/KotaSections";
import {
  CITIES,
  cityFaqs,
  decodeEntities,
  getCity,
  wmToken,
} from "@/lib/kota";
import {
  JsonLd,
  jsonLdFaq,
  jsonLdLocalBusinessKota,
  pageMetadata,
} from "@/lib/seo";

const jakarta = Plus_Jakarta_Sans({
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
  display: "optional",
});

/** Metadata per kota — dipakai wrapper rute statis. */
export async function kotaMetadata(slug: string): Promise<Metadata> {
  const city = getCity(slug);
  if (!city) return {};
  const base = pageMetadata({
    title: decodeEntities(city.title as string),
    description: decodeEntities(city.meta_description as string),
    path: `/${city.slug}/`,
    image: "/images/promo-wifi-rumah-koneksi-pasti.webp",
  });
  return {
    ...base,
    keywords: (city.meta_keywords as string).split(/,\s*/),
    openGraph: {
      ...base.openGraph,
      title: decodeEntities(city.og_title as string),
      description: decodeEntities(city.og_description as string),
    },
  };
}

/** Isi halaman kota — dipakai wrapper rute statis. */
export function KotaPage({ slug }: { slug: string }) {
  const city = getCity(slug);
  if (!city) notFound();

  const faqs = cityFaqs(city);
  let areaServed: unknown = city.nama as string;
  try {
    areaServed = JSON.parse(city.area_served_json as string);
  } catch {
    areaServed = city.nama as string;
  }

  return (
    <div className={jakarta.className}>
      <Watermark token={wmToken(city.slug)} />
      <Header showFiber={!!city.has_fiber} showWireless={!!city.has_wireless} />
      <main>
        <ScrollReveal delay={0.1}>
          <KotaHero city={city} />
        </ScrollReveal>
        <Marquee />
        <ScrollReveal delay={0.1}>
          <KotaArea active={city} cities={CITIES} />
        </ScrollReveal>
        <ScrollReveal delay={0.1}>
          <KecamatanBlock city={city} />
        </ScrollReveal>
        {city.has_fiber && (
          <>
            <ScrollReveal delay={0.1}>
          <FiberPaket promoBadge={city.promo_badge as string} />
        </ScrollReveal>
            <ScrollReveal delay={0.1}>
          <TahunanPaket />
        </ScrollReveal>
          </>
        )}
        {city.has_wireless && (
          <ScrollReveal delay={0.1}>
          <WirelessPaket
            badge={city.wireless_badge as string}
            intro="kota"
          />
        </ScrollReveal>
        )}
        <ScrollReveal delay={0.1}>
          <Kenapa />
        </ScrollReveal>
        <ScrollReveal delay={0.1}>
          <About />
        </ScrollReveal>
        <ScrollReveal delay={0.1}>
          <Myxl />
        </ScrollReveal>
        <ScrollReveal delay={0.1}>
          <Faq faqs={faqs} />
        </ScrollReveal>
        <ScrollReveal delay={0.1}>
          <Hubungi />
        </ScrollReveal>
        <WaFloat text={city.wa_float_text as string} />
      </main>
      <Footer />
      <JsonLd data={jsonLdLocalBusinessKota(`/${city.slug}/`, areaServed)} />
      <JsonLd data={jsonLdFaq(faqs)} />
    </div>
  );
}
