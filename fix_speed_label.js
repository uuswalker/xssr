const fs = require('fs');

let code = fs.readFileSync('components/home/PaketSection.tsx', 'utf8');

// The generic replacement for the speed-label div
const oldLabel = `<div className="speed-label">
            <span>0 Mbps</span>
            <span>{t.speedMax} Mbps</span>
          </div>`;

const newLabel = `<div className="speed-label">
            <span>0 Mbps</span>
            <span>
              {t.speedNormal && (
                <span style={{ textDecoration: 'line-through', color: '#9ca3af', marginRight: '6px' }}>
                  {t.speedNormal}
                </span>
              )}
              {t.speedMax} Mbps
            </span>
          </div>`;

const oldLabelTahunan = `<div className="speed-label">
                  <span>0 Mbps</span>
                  <span>{t.speedMax} Mbps</span>
                </div>`;

const newLabelTahunan = `<div className="speed-label">
                  <span>0 Mbps</span>
                  <span>
                    {t.speedNormal && (
                      <span style={{ textDecoration: 'line-through', color: '#9ca3af', marginRight: '6px' }}>
                        {t.speedNormal}
                      </span>
                    )}
                    {t.speedMax} Mbps
                  </span>
                </div>`;

code = code.replace(oldLabel, newLabel);
code = code.replace(oldLabelTahunan, newLabelTahunan);

fs.writeFileSync('components/home/PaketSection.tsx', code);
console.log('Fixed PaketSection speed label');
