import type { Metadata } from "next";
import AlatPage from "@/components/AlatPage";
import Kalkulator from "@/components/tools/Kalkulator";
import { ALAT } from "@/lib/alat";
import { decodeEntities } from "@/lib/kota";
import { JsonLd, pageMetadata } from "@/lib/seo";

const A = ALAT["berapa-mbps-untuk-berapa-orang"];

export async function generateMetadata(): Promise<Metadata> {
  const base = pageMetadata({
    title: decodeEntities(A.title),
    description: decodeEntities(A.description),
    path: `/${A.slug}/`,
    image: A.ogImage || "/images/promo-wifi-rumah-koneksi-pasti.webp",
  });
  return {
    ...base,
    keywords: A.keywords,
    openGraph: {
      ...base.openGraph,
      title: decodeEntities(A.ogTitle || A.title),
      description: decodeEntities(A.ogDescription || A.description),
    },
  };
}

export default function Page() {
  return (
    <>
      <AlatPage data={A} tool={<Kalkulator />} />
      {A.schemas.map((s, i) => (
        <JsonLd key={i} data={s} />
      ))}
    </>
  );
}