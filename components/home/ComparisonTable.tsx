
import { CheckCircle2, XCircle } from "lucide-react";

export default function ComparisonTable() {
  return (
    <section id="bandingkan" style={{ padding: "64px 24px", background: "#f8fafc" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <h2 style={{ fontSize: 28, fontWeight: 800, textAlign: "center", marginBottom: 12, color: "#1e293b" }}>
          Kenapa Harus Pindah ke XL Home?
        </h2>
        <p style={{ textAlign: "center", color: "#475569", marginBottom: 40 }}>
          Bandingkan sendiri kualitas, harga, dan transparansi layanan kami dengan provider lain di Solo Raya.
        </p>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", background: "#fff", borderRadius: 12, overflow: "hidden", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)" }}>
            <thead>
              <tr style={{ background: "#f1f5f9", textAlign: "left" }}>
                <th style={{ padding: "16px 20px", color: "#334155", fontWeight: 700 }}>Fitur Layanan</th>
                <th style={{ padding: "16px 20px", color: "#037e64", fontWeight: 800, background: "#e6f7f3", borderTop: "4px solid #037e64" }}>XL Home</th>
                <th style={{ padding: "16px 20px", color: "#475569", fontWeight: 700 }}>Provider "I"</th>
                <th style={{ padding: "16px 20px", color: "#475569", fontWeight: 700 }}>Provider "B"</th>
              </tr>
            </thead>
            <tbody>
              {[
                { feature: "Batas Kuota / FUP", xl: "100% Unlimited", i: "Ada Batas FUP", b: "Berubah-ubah" },
                { feature: "Biaya Pasang/Instalasi", xl: "Gratis (S&K)", i: "Berbayar", b: "Berbayar (Sewa Modem)" },
                { feature: "Kecepatan Upload", xl: "Simetris (Sama Cepat)", i: "Dibatasi (Lebih Lambat)", b: "Simetris" },
                { feature: "Harga & Pajak", xl: "Transparan", i: "Sering Naik Tiba-tiba", b: "Transparan" },
                { feature: "Pendaftaran via WA", xl: "Bisa (Tanpa Antre)", i: "Harus ke Plasa/Kantor", b: "Bisa" },
              ].map((row, i) => (
                <tr key={i} style={{ borderBottom: "1px solid #e2e8f0" }}>
                  <td style={{ padding: "16px 20px", fontWeight: 600, color: "#334155" }}>{row.feature}</td>
                  <td style={{ padding: "16px 20px", fontWeight: 700, color: "#037e64", background: "#f8fffd" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <CheckCircle2 size={18} /> {row.xl}
                    </div>
                  </td>
                  <td style={{ padding: "16px 20px", color: "#475569" }}>{row.i}</td>
                  <td style={{ padding: "16px 20px", color: "#475569" }}>{row.b}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
