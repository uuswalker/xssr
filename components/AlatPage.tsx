import type { ReactNode } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WaFloat from "@/components/WaFloat";
import ArticleHero from "@/components/ArticleHero";
import type { Alat } from "@/lib/alat";
import { PAGE_CSS } from "@/lib/page-css";

// Shell halaman tool: header CTA + hero + sebelum + komponen tool + sesudah.
export default function AlatPage({ data, tool }: { data: Alat; tool: ReactNode }) {
  const css = PAGE_CSS[data.slug] || "";
  return (
    <>
      <Header ctaHref={data.headerCta || undefined} />
      <main>
        {css && <style dangerouslySetInnerHTML={{ __html: css }} />}
        {data.hero && <ArticleHero hero={data.hero} />}
        <article className="article-body">
          <div dangerouslySetInnerHTML={{ __html: data.beforeHtml }} />
          {tool}
          <div dangerouslySetInnerHTML={{ __html: data.afterHtml }} />
        </article>
      </main>
      <Footer />
      <WaFloat />
    </>
  );
}
