import type { MetadataRoute } from "next";
import { listPublishedPosts } from "@/lib/posts";

const BASE = "https://hall.our.one";

// Generated at request time, not at build time. The DB isn't reachable during
// prerender on Vercel, and posts change too often for a static sitemap to
// stay accurate anyway.
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const baseUrls: MetadataRoute.Sitemap = [
    { url: `${BASE}/`, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${BASE}/login`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
  ];

  try {
    const posts = await listPublishedPosts();
    const postUrls = posts.map((p) => ({
      url: `${BASE}/p/${p.slug}`,
      lastModified: p.publishedAt,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));
    return [...baseUrls, ...postUrls];
  } catch (err) {
    // If the DB is unreachable for any reason (build-time prerender, transient
    // outage), still return the static base URLs so the sitemap doesn't 500.
    console.error("sitemap: failed to load posts, returning base URLs only", err);
    return baseUrls;
  }
}
