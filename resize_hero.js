const sharp = require('sharp');
const fs = require('fs');

async function resizeImage() {
  const input = 'public/images/promo-wifi-rumah-koneksi-pasti.webp';
  const output = 'public/images/promo-wifi-rumah-koneksi-pasti-mobile.webp';
  
  await sharp(input)
    .resize(500, 500)
    .webp({ quality: 80 })
    .toFile(output);
    
  console.log('Mobile image generated: ' + fs.statSync(output).size + ' bytes');
}

resizeImage();
