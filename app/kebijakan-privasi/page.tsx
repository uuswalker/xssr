import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WaFloat from "@/components/WaFloat";
import { PRIVASI } from "@/lib/halaman";
import { decodeEntities } from "@/lib/kota";
import { PAGE_CSS } from "@/lib/page-css";
import { JsonLd, pageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const base = pageMetadata({
    title: decodeEntities(PRIVASI.title),
    description: decodeEntities(PRIVASI.description),
    path: "/kebijakan-privasi/",
    image: PRIVASI.ogImage || "/images/promo-wifi-rumah-koneksi-pasti.webp",
  });
  return {
    ...base,
    keywords: PRIVASI.keywords,
    openGraph: {
      ...base.openGraph,
      title: decodeEntities(PRIVASI.ogTitle || PRIVASI.title),
      description: decodeEntities(PRIVASI.ogDescription || PRIVASI.description),
    },
  };
}

export default function Page() {
  return (
    <>
      <Header />
      <main>
        <style
          dangerouslySetInnerHTML={{ __html: PAGE_CSS["kebijakan-privasi"] || "" }}
        />
        <article dangerouslySetInnerHTML={{ __html: PRIVASI.bodyHtml }} />
      </main>
      <Footer />
      <WaFloat />
      {PRIVASI.schemas.map((s, i) => (
        <JsonLd key={i} data={s} />
      ))}
    </>
  );
}
