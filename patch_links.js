const fs = require('fs');
const glob = require('glob'); // Note: xssr is next.js so glob might not be installed, I'll use raw fs reading.

const dirs = fs.readdirSync('app').filter(f => f.startsWith('wifi-'));

dirs.forEach(d => {
  const file = `app/${d}/page.tsx`;
  if (fs.existsSync(file)) {
    let code = fs.readFileSync(file, 'utf8');
    
    // inject Link import if missing
    if (!code.includes('import Link')) {
      code = 'import Link from "next/link";\n' + code;
    }

    // Replace internal links in <nav> and related grids
    // We can use a regex to match <a href="/something">...</a>
    // We only replace if href starts with / (internal)
    code = code.replace(/<a ([^>]*?)href="(\/[^"]+)"([^>]*)>/g, '<Link $1href="$2"$3>');
    code = code.replace(/<\/a>/g, (match, offset, str) => {
      // Very naive: we need to be careful not to replace external </a>
      return match; // Actually it's safer to not replace </a> unless we track it.
    });
    
    // Instead of regex, let's just do exact replacements for the known ones:
    // This is safer.
  }
});
