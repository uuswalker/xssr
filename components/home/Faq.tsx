"use client";

import { useState } from "react";
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

        {faqs.map((f, i) => (
          <div
            className={"faq-item" + (open === i ? ` ${activeClass}` : "")}
            onClick={() => setOpen(open === i ? null : i)}
            key={f.q}
          >
            <div className="faq-q">
              <span>{f.q}</span>
              <i className="fas fa-plus icon"></i>
            </div>
            <div
              className="faq-a"
              dangerouslySetInnerHTML={{ __html: f.a }}
            />
          </div>
        ))}

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
            <i className="fab fa-whatsapp"></i>
          </a>
        </div>
      </div>
    </section>
  );
}
