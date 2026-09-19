const fs = require('fs');

function replaceIcons(file) {
  if (!fs.existsSync(file)) return;
  let code = fs.readFileSync(file, 'utf8');

  // Need to gather all lucide imports used
  const toImport = new Set();
  
  if (code.match(/fa-chevron-(up|down)/)) {
    toImport.add('ChevronUp');
    toImport.add('ChevronDown');
    code = code.replace(/<i[^>]*className=\{`fas fa-chevron-\$\{showAll \? "up" : "down"\}`\}[^>]*><\/i>/g, '{showAll ? <ChevronUp size={16} style={{ marginLeft: 8 }} /> : <ChevronDown size={16} style={{ marginLeft: 8 }} />}');
  }
  
  if (code.includes('fa-plus')) {
    toImport.add('Plus');
    toImport.add('Minus');
    code = code.replace(/<i\s+className="fas fa-plus icon"[^>]*><\/i>/g, '<Plus className="icon" size={20} />');
  }

  if (code.includes('fa-whatsapp')) {
    toImport.add('MessageCircle');
    code = code.replace(/<i[^>]*className="fab fa-whatsapp"[^>]*><\/i>/g, '<MessageCircle size={18} />');
  }

  if (code.includes('fa-calendar-check')) {
    toImport.add('CalendarCheck');
    code = code.replace(/<i[^>]*className="fas fa-calendar-check"[^>]*><\/i>/g, '<CalendarCheck size={16} style={{ marginRight: 8, color: "var(--green)" }} />');
  }

  if (code.includes('fa-map-marker-alt') || code.includes('fa-map-pin')) {
    toImport.add('MapPin');
    code = code.replace(/<i[^>]*className="fas fa-map-marker-alt"[^>]*><\/i>/g, '<MapPin size={18} />');
    code = code.replace(/<i[^>]*className="fas fa-map-pin"[^>]*><\/i>/g, '<MapPin size={18} />');
  }

  if (code.includes('fa-check-circle')) {
    toImport.add('CheckCircle2');
    code = code.replace(/<i[^>]*className="fas fa-check-circle"[^>]*><\/i>/g, '<CheckCircle2 size={18} color="var(--green)" />');
  }

  if (code.includes('fa-question-circle')) {
    toImport.add('HelpCircle');
    code = code.replace(/<i[^>]*className="fas fa-question-circle"[^>]*><\/i>/g, '<HelpCircle size={20} color="var(--green)" />');
  }

  if (code.includes('fa-map-location-dot')) {
    toImport.add('Map');
    code = code.replace(/<i[^>]*className="fas fa-map-location-dot"[^>]*><\/i>/g, '<Map size={24} color="var(--green)" />');
  }

  if (code.includes('fa-location-crosshairs')) {
    toImport.add('Target');
    code = code.replace(/<i[^>]*className="fas fa-location-crosshairs"[^>]*><\/i>/g, '<Target size={18} />');
  }

  if (code.includes('fa-search')) {
    toImport.add('Search');
    code = code.replace(/<i[^>]*className="fas fa-search"[^>]*><\/i>/g, '<Search size={18} />');
  }

  if (code.includes('fa-arrow-right')) {
    toImport.add('ArrowRight');
    code = code.replace(/<i[^>]*className="fas fa-arrow-right"[^>]*><\/i>/g, '<ArrowRight size={18} />');
  }

  if (toImport.size > 0) {
    const importStr = `import { ${Array.from(toImport).join(', ')} } from "lucide-react";\n`;
    if (!code.includes('lucide-react')) {
      // Find the first line after "use client" if it exists
      if (code.startsWith('"use client";')) {
        code = '"use client";\n' + importStr + code.substring(14);
      } else {
        code = importStr + code;
      }
    } else {
      // Add missing imports to the existing lucide-react line
      Array.from(toImport).forEach(imp => {
        if (!code.includes(imp)) {
          code = code.replace('from "lucide-react";', `, ${imp} } from "lucide-react";`);
        }
      });
      // Fix double { } if it happened
      code = code.replace(/\} ,/g, ',');
    }
  }

  fs.writeFileSync(file, code);
}

replaceIcons('components/home/Faq.tsx');
replaceIcons('components/home/PaketSection.tsx');
replaceIcons('components/kota/KotaSections.tsx');
replaceIcons('components/CekLokasi.tsx');
