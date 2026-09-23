import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageTransition from "@/components/animations/PageTransition";
import Article from "@/components/Article";
import { ARTIKEL } from "@/lib/artikel";
import { GEO_AREAS, getGeoArticle } from "@/lib/geo-pages";
import { decodeEntities } from "@/lib/kota";
import { JsonLd, pageMetadata } from "@/lib/seo";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const articleRoutes = Object.keys(ARTIKEL).map((slug) => ({ slug }));
  const geoRoutes = GEO_AREAS.map((area) => ({ slug: `pasang-wifi-xl-satu-${area}` }));
  return [...articleRoutes, ...geoRoutes];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const a = ARTIKEL[slug] || getGeoArticle(slug);
  if (!a) return {};

  const base = pageMetadata({
    title: decodeEntities(a.title),
    description: decodeEntities(a.description),
    path: `/${slug}/`,
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

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const a = ARTIKEL[slug] || getGeoArticle(slug);
  
  if (!a) notFound();

  return (
    <>
      <Article data={a} />
      {a.schemas && a.schemas.map((s, i) => (
        <JsonLd key={i} data={s} />
      ))}
    </>
  );
}
