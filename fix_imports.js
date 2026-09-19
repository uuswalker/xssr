const fs = require('fs');

let solo = fs.readFileSync('app/wifi-solo/page.tsx', 'utf8');
if (!solo.includes('lucide-react')) {
  solo = 'import { MessageCircle, ArrowRight } from "lucide-react";\n' + solo;
}
fs.writeFileSync('app/wifi-solo/page.tsx', solo);

let kota = fs.readFileSync('components/kota/KotaSections.tsx', 'utf8');
if (!kota.includes('lucide-react')) {
  kota = 'import { Building2 } from "lucide-react";\n' + kota;
}
fs.writeFileSync('components/kota/KotaSections.tsx', kota);

