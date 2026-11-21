import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.APP_URL ?? "http://localhost:3000";
  return [
    { url: baseUrl, changeFrequency: "monthly", priority: 1 },
    { url: `${baseUrl}/sobre`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/servicos`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/contactos`, changeFrequency: "monthly", priority: 0.6 },
  ];
}
