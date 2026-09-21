"use client";

import { MessageCircle } from "lucide-react";
import { PHONE_DISPLAY, waLink } from "@/lib/site";

export default function WaFloat({
  text = "Info XL SATU",
  small = "Tanya Dulu",
}: {
  text?: string;
  small?: string;
}) {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes slideUpWa {
          0% { transform: translateY(50px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        .float-wa-anim {
          animation: slideUpWa 0.6s ease-out forwards;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .float-wa-anim:hover {
          transform: scale(1.05);
          box-shadow: 0 10px 25px rgba(20,122,69,0.3);
        }
      ` }} />
      <a
        href={waLink(text)}
        target="_blank"
        rel="noopener noreferrer"
        className="float-wa float-wa-anim"
      >
        <MessageCircle size={24} style={{ marginRight: 8 }} />
        <div className="float-wa-text">
          <small>{small}</small>
          <span>{PHONE_DISPLAY}</span>
        </div>
      </a>
    </>
  );
}
