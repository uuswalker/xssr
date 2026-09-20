import { ARTIKEL } from "@/lib/artikel";
import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import type { Metadata } from "next";
import PageTransition from "@/components/animations/PageTransition";

export const metadata: Metadata = {
  title: "Artikel & Panduan WiFi Rumah | XL SATU Solo Raya",
  description: "Kumpulan artikel edukasi, tips, dan panduan memilih paket internet rumah fiber optic terbaik di Solo Raya.",
  openGraph: {
    title: "Artikel & Panduan WiFi Rumah | XL SATU Solo",
    description: "Kumpulan panduan memilih paket internet rumah fiber optic terbaik.",
  }
};

export default function ArtikelIndex() {
  const articles = Object.values(ARTIKEL);

  return (
    <div style={{ backgroundColor: "#f8fafc", minHeight: "100vh", padding: "40px 20px" }}>
      <PageTransition style={{ maxWidth: 1000, margin: "0 auto" }}>
        
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <h1 style={{ fontSize: "2.5rem", color: "#0f172a", marginBottom: 16 }}>
            Panduan &amp; Edukasi <span style={{ color: "var(--green)" }}>Internet</span>
          </h1>
          <p style={{ color: "#64748b", fontSize: "1.1rem", maxWidth: 600, margin: "0 auto" }}>
            Temukan tips memilih kecepatan WiFi, perbandingan provider, dan solusi internet rumah terbaik untuk keluarga Anda di Solo Raya.
          </p>
        </div>

        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", 
          gap: "24px" 
        }}>
          {articles.map((a) => (
            <Link 
              key={a.slug} 
              href={`/${a.slug}/`}
              style={{
                display: "flex",
                flexDirection: "column",
                backgroundColor: "#fff",
                borderRadius: "16px",
                overflow: "hidden",
                textDecoration: "none",
                boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03)",
                border: "1px solid #e2e8f0",
                transition: "transform 0.2s, box-shadow 0.2s"
              }}
              className="article-card"
            >
              <div style={{ 
                height: 160, 
                backgroundColor: "var(--green-light)",
                backgroundImage: `url(${a.ogImage || "/images/promo-wifi-rumah-koneksi-pasti.webp"})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                borderBottom: "1px solid #e2e8f0"
              }} />
              <div style={{ padding: "24px", display: "flex", flexDirection: "column", flexGrow: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--green)", fontSize: "0.8rem", fontWeight: 700, marginBottom: 12 }}>
                  <BookOpen size={14} /> ARTIKEL
                </div>
                <h2 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#1e293b", marginBottom: 12, lineHeight: 1.4 }}>
                  {a.title}
                </h2>
                <p style={{ fontSize: "0.9rem", color: "#64748b", lineHeight: 1.5, marginBottom: 20, flexGrow: 1 }}>
                  {a.description.substring(0, 120)}...
                </p>
                <div style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  gap: 8, 
                  color: "var(--green)", 
                  fontSize: "0.9rem", 
                  fontWeight: 600,
                  marginTop: "auto"
                }}>
                  Baca Selengkapnya <ArrowRight size={16} />
                </div>
              </div>
            </Link>
          ))}
        </div>
        
        <style dangerouslySetInnerHTML={{__html: `
          .article-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05) !important;
            border-color: #cbd5e1 !important;
          }
        `}} />
      </PageTransition>
    </div>
  );
}
