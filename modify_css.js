const fs = require('fs');

let css = fs.readFileSync('app/globals.css', 'utf8');

const bentoStyles = `
    /* ── BENTO GRID ── */
    .bento-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 20px;
      margin-top: 32px;
    }
    .bento-card {
      background: var(--white);
      border-radius: 16px;
      padding: 24px;
      border: 1px solid rgba(0,0,0,0.04);
      box-shadow: 0 4px 20px rgba(0,0,0,0.02);
      transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
      display: flex;
      flex-direction: column;
    }
    .bento-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 12px 30px rgba(0,0,0,0.08);
    }
    /* Asymmetrical span logic */
    .bento-card:nth-child(1) { grid-column: span 2; grid-row: span 2; }
    .bento-card:nth-child(2) { grid-column: span 2; grid-row: span 1; }
    .bento-card:nth-child(3) { grid-column: span 1; grid-row: span 1; }
    .bento-card:nth-child(4) { grid-column: span 1; grid-row: span 1; }
    @media (max-width: 992px) {
      .bento-grid { grid-template-columns: repeat(2, 1fr); }
      .bento-card:nth-child(1) { grid-column: span 2; }
      .bento-card:nth-child(2) { grid-column: span 2; }
      .bento-card:nth-child(3) { grid-column: span 1; }
      .bento-card:nth-child(4) { grid-column: span 1; }
    }
    @media (max-width: 600px) {
      .bento-grid { grid-template-columns: 1fr; }
      .bento-card:nth-child(1), .bento-card:nth-child(2), .bento-card:nth-child(3), .bento-card:nth-child(4) { grid-column: span 1; grid-row: span 1; }
    }
`;

if (!css.includes('.bento-grid')) {
  css = css + bentoStyles;
}

// Add Glow Effect to Paket Laris
const glowStyles = `
    .paket-card.best-seller {
      position: relative;
      border: 2px solid var(--green);
    }
    .paket-card.best-seller::before {
      content: "";
      position: absolute;
      top: -2px; left: -2px; right: -2px; bottom: -2px;
      border-radius: inherit;
      background: linear-gradient(45deg, #037e64, #1a8ac0, #037e64);
      z-index: -1;
      animation: glowing 3s ease-in-out infinite alternate;
      opacity: 0.6;
      filter: blur(8px);
    }
    @keyframes glowing {
      0% { filter: blur(6px); opacity: 0.5; }
      100% { filter: blur(12px); opacity: 0.8; }
    }
`;

if (!css.includes('paket-card.best-seller')) {
  css = css + glowStyles;
}

fs.writeFileSync('app/globals.css', css);
