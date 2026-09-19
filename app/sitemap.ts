import type { MetadataRoute } from "next";
import { SITE_DOMAIN, V1_ROUTES } from "@/lib/site";

// Tumbuh per fase mengikuti V1_ROUTES. lastmod = tanggal build.
export const dynamic = "force-static";
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return V1_ROUTES.map((path) => ({
    url: `${SITE_DOMAIN}${path === "/" ? "" : path}`,
    lastModified: now,
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : 0.8,
  }));
}
