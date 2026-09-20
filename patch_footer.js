const fs = require('fs');

const f = 'components/Footer.tsx';
let code = fs.readFileSync(f, 'utf8');

if (!code.includes('import Link')) {
  code = `import Link from "next/link";\n` + code;
}

code = code.replace(
  `<a href="/kebijakan-privasi/" style={{ color: "inherit" }}>\n              Kebijakan Privasi\n            </a>`,
  `<Link href="/kebijakan-privasi/" style={{ color: "inherit" }}>\n              Kebijakan Privasi\n            </Link>`
);

fs.writeFileSync(f, code);
console.log('Patched Footer');
