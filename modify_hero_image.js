const fs = require('fs');

let code = fs.readFileSync('components/home/Hero.tsx', 'utf8');

if (!code.includes('import Image from "next/image"')) {
  code = code.replace('import { motion, useScroll, useTransform } from "framer-motion";', 'import { motion, useScroll, useTransform } from "framer-motion";\nimport Image from "next/image";');
}

// Replace <img ... /> with <Image ... />
code = code.replace(/<img/g, '<Image');

fs.writeFileSync('components/home/Hero.tsx', code);
