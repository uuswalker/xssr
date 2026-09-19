const fs = require('fs');

let content = fs.readFileSync('components/kota/KotaSections.tsx', 'utf8');

const targetStr = `
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
      </div>
    </section>
  );
}`;

const replacementStr = `
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
        
        {/* Anti-RT/RW Net / Competitive Advantage Copy */}
        <div
          style={{
            background: "#fff4f4",
            border: "1px solid #ffe1e1",
            borderRadius: 16,
            padding: "24px 28px",
            textAlign: "left",
            marginTop: 20
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
}`;

content = content.replace(targetStr, replacementStr);
fs.writeFileSync('components/kota/KotaSections.tsx', content);
