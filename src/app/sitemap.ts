import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/posts";
import { SITE_CONFIG } from "@/lib/config";

const baseUrl = SITE_CONFIG.siteUrl;

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts().map((post) => ({
    url: `${baseUrl}/posts/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "daily" as const, priority: 1 },
    { url: `${baseUrl}/products`, lastModified: new Date(), changeFrequency: "daily" as const, priority: 0.95 },
    { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: "daily" as const, priority: 0.9 },
    { url: `${baseUrl}/disclosure`, lastModified: new Date(), changeFrequency: "yearly" as const, priority: 0.2 },
    ...posts,
  ];
}
