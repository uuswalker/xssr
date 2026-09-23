import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WaFloat from "@/components/WaFloat";
import ArticleHero from "@/components/ArticleHero";
import ScrollReveal from "@/components/animations/ScrollReveal";
import ArtikelTerkait from "@/components/ArtikelTerkait";
import type { Artikel } from "@/lib/artikel";
import { PAGE_CSS } from "@/lib/page-css";

export default function Article({ data }: { data: Artikel }) {
  const isGeoPage = data.slug.startsWith("pasang-wifi-xl-satu-");
  const css = PAGE_CSS[data.slug] || (isGeoPage ? PAGE_CSS['cara-daftar-pasang-wifi-xl-satu-solo'] : "");
  return (
    <>
      <Header ctaHref={data.headerCta || undefined} />
      <main>
        {css && (
          <style dangerouslySetInnerHTML={{ __html: css }} />
        )}
        {data.hero && <ArticleHero hero={data.hero} />}
        <ScrollReveal>
          <article
            className="article-body"
            dangerouslySetInnerHTML={{ __html: data.bodyHtml }}
          />
        </ScrollReveal>
        <ArtikelTerkait currentSlug={data.slug} />
      </main>
      <Footer />
      <WaFloat />
    </>
  );
}
