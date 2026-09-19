const fs = require('fs');
let layout = fs.readFileSync('app/layout.tsx', 'utf8');

// Remove the manual <head> and its contents
layout = layout.replace(/<head>[\s\S]*?<\/head>/, '');

// Insert the links right before {children}
layout = layout.replace(/{children}/, `{children}
        <link rel="webmcp" id="webmcp" href="/webmcp.json" />
        <link 
          rel="preload" 
          as="image" 
          imageSrcSet="/images/promo-wifi-rumah-koneksi-pasti-mobile.webp 500w, /images/promo-wifi-rumah-koneksi-pasti.webp 1080w"
          imageSizes="(max-width: 768px) 500px, 1080px"
          fetchPriority="high" 
        />
        <link rel="preconnect" href="https://ipwho.is" crossOrigin="anonymous" />`);

fs.writeFileSync('app/layout.tsx', layout);
