"use client";

import { useCallback, useEffect, useState } from "react";
import { gtag } from "@/lib/lead";

interface Opt {
  t: string;
  f: number;
  w: number;
  note?: string;
}
interface Q {
  q: string;
  opts: Opt[];
}

const QS: Q[] = [
  {
    q: "1. Apakah area rumahmu sudah terjangkau kabel fiber optik XL SATU?",
    opts: [
      { t: "Sudah, ada tiang/kabel fiber di dekat rumah", f: 2, w: 0 },
      {
        t: "Belum tahu - perlu dicek dulu",
        f: 0,
        w: 0,
        note:
          'Belum tahu? <a href="https://wa.me/6287778999141?text=Halo%20kak,%20tolong%20cek%20apakah%20alamat%20saya%20sudah%20tercover%20fiber" target="_blank" rel="noopener noreferrer">Minta sales cek coverage gratis di sini</a>.',
      },
      { t: "Belum - daerahku belum ada kabel fiber", f: 0, w: 2 },
    ],
  },
  {
    q: "2. Berapa orang internetan bareng di jam tersibuk?",
    opts: [
      { t: "1-2 orang", f: 0, w: 1 },
      { t: "3-5 orang", f: 1, w: 0 },
      { t: "6 orang atau lebih", f: 2, w: 0 },
    ],
  },
  {
    q: "3. Apa aktivitas internet terberat di rumahmu?",
    opts: [
      { t: "Ringan: browsing, sosmed, streaming sesekali", f: 0, w: 2 },
      { t: "Sedang: streaming HD tiap hari + video call WFH", f: 1, w: 1 },
      { t: "Berat: 4K multi-layar, gaming kompetitif, upload besar", f: 2, w: 0 },
    ],
  },
  {
    q: "4. Budget internet per bulan?",
    opts: [
      { t: "Di bawah Rp200 ribu", f: 0, w: 2 },
      { t: "Rp200-350 ribu", f: 1, w: 1 },
      { t: "Di atas Rp350 ribu / fleksibel", f: 2, w: 0 },
    ],
  },
  {
    q: "5. Butuh internet aktif secepat apa?",
    opts: [
      { t: "Mendesak - maunya cepat tanpa tarik kabel", f: 0, w: 2 },
      { t: "Bisa menunggu proses survei + instalasi", f: 1, w: 0 },
    ],
  },
];

const BTN_OPT: React.CSSProperties = {
  textAlign: "left",
  background: "#f6f8fa",
  border: "1.5px solid #e2e8f0",
  padding: "12px 14px",
  borderRadius: 8,
  fontSize: 14,
  fontWeight: 600,
  cursor: "pointer",
  color: "#1a1a1a",
};

export default function Kuis() {
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [score, setScore] = useState({ F: 0, W: 0 });
  const [done, setDone] = useState(false);
  const [shared, setShared] = useState(false);

  useEffect(() => {
    gtag("event", "quiz_start", {
      quiz: "fiber_vs_wireless",
      page_path: window.location.pathname,
    });
    // Buka link hasil dari orang lain → lompat ke hasil
    const h = (window.location.hash || "").replace("#kuis-", "");
    if (/^[012]{5}$/.test(h)) {
      const a = h.split("").map(Number);
      let F = 0,
        W = 0;
      a.forEach((v, qi) => {
        F += QS[qi].opts[v].f;
        W += QS[qi].opts[v].w;
      });
      setAnswers(a);
      setScore({ F, W });
      setIdx(QS.length);
      setDone(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const jawab = useCallback(
    (i: number) => {
      const o = QS[idx].opts[i];
      const na = [...answers];
      na[idx] = i;
      setAnswers(na);
      setScore((s) => ({ F: s.F + o.f, W: s.W + o.w }));
      gtag("event", "quiz_answer", {
        quiz: "fiber_vs_wireless",
        q: idx + 1,
        a: i,
        page_path: window.location.pathname,
      });
      if (idx + 1 < QS.length) setIdx(idx + 1);
      else setDone(true);
      if (idx + 1 >= QS.length) {
        const type =
          score.F + o.f > score.W + o.w
            ? "fiber"
            : score.W + o.w > score.F + o.f
              ? "wireless"
              : "seri";
        gtag("event", "quiz_result", {
          quiz: "fiber_vs_wireless",
          result: type,
          page_path: window.location.pathname,
        });
      }
    },
    [idx, answers, score]
  );

  const kembali = useCallback(() => {
    if (idx <= 0) return;
    const o = QS[idx - 1].opts[answers[idx - 1]];
    setScore((s) => ({ F: s.F - o.f, W: s.W - o.w }));
    setIdx(idx - 1);
    setDone(false);
  }, [idx, answers]);

  const ulangi = useCallback(() => {
    setIdx(0);
    setAnswers([]);
    setScore({ F: 0, W: 0 });
    setDone(false);
  }, []);

  const share = useCallback(() => {
    const url = `https://xlsatusolo.com/panduan-fiber-vs-wireless/#kuis-${answers.join("")}`;
    const doneFn = () => {
      setShared(true);
      gtag("event", "quiz_share", {
        quiz: "fiber_vs_wireless",
        page_path: window.location.pathname,
      });
      setTimeout(() => setShared(false), 3000);
    };
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(url).then(doneFn).catch(() => prompt("Salin link ini:", url));
    } else {
      prompt("Salin link ini:", url);
    }
  }, [answers]);

  const type =
    score.F > score.W ? "fiber" : score.W > score.F ? "wireless" : "seri";

  return (
    <div
      id="kuis-fw"
      style={{
        background: "#fff",
        border: "1px solid #e5e7eb",
        borderLeft: "4px solid #037e64",
        borderRadius: 8,
        padding: "20px 24px",
        margin: "24px 0",
      }}
    >
      <strong style={{ display: "block", marginBottom: 4, fontSize: 16 }}>
        Kuis 1 Menit: Fiber atau Wireless untuk Rumahmu?
      </strong>
      <p style={{ fontSize: 14, marginBottom: 12, color: "#555" }}>
        Jawab 5 pertanyaan, dapat rekomendasi + tombol chat sales.
      </p>
      <div
        style={{
          background: "#eef2f7",
          borderRadius: 999,
          height: 8,
          marginBottom: 14,
          overflow: "hidden",
        }}
      >
        <div
          id="kuis-bar"
          style={{
            height: "100%",
            width: `${done ? 100 : Math.round((idx / QS.length) * 100)}%`,
            background: "var(--green, #037e64)",
            borderRadius: 999,
            transition: "width .3s",
          }}
        ></div>
      </div>
      <div
        id="kuis-step"
        style={{ fontSize: 13, fontWeight: 700, color: "#666", marginBottom: 10 }}
      >
        {done ? "Hasil" : `Pertanyaan ${idx + 1} dari ${QS.length}`}
      </div>
      {!done ? (
        <>
          <div
            id="kuis-q"
            style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}
          >
            {QS[idx].q}
          </div>
          <div id="kuis-opts" style={{ display: "grid", gap: 8 }}>
            {QS[idx].opts.map((o, i) => (
              <button key={i} type="button" style={BTN_OPT} onClick={() => jawab(i)}>
                {o.t}
              </button>
            ))}
          </div>
        </>
      ) : (
        <div id="kuis-hasil">
          {type === "fiber" && (
            <>
              <p style={{ fontSize: 15 }}>
                <strong>🏆 Hasil: Fiber Optic XL SATU cocok untukmu.</strong>
              </p>
              <p style={{ fontSize: 14 }}>
                Koneksi kabel paling stabil, latensi rendah untuk gaming &amp;
                video call, kecepatan hingga 1000 Mbps. Mulai Rp185rb/bln
                (Starter 20).
              </p>
              <a
                href={`https://wa.me/6287778999141?text=${encodeURIComponent("Halo kak, hasil kuisku: FIBER. Tolong info paket + cek coverage di alamat saya")}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-block",
                  background: "var(--green, #037e64)",
                  color: "#fff",
                  padding: "12px 24px",
                  borderRadius: 8,
                  fontWeight: 700,
                  textDecoration: "none",
                  margin: "8px 8px 0 0",
                }}
              >
                Chat Sales: Paket Fiber
              </a>
              <a
                href="/biaya-pasang-wifi-solo-raya/"
                style={{
                  display: "inline-block",
                  padding: "12px 0",
                  fontWeight: 700,
                  fontSize: 14,
                }}
              >
                Lihat harga paket →
              </a>
            </>
          )}
          {type === "wireless" && (
            <>
              <p style={{ fontSize: 15 }}>
                <strong>🏆 Hasil: Wireless XL SATU cocok untukmu.</strong>
              </p>
              <p style={{ fontSize: 14 }}>
                Tanpa tarik kabel — aktif cepat, solusi area belum fiber, hemat
                mulai ±Rp162rb/bln (program bayar di muka). Cocok untuk
                pemakaian ringan-sedang.
              </p>
              <a
                href={`https://wa.me/6287778999141?text=${encodeURIComponent("Halo kak, hasil kuisku: WIRELESS. Tolong info program wireless + cek sinyal di alamat saya")}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-block",
                  background: "var(--green, #037e64)",
                  color: "#fff",
                  padding: "12px 24px",
                  borderRadius: 8,
                  fontWeight: 700,
                  textDecoration: "none",
                  margin: "8px 8px 0 0",
                }}
              >
                Chat Sales: Wireless
              </a>
              <a
                href="/solusi-internet-daerah-belum-ada-fiber-optik/"
                style={{
                  display: "inline-block",
                  padding: "12px 0",
                  fontWeight: 700,
                  fontSize: 14,
                }}
              >
                Pelajari wireless →
              </a>
            </>
          )}
          {type === "seri" && (
            <>
              <p style={{ fontSize: 15 }}>
                <strong>
                  🏆 Hasil: Seimbang — konsultasi dulu yang paling pas.
                </strong>
              </p>
              <p style={{ fontSize: 14 }}>
                Jawabanmu cocok untuk keduanya. Faktor penentu akhir: hasil cek
                coverage + budget. Ceritakan alamatmu, sales bantu putuskan.
              </p>
              <a
                href={`https://wa.me/6287778999141?text=${encodeURIComponent("Halo kak, hasil kuisku SERI (fiber vs wireless). Tolong bantu pilihkan + cek coverage")}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-block",
                  background: "var(--green, #037e64)",
                  color: "#fff",
                  padding: "12px 24px",
                  borderRadius: 8,
                  fontWeight: 700,
                  textDecoration: "none",
                  marginTop: 8,
                }}
              >
                Konsultasi Gratis via WA
              </a>
            </>
          )}
          {answers[0] === 1 && QS[0].opts[1].note && (
            <p
              style={{ fontSize: 13, marginTop: 10 }}
              dangerouslySetInnerHTML={{ __html: QS[0].opts[1].note! }}
            />
          )}
        </div>
      )}
      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        {!done && idx > 0 && (
          <button type="button" onClick={kembali} style={BTN_BACK}>
            ← Kembali
          </button>
        )}
        {done && (
          <>
            <button type="button" onClick={share} style={BTN_BACK}>
              {shared ? "Link Tersalin! Sebar yuk 🎉" : "Bagikan Hasilku"}
            </button>
            <button type="button" onClick={ulangi} style={BTN_BACK}>
              Ulangi Kuis
            </button>
          </>
        )}
      </div>
    </div>
  );
}

const BTN_BACK: React.CSSProperties = {
  flex: 1,
  background: "#f3f4f6",
  color: "#444",
  border: "none",
  padding: "10px 16px",
  borderRadius: 8,
  fontSize: 14,
  fontWeight: 700,
  cursor: "pointer",
};
