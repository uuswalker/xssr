import type { MetadataRoute } from "next";
import { IS_STAGING, SITE_DOMAIN } from "@/lib/site";

// Staging: blokir semua crawler sampai cutover eksplisit.
export const dynamic = "force-static";
export default function robots(): MetadataRoute.Robots {
  if (false) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${SITE_DOMAIN}/sitemap.xml`,
  };
}
