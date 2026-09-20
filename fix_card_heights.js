const fs = require('fs');

let css = fs.readFileSync('app/globals.css', 'utf8');

css = css.replace(
  /\.paket-card \{[\s\S]*?position: relative;\n\s*transition: box-shadow \.2s;\n\s*\}/,
  `.paket-card {
        background: var(--white); 
        border-radius: 20px;
        overflow: hidden; 
        box-shadow: 0 2px 12px rgba(0,0,0,.06);
        display: flex; 
        flex-direction: column;
        position: relative;
        transition: box-shadow .2s;
        height: 100%;
      }`
);

css = css.replace(
  /\.wireless-card \{[\s\S]*?transition: box-shadow \.2s, border-color \.2s;\n\s*\}/,
  `.wireless-card {
        background: var(--white);
        border: 1.5px solid var(--border);
        border-radius: 18px;
        padding: 24px;
        text-align: center;
        display: flex;
        flex-direction: column;
        align-items: center;
        transition: box-shadow .2s, border-color .2s;
        height: 100%;
      }`
);

fs.writeFileSync('app/globals.css', css);
console.log('Fixed CSS heights');
