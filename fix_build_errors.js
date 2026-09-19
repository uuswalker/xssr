const fs = require('fs');

// Fix globals.css
let css = fs.readFileSync('app/globals.css', 'utf8');
css = css.replace(/animation: shadow-pulse 3s infinite alternate;/g, 'box-shadow: 0 15px 35px rgba(3, 126, 100, 0.25);');
css = css.replace(/@keyframes shadow-pulse \{[\s\S]*?\}/g, '');
// Clean any leftover orphan braces at the very end
css = css.replace(/\}\s*\}\s*$/g, '}');
fs.writeFileSync('app/globals.css', css);

// Fix CekLokasi.tsx
let cek = fs.readFileSync('components/CekLokasi.tsx', 'utf8');
cek = cek.replace(/import \{ MessageCircle \} from "lucide-react";\n/g, '');
if (!cek.includes('MessageCircle, MapPin')) {
  cek = cek.replace('import { MapPin, Target, Search, ArrowRight, CheckCircle2 }', 'import { MessageCircle, MapPin, Target, Search, ArrowRight, CheckCircle2 }');
}
fs.writeFileSync('components/CekLokasi.tsx', cek);

// Fix Faq.tsx
let faq = fs.readFileSync('components/home/Faq.tsx', 'utf8');
faq = faq.replace(/import \{ MessageCircle \} from "lucide-react";\n/g, '');
faq = 'import { MessageCircle } from "lucide-react";\n' + faq;
fs.writeFileSync('components/home/Faq.tsx', faq);
