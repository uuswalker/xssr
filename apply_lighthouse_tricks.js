const fs = require('fs');

// 1. Clean layout.tsx manual preloads
let layout = fs.readFileSync('app/layout.tsx', 'utf8');
layout = layout.replace(/<link\s*rel="preload"\s*as="image"\s*href="\/images\/promo-wifi-rumah-koneksi-pasti\.webp"[\s\S]*?fetchPriority="high"\s*\/>/g, '');
layout = layout.replace(/<link\s*rel="preload"\s*href="\/images\/promo-wifi-rumah-koneksi-pasti\.webp"[\s\S]*?fetchPriority="high"\s*\/>/g, '');
fs.writeFileSync('app/layout.tsx', layout);

// 2. Fix Hero.tsx priority
let hero = fs.readFileSync('components/home/Hero.tsx', 'utf8');
hero = hero.replace(/fetchPriority=\{s\.eager \? "high" : undefined\}\s*loading=\{s\.eager \? "eager" : "lazy"\}/g, 'priority={s.eager}');
fs.writeFileSync('components/home/Hero.tsx', hero);

// 3. Dynamic import in app/page.tsx
let page = fs.readFileSync('app/page.tsx', 'utf8');
if (!page.includes('dynamic(')) {
  page = page.replace('import PaketSection from "@/components/home/PaketSection";', 'import dynamic from "next/dynamic";\nconst PaketSection = dynamic(() => import("@/components/home/PaketSection"));');
  page = page.replace('import InfoSections from "@/components/home/InfoSections";', 'const InfoSections = dynamic(() => import("@/components/home/InfoSections"));');
  page = page.replace('import Faq from "@/components/home/Faq";', 'const Faq = dynamic(() => import("@/components/home/Faq"));');
  page = page.replace('import WaFloat from "@/components/WaFloat";', 'const WaFloat = dynamic(() => import("@/components/WaFloat"));');
  page = page.replace('import ScrollReveal from "@/components/animations/ScrollReveal";', 'const ScrollReveal = dynamic(() => import("@/components/animations/ScrollReveal"));');
}
fs.writeFileSync('app/page.tsx', page);
