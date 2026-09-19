const fs = require('fs');

let code = fs.readFileSync('lib/coverage.ts', 'utf8');

// Replace coverageDetail logic
const newDetail = `export function coverageDetail(cv: CoverageResult): string {
    if (cv.status === "fiber") {
      let s = \`Titik fiber terdekat hanya sekitar \${cv.jarakM} m dari lokasimu. \`;
      if (cv.zona) s += \`Jaringan Wireless (Area Sukoharjo) juga tersedia di area ini. \`;
      return s;
    } else if (cv.status === "mungkin") {
      return \`Titik fiber terdekat sekitar \${cv.jarakM} m. Sales verifikasi + siapkan opsi wireless. \`;
    } else if (cv.status === "manual") {
      return "Di luar jangkauan data fiber kami. Sales cek manual / tawarkan wireless. ";
    } else if (cv.status === "wireless") {
      let s = cv.zona
        ? \`Masuk Area Sukoharjo — jaringan wireless tercover\${
            cv.jarakM != null ? \` (±\${cv.jarakM} m)\` : ""
          }, aktif cepat. \`
        : "Area ini jalur wireless (tanpa kabel) — aktif cepat. ";
      if (cv.fiberM) s += \`Fiber terdekat ±\${cv.fiberM} m — sales bisa cek opsi fiber dahulu. \`;
      return s;
    }
    return "Menghitung jarak ke titik fiber terdekat...";
  }`;

// Use regex to replace the function `export function coverageDetail...` until the end of the function block.
code = code.replace(/export function coverageDetail\([\s\S]*?return "Menghitung jarak ke titik fiber terdekat\.\.\.";\s*\}/, newDetail);

// Replace coverageLine logic
const newLine = `export function coverageLine(cv: CoverageResult | null): string {
    if (!cv || !cv.status || cv.status === "loading") return "";
    return (
      "Hasil cek coverage: " +
      cv.status.toUpperCase() +
      (cv.zona ? " (Area Sukoharjo)" : "") +
      (cv.jarakM != null ? " (sekitar " + cv.jarakM + " m)" : "") +
      "\\n"
    );
  }`;

code = code.replace(/export function coverageLine\([\s\S]*?return \([\s\S]*?\\n"\s*\);\s*\}/, newLine);

fs.writeFileSync('lib/coverage.ts', code);
