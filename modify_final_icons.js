const fs = require('fs');

// CekLokasi.tsx
let cek = fs.readFileSync('components/CekLokasi.tsx', 'utf8');
if (!cek.includes('lucide-react')) {
  cek = cek.replace('import { motion, AnimatePresence } from "framer-motion";', 'import { motion, AnimatePresence } from "framer-motion";\nimport { MapPin, Target, Search, ArrowRight, CheckCircle2 } from "lucide-react";');
} else {
  // If MessageCircle was already added
  cek = cek.replace('import { MessageCircle } from "lucide-react";', 'import { MessageCircle, MapPin, Target, Search, ArrowRight, CheckCircle2 } from "lucide-react";');
}
cek = cek.replace(/<i className="fas fa-location-crosshairs" style=\{\{ fontSize: 18, flexShrink: 0 \}\}\><\/i>/g, '<Target size={18} style={{ flexShrink: 0 }} />');
cek = cek.replace(/<i className="fas fa-location-crosshairs"><\/i>/g, '<Target size={18} />');
cek = cek.replace(/<i className="fas fa-map-marker-alt"><\/i>/g, '<MapPin size={18} />');
cek = cek.replace(/<i className="fas fa-map-pin"><\/i>/g, '<MapPin size={18} />');
cek = cek.replace(/<i className="fas fa-search"><\/i>/g, '<Search size={18} />');
cek = cek.replace(/<i className="fas fa-arrow-right"><\/i>/g, '<ArrowRight size={18} />');
cek = cek.replace(/<i className="fas fa-check-circle" style=\{\{ color: "#037e64" \}\}\><\/i>/g, '<CheckCircle2 size={18} color="#037e64" />');
fs.writeFileSync('components/CekLokasi.tsx', cek);

// PaketSection.tsx
let paket = fs.readFileSync('components/home/PaketSection.tsx', 'utf8');
if (!paket.includes('lucide-react')) {
  paket = paket.replace('import { motion } from "framer-motion";', 'import { motion } from "framer-motion";\nimport { MapPin, Gift, CheckCircle2, Settings, PlayCircle } from "lucide-react";');
}
paket = paket.replace(/<i className="fas fa-location-dot"><\/i>/g, '<MapPin size={16} />');
paket = paket.replace(/<i className="fas fa-gift" style=\{\{ marginRight: 6 \}\}\><\/i>/g, '<Gift size={16} style={{ marginRight: 6 }} />');
paket = paket.replace(/<i className="fas fa-circle-check"><\/i>/g, '<CheckCircle2 size={16} />');
paket = paket.replace(/<i className="fas fa-gear"><\/i>/g, '<Settings size={16} />');
paket = paket.replace(/<i className="fas fa-circle-play"><\/i>/g, '<PlayCircle size={16} />');
fs.writeFileSync('components/home/PaketSection.tsx', paket);

// Hero.tsx
let hero = fs.readFileSync('components/home/Hero.tsx', 'utf8');
if (!hero.includes('lucide-react')) {
  hero = hero.replace('import { motion, useScroll, useTransform } from "framer-motion";', 'import { motion, useScroll, useTransform } from "framer-motion";\nimport { MapPin } from "lucide-react";');
}
hero = hero.replace(/<i className="fas fa-map-marker-alt" style=\{\{ marginRight: 8 \}\}\><\/i>/g, '<MapPin size={18} style={{ marginRight: 8, display: "inline-block", verticalAlign: "middle" }} />');
fs.writeFileSync('components/home/Hero.tsx', hero);

// wifi-solo/page.tsx
let solo = fs.readFileSync('app/wifi-solo/page.tsx', 'utf8');
if (!solo.includes('ArrowRight')) {
  solo = solo.replace('import { MessageCircle } from "lucide-react";', 'import { MessageCircle, ArrowRight } from "lucide-react";');
}
solo = solo.replace(/<i className="fas fa-arrow-right"><\/i>/g, '<ArrowRight size={16} />');
fs.writeFileSync('app/wifi-solo/page.tsx', solo);

// KotaSections.tsx
let kota = fs.readFileSync('components/kota/KotaSections.tsx', 'utf8');
if (!kota.includes('lucide-react')) {
  kota = kota.replace('import Image from "next/image";', 'import Image from "next/image";\nimport { Building2 } from "lucide-react";');
}
kota = kota.replace(/<i className="fas fa-city"><\/i>/g, '<Building2 size={24} color="var(--green)" />');
fs.writeFileSync('components/kota/KotaSections.tsx', kota);
