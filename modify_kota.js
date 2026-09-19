const fs = require('fs');
let code = fs.readFileSync('components/kota/KotaPage.tsx', 'utf8');

// Insert imports
code = code.replace('import { KecamatanBlock', 'import ScrollReveal from "@/components/animations/ScrollReveal";\nimport Marquee from "@/components/animations/Marquee";\nimport { KecamatanBlock');

// Now replace the JSX return inside export default function KotaPage
// Find the <main> block
// Note: It's easier to just use regex to wrap the specific components.

code = code.replace(/<KotaHero[^>]*\/>/g, '<ScrollReveal delay={0.1}>\n          $&\n        </ScrollReveal>\n        <Marquee />');
code = code.replace(/<FiberPaket[^>]*\/>/g, '<ScrollReveal delay={0.1}>\n          $&\n        </ScrollReveal>');
code = code.replace(/<TahunanPaket[^>]*\/>/g, '<ScrollReveal delay={0.1}>\n          $&\n        </ScrollReveal>');
code = code.replace(/<WirelessPaket[^>]*\/>/g, '<ScrollReveal delay={0.1}>\n          $&\n        </ScrollReveal>');
code = code.replace(/<KecamatanBlock[^>]*\/>/g, '<ScrollReveal delay={0.1}>\n          $&\n        </ScrollReveal>');
code = code.replace(/<KotaArea[^>]*\/>/g, '<ScrollReveal delay={0.1}>\n          $&\n        </ScrollReveal>');
code = code.replace(/<Kenapa[^>]*\/>/g, '<ScrollReveal delay={0.1}>\n          $&\n        </ScrollReveal>');
code = code.replace(/<About[^>]*\/>/g, '<ScrollReveal delay={0.1}>\n          $&\n        </ScrollReveal>');
code = code.replace(/<Myxl[^>]*\/>/g, '<ScrollReveal delay={0.1}>\n          $&\n        </ScrollReveal>');
code = code.replace(/<Hubungi[^>]*\/>/g, '<ScrollReveal delay={0.1}>\n          $&\n        </ScrollReveal>');
code = code.replace(/<Faq[^>]*\/>/g, '<ScrollReveal delay={0.1}>\n          $&\n        </ScrollReveal>');


fs.writeFileSync('components/kota/KotaPage.tsx', code);
