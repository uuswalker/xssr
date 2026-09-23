
"use client";
import React, { useState, useEffect, useRef } from 'react';
import { CheckCircle2, X } from "lucide-react";

const socialProofData = [
  { name: 'Ayu', location: 'Colomadu', action: 'baru saja memasang', product: 'Paket Spark 250Mbps', timeAgo: '2 menit yang lalu' },
  { name: 'Dimas', location: 'Solo Baru', action: 'berhasil klaim', product: 'Promo Bebas Biaya Pasang', timeAgo: '5 menit yang lalu' },
  { name: 'Keluarga Budi', location: 'Gentan', action: 'sedang menjadwalkan', product: 'Instalasi XL SATU', timeAgo: 'Baru saja' },
  { name: 'Rini', location: 'Banjarsari', action: 'baru saja upgrade ke', product: 'Paket Fiber 500Mbps', timeAgo: '12 menit yang lalu' },
  { name: 'Agung', location: 'Kartasura', action: 'baru saja beralih ke', product: 'WiFi Tanpa FUP', timeAgo: '1 jam yang lalu' },
  { name: 'Ratna', location: 'Jebres', action: 'berhasil pasang', product: 'Paket Spark 250Mbps', timeAgo: 'Baru saja' },
  { name: 'Dwi', location: 'Pasar Kliwon', action: 'mengamankan', product: 'Promo Hemat XL SATU', timeAgo: '18 menit yang lalu' },
  { name: 'Pak Joko', location: 'Laweyan', action: 'menjadwalkan teknisi untuk', product: 'Pemasangan Hari Ini', timeAgo: '3 menit yang lalu' },
  { name: 'Siti', location: 'Banyuanyar', action: 'baru saja daftar', product: 'Paket Fiber 100Mbps', timeAgo: '10 menit yang lalu' },
  { name: 'Wahyu', location: 'Manahan', action: 'berhasil klaim', product: 'Gratis Router XL SATU', timeAgo: 'Baru saja' },
  { name: 'Keluarga Santoso', location: 'Fajar Indah', action: 'upgrade ke jaringan', product: 'Fiber Optic Stabil', timeAgo: '22 menit yang lalu' },
  { name: 'Putri', location: 'Mojosongo', action: 'baru saja beralih ke', product: 'Internet Tanpa FUP', timeAgo: '7 menit yang lalu' },
  { name: 'Bagus', location: 'Palur', action: 'sedang memproses', product: 'Pendaftaran WiFi Rumah', timeAgo: 'Baru saja' },
  { name: 'Arif', location: 'Jaten', action: 'berhasil klaim', product: 'Promo Bebas Biaya Pasang', timeAgo: '15 menit yang lalu' },
  { name: 'Nia', location: 'Baki', action: 'baru saja memasang', product: 'Paket Keluarga Cerdas', timeAgo: '4 menit yang lalu' },
  { name: 'Toni', location: 'Ngemplak', action: 'menjadwalkan instalasi', product: 'Paket Spark 250Mbps', timeAgo: 'Baru saja' },
  { name: 'Ibu Ratmi', location: 'Colomadu', action: 'berhasil mendaftar', product: 'Promo XL SATU Fiber', timeAgo: '9 menit yang lalu' },
  { name: 'Keluarga Hermawan', location: 'Solo Baru', action: 'baru saja pindah ke', product: 'Koneksi Bebas Lemot', timeAgo: '30 menit yang lalu' },
  { name: 'Gilang', location: 'Kartasura', action: 'mengamankan kuota', product: 'Gratis Pemasangan', timeAgo: 'Baru saja' },
  { name: 'Maya', location: 'Jebres', action: 'baru saja memasang', product: 'Paket Fiber 100Mbps', timeAgo: '6 menit yang lalu' }
];

export default function LiveSocialProof() {
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  
  // Gunakan ref untuk melacak timeout agar bisa dibersihkan
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const showTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Pilih index random pertama kali saat komponen dimount
    setCurrentIndex(Math.floor(Math.random() * socialProofData.length));
    
    // Jeda awal 8 detik sebelum popup pertama (biar tidak terlalu agresif)
    const initialTimer = setTimeout(() => {
      showNotification();
    }, 8000);

    return () => clearTimeout(initialTimer);
  }, []);

  const showNotification = () => {
    if (isDismissed) return; // Jika user sudah close, jangan munculkan lagi
    setIsVisible(true);

    // Notifikasi tampil selama 5 detik
    hideTimeoutRef.current = setTimeout(() => {
      setIsVisible(false);
      
      // Jeda acak (antara 25 - 45 detik) sebelum popup berikutnya (biar tidak annoying)
      const nextDelay = Math.floor(Math.random() * 20000) + 25000;
      showTimeoutRef.current = setTimeout(() => {
        if (isDismissed) return;
        
        setCurrentIndex((prev) => {
          let newIdx;
          do {
            newIdx = Math.floor(Math.random() * socialProofData.length);
          } while (newIdx === prev);
          return newIdx;
        });
        showNotification();
      }, nextDelay);
      
    }, 5000);
  };
  
  const handleClose = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsVisible(false);
    setIsDismissed(true); // Matikan selamanya jika user merasa terganggu
    if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    if (showTimeoutRef.current) clearTimeout(showTimeoutRef.current);
  };

  const currentData = currentIndex >= 0 ? socialProofData[currentIndex] : null;
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
          transform: isVisible && !isDismissed ? "translateY(0)" : "translateY(20px)",
          opacity: isVisible && !isDismissed ? 1 : 0,
          pointerEvents: isVisible && !isDismissed ? "auto" : "none",
          transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
          display: "flex",
          gap: "14px",
          alignItems: "flex-start",
        }}
      >
        <button 
          onClick={handleClose}
          style={{
            position: "absolute",
            top: "6px",
            right: "6px",
            background: "transparent",
            border: "none",
            color: "#94a3b8",
            cursor: "pointer",
            padding: "4px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "50%",
          }}
          aria-label="Tutup notifikasi"
        >
          <X size={14} />
        </button>
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
        <div style={{ paddingRight: "10px" }}>
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
