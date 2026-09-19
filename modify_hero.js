const fs = require('fs');

let code = fs.readFileSync('components/home/Hero.tsx', 'utf8');

if (!code.includes('import { motion, useScroll, useTransform }')) {
  code = code.replace('import { useCallback, useEffect, useRef, useState } from "react";', 'import { useCallback, useEffect, useRef, useState } from "react";\nimport { motion, useScroll, useTransform } from "framer-motion";');
}

code = code.replace('const total = SLIDES.length;', 'const total = SLIDES.length;\n  const { scrollY } = useScroll();\n  const y = useTransform(scrollY, [0, 800], [0, 250]);');

code = code.replace('<div\n        className="slides"\n        id="slides"\n        style={{ transform: `translateX(-${cur * 100}%)` }}\n      >', '<motion.div\n        className="slides"\n        id="slides"\n        style={{ x: `-${cur * 100}%`, y }}\n        animate={{ x: `-${cur * 100}%` }}\n        transition={{ type: "spring", damping: 30, stiffness: 200 }}\n      >');

code = code.replace('        ))}\n      </div>\n      <button\n        className="slider-btn prev"', '        ))}\n      </motion.div>\n      <button\n        className="slider-btn prev"');

fs.writeFileSync('components/home/Hero.tsx', code);
