const fs = require('fs');
let content = fs.readFileSync('components/kota/KotaSections.tsx', 'utf8');

// Find where KecamatanBlock starts
const startIdx = content.indexOf('export function KecamatanBlock');
if (startIdx === -1) throw new Error("Could not find KecamatanBlock");

// Replace everything from startIdx to the end of the file with the new function
const before = content.slice(0, startIdx);

const newKecamatanBlock = `export function KecamatanBlock({ city }: { city: City }) {
  const cekUrl = \`https://wa.me/6287778999141?text=\${waEncode(
    city.wa_widget_text as string
  )}\`;
  return (
    <section className="area-section" style={{ paddingTop: 0 }}>
      <div className="area-inner">
        <div
          style={{
            background: "#f7faf9",
            border: "1px solid #e3ece9",
            borderRadius: 16,
            padding: "24px 28px",
            textAlign: "left",
            marginBottom: 20
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: 15,
              lineHeight: 1.7,
              color: "#3a4a45",
            }}
          >
            <MapPin size={18} />
            Kami melayani pemasangan XL SATU di {city.h1_kota as string},
            termasuk kecamatan{" "}
            {kecamatanText(city.kecamatan_list as string[])}. Belum yakin area
            kamu sudah terjangkau?{" "}
            <a
              href={cekUrl}
              style={{
                color: "var(--green)",
                fontWeight: 600,
                textDecoration: "underline",
              }}
            >
              Cek langsung ke sales kami
            </a>{" "}
            untuk kepastian jaringan di alamat spesifik Anda.
          </p>
        </div>

        <div
          style={{
            background: "#fff4f4",
            border: "1px solid #ffe1e1",
            borderRadius: 16,
            padding: "24px 28px",
            textAlign: "left",
          }}
        >
          <h3 style={{ margin: "0 0 10px 0", fontSize: 18, color: "#d32f2f", display: "flex", alignItems: "center", gap: "8px" }}>
            <CheckCircle2 size={20} />
            Kualitas Fiber Nasional vs Provider Lokal (RT/RW Net)
          </h3>
          <p style={{ margin: 0, fontSize: 15, lineHeight: 1.7, color: "#5c3a3a" }}>
            Sedang mempertimbangkan provider lokal atau RT/RW Net di {city.h1_kota as string}? 
            Pastikan Anda memilih koneksi yang tepat. XL SATU menggunakan <strong>Koneksi Fiber Optik Murni</strong> berstandar Nasional dari XL Axiata. 
            Berbeda dengan WiFi tembakan (sinyal radio) yang sering putus dan lemot saat cuaca buruk atau hujan deras, koneksi fiber optik kami kebal cuaca dan dijamin SLA-nya. Jangan korbankan pekerjaan dan hiburan keluarga demi selisih harga yang sedikit!
          </p>
        </div>
      </div>
    </section>
  );
}
`;

fs.writeFileSync('components/kota/KotaSections.tsx', before + newKecamatanBlock);
console.log("Patched KotaSections.tsx successfully");
