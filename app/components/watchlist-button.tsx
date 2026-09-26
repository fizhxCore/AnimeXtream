"use client";

import { useEffect, useState } from "react";
import {
  addToWatchlist,
  isInWatchlist,
  removeFromWatchlist,
  type WatchlistItem,
} from "@/lib/watchlist";

export default function WatchlistButton({
  anime,
  size = "md",
}: {
  anime: WatchlistItem;
  size?: "sm" | "md";
}) {
  const [saved, setSaved] = useState(false);

  // Cek status awal di client (localStorage nggak ada di server render)
  useEffect(() => {
    setSaved(isInWatchlist(anime.slug));
  }, [anime.slug]);

  function toggle() {
    if (saved) {
      removeFromWatchlist(anime.slug);
      setSaved(false);
    } else {
      addToWatchlist(anime);
      setSaved(true);
    }
  }

  const padding = size === "sm" ? "px-3 py-1.5 text-xs" : "px-5 py-2.5 text-sm";

  return (
    <button
      onClick={toggle}
      className={`inline-flex items-center gap-1.5 font-semibold rounded transition-colors ${padding}`}
      style={
        saved
          ? { backgroundColor: "var(--surface)", color: "var(--accent)", border: "1px solid var(--accent)" }
          : { backgroundColor: "var(--accent)", color: "#0b0c12" }
      }
    >
      {saved ? "✓ Di Watchlist" : "+ Watchlist"}
    </button>
  );
}
