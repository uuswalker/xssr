const fs = require('fs');

let config = fs.readFileSync('next.config.ts', 'utf8');

if (!config.includes('optimizePackageImports')) {
  config = config.replace(/experimental:\s*\{/, 'experimental: {\n    optimizePackageImports: ["lucide-react"],');
  fs.writeFileSync('next.config.ts', config);
}
