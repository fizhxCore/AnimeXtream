import type { AnimeCard, AnimeDetail, EpisodeStream } from "./types";

/**
 * Sanka API (otakudesu wrapper) — https://www.sankavollerei.web.id/anime
 *
 * Kita fetch LANGSUNG dari sini di server component / API route Next.js,
 * pakai Next.js fetch cache (revalidate) buat ngirit rate limit (60 req/menit).
 *
 * Kalau Vercel kena 403 (serverless IP keblokir WAF di upstream), isi
 * SANKA_API_FALLBACK di env var dengan URL Cloudflare Worker reverse-proxy
 * (lihat README) — kode di bawah otomatis coba fallback itu.
 */
const PRIMARY_BASE = process.env.SANKA_API_BASE || "https://www.sankavollerei.web.id/anime";
const FALLBACK_BASE = process.env.SANKA_API_FALLBACK || "";

async function sankaFetch(path: string, revalidateSeconds: number) {
  const bases = [PRIMARY_BASE, FALLBACK_BASE].filter(Boolean);
  let lastError: Error | null = null;

  for (const base of bases) {
    try {
      const res = await fetch(`${base}${path}`, { next: { revalidate: revalidateSeconds } });
      if (!res.ok) throw new Error(`Sanka API balas status ${res.status}`);
      const json = await res.json();
      if (!json.ok) throw new Error(json.message || "Sanka API balas error");
      return json.data;
    } catch (err) {
      lastError = err as Error;
      // coba base berikutnya (fallback) kalau ada
    }
  }
  throw lastError || new Error("Semua Sanka API base gagal diakses");
}

function mapCard(item: any): AnimeCard {
  return {
    slug: item.animeId,
    title: item.title,
    thumbnail: item.poster,
    episode: item.episodes ? `Episode ${item.episodes}` : undefined,
    updatedOn: item.releaseDay,
    status: item.releaseDay ? undefined : "Complete", // complete-anime biasanya nggak punya releaseDay
  };
}

export async function getOngoingCached(page = 1): Promise<AnimeCard[]> {
  try {
    const data = await sankaFetch(`/ongoing-anime?page=${page}`, 300);
    return (data.animeList || []).map(mapCard);
  } catch {
    return [];
  }
}

export async function getCompleteCached(page = 1): Promise<AnimeCard[]> {
  try {
    const data = await sankaFetch(`/complete-anime?page=${page}`, 300);
    return (data.animeList || []).map((item: any) => ({ ...mapCard(item), status: "Complete" }));
  } catch {
    return [];
  }
}

export async function getAnimeDetailCached(slug: string): Promise<AnimeDetail | null> {
  try {
    const data = await sankaFetch(`/anime/${slug}`, 600);
    const episodes = (data.episodeList || [])
      .map((e: any) => ({ slug: e.episodeId, title: e.title, eps: e.eps }))
      .sort((a: any, b: any) => a.eps - b.eps);

    return {
      slug,
      title: data.title,
      thumbnail: data.poster,
      synopsis: (data.synopsis?.paragraphs || []).join("\n\n"),
      genres: (data.genreList || []).map((g: any) => g.title),
      status: data.status || "",
      episodes,
    };
  } catch {
    return null;
  }
}

export async function searchAnimeLive(keyword: string): Promise<AnimeCard[]> {
  const data = await sankaFetch(`/search/${encodeURIComponent(keyword)}`, 60);
  return (data.animeList || data || []).map(mapCard);
}

export async function getEpisodeStreamLive(slug: string): Promise<EpisodeStream> {
  const data = await sankaFetch(`/episode/${slug}`, 0); // link streaming: jangan di-cache

  const qualityServers = (data.server?.qualities || []).map((q: any) => ({
    quality: q.title,
    servers: (q.serverList || []).map((s: any) => ({ name: s.title, serverId: s.serverId })),
  }));

  const downloadLinks = (data.downloadUrl?.qualities || []).map((q: any) => ({
    resolution: q.title,
    links: (q.urls || []).map((u: any) => ({ host: u.title, url: u.url })),
  }));

  return {
    slug,
    title: data.title,
    streamServers: data.defaultStreamingUrl
      ? [{ name: "Default", url: data.defaultStreamingUrl }]
      : [],
    qualityServers,
    downloadLinks,
  };
}

/** Resolve satu server (dari tombol pilihan kualitas/server) jadi URL embed asli */
export async function resolveServerLive(serverId: string): Promise<string> {
  const data = await sankaFetch(`/server/${serverId}`, 0);
  return data.url || data.streamUrl || data.embedUrl || "";
}
