const fs = require('fs');

let code = fs.readFileSync('components/CekLokasi.tsx', 'utf8');

code = code.replace(
  /<label htmlFor="cl-nama"/,
  `<form 
    // @ts-ignore
    toolname="checkLocation" 
    // @ts-ignore
    tooldescription="Submit user location and contact details to register for WiFi installation"
    onSubmit={(e) => { e.preventDefault(); kirim(); }}
  >
  <label htmlFor="cl-nama"`
);

code = code.replace(
  /id="cl-nama"\s*className="cl-input"\s*placeholder="Nama kamu"\s*value=\{nama\}\s*onChange=\{\(e\) => setNama\(e\.target\.value\)\}\s*onKeyDown=\{[^}]+\}[^}]+\}[^}]+\}\s*\/>/g,
  `id="cl-nama"
   className="cl-input"
   placeholder="Nama kamu"
   value={nama}
   onChange={(e) => setNama(e.target.value)}
   // @ts-ignore
   toolparamdescription="Full name of the user"
  />`
);

code = code.replace(
  /id="cl-wa"\s*className="cl-input"\s*placeholder="0812xxxxxxx"\s*value=\{wa\}\s*onChange=\{\(e\) => setWa\(e\.target\.value\)\}\s*onKeyDown=\{[^}]+\}[^}]+\}[^}]+\}\s*\/>/g,
  `id="cl-wa"
   className="cl-input"
   placeholder="0812xxxxxxx"
   value={wa}
   onChange={(e) => setWa(e.target.value)}
   // @ts-ignore
   toolparamdescription="WhatsApp phone number of the user starting with 08"
  />`
);

code = code.replace(
  /<button\s*type="button"\s*className="cl-btn-primary"\s*disabled=\{sending\}\s*onClick=\{kirim\}\s*style=\{\{ marginTop: 12 \}\}\s*>/,
  `<button
    type="submit"
    className="cl-btn-primary"
    disabled={sending}
    style={{ marginTop: 12 }}
  >`
);

code = code.replace(
  /Ganti lokasi\s*<\/button>\s*<\/motion\.div>/,
  `Ganti lokasi\n                    </button>\n                  </form>\n                </motion.div>`
);

fs.writeFileSync('components/CekLokasi.tsx', code);
