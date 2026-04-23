import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/p/"],
        disallow: ["/inside", "/api/auth"],
      },
    ],
    sitemap: "https://hall.our.one/sitemap.xml",
  };
}
