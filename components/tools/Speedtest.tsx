"use client";

import { useState } from "react";

export default function Speedtest() {
  const [loading, setLoading] = useState(true);

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
      <p style={{ marginBottom: 16, fontSize: 15, color: "#4b5563" }}>
        Gunakan alat ukur di bawah ini untuk mengecek kecepatan internet Anda. Pastikan tidak ada aplikasi yang sedang mendownload saat tes berlangsung untuk hasil yang paling akurat.
      </p>
      
      <div 
        style={{ 
          position: "relative",
          width: "100%", 
          minHeight: "500px",
          background: "#f3f4f6", 
          borderRadius: 16, 
          overflow: "hidden",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
        }}
      >
        {loading && (
          <div style={{ 
            position: "absolute", 
            top: 0, left: 0, right: 0, bottom: 0, 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center",
            flexDirection: "column",
            color: "#6b7280"
          }}>
            <div className="spinner" style={{ marginBottom: 12 }}>Memuat Mesin Speedtest...</div>
          </div>
        )}
        
        {/* DCSpeedTest Widget (Powered by Cloudflare, 100% Mobile Iframe Support) */}
        <iframe 
          src="https://dcspeedtest.com/embed"
          width="100%" 
          height="550px" 
          frameBorder="0"
          onLoad={() => setLoading(false)}
          style={{ position: "relative", zIndex: 1, border: "none" }}
          title="Internet Speed Test"
          allow="fullscreen; clipboard-write"
          loading="lazy"
        />
      </div>

      <div style={{ marginTop: 24, padding: 16, background: "#f8fafc", borderRadius: 12, textAlign: "left", fontSize: 14, color: "#334155" }}>
        <h4 style={{ margin: "0 0 8px 0", fontSize: 16, color: "#0f172a" }}>💡 Panduan Hasil Speedtest:</h4>
        <ul style={{ margin: 0, paddingLeft: 20 }}>
          <li style={{ marginBottom: 6 }}><strong>Cepat (50+ Mbps):</strong> Ideal untuk streaming 4K, WFH, dan gaming sekeluarga tanpa hambatan.</li>
          <li style={{ marginBottom: 6 }}><strong>Sedang (20-49 Mbps):</strong> Cukup untuk browsing dan streaming HD, namun mungkin buffering jika dipakai bersamaan.</li>
          <li><strong>Lambat (&lt; 20 Mbps):</strong> Sangat disarankan untuk beralih ke internet fiber optik XL SATU demi kelancaran aktivitas digital.</li>
        </ul>
      </div>
    </div>
  );
}
