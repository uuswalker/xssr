const fs = require('fs');

let css = fs.readFileSync('app/globals.css', 'utf8');

const badGlowRegex = /\.paket-card\.best-seller\s*\{[\s\S]*?@keyframes glowing\s*\{[\s\S]*?\}/;

const proHighlight = `.paket-card.best-seller {
      position: relative;
      border: 2px solid var(--green);
      transform: scale(1.03);
      z-index: 2;
      animation: shadow-pulse 3s infinite alternate;
    }
    @keyframes shadow-pulse {
      0% { box-shadow: 0 10px 20px rgba(3, 126, 100, 0.1); }
      100% { box-shadow: 0 15px 35px rgba(3, 126, 100, 0.3); }
    }
    @media (max-width: 768px) {
      .paket-card.best-seller { transform: scale(1); }
    }`;

css = css.replace(badGlowRegex, proHighlight);

fs.writeFileSync('app/globals.css', css);
