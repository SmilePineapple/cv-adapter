import type { MetadataRoute } from "next";
import { BLOG_POSTS } from "@/lib/blog-posts";

const BASE_URL = "https://www.mycvbuddy.com";

const LANGUAGE_PAGES = ["ar", "de", "es", "fr", "hi", "pt"];

// Deliberately excludes auth pages (/login, /signup, /forgot-password,
// /reset-password) and everything under /dashboard - none of that is
// meant to be indexed or land as a search result.
export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE_URL}/about`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/ats-checker`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/blog`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE_URL}/contact`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE_URL}/help`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${BASE_URL}/privacy`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${BASE_URL}/terms`, changeFrequency: "yearly", priority: 0.2 },
  ];

  const languagePages: MetadataRoute.Sitemap = LANGUAGE_PAGES.map((lang) => ({
    url: `${BASE_URL}/${lang}`,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const blogPages: MetadataRoute.Sitemap = BLOG_POSTS.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: post.date,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticPages, ...languagePages, ...blogPages];
}
