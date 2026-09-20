const fs = require('fs');

let css = fs.readFileSync('app/globals.css', 'utf8');

css = css.replace(
  /\.fitur-item img\s*\{\s*width: 28px;\s*height: 28px;\s*\}/,
  `.fitur-item img { 
        width: 28px; 
        height: 28px;
        object-fit: contain;
        object-position: left center;
      }`
);

fs.writeFileSync('app/globals.css', css);
console.log('Fixed fitur-item img alignment');
