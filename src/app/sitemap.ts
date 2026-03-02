import type { MetadataRoute } from "next";

const BASE = "https://zodiak-web.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${BASE}/es`, lastModified: new Date(), changeFrequency: "monthly", priority: 1 },
    { url: `${BASE}/en`, lastModified: new Date(), changeFrequency: "monthly", priority: 1 }
  ];
}
