const fs = require('fs');

let kota = fs.readFileSync('components/kota/KotaSections.tsx', 'utf8');
kota = kota.replace('import { Building2 } from "lucide-react";', 'import { Building2, MapPin, CheckCircle2, HelpCircle, Map as MapIcon } from "lucide-react";');
kota = kota.replace(/<Map /g, '<MapIcon ');
fs.writeFileSync('components/kota/KotaSections.tsx', kota);

let paket = fs.readFileSync('components/home/PaketSection.tsx', 'utf8');
paket = paket.replace('import { MapPin, Gift, CheckCircle2, Settings, PlayCircle } from "lucide-react";', 'import { MapPin, Gift, CheckCircle2, Settings, PlayCircle, ChevronUp, ChevronDown, CalendarCheck } from "lucide-react";');
fs.writeFileSync('components/home/PaketSection.tsx', paket);
