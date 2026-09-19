const fs = require('fs');

let header = fs.readFileSync('components/Header.tsx', 'utf8');

header = header.replace(/import\s*\{\s*motion\s*\}\s*from\s*"framer-motion";/g, '');
header = header.replace(/<motion\.header[^>]*>/, '<header role="banner" className="site-header">');
header = header.replace(/<\/motion\.header>/, '</header>');
header = header.replace(/<motion\.img\s+whileHover=\{\{\s*scale:\s*1\.05\s*\}\}\s+/, '<img className="hover-scale" ');
header = header.replace(/<motion\.a\s+whileHover=\{\{\s*y:\s*-2\s*\}\}\s+href=/g, '<a className="hover-lift" href=');
header = header.replace(/<motion\.a\s+whileHover=[^>]*whileTap=[^>]*href=/g, '<a className="btn-chat hover-glow" href=');
header = header.replace(/<\/motion\.a>/g, '</a>');
header = header.replace(/<motion\.button\s+whileHover=[^>]*whileTap=[^>]*onClick=/g, '<button className="btn-chat hover-glow" onClick=');
header = header.replace(/<\/motion\.button>/g, '</button>');

fs.writeFileSync('components/Header.tsx', header);

let css = fs.readFileSync('app/globals.css', 'utf8');
if (!css.includes('.hover-scale')) {
  css += `
    .site-header { position: sticky; top: 0; z-index: 50; }
    .hover-scale { transition: transform 0.2s ease; }
    .hover-scale:hover { transform: scale(1.05); }
    .hover-lift { transition: transform 0.2s ease; }
    .hover-lift:hover { transform: translateY(-2px); }
    .hover-glow { transition: all 0.2s ease; }
    .hover-glow:hover { transform: scale(1.05); box-shadow: 0px 5px 15px rgba(5,169,134,0.4); }
    .hover-glow:active { transform: scale(0.95); }
  `;
  fs.writeFileSync('app/globals.css', css);
}

