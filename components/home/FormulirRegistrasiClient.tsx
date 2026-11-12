"use client";

import dynamic from "next/dynamic";

const FormulirRegistrasi = dynamic(
  () => import("@/components/home/FormulirRegistrasi"),
  {
    ssr: false,
    loading: () => (
      <section
        className="reg-section"
        id="daftar"
        style={{
          padding: "64px 20px",
          background: "var(--gray-bg, #f8fafc)",
          borderTop: "1px solid var(--border, #e2e8f0)",
          minHeight: "400px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ textAlign: "center", color: "#64748b" }}>
          <p style={{ fontSize: "16px", fontWeight: 600 }}>Memuat Formulir Pendaftaran...</p>
        </div>
      </section>
    ),
  }
);

export default function FormulirRegistrasiClient() {
  return <FormulirRegistrasi />;
}
