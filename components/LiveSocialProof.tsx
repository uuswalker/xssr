
"use client";
import React, { useState, useEffect } from 'react';
import { CheckCircle2 } from "lucide-react";

const socialProofData = [
  { id: 1, name: 'Ayu', location: 'Colomadu', action: 'baru saja memasang', product: 'Paket Spark 250Mbps', timeAgo: '2 menit yang lalu' },
  { id: 2, name: 'Dimas', location: 'Solo Baru', action: 'berhasil klaim', product: 'Promo Bebas Biaya Pasang', timeAgo: '5 menit yang lalu' },
  { id: 3, name: 'Keluarga Budi', location: 'Gentan', action: 'sedang menjadwalkan', product: 'Instalasi XL SATU', timeAgo: 'Baru saja' },
  { id: 4, name: 'Rini', location: 'Banjarsari', action: 'baru saja upgrade ke', product: 'Paket Fiber 500Mbps', timeAgo: '12 menit yang lalu' },
  { id: 5, name: 'Agung', location: 'Kartasura', action: 'baru saja berlangganan', product: 'WiFi Tanpa FUP', timeAgo: '1 jam yang lalu' },
  { id: 6, name: 'Ratna', location: 'Jebres', action: 'berhasil pasang', product: 'Paket Spark 250Mbps', timeAgo: 'Baru saja' },
  { id: 7, name: 'Dwi', location: 'Pasar Kliwon', action: 'mengamankan', product: 'Promo Hemat XL SATU', timeAgo: '18 menit yang lalu' }
];

export default function LiveSocialProof() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const initialTimer = setTimeout(() => showNotification(), 5000);
    return () => clearTimeout(initialTimer);
  }, []);

  const showNotification = () => {
    setIsVisible(true);
    setTimeout(() => {
      setIsVisible(false);
      const nextDelay = Math.floor(Math.random() * 8000) + 12000;
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % socialProofData.length);
        showNotification();
      }, nextDelay);
    }, 5000);
  };

  const currentData = socialProofData[currentIndex];
  if (!currentData) return null;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes pulseDot {
          0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7); }
          70% { transform: scale(1); box-shadow: 0 0 0 4px rgba(34, 197, 94, 0); }
          100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(34, 197, 94, 0); }
        }
        .fomo-dot {
          width: 8px;
          height: 8px;
          background-color: #22c55e;
          border-radius: 50%;
          display: inline-block;
          animation: pulseDot 2s infinite;
        }
      ` }} />
      <div
        style={{
          position: "fixed",
          bottom: "24px",
          left: "24px",
          zIndex: 9999,
          maxWidth: "340px",
          backgroundColor: "#ffffff",
          borderRadius: "12px",
          boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
          border: "1px solid #f1f5f9",
          padding: "14px 18px",
          transform: isVisible ? "translateY(0)" : "translateY(20px)",
          opacity: isVisible ? 1 : 0,
          pointerEvents: isVisible ? "auto" : "none",
          transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
          display: "flex",
          gap: "14px",
          alignItems: "flex-start",
        }}
      >
        <div style={{
          flexShrink: 0,
          marginTop: "2px",
          width: "36px",
          height: "36px",
          borderRadius: "50%",
          backgroundColor: "#eff6ff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}>
          <CheckCircle2 size={18} color="#2563eb" />
        </div>
        <div>
          <p style={{ margin: 0, fontSize: "14px", color: "#1e293b", lineHeight: "1.4" }}>
            <strong style={{ fontWeight: 600 }}>{currentData.name}</strong> dari <strong style={{ fontWeight: 600 }}>{currentData.location}</strong> {currentData.action}{" "}
            <strong style={{ fontWeight: 600, color: "#2563eb" }}>{currentData.product}</strong>!
          </p>
          <div style={{ marginTop: "6px", fontSize: "12px", color: "#64748b", display: "flex", alignItems: "center", gap: "6px" }}>
            <span className="fomo-dot"></span>
            {currentData.timeAgo}
          </div>
        </div>
      </div>
    </>
  );
}
