const fs = require('fs');
let code = fs.readFileSync('app/layout.tsx', 'utf8');

if (!code.includes('import WebMCPRegistry')) {
  code = code.replace(
    'import "./globals.css";',
    'import "./globals.css";\nimport WebMCPRegistry from "@/components/WebMCPRegistry";'
  );
  
  code = code.replace(
    '<Trackers />',
    '<Trackers />\n        <WebMCPRegistry />'
  );
  
  fs.writeFileSync('app/layout.tsx', code);
}
