import type { ReactNode } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WaFloat from "@/components/WaFloat";
import ArticleHero from "@/components/ArticleHero";
import ScrollReveal from "@/components/animations/ScrollReveal";
import type { Alat } from "@/lib/alat";
import { PAGE_CSS } from "@/lib/page-css";

export default function AlatPage({ data, tool }: { data: Alat; tool: ReactNode }) {
  const css = PAGE_CSS[data.slug] || "";
  return (
    <>
      <Header ctaHref={data.headerCta || undefined} />
      <main>
        {css && <style dangerouslySetInnerHTML={{ __html: css }} />}
        {data.hero && <ArticleHero hero={data.hero} />}
        <article className="article-body">
          <ScrollReveal>
            <div dangerouslySetInnerHTML={{ __html: data.beforeHtml }} />
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            {tool}
          </ScrollReveal>
          <ScrollReveal delay={0.4}>
            <div dangerouslySetInnerHTML={{ __html: data.afterHtml }} />
          </ScrollReveal>
        </article>
      </main>
      <Footer />
      <WaFloat />
    </>
  );
}
