const fs = require('fs');

let code = fs.readFileSync('components/home/PaketSection.tsx', 'utf8');

const targetStart = '<div style={{ padding: "16px 24px 0" }}>';
const searchPhrase = 'Internet Speed <strong>{t.speed}</strong>';

const targetIndex = code.indexOf(searchPhrase);
if (targetIndex > -1) {
  const startIndex = code.lastIndexOf(targetStart, targetIndex);
  
  const targetEnd = 'Tanya Paket Ini\\n                    </a>\\n                  </div>\\n                </div>';
  const endIndex = code.indexOf('Tanya Paket Ini', targetIndex) + 100; // rough estimate
  
  // Just find the end of the a tag and closing divs manually
  const endSlice = code.substring(code.indexOf('Tanya Paket Ini', targetIndex));
  const closeIndex = endSlice.indexOf('</div>\\n                </div>') + 30; // Find closing tag
  
  // Actually, I'll just use a literal string replace using parts of it.
  
}
