const fs = require('fs');

let code = fs.readFileSync('components/home/PaketSection.tsx', 'utf8');

if (!code.includes('import NumberCounter')) {
  code = code.replace('import { motion } from "framer-motion";', 'import { motion } from "framer-motion";\nimport NumberCounter from "@/components/animations/NumberCounter";');
}

// Convert "{t.price}" to NumberCounter
code = code.replace('{t.price}', '{t.price.includes("Rp") ? <NumberCounter value={parseInt(t.price.replace(/\\D/g, ""), 10)} prefix="Rp " /> : t.price}');

fs.writeFileSync('components/home/PaketSection.tsx', code);
