import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WaFloat from "@/components/WaFloat";
import AreaSearch from "@/components/AreaSearch";
import { AREA } from "@/lib/halaman";
import { decodeEntities } from "@/lib/kota";
import { PAGE_CSS } from "@/lib/page-css";
import { JsonLd, pageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const base = pageMetadata({
    title: decodeEntities(AREA.title),
    description: decodeEntities(AREA.description),
    path: "/area-layanan/",
    image: AREA.ogImage || "/images/promo-wifi-rumah-koneksi-pasti.webp",
  });
  return {
    ...base,
    keywords: AREA.keywords,
    openGraph: {
      ...base.openGraph,
      title: decodeEntities(AREA.ogTitle || AREA.title),
      description: decodeEntities(AREA.ogDescription || AREA.description),
    },
  };
}

export default function Page() {
  return (
    <>
      <Header />
      <main>
        <style dangerouslySetInnerHTML={{ __html: PAGE_CSS["area-layanan"] || "" }} />
        <div dangerouslySetInnerHTML={{ __html: AREA.bodyHtml }} />
        <AreaSearch />
      </main>
      <Footer />
      <WaFloat />
      {AREA.schemas.map((s, i) => (
        <JsonLd key={i} data={s} />
      ))}
    </>
  );
}
