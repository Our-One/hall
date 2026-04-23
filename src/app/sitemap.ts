import type { MetadataRoute } from "next";
import { SEED_POSTS } from "@/lib/seed-posts";

const BASE = "https://hall.our.one";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    { url: `${BASE}/`, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${BASE}/login`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    ...SEED_POSTS.map((p) => ({
      url: `${BASE}/p/${p.slug}`,
      lastModified: p.publishedAt,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
