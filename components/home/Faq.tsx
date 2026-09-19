"use client";
import { MessageCircle , Plus , Minus } from "lucide-react";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { FaqItem } from "@/lib/seo";

export default function Faq({
  faqs,
  activeClass = "open",
  title = "Bantuan",
  sub = "Pertanyaan yang sering ditanyakan",
}: {
  faqs: FaqItem[];
  activeClass?: string;
  title?: string;
  sub?: string;
}) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="bantuan-section" id="bantuan">
      <div className="bantuan-inner">
        <h2 className="section-title">{title}</h2>
        <p className="section-sub">{sub}</p>

        {faqs.map((f, i) => {
          const isOpen = open === i;
          return (
            <div
              className={`faq-item ${isOpen ? activeClass : ""}`}
              onClick={() => setOpen(isOpen ? null : i)}
              key={f.q}
              style={{ overflow: "hidden", cursor: "pointer" }}
            >
              <div className="faq-q">
                <span>{f.q}</span>
                <motion.i
                  className="fas fa-plus icon"
                  animate={{ rotate: isOpen ? 45 : 0 }}
                  transition={{ duration: 0.2 }}
                />
              </div>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    style={{ overflow: "hidden" }}
                  >
                    <div
                      className="faq-a"
                      style={{ display: "block" }} // Ensure css doesn't hide it using display:none 
                      dangerouslySetInnerHTML={{ __html: f.a }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}

        <div
          style={{ marginTop: 20, fontSize: 13, color: "var(--text-muted)" }}
        >
          Lihat juga:{" "}
          <a
            href="/kebijakan-privasi/"
            style={{
              color: "var(--green)",
              fontWeight: 600,
              textDecoration: "underline",
            }}
          >
            Kebijakan Privasi &amp; Cookie
          </a>{" "}
          kami.
        </div>

        <div style={{ textAlign: "center", marginTop: 24 }}>
          <a
            href="https://wa.me/6287778999141?text=Halo%20kak%2C%20saya%20punya%20pertanyaan%20lainnya%20soal%20XL%20SATU%20di%20Solo%20Raya"
            target="_blank"
            rel="noopener noreferrer"
            className="more-btn"
          >
            Punya Pertanyaan Lainnya? Chat Sales{" "}
            <MessageCircle size={18} />
          </a>
        </div>
      </div>
    </section>
  );
}
