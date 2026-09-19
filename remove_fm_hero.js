const fs = require('fs');

let hero = fs.readFileSync('components/home/Hero.tsx', 'utf8');

hero = hero.replace(/import\s*\{\s*motion\s*,\s*useScroll\s*,\s*useTransform\s*\}\s*from\s*"framer-motion";/g, '');
hero = hero.replace(/\s*const\s*\{\s*scrollY\s*\}\s*=\s*useScroll\(\);/g, '');
hero = hero.replace(/\s*const\s*y\s*=\s*useTransform\(scrollY,\s*\[0,\s*800\],\s*\[0,\s*250\]\);/g, '');

fs.writeFileSync('components/home/Hero.tsx', hero);
