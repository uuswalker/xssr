"use client";

import { useEffect } from "react";

// Filter kelurahan — port 1:1 script area-layanan xssr@ec66035.
export default function AreaSearch() {
  useEffect(() => {
    const input = document.getElementById("kel-search") as HTMLInputElement | null;
    const count = document.getElementById("kel-count");
    if (!input) return;
    const groups = Array.from(document.querySelectorAll(".kel-group"));
    const details = Array.from(
      document.querySelectorAll(".kel-details")
    ) as HTMLDetailsElement[];
    const total = document.querySelectorAll(".kel-group span").length;
    function terapkan() {
      const q = input!.value.trim().toLowerCase();
      let cocok = 0;
      groups.forEach((g) => {
        let adaCocok = false;
        g.querySelectorAll("span").forEach((s) => {
          const hit = !q || (s.textContent || "").toLowerCase().indexOf(q) !== -1;
          (s as HTMLElement).style.display = hit ? "" : "none";
          if (hit) {
            adaCocok = true;
            cocok++;
          }
        });
        (g as HTMLElement).style.display = adaCocok ? "" : "none";
      });
      details.forEach((d) => {
        if (q) d.open = true;
      });
      if (count)
        count.textContent = q
          ? cocok > 0
            ? cocok + " dari " + total + " kelurahan cocok."
            : "Tidak ada kelurahan yang cocok - coba kata lain atau chat sales."
          : "";
    }
    input.addEventListener("input", terapkan);
    return () => input.removeEventListener("input", terapkan);
  }, []);
  return null;
}
