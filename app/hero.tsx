import Link from "next/link";
import type { AnimeCard } from "@/lib/types";

export default function Hero({ anime }: { anime: AnimeCard }) {
  return (
    <div className="relative -mx-4 sm:mx-0 mb-10 rounded-none sm:rounded-xl overflow-hidden">
      <div
        className="relative h-[46vh] min-h-[280px] max-h-[460px] bg-cover bg-center"
        style={{ backgroundImage: anime.thumbnail ? `url(${anime.thumbnail})` : undefined }}
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, var(--bg) 5%, rgba(11,12,18,0.35) 55%, rgba(11,12,18,0.15) 100%)",
          }}
        />
        <div className="absolute inset-x-0 bottom-0 px-4 sm:px-6 pb-6">
          <p
            className="text-xs font-semibold tracking-wide mb-1"
            style={{ color: "var(--accent-2)" }}
          >
            Sedang Tayang
          </p>
          <h1 className="font-display text-2xl sm:text-4xl font-bold max-w-lg drop-shadow-md">
            {anime.title}
          </h1>
          {anime.episode && (
            <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
              {anime.episode}
            </p>
          )}
          <Link
            href={`/anime/${anime.slug}`}
            className="inline-block mt-4 font-semibold text-sm px-5 py-2.5 rounded"
            style={{ backgroundColor: "var(--accent)", color: "#0b0c12" }}
          >
            Lihat episode
          </Link>
        </div>
      </div>
    </div>
  );
}
