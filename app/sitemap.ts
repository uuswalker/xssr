import type { MetadataRoute } from "next";
import { SITE_DOMAIN, V1_ROUTES } from "@/lib/site";
import { ARTIKEL } from "@/lib/artikel";
import { GEO_AREAS } from "@/lib/geo-pages";

export const dynamic = "force-static";
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  
  const staticRoutes: MetadataRoute.Sitemap = V1_ROUTES.map((path) => ({
    url: `${SITE_DOMAIN}${path === "/" ? "" : path}`,
    lastModified: now,
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : 0.8,
  }));

  const v1Set = new Set(V1_ROUTES.map(r => r.replace(/\//g, '')));
  
  const articleRoutes: MetadataRoute.Sitemap = Object.keys(ARTIKEL)
    .filter(slug => !v1Set.has(slug))
    .map((slug) => ({
      url: `${SITE_DOMAIN}/${slug}/`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    }));

  const geoRoutes: MetadataRoute.Sitemap = GEO_AREAS.map((area: string) => ({
    url: `${SITE_DOMAIN}/pasang-wifi-xl-satu-${area}/`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.75,
  }));

  return [...staticRoutes, ...articleRoutes, ...geoRoutes];
}