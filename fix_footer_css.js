const fs = require('fs');
let css = fs.readFileSync('app/globals.css', 'utf8');

css = css.replace(
  /\.footer-inner\s*\{\s*flex-direction:\s*column;\s*\}/,
  `.footer-inner {\n          flex-direction: column;\n          align-items: center;\n          text-align: center;\n          gap: 24px;\n        }\n        .footer-left {\n          align-items: center;\n          text-align: center;\n        }`
);

fs.writeFileSync('app/globals.css', css);
console.log('Fixed footer CSS for real');
