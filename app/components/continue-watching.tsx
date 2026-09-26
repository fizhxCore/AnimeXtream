"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getContinueWatching, type ContinueItem } from "@/lib/watchlist";

function timeAgo(ts: number): string {
  const diffMin = Math.floor((Date.now() - ts) / 60000);
  if (diffMin < 1) return "Baru saja";
  if (diffMin < 60) return `${diffMin} menit lalu`;
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour} jam lalu`;
  const diffDay = Math.floor(diffHour / 24);
  return `${diffDay} hari lalu`;
}

/**
 * Rail "Lanjutkan Menonton" — dibaca dari localStorage, jadi harus client
 * component & di-render kosong dulu waktu SSR (nggak ada mismatch karena
 * baru keisi lewat useEffect setelah mount).
 */
export default function ContinueWatching() {
  const [items, setItems] = useState<ContinueItem[]>([]);

  useEffect(() => {
    setItems(getContinueWatching());
  }, []);

  if (items.length === 0) return null;

  return (
    <section className="mb-10">
      <h2 className="font-display text-lg font-bold mb-3">Lanjutkan Menonton</h2>
      <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 snap-x snap-mandatory scrollbar-none">
        {items.map((it) => (
          <Link
            key={it.slug}
            href={`/watch/${it.slug}`}
            className="shrink-0 w-[200px] snap-start rounded-md p-3 transition-colors hover:bg-[var(--surface-2)]"
            style={{ backgroundColor: "var(--surface)" }}
          >
            <p className="text-sm font-medium line-clamp-2 mb-1.5">{it.title}</p>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              {timeAgo(it.ts)}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
