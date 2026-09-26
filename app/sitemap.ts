import type { MetadataRoute } from "next";
import { getOngoingCached, getCompleteCached } from "@/lib/sanka";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://animextream.example.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [ongoing, complete] = await Promise.all([
    getOngoingCached().catch(() => []),
    getCompleteCached().catch(() => []),
  ]);

  const animeUrls = [...ongoing, ...complete].map((a) => ({
    url: `${SITE_URL}/anime/${a.slug}`,
    lastModified: new Date(),
  }));

  return [
    { url: SITE_URL, lastModified: new Date() },
    { url: `${SITE_URL}/watchlist`, lastModified: new Date() },
    ...animeUrls,
  ];
}
