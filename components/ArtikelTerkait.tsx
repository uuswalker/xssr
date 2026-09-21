import Link from "next/link";
import { ARTIKEL } from "@/lib/artikel";
import { ChevronRight } from "lucide-react";

export default function ArtikelTerkait({ currentSlug }: { currentSlug: string }) {
  // Ambil 3 artikel selain artikel saat ini
  const allSlugs = Object.keys(ARTIKEL).filter(slug => slug !== currentSlug);
  
  // Ambil maksimal 3 artikel
  const relatedSlugs = allSlugs.slice(0, 3);
  
  if (relatedSlugs.length === 0) return null;

  return (
    <section style={{ padding: "40px 20px", background: "var(--gray-bg)" }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 24, color: "var(--green)" }}>
          Baca Juga Artikel Lainnya
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {relatedSlugs.map(slug => {
            const a = ARTIKEL[slug];
            return (
              <Link 
                key={slug} 
                href={`/${slug}/`}
                className="hover-lift"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  background: "#fff",
                  padding: "16px 20px",
                  borderRadius: 12,
                  textDecoration: "none",
                  color: "inherit",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
                  border: "1px solid var(--border)"
                }}
              >
                <div>
                  <h4 style={{ margin: "0 0 6px", fontSize: 16, fontWeight: 700, lineHeight: 1.4 }}>
                    {a.title.replace(/(&#34;|&quot;|&amp;)/g, "")}
                  </h4>
                  <p style={{ margin: 0, fontSize: 13, color: "var(--text-muted)", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                    {a.description}
                  </p>
                </div>
                <div style={{ paddingLeft: 16, color: "var(--green)" }}>
                  <ChevronRight size={20} />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
