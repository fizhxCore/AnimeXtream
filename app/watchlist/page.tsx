"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { getWatchlist, removeFromWatchlist, type WatchlistItem } from "@/lib/watchlist";

export default function WatchlistPage() {
  const [items, setItems] = useState<WatchlistItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setItems(getWatchlist());
    setLoaded(true);
  }, []);

  function remove(slug: string) {
    removeFromWatchlist(slug);
    setItems((prev) => prev.filter((a) => a.slug !== slug));
  }

  return (
    <div>
      <h1 className="font-display text-xl font-bold mb-1">Watchlist</h1>
      <p className="text-sm mb-5" style={{ color: "var(--text-muted)" }}>
        Disimpan di browser ini aja (localStorage) — belum sinkron antar perangkat.
      </p>

      {!loaded ? null : items.length === 0 ? (
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          Belum ada anime di watchlist. Buka halaman detail anime, terus tekan{" "}
          <span style={{ color: "var(--accent)" }}>+ Watchlist</span>.
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
          {items.map((a) => (
            <div key={a.slug} className="group relative">
              <button
                onClick={() => remove(a.slug)}
                aria-label={`Hapus ${a.title} dari watchlist`}
                className="absolute top-1.5 right-1.5 z-10 w-6 h-6 rounded-full text-xs flex items-center justify-center"
                style={{ backgroundColor: "rgba(11,12,18,0.85)", color: "var(--text)" }}
              >
                ✕
              </button>
              <Link href={`/anime/${a.slug}`} className="block">
                <div
                  className="relative aspect-[2/3] rounded-md overflow-hidden mb-1.5 transition-transform group-hover:scale-[1.03]"
                  style={{ backgroundColor: "var(--surface)" }}
                >
                  {a.thumbnail ? (
                    <Image src={a.thumbnail} alt={a.title} fill className="object-cover" unoptimized />
                  ) : null}
                </div>
                <p className="text-xs line-clamp-2 group-hover:text-[var(--accent)] transition-colors">
                  {a.title}
                </p>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
