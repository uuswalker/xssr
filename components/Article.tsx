import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WaFloat from "@/components/WaFloat";
import ArticleHero from "@/components/ArticleHero";
import ScrollReveal from "@/components/animations/ScrollReveal";
import type { Artikel } from "@/lib/artikel";
import { PAGE_CSS } from "@/lib/page-css";

export default function Article({ data }: { data: Artikel }) {
  const css = PAGE_CSS[data.slug] || "";
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
      </main>
      <Footer />
      <WaFloat />
    </>
  );
}
