const fs = require('fs');

let info = fs.readFileSync('components/home/InfoSections.tsx', 'utf8');
if (!info.includes('lucide-react')) {
  info = info.replace('import { motion } from "framer-motion";', 'import { motion } from "framer-motion";\nimport { Ticket, HandCoins, MapPinned, Building2, HelpCircle, Map, MessageCircle } from "lucide-react";');
}
info = info.replace('icon: "fab fa-whatsapp"', 'icon: MessageCircle');
info = info.replace('icon: "fas fa-ticket-alt"', 'icon: Ticket');
info = info.replace('icon: "fas fa-hand-holding-usd"', 'icon: HandCoins');
info = info.replace('icon: "fas fa-map-marked-alt"', 'icon: MapPinned');

info = info.replace('{KENAPA.map((k) => (', '{KENAPA.map((k) => {\nconst Icon = k.icon;\nreturn (');
info = info.replace(/<i\s*className=\{k\.icon\}\s*style=\{\{[\s\S]*?\}\}\s*><\/i>/g, '<Icon size={28} color="var(--green)" />');
info = info.replace(/<\/motion\.div>\s*\)\)}/g, '</motion.div>\n                );\n              })}');

info = info.replace('<i className="fas fa-city"></i>', '<Building2 size={20} color="var(--green)" />');
info = info.replace('<i className="fas fa-question-circle" style={{ color: "#fff" }}></i>', '<HelpCircle size={20} color="#fff" />');
info = info.replace(/<i\s*className="fas fa-map-location-dot"\s*style=\{\{\s*marginRight: 6\s*\}\}\s*><\/i>/g, '<Map size={16} style={{ marginRight: 6 }} />');

// Remove emojis
info = info.replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F1E6}-\u{1F1FF}➔]/gu, '');

fs.writeFileSync('components/home/InfoSections.tsx', info);
