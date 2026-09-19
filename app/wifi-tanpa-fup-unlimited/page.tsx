import type { Metadata } from "next";
import AlatPage from "@/components/AlatPage";
import FupSim from "@/components/tools/FupSim";
import { ALAT } from "@/lib/alat";
import { decodeEntities } from "@/lib/kota";
import { JsonLd, pageMetadata } from "@/lib/seo";

const A = ALAT["wifi-tanpa-fup-unlimited"];

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
      <AlatPage data={A} tool={<FupSim />} />
      {A.schemas.map((s, i) => (
        <JsonLd key={i} data={s} />
      ))}
    </>
  );
}