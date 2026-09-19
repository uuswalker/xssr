const fs = require('fs');
let css = fs.readFileSync('app/globals.css', 'utf8');

css = css.replace(/animation: shadow-pulse 3s infinite alternate;/, 'box-shadow: 0 15px 35px rgba(3, 126, 100, 0.25);');
css = css.replace(/@keyframes shadow-pulse \{[\s\S]*?\}/, '');

fs.writeFileSync('app/globals.css', css);
