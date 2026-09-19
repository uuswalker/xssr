const fs = require('fs');

let hero = fs.readFileSync('components/home/Hero.tsx', 'utf8');

// Replace the img tag
hero = hero.replace(/<img[\s\S]*?decoding="async"\s*\/>/, 
  `<img
    src={s.img}
    srcSet={\`\${s.img.replace('.webp', '-mobile.webp')} 500w, \${s.img} 1080w\`}
    sizes="(max-width: 768px) 500px, 1080px"
    alt={s.alt}
    fetchPriority="high"
    loading="eager"
    decoding="async"
    className="hero-img-lcp"
  />`
);

// Inject inline style right before the slides div
hero = hero.replace(/<div\s+className="slides"/, 
  `<style dangerouslySetInnerHTML={{ __html: \`
    .hero-img-lcp { width: 100%; height: 480px; object-fit: cover; display: block; }
    @media (max-width: 768px) { .hero-img-lcp { height: 240px; } }
    @media (max-width: 480px) { .hero-img-lcp { height: 160px; } }
  \` }} />
        <div className="slides"`
);

fs.writeFileSync('components/home/Hero.tsx', hero);
