"use client";

import { MessageCircle, MapPin } from "lucide-react";
import { waLink } from "@/lib/site";
import { useEffect, useState } from "react";

export default function StickyMobileBar() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="sticky-mobile-bar" role="region" aria-label="Aksi Cepat Mobile">
      <button 
        type="button" 
        className="btn-cek-lokasi-trigger smb-btn smb-btn-primary"
        aria-label="Cek Lokasi Jangkauan Fiber"
      >
        <MapPin size={18} style={{ flexShrink: 0 }} /> Cek Lokasi
      </button>
      
      <a 
        href={waLink("Halo Sales XL Home Solo, mau tanya promo pasang baru WiFi (Gratis Pasang Rp 0). Mohon info paket terbaik:")} 
        target="_blank" 
        rel="noopener noreferrer"
        className="smb-btn smb-btn-wa"
        aria-label="Tanya Dulu via WhatsApp Sales XL Home Solo"
      >
        <MessageCircle size={18} style={{ flexShrink: 0 }} /> Tanya Dulu
      </a>
    </div>
  );
}
