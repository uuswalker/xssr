const fs = require('fs');
let css = fs.readFileSync('app/globals.css', 'utf8');

css = css.replace(
  /\.smb-btn-primary\s*\{\s*background:\s*var\(--light-bg\);\s*color:\s*var\(--primary\);\s*\}/,
  `.smb-btn-primary {\n  background: var(--white);\n  color: var(--green);\n  border: 1.5px solid var(--green);\n}`
);

css = css.replace(
  /\.smb-btn-wa\s*\{\s*background:\s*#147a45;\s*color:\s*#fff;\s*\}/,
  `.smb-btn-wa {\n  background: var(--green);\n  color: var(--white);\n  border: 1.5px solid var(--green);\n}`
);

css = css.replace(
  /border:\s*none;\s*\/\*\s*smb-btn\s*\*\//, // wait, there is no comment
  '' // I will just replace `border: none;` in `.smb-btn` block.
);

// Better way to do it
css = css.replace(
  /\.smb-btn \{[\s\S]*?\}/,
  `.smb-btn {\n  flex: 1;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  gap: 8px;\n  padding: 12px 16px;\n  border-radius: 99px;\n  font-size: 14px;\n  font-weight: 700;\n  text-decoration: none;\n  cursor: pointer;\n  border: 1.5px solid transparent;\n}`
);

fs.writeFileSync('app/globals.css', css);
console.log('Fixed CSS');
