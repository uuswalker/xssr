"use client";

import { motion } from "framer-motion";
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
    <motion.a
      href={waLink(text)}
      target="_blank"
      rel="noopener noreferrer"
      className="float-wa"
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{
        duration: 0.6,
        ease: "easeOut",
      }}
      whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(20,122,69,0.3)" }}
    >
      <MessageCircle size={24} style={{ marginRight: 8 }} />
      <div className="float-wa-text">
        <small>{small}</small>
        <span>{PHONE_DISPLAY}</span>
      </div>
    </motion.a>
  );
}
