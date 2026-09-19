const fs = require('fs');

let hero = fs.readFileSync('components/home/Hero.tsx', 'utf8');

// Replace the forced LCP img tag with responsive srcset
hero = hero.replace(/<img\s*src=\{s\.img\}\s*alt=\{s\.alt\}\s*width=\{s\.w\}\s*height=\{s\.h\}\s*fetchPriority="high"\s*loading="eager"\s*decoding="async"\s*style=\{\{ width: "100%", height: "auto", objectFit: "cover" \}\}\s*\/>/g, 
`<img
  src={s.img}
  srcSet={\`\${s.img.replace('.webp', '-mobile.webp')} 500w, \${s.img} 1080w\`}
  sizes="(max-width: 768px) 500px, 1080px"
  alt={s.alt}
  width={s.w}
  height={s.h}
  fetchPriority="high"
  loading="eager"
  decoding="async"
  style={{ width: "100%", height: "auto", objectFit: "cover" }}
/>`);

fs.writeFileSync('components/home/Hero.tsx', hero);
