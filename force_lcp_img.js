const fs = require('fs');

let hero = fs.readFileSync('components/home/Hero.tsx', 'utf8');

hero = hero.replace(/<Image\s*src=\{s\.img\}\s*alt=\{s\.alt\}\s*width=\{s\.w\}\s*height=\{s\.h\}\s*priority=\{s\.eager\}\s*\/>/g, `{s.eager ? (
              <img
                src={s.img}
                alt={s.alt}
                width={s.w}
                height={s.h}
                fetchPriority="high"
                loading="eager"
                decoding="async"
                style={{ width: "100%", height: "auto", objectFit: "cover" }}
              />
            ) : (
              <Image
                src={s.img}
                alt={s.alt}
                width={s.w}
                height={s.h}
                loading="lazy"
                style={{ width: "100%", height: "auto", objectFit: "cover" }}
              />
            )}`);

fs.writeFileSync('components/home/Hero.tsx', hero);
