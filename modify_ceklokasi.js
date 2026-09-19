const fs = require('fs');

let code = fs.readFileSync('components/CekLokasi.tsx', 'utf8');

if (!code.includes('import { motion, AnimatePresence } from "framer-motion"')) {
  code = code.replace('import { useCallback, useEffect, useRef, useState } from "react";', 'import { useCallback, useEffect, useRef, useState } from "react";\nimport { motion, AnimatePresence } from "framer-motion";');
}

// 1. Wrap modal step rendering with AnimatePresence
code = code.replace('{step === "lokasi" ? (', '<AnimatePresence mode="wait">\n              {step === "lokasi" ? (');

// 2. cl-step-lokasi to motion.div
code = code.replace('<div id="cl-step-lokasi">', '<motion.div key="lokasi" initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 30 }} transition={{ type: "spring", stiffness: 300, damping: 30 }} id="cl-step-lokasi">');

// 3. cl-step-lokasi closing and cl-step-form opening
code = code.replace(/<\/div>\s*\) : \(\s*<div id="cl-step-form">/, '</motion.div>\n            ) : (\n              <motion.div key="form" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ type: "spring", stiffness: 300, damping: 30 }} id="cl-step-form">');

// 4. cl-step-form closing
code = code.replace(/<\/div>\s*\)}\s*<\/div>\s*<\/div>/, '</motion.div>\n            )}\n            </AnimatePresence>\n          </motion.div>\n        </div>');

// 5. cl-modal-box animation
code = code.replace('<div className="cl-modal-box">', '<motion.div className="cl-modal-box" initial={{ opacity: 0, y: 50, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ type: "spring", damping: 25, stiffness: 300 }}>');

fs.writeFileSync('components/CekLokasi.tsx', code);
