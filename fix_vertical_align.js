const fs = require('fs');

let css = fs.readFileSync('app/globals.css', 'utf8');

css = css.replace(
  /\.paket-body \s*\{\s*padding: 16px 24px 24px;\s*flex: 1;\s*display: flex;\s*flex-direction: column;\s*\}/,
  `.paket-body { \n        padding: 16px 24px 24px; \n        flex: 1; \n        display: flex; \n        flex-direction: column; \n        justify-content: flex-end; \n      }`
);

css = css.replace(
  /\.price-box \s*\{\s*margin-top: auto;\s*\}/,
  `.price-box { \n        margin-top: 0; \n      }`
);

fs.writeFileSync('app/globals.css', css);
console.log('Fixed paket-body alignment');
