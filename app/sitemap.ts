import type { MetadataRoute } from "next";
import { getDocSlugs } from "@/lib/docs";

const SITE_URL = "https://origindb.dev";

export default function sitemap(): MetadataRoute.Sitemap {
  const docs = getDocSlugs().map((slug) => ({
    url: `${SITE_URL}/docs/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/docs`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...docs,
  ];
}
