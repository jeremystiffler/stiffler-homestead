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
    { url: `${baseUrl}/local-food-lexington-ky`, lastModified: new Date(), changeFrequency: "daily" as const, priority: 0.98 },
    { url: `${baseUrl}/products`, lastModified: new Date(), changeFrequency: "daily" as const, priority: 0.95 },
    { url: `${baseUrl}/homestead-supplies`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.92 },
    { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: "daily" as const, priority: 0.9 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${baseUrl}/disclosure`, lastModified: new Date(), changeFrequency: "yearly" as const, priority: 0.2 },
    ...posts,
  ];
}
