const fs = require('fs');

let page = fs.readFileSync('app/page.tsx', 'utf8');

// Remove ScrollReveal around Hero
page = page.replace(/<ScrollReveal delay=\{0\.1\}>\s*<Hero \/>\s*<\/ScrollReveal>/, '<Hero />');

fs.writeFileSync('app/page.tsx', page);

