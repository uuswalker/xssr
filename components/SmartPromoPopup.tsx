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
        justifyContent: "center", // Center on mobile
        padding: "16px"
      }}
    >
      <div 
        className="promo-popup-card"
        style={{
          background: "var(--white, #ffffff)",
          border: "1px solid #e5e7eb",
          boxShadow: "0 20px 40px -15px rgba(0,0,0,0.15)",
          borderRadius: "16px",
          padding: "16px",
          width: "100%",
          maxWidth: "380px",
          pointerEvents: "auto",
          position: "relative",
          animation: "slideUpMinimal 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards",
          overflow: "hidden",
          display: "flex",
          gap: "16px",
          alignItems: "flex-start"
        }}
      >
        <div style={{ background: "var(--green-light, #e6f7f3)", color: "var(--green, #037e64)", borderRadius: "999px", padding: "10px", flexShrink: 0, marginTop: "2px" }}>
          <Gift size={20} />
        </div>
        
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "4px" }}>
            <h3 style={{ margin: 0, fontSize: "15px", fontWeight: "700", color: "#111827" }}>Promo XL SATU</h3>
            <button 
              onClick={handleClose}
              style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
                color: "#9ca3af",
                padding: "2px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "color 0.2s"
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = "#4b5563"}
              onMouseLeave={(e) => e.currentTarget.style.color = "#9ca3af"}
              aria-label="Tutup promo"
            >
              <X size={16} />
            </button>
          </div>
          
          <p style={{ margin: "0 0 12px 0", fontSize: "13px", color: "#6b7280", lineHeight: 1.5 }}>
            Bayar satu, dapat internet super ngebut & kuota HP lebih luas. Promo bebas biaya pasang terbatas.
          </p>
          
          <div style={{ display: "flex", gap: "8px" }}>
            <button 
              className="btn-cek-lokasi-trigger"
              onClick={handleClose}
              style={{
                flex: 1,
                background: "var(--green, #037e64)",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                padding: "10px 12px",
                fontSize: "13px",
                fontWeight: "600",
                cursor: "pointer",
                transition: "background 0.2s"
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = "var(--green-dark, #026b55)"}
              onMouseLeave={(e) => e.currentTarget.style.background = "var(--green, #037e64)"}
            >
              Klaim Promo
            </button>
            <button 
              onClick={handleClose}
              style={{
                flex: 1,
                background: "#f3f4f6",
                color: "#4b5563",
                border: "none",
                borderRadius: "8px",
                padding: "10px 12px",
                fontSize: "13px",
                fontWeight: "600",
                cursor: "pointer",
                transition: "background 0.2s"
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = "#e5e7eb"}
              onMouseLeave={(e) => e.currentTarget.style.background = "#f3f4f6"}
            >
              Nanti Saja
            </button>
          </div>
        </div>
        
        {/* Progress bar indicator */}
        <div style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          height: "4px",
          background: "var(--green, #037e64)",
          width: "30%",
          borderBottomLeftRadius: "16px"
        }}></div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes slideUpMinimal {
          from { transform: translateY(40px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        
        @media (min-width: 768px) {
          .promo-popup-overlay {
            justify-content: flex-end !important;
            padding: 24px !important;
          }
        }
      `}} />
    </div>
  );
}
