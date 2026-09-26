import Link from "next/link";
import Image from "next/image";
import type { AnimeCard as AnimeCardType } from "@/lib/types";

/**
 * Kartu poster anime yang dipakai bareng di Rail (homepage), halaman Search,
 * dan halaman Watchlist. Nggak bawa lebar sendiri (`w-[...]`) — biar bisa
 * dipakai baik di rail horizontal (shrink-0 w-[..]) maupun grid (w-full).
 * Atur lebar dari wrapper pemanggil, bukan dari sini.
 */
export default function AnimeCard({ anime }: { anime: AnimeCardType }) {
  return (
    <Link href={`/anime/${anime.slug}`} className="group relative block">
      <div
        className="relative aspect-[2/3] rounded-md overflow-hidden transition-transform duration-200 group-hover:scale-[1.04] group-hover:shadow-xl"
        style={{ backgroundColor: "var(--surface)" }}
      >
        {anime.thumbnail ? (
          <Image src={anime.thumbnail} alt={anime.title} fill className="object-cover" unoptimized />
        ) : null}

        {anime.status && (
          <span
            className="absolute top-1.5 left-1.5 text-[10px] font-semibold px-1.5 py-0.5 rounded"
            style={{ backgroundColor: "var(--accent-2)", color: "#1a1200" }}
          >
            Complete
          </span>
        )}
        {anime.episode && (
          <span className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 to-transparent text-[11px] px-2 py-1.5">
            {anime.episode}
          </span>
        )}
      </div>
      <p className="text-xs mt-1.5 line-clamp-2 group-hover:text-[var(--accent)] transition-colors">
        {anime.title}
      </p>
    </Link>
  );
}
