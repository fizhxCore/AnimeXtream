import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAnimeDetailCached } from "@/lib/sanka";
import WatchlistButton from "@/app/components/watchlist-button";

export const revalidate = 600;

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const anime = await getAnimeDetailCached(params.slug);
  if (!anime) return { title: "Anime tidak ditemukan" };

  const description =
    anime.synopsis?.slice(0, 155) || `Nonton ${anime.title} sub Indo di AnimeXtream.`;

  return {
    title: anime.title,
    description,
    openGraph: {
      title: anime.title,
      description,
      images: anime.thumbnail ? [{ url: anime.thumbnail }] : undefined,
    },
  };
}

export default async function AnimeDetailPage({ params }: { params: { slug: string } }) {
  const anime = await getAnimeDetailCached(params.slug);
  if (!anime) notFound();

  return (
    <div className="grid md:grid-cols-[240px_1fr] gap-6">
      <div className="relative aspect-[2/3] rounded-lg overflow-hidden" style={{ backgroundColor: "var(--surface)" }}>
        {anime.thumbnail ? (
          <Image src={anime.thumbnail} alt={anime.title} fill className="object-cover" unoptimized />
        ) : null}
      </div>

      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold mb-2">{anime.title}</h1>
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span
            className="text-xs font-semibold px-2 py-1 rounded"
            style={{ backgroundColor: "var(--accent)", color: "#0b0c12" }}
          >
            {anime.status || "Ongoing"}
          </span>
          {anime.genres.map((g) => (
            <span
              key={g}
              className="text-xs px-2 py-1 rounded border"
              style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}
            >
              {g}
            </span>
          ))}
          <span className="ml-auto">
            <WatchlistButton
              anime={{ slug: anime.slug, title: anime.title, thumbnail: anime.thumbnail }}
              size="sm"
            />
          </span>
        </div>
        <p className="text-sm whitespace-pre-line mb-6" style={{ color: "var(--text-muted)" }}>
          {anime.synopsis || "Sinopsis belum tersedia."}
        </p>

        <h2 className="font-display text-lg font-bold mb-2">Episode</h2>
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
          {anime.episodes.map((ep, i) => (
            <Link
              key={ep.slug}
              href={`/watch/${ep.slug}`}
              className="text-sm font-medium px-2 py-2.5 rounded text-center transition-colors hover:text-[var(--bg)]"
              style={{ backgroundColor: "var(--surface)" }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--accent)")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "var(--surface)")}
            >
              {i + 1}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
