const fs = require('fs');
let info = fs.readFileSync('components/home/InfoSections.tsx', 'utf8');

// If 'MessageCircle' is not imported, add it
if (!info.includes('MessageCircle')) {
  info = info.replace('import { Ticket,', 'import { MessageCircle, Ticket,');
}

info = info.replace('icon: "fab fa-whatsapp",', 'icon: MessageCircle,');

fs.writeFileSync('components/home/InfoSections.tsx', info);
