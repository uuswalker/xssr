"use client";
import { useState, useEffect } from "react";
import { X, Gift } from "lucide-react";

export default function SmartPromoPopup() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Hindari muncul berulang kali jika user sudah menutupnya di sesi ini
    if (sessionStorage.getItem("promo_closed")) return;

    let timeout: NodeJS.Timeout;
    let hasTriggered = false;
    
    const triggerPopup = () => {
      if (hasTriggered) return;
      hasTriggered = true;
      setShow(true);
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mouseleave", handleMouseLeave);
      clearTimeout(timeout);
    };

    const handleScroll = () => {
      // Muncul jika scroll sudah melewati 50% layar
      if (window.scrollY > window.innerHeight * 0.5) {
        triggerPopup();
      }
    };

    const handleMouseLeave = (e: MouseEvent) => {
      // Exit intent: kursor bergerak cepat ke atas (ke arah close tab/url bar)
      if (e.clientY <= 0) {
        triggerPopup();
      }
    };

    // Fallback: Muncul setelah 12 detik idle
    timeout = setTimeout(triggerPopup, 12000);
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mouseleave", handleMouseLeave);
      clearTimeout(timeout);
    };
  }, []);

  if (!show) return null;

  const handleClose = () => {
    setShow(false);
    sessionStorage.setItem("promo_closed", "true");
  };

  return (
    <div 
      className="promo-popup-overlay"
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 9999,
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        padding: "20px"
      }}
    >
      <div 
        className="promo-popup-card"
        style={{
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          border: "1px solid rgba(3, 126, 100, 0.15)",
          boxShadow: "0 20px 40px rgba(0,0,0,0.15), 0 0 0 1px rgba(255,255,255,0.5) inset",
          borderRadius: "24px",
          padding: "24px",
          width: "100%",
          maxWidth: "400px",
          pointerEvents: "auto",
          position: "relative",
          animation: "slideUpPromo 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        }}
      >
        <button 
          onClick={handleClose}
          style={{
            position: "absolute",
            top: "16px",
            right: "16px",
            background: "#f3f4f6",
            border: "none",
            borderRadius: "50%",
            width: "32px",
            height: "32px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: "#6b7280",
            transition: "background 0.2s"
          }}
          aria-label="Tutup promo"
          onMouseEnter={(e) => e.currentTarget.style.background = "#e5e7eb"}
          onMouseLeave={(e) => e.currentTarget.style.background = "#f3f4f6"}
        >
          <X size={18} />
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "16px" }}>
          <div style={{ background: "var(--green-light)", padding: "12px", borderRadius: "14px", color: "var(--green)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Gift size={24} strokeWidth={2.5} />
          </div>
          <div>
            <h3 style={{ margin: "0 0 4px 0", fontSize: "18px", fontWeight: "800", color: "var(--text)", lineHeight: 1.2 }}>Promo Terbatas!</h3>
            <div style={{ fontSize: "13px", color: "var(--green)", fontWeight: "700" }}>Khusus Area Solo Raya</div>
          </div>
        </div>

        <p style={{ margin: "0 0 20px 0", fontSize: "14px", color: "#4b5563", lineHeight: 1.5 }}>
          Hanya tersisa <strong>3 slot bebas biaya instalasi</strong> untuk minggu ini. Cek ketersediaan di lokasi Anda sekarang sebelum penuh.
        </p>

        <button 
          className="btn-cek-lokasi-trigger"
          onClick={handleClose}
          style={{
            width: "100%",
            background: "linear-gradient(135deg, var(--green) 0%, var(--green-dark) 100%)",
            color: "#fff",
            border: "none",
            borderRadius: "14px",
            padding: "16px",
            fontSize: "15px",
            fontWeight: "800",
            cursor: "pointer",
            boxShadow: "0 8px 20px rgba(3, 126, 100, 0.25)",
            transition: "transform 0.2s, box-shadow 0.2s",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = "0 12px 24px rgba(3, 126, 100, 0.35)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 8px 20px rgba(3, 126, 100, 0.25)";
          }}
        >
          Klaim & Cek Lokasi
        </button>
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes slideUpPromo {
          from { transform: translateY(120px) scale(0.95); opacity: 0; }
          to { transform: translateY(0) scale(1); opacity: 1; }
        }
      `}} />
    </div>
  );
}
