const fs = require('fs');

let hero = fs.readFileSync('components/home/Hero.tsx', 'utf8');

hero = hero.replace(/style=\{\{\s*width:\s*"100%",\s*height:\s*"auto",\s*objectFit:\s*"cover"\s*\}\}/g, '');

// Clean up any double spaces or empty lines caused by the removal
hero = hero.replace(/\s+\/>/g, ' />');

fs.writeFileSync('components/home/Hero.tsx', hero);
