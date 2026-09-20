"use client";

import { MessageCircle, MapPin } from "lucide-react";
import { waLink } from "@/lib/site";
import { useEffect, useState } from "react";

export default function StickyMobileBar() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show after scrolling a little bit
    const handleScroll = () => {
      if (window.scrollY > 200) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="sticky-mobile-bar">
      <button 
        type="button" 
        className="btn-cek-lokasi-trigger smb-btn smb-btn-primary"
      >
        <MapPin size={18} style={{ flexShrink: 0 }} /> Cek Lokasi
      </button>
      
      <a 
        href={waLink("Halo kak, saya mau tanya XL SATU.")} 
        target="_blank" 
        rel="noopener noreferrer"
        className="smb-btn smb-btn-wa"
      >
        <MessageCircle size={18} style={{ flexShrink: 0 }} /> Chat WA
      </a>
    </div>
  );
}
