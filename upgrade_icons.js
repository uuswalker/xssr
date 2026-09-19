const fs = require('fs');

// HEADER.TSX
let header = fs.readFileSync('components/Header.tsx', 'utf8');
if (!header.includes('lucide-react')) {
  header = header.replace('import { usePathname } from "next/navigation";', 'import { usePathname } from "next/navigation";\nimport { MessageCircle, MapPin } from "lucide-react";');
}
header = header.replace('<i className="fab fa-whatsapp"></i>', '<MessageCircle size={18} />');
header = header.replace('<i className="fas fa-map-marker-alt"></i>', '<MapPin size={18} />');
fs.writeFileSync('components/Header.tsx', header);

// INFOSECTIONS.TSX
let info = fs.readFileSync('components/home/InfoSections.tsx', 'utf8');
if (!info.includes('lucide-react')) {
  info = info.replace('import { motion } from "framer-motion";', 'import { motion } from "framer-motion";\nimport { Ticket, HandCoins, MapPinned, Building2, HelpCircle, Map } from "lucide-react";');
}
info = info.replace('icon: "fas fa-ticket-alt"', 'icon: Ticket');
info = info.replace('icon: "fas fa-hand-holding-usd"', 'icon: HandCoins');
info = info.replace('icon: "fas fa-map-marked-alt"', 'icon: MapPinned');

// In KENAPA.map, replace the <i> tag
// We have:
/*
<i
  className={k.icon}
  style={{
    color: "var(--green)",
    fontSize: 28,
  }}
></i>
*/
info = info.replace(/<i\s*className=\{k\.icon\}\s*style=\{\{[\s\S]*?\}\}\s*><\/i>/g, '<k.icon size={28} color="var(--green)" />');

// Replace area cards icons
info = info.replace('<i className="fas fa-city"></i>', '<Building2 size={20} color="var(--green)" />');
info = info.replace('<i className="fas fa-question-circle" style={{ color: "#fff" }}></i>', '<HelpCircle size={20} color="#fff" />');
info = info.replace(/<i\s*className="fas fa-map-location-dot"\s*style=\{\{\s*marginRight: 6\s*\}\}\s*><\/i>/g, '<Map size={16} style={{ marginRight: 6 }} />');

fs.writeFileSync('components/home/InfoSections.tsx', info);
