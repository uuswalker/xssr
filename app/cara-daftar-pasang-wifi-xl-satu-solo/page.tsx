import type { Metadata } from "next";
import Article from "@/components/Article";
import { ARTIKEL } from "@/lib/artikel";
import { decodeEntities } from "@/lib/kota";
import { JsonLd, pageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const a = ARTIKEL["cara-daftar-pasang-wifi-xl-satu-solo"];
  const base = pageMetadata({
    title: decodeEntities(a.title),
    description: decodeEntities(a.description),
    path: `/cara-daftar-pasang-wifi-xl-satu-solo/`,
    image: a.ogImage || "/images/promo-wifi-rumah-koneksi-pasti.webp",
  });
  return {
    ...base,
    keywords: a.keywords,
    openGraph: {
      ...base.openGraph,
      title: decodeEntities(a.ogTitle || a.title),
      description: decodeEntities(a.ogDescription || a.description),
    },
  };
}

export default function Page() {
  const a = ARTIKEL["cara-daftar-pasang-wifi-xl-satu-solo"];
  return (
    <>
      <Article data={a} />
      {a.schemas.map((s, i) => (
        <JsonLd key={i} data={s} />
      ))}
    </>
  );
}
