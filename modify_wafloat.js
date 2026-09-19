const fs = require('fs');

let code = fs.readFileSync('components/WaFloat.tsx', 'utf8');

if (!code.includes('lucide-react')) {
  code = code.replace('import { motion } from "framer-motion";', 'import { motion } from "framer-motion";\nimport { MessageCircle } from "lucide-react";');
}

code = code.replace('<i className="fab fa-whatsapp"></i>', '<MessageCircle size={24} style={{ marginRight: 8 }} />');

fs.writeFileSync('components/WaFloat.tsx', code);
