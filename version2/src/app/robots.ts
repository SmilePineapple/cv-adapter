import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/dashboard", "/api", "/reset-password", "/forgot-password"],
    },
    sitemap: "https://www.mycvbuddy.com/sitemap.xml",
  };
}
