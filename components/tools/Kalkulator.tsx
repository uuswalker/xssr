"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { gtag } from "@/lib/lead";

const NEED: Record<string, number> = { k4: 22, hd: 6, vc: 4, game: 8, browse: 3, smart: 0.5 };
const SMART_CAP = 10;
const TIERS = [20, 100, 250, 300, 400, 500, 1000];
const PAKET: Record<number, string> = {
  20: "Starter 20 Mbps",
  100: "100 Mbps",
  250: "Spark 250 Mbps",
  300: "Spark 300 Mbps",
  400: "Spark 400 Mbps",
  500: "Spark 500 Mbps",
  1000: "Spark 1000 Mbps",
};
const FIELDS = ["4k", "hd", "vc", "game", "browse", "smart"];
const LABELS: Record<string, string> = {
  "4k": "TV streaming 4K",
  hd: "TV/HP streaming HD",
  vc: "Video call / meeting",
  game: "Gaming online",
  browse: "Browsing / sosmed",
  smart: "Smart home / CCTV",
};
const COLORS: Record<string, string> = {
  "4k": "#7c3aed",
  hd: "#2563eb",
  vc: "#0891b2",
  game: "#db2777",
  browse: "#65a30d",
  smart: "#9ca3af",
};

interface CalcHasil {
  html: string;
  vals: Record<string, number>;
}

export default function Kalkulator() {
  const [vals, setVals] = useState<Record<string, number>>({
    "4k": 0,
    hd: 0,
    vc: 0,
    game: 0,
    browse: 0,
    smart: 0,
  });
  const [hasil, setHasil] = useState<CalcHasil | null>(null);
  const [shared, setShared] = useState(false);

  const num = (v: number) => (isNaN(v) || v < 0 ? 0 : Math.min(v, 50));

  function hitung(cur: Record<string, number>): CalcHasil {
    const parts = [
      { k: "4k", mbps: cur["4k"] * NEED.k4 },
      { k: "hd", mbps: cur.hd * NEED.hd },
      { k: "vc", mbps: cur.vc * NEED.vc },
      { k: "game", mbps: cur.game * NEED.game },
      { k: "browse", mbps: cur.browse * NEED.browse },
      { k: "smart", mbps: Math.min(cur.smart * NEED.smart, SMART_CAP) },
    ];
    const subtotal = parts.reduce((s, p) => s + p.mbps, 0);
    const total = Math.round(subtotal * 1.3);
    const tier = TIERS.find((t) => t >= total) || 1000;
    const maxPart = Math.max(...parts.map((p) => p.mbps), 1);
    const bars = parts
      .filter((p) => p.mbps > 0)
      .map((p) => {
        const w = Math.max(3, Math.round((p.mbps / maxPart) * 100));
        return (
          '<div style="display:flex; align-items:center; gap:8px; font-size:13px; margin-bottom:6px;">' +
          '<span style="width:110px; flex-shrink:0;">' +
          LABELS[p.k] +
          "</span>" +
          '<span style="flex:1; background:#eef2f7; border-radius:6px; overflow:hidden;"><span style="display:block; height:14px; width:' +
          w +
          "%; background:" +
          COLORS[p.k] +
          ';"></span></span>' +
          '<span style="width:64px; text-align:right; font-weight:700;">~' +
          Math.round(p.mbps * 10) / 10 +
          "</span></div>"
        );
      })
      .join("");
    const perangkat = cur["4k"] + cur.hd + cur.vc + cur.game + cur.browse;
    const wa =
      "https://wa.me/6287778999141?text=" +
      encodeURIComponent(
        `Halo kak, hasil kalkulator saya butuh ~${total} Mbps (${perangkat} perangkat aktif), paket apa yang pas?`
      );
    const html =
      bars +
      '<p style="margin:10px 0 4px;">Subtotal: <strong>~' +
      Math.round(subtotal) +
      " Mbps</strong> + buffer 30% = <strong>~" +
      total +
      " Mbps</strong> untuk " +
      perangkat +
      " perangkat aktif.</p>" +
      "<p>Paket yang pas: <strong>XL SATU " +
      PAKET[tier] +
      "</strong></p>" +
      '<a href="' +
      wa +
      '" target="_blank" rel="noopener noreferrer" style="display:inline-block; background:var(--green); color:#fff; padding:12px 24px; border-radius:8px; font-weight:700; text-decoration:none; margin-top:8px;">Tanya Paket Ini via WA</a>';
    return { html, vals: { ...cur } };
  }

  const jalankan = () => {
    const r = hitung(vals);
    setHasil(r);
    const total = Math.round(
      (r.vals["4k"] * NEED.k4 +
        r.vals.hd * NEED.hd +
        r.vals.vc * NEED.vc +
        r.vals.game * NEED.game +
        r.vals.browse * NEED.browse +
        Math.min(r.vals.smart * NEED.smart, SMART_CAP)) *
        1.3
    );
    gtag("event", "hitung_mbps", {
      hasil_mbps: total,
      perangkat_aktif:
        r.vals["4k"] + r.vals.hd + r.vals.vc + r.vals.game + r.vals.browse,
      page_path: window.location.pathname,
    });
  };

  const share = () => {
    const r = hitung(vals);
    setHasil(r);
    const q = FIELDS.map((f) => `${f}=${r.vals[f]}`).join("&");
    const url = `https://xlsatusolo.com/berapa-mbps-untuk-berapa-orang/#calc-${q}`;
    const doneFn = () => {
      setShared(true);
      gtag("event", "share_kalkulator", { page_path: window.location.pathname });
      setTimeout(() => setShared(false), 3000);
    };
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(url).then(doneFn).catch(() => prompt("Salin link ini:", url));
    } else {
      prompt("Salin link ini:", url);
    }
  };

  // Buka link hasil dari orang lain → isi otomatis + hitung langsung
  useEffect(() => {
    const h = (window.location.hash || "").replace("#calc-", "");
    if (!h || h.indexOf("=") < 0) return;
    const nv: Record<string, number> = { ...vals };
    let ada = false;
    h.split("&").forEach((pair) => {
      const kv = pair.split("=");
      if (FIELDS.includes(kv[0]) && !isNaN(parseInt(kv[1], 10))) {
        nv[kv[0]] = Math.max(0, parseInt(kv[1], 10));
        ada = true;
      }
    });
    if (ada) {
      setVals(nv);
      setHasil(hitung(nv));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const set = (f: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setVals((v) => ({ ...v, [f]: num(parseInt(e.target.value, 10)) }));

  return (
    <div
      className="info-box"
      id="kalkulator-mbps"
      style={{
        background: "#fff",
        border: "1px solid var(--border)",
        borderLeft: "4px solid var(--green)",
      }}
    >
      <strong style={{ display: "block", marginBottom: 8, fontSize: 16 }}>
        Kalkulator Kebutuhan Mbps Lanjutan
      </strong>
      <p style={{ fontSize: 14, marginBottom: 12 }}>
        Isi jumlah <strong>perangkat aktif bersamaan</strong> (jam tersibuk),
        bukan total perangkat di rumah:
      </p>
      <div style={{ display: "grid", gap: 10, fontSize: 14, marginBottom: 14 }}>
        {FIELDS.map((f) => (
          <label key={f}>
            {LABELS[f]}{" "}
            <input
              id={`calc-${f}`}
              type="number"
              min={0}
              max={50}
              value={vals[f]}
              onChange={set(f)}
              style={{
                width: 70,
                padding: "8px 10px",
                border: "1px solid #e5e7eb",
                borderRadius: 8,
                fontSize: 15,
                float: "right",
              }}
            />
          </label>
        ))}
      </div>
      <button
        type="button"
        onClick={jalankan}
        style={{
          width: "100%",
          background: "var(--green)",
          color: "#fff",
          border: "none",
          padding: 12,
          borderRadius: 8,
          fontSize: 15,
          fontWeight: 700,
          cursor: "pointer",
        }}
      >
        Hitung Kebutuhan
      </button>
      {hasil && (
        <div
          id="calc-hasil"
          style={{ marginTop: 14 }}
          dangerouslySetInnerHTML={{ __html: hasil.html }}
        />
      )}
      {hasil && (
        <button
          type="button"
          onClick={share}
          style={{
            width: "100%",
            background: "#fff",
            color: "var(--green-dark)",
            border: "1.5px solid var(--green)",
            padding: 10,
            borderRadius: 8,
            fontSize: 14,
            fontWeight: 700,
            cursor: "pointer",
            marginTop: 10,
          }}
        >
          {shared ? "Link Tersalin! Sebar ke keluarga/grup " : "Salin Link Hasil Ini"}
        </button>
      )}
    </div>
  );
}
