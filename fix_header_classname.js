const fs = require('fs');

let header = fs.readFileSync('components/Header.tsx', 'utf8');

header = header.replace(/<a className="btn-chat hover-glow" href=\{ctaHref\}\s*target="_blank"\s*rel="noopener noreferrer"\s*className="btn-wa-header"/, '<a className="btn-chat hover-glow btn-wa-header" href={ctaHref}\n            target="_blank"\n            rel="noopener noreferrer"');

fs.writeFileSync('components/Header.tsx', header);
