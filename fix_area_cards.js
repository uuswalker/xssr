const fs = require('fs');

// Fix globals.css
let css = fs.readFileSync('app/globals.css', 'utf8');
css = css.replace(
  /\.area-card i \{[\s\S]*?display: block;\n\s*\}/,
  `.area-card i, .area-card svg {\n        margin: 0 auto 12px;\n        display: block;\n      }`
);
fs.writeFileSync('app/globals.css', css);

// Fix InfoSections.tsx
let info = fs.readFileSync('components/home/InfoSections.tsx', 'utf8');
info = info.replace(
  /<div\s*className="area-card"\s*style=\{\{ background: "var\(--green\)", borderColor: "var\(--green\)" \}\}\s*>[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/,
  `<a
                className="area-card"
                style={{ background: "var(--green)", borderColor: "var(--green)", textDecoration: "none" }}
                href="https://wa.me/6287778999141?text=Halo,%20saya%20mau%20cek%20apakah%20area%20saya%20tersedia%20XL%20SATU"
                target="_blank"
                rel="noopener noreferrer"
              >
                <HelpCircle size={24} color="#fff" />
                <div className="area-name" style={{ color: "#fff" }}>
                  Area Lain?
                </div>
                <div
                  className="area-desc"
                  style={{ color: "rgba(255,255,255,.85)", fontWeight: 700 }}
                >
                  Tanya Dulu
                </div>
              </a>`
);
info = info.replace(/<Building2 size=\{20\} color="var\(--green\)" \/>/g, `<Building2 size={24} color="var(--green)" />`);
fs.writeFileSync('components/home/InfoSections.tsx', info);

// Fix KotaSections.tsx
let kota = fs.readFileSync('components/kota/KotaSections.tsx', 'utf8');
kota = kota.replace(
  /<div\s*className="area-card"\s*style=\{\{\s*background: "var\(--green\)",\s*borderColor: "var\(--green\)",\s*\}\}\s*>[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/,
  `<a
              className="area-card"
              style={{
                background: "var(--green)",
                borderColor: "var(--green)",
                textDecoration: "none"
              }}
              href="https://wa.me/6287778999141?text=Halo,%20saya%20mau%20cek%20apakah%20area%20saya%20tersedia%20XL%20SATU"
              target="_blank"
              rel="noopener noreferrer"
            >
              <HelpCircle size={24} color="#fff" />
              <div className="area-name" style={{ color: "#fff" }}>
                Area Lain?
              </div>
              <div
                className="area-desc"
                style={{ color: "rgba(255,255,255,.85)", fontWeight: 700 }}
              >
                Tanya Dulu
              </div>
            </a>`
);
fs.writeFileSync('components/kota/KotaSections.tsx', kota);

console.log('Fixed area cards alignment and UX');
