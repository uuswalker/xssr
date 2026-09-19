const fs = require('fs');

let hero = fs.readFileSync('components/home/Hero.tsx', 'utf8');
if (!hero.includes('CheckCircle2')) {
  hero = hero.replace('import { MapPin } from "lucide-react";', 'import { MapPin, CheckCircle2 } from "lucide-react";');
}
hero = hero.replace(/<i\s*className="fas fa-check-circle"\s*style=\{\{\s*color: "var\(--green\)",\s*marginRight: 6\s*\}\}\s*><\/i>/g, '<CheckCircle2 size={16} color="var(--green)" style={{ marginRight: 6 }} />');

fs.writeFileSync('components/home/Hero.tsx', hero);
