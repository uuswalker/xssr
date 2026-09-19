const fs = require('fs');

let layout = fs.readFileSync('app/layout.tsx', 'utf8');

// Remove all CSS fontawesome references
layout = layout.replace(/<link\s*rel="preload"\s*href="\/css\/all\.min\.css"[\s\S]*?id="fa-css"\s*\/>/g, '<link rel="preconnect" href="https://ipwho.is" />');
layout = layout.replace(/<script\s*dangerouslySetInnerHTML=\{\{\s*__html:\s*`\s*window\.addEventListener\("load", function\(\) \{\s*var fa = document\.getElementById\('fa-css'\);\s*if \(fa\) fa\.media = 'all';\s*\}\);\s*`\s*\}\}\s*\/>/g, '');
layout = layout.replace(/<noscript>[\s\S]*?<\/noscript>/g, '');

fs.writeFileSync('app/layout.tsx', layout);
