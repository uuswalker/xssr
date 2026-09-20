const fs = require('fs');

let code = fs.readFileSync('components/home/PaketSection.tsx', 'utf8');

code = code.replace(
  /<div className="speed-label">\s*<span>0 Mbps<\/span>\s*<span>\{t\.speedMax\} Mbps<\/span>\s*<\/div>/g,
  `<div className="speed-label">
            <span>0 Mbps</span>
            <span>
              {t.speedNormal && (
                <span style={{ textDecoration: 'line-through', color: '#9ca3af', marginRight: '6px' }}>
                  {t.speedNormal}
                </span>
              )}
              {t.speedMax} Mbps
            </span>
          </div>`
);

fs.writeFileSync('components/home/PaketSection.tsx', code);
console.log('Regex replace finished');
