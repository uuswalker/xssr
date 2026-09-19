const fs = require('fs');
let faq = fs.readFileSync('components/home/Faq.tsx', 'utf8');
faq = faq.replace('import { MessageCircle } from "lucide-react";\n"use client";', '"use client";\nimport { MessageCircle } from "lucide-react";');
fs.writeFileSync('components/home/Faq.tsx', faq);
