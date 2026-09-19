import type { HeroBand } from "@/lib/artikel";

// Pita hero artikel — breadcrumb + h1 + subtitle + meta (HTML verbatim xssr).
export default function ArticleHero({ hero }: { hero: HeroBand }) {
  return (
    <div className="article-hero">
      <div
        className="breadcrumb"
        dangerouslySetInnerHTML={{ __html: hero.crumb }}
      />
      <h1 dangerouslySetInnerHTML={{ __html: hero.h1 }} />
      <p
        className="subtitle"
        dangerouslySetInnerHTML={{ __html: hero.sub }}
      />
      <p
        className="article-meta"
        dangerouslySetInnerHTML={{ __html: hero.meta }}
      />
    </div>
  );
}
