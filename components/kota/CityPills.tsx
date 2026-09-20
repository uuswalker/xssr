"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const CITIES = [
  { name: "Solo", slug: "/wifi-solo" },
  { name: "Sukoharjo", slug: "/wifi-sukoharjo" },
  { name: "Boyolali", slug: "/wifi-boyolali" },
  { name: "Karanganyar", slug: "/wifi-karanganyar" },
  { name: "Klaten", slug: "/wifi-klaten" },
];

export default function CityPills() {
  const pathname = usePathname();

  return (
    <section style={{ padding: "40px 24px 60px", background: "var(--white)", textAlign: "center" }}>
      <h3 style={{ fontSize: 18, fontWeight: 800, color: "var(--text)", marginBottom: 20 }}>
        Cek Ketersediaan XL Satu di Kota Sekitarmu:
      </h3>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 12, maxWidth: 800, margin: "0 auto" }}>
        {CITIES.map((city) => {
          const isActive = pathname === city.slug;
          return (
            <Link
              key={city.slug}
              href={city.slug}
              style={{
                padding: "10px 20px",
                borderRadius: 999,
                fontSize: 14,
                fontWeight: 700,
                background: isActive ? "var(--green)" : "var(--gray-bg)",
                color: isActive ? "#fff" : "var(--text-muted)",
                border: isActive ? "1px solid var(--green)" : "1px solid var(--border)",
                textDecoration: "none",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.borderColor = "var(--green)";
                  e.currentTarget.style.color = "var(--green)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.borderColor = "var(--border)";
                  e.currentTarget.style.color = "var(--text-muted)";
                }
              }}
            >
              📍 {city.name}
            </Link>
          );
        })}
      </div>
    </section>
  );
}
