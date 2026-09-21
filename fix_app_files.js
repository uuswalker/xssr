const fs = require('fs');

let layout = fs.readFileSync('app/layout.tsx', 'utf8');

layout = layout.replace(
  'import "./globals.css";',
  'import { Plus_Jakarta_Sans } from "next/font/google";\nimport "./globals.css";'
);

layout = layout.replace(
  'export const metadata: Metadata = {',
  'const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], display: "swap", variable: "--font-jakarta" });\n\nexport const metadata: Metadata = {'
);

layout = layout.replace(
  '<html lang="id">',
  '<html lang="id" className={jakarta.variable}>'
);

fs.writeFileSync('app/layout.tsx', layout);
console.log('Fixed layout.tsx');

let sitemap = fs.readFileSync('app/sitemap.ts', 'utf8');
sitemap = `import type { MetadataRoute } from "next";
import { SITE_DOMAIN, V1_ROUTES } from "@/lib/site";
import { ARTIKEL } from "@/lib/artikel";

export const dynamic = "force-static";
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  
  const staticRoutes: MetadataRoute.Sitemap = V1_ROUTES.map((path) => ({
    url: \`\${SITE_DOMAIN}\${path === "/" ? "" : path}\`,
    lastModified: now,
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : 0.8,
  }));

  const v1Set = new Set(V1_ROUTES.map(r => r.replace(/\\//g, '')));
  
  const articleRoutes: MetadataRoute.Sitemap = Object.keys(ARTIKEL)
    .filter(slug => !v1Set.has(slug))
    .map((slug) => ({
      url: \`\${SITE_DOMAIN}/\${slug}/\`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    }));

  return [...staticRoutes, ...articleRoutes];
}`;

fs.writeFileSync('app/sitemap.ts', sitemap);
console.log('Fixed sitemap.ts');
