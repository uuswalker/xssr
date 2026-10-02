"use client";

import { useState } from "react";
import { Share2 } from "lucide-react";

export default function ReferralShareClient() {
  const [referrer, setReferrer] = useState("");

  const baseText = "Halo! Lagi cari WiFi rumah atau kos di Solo Raya? Aku rekomendasikan pakai *XL Home*. Internetnya asli unlimited tanpa FUP, anti lemot di akhir bulan.\n\nCoba cek harganya dan daftar lewat Admin resminya di sini: https://wa.me/6287778999141";
  
  const referralText = referrer.trim() 
    ? `\n\n(Jangan lupa bilang dapat rekomendasi dari ${referrer.trim()} ya!)`
    : "\n\n(Jangan lupa bilang dapat rekomendasi dari aku ya!)";
    
  const encodedText = encodeURIComponent(baseText + referralText);
  const waLink = `https://wa.me/?text=${encodedText}`;

  return (
    <div style={{ background: "#f8fafc", padding: 32, borderRadius: 16, border: "1px solid #e2e8f0", display: "flex", flexDirection: "column", justifyContent: "center" }}>
      <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 12, textAlign: "center" }}>Sebarkan Lewat WhatsApp</h3>
      <p style={{ fontSize: 14, color: "#64748b", textAlign: "center", marginBottom: 20 }}>
        Isi nama/nomor HP Anda di bawah agar teman yang daftar otomatis menyebutkan referensi Anda di pesannya.
      </p>
      
      <input 
        type="text" 
        placeholder="Nama atau No. HP Anda..." 
        value={referrer}
        onChange={(e) => setReferrer(e.target.value)}
        style={{
          width: "100%", padding: "12px 16px", borderRadius: 8, border: "1px solid #cbd5e1", marginBottom: 20, fontSize: 15,
          outline: "none", fontFamily: "inherit"
        }}
      />
      
      <a 
        href={waLink}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
          background: "#25D366", color: "white", padding: "16px", borderRadius: 12, fontWeight: 700, textDecoration: "none",
          boxShadow: "0 4px 14px rgba(37,211,102,0.3)", transition: "all 0.2s"
        }}
      >
        <Share2 size={20} />
        Bagikan Pesan ke WA
      </a>

      <p style={{ fontSize: 13, color: "#94a3b8", textAlign: "center", marginTop: 24, fontStyle: "italic" }}>
        *Teks pesan WhatsApp akan dibuat otomatis setelah tombol di atas diklik.
      </p>
    </div>
  );
}
