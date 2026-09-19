const fs = require('fs');

function replaceFa(file) {
  if (!fs.existsSync(file)) return;
  let code = fs.readFileSync(file, 'utf8');
  if (code.includes('fab fa-whatsapp')) {
    if (!code.includes('lucide-react')) {
      code = code.replace(/from "react";|from "framer-motion";|from "@\/lib\/site";/g, '$&\nimport { MessageCircle } from "lucide-react";');
      if (!code.includes('lucide-react')) {
        // Fallback for wifi-solo/page.tsx which might not match those exactly
        code = code.replace('import { Metadata } from "next";', 'import { Metadata } from "next";\nimport { MessageCircle } from "lucide-react";');
      }
    }
    code = code.replace(/<i className="fab fa-whatsapp"><\/i>/g, '<MessageCircle size={18} style={{ display: "inline-block", verticalAlign: "middle" }} />');
    fs.writeFileSync(file, code);
  }
}

replaceFa('components/home/Faq.tsx');
replaceFa('app/wifi-solo/page.tsx');
replaceFa('components/CekLokasi.tsx');
