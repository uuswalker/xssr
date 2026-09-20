const fs = require('fs');

let css = fs.readFileSync('app/globals.css', 'utf8');

// Best seller card
css = css.replace(
  /box-shadow: 0 15px 35px rgba\(3, 126, 100, 0\.25\);/g,
  'box-shadow: 0 20px 40px -5px rgba(3, 126, 100, 0.15);'
);

// hover glow
css = css.replace(
  /box-shadow: 0px 5px 15px rgba\(5,169,134,0\.4\);/g,
  'box-shadow: 0 8px 20px -4px rgba(5,169,134,0.2);'
);

// WaFloat
css = css.replace(
  /box-shadow: 0 4px 20px rgba\(20,122,69,\.4\);/g,
  'box-shadow: 0 8px 25px -5px rgba(20,122,69,0.25);'
);

// Paket card hover
css = css.replace(
  /box-shadow: 0 8px 20px rgba\(0,0,0,\.12\);/g,
  'box-shadow: 0 12px 24px -6px rgba(0,0,0,0.08);'
);

// Sticky Mobile Bar
css = css.replace(
  /box-shadow: 0 -4px 12px rgba\(0,0,0,0\.1\);/g,
  'box-shadow: 0 -10px 30px -10px rgba(0,0,0,0.08);'
);

fs.writeFileSync('app/globals.css', css);
console.log('Fixed CSS shadows');
