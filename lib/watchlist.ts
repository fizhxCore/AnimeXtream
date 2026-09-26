"use client";

/**
 * Watchlist & "Lanjutkan Menonton" — disimpan di localStorage browser aja,
 * nggak butuh backend/DB. Aman dipanggil di server juga (semua fungsi
 * ngecek `typeof window` dulu, jadi nggak error waktu SSR).
 */

export type WatchlistItem = {
  slug: string;
  title: string;
  thumbnail: string;
};

export type ContinueItem = {
  slug: string; // episode slug (dari /watch/[slug])
  title: string;
  ts: number; // Date.now()
};

const WATCHLIST_KEY = "ax_watchlist";
const CONTINUE_KEY = "ax_continue";
const CONTINUE_LIMIT = 12;

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // localStorage penuh/disabled — diemin aja, bukan fitur kritikal
  }
}

// ---- Watchlist ----

export function getWatchlist(): WatchlistItem[] {
  return readJson<WatchlistItem[]>(WATCHLIST_KEY, []);
}

export function isInWatchlist(slug: string): boolean {
  return getWatchlist().some((a) => a.slug === slug);
}

export function addToWatchlist(item: WatchlistItem) {
  const list = getWatchlist();
  if (list.some((a) => a.slug === item.slug)) return;
  writeJson(WATCHLIST_KEY, [item, ...list]);
}

export function removeFromWatchlist(slug: string) {
  writeJson(
    WATCHLIST_KEY,
    getWatchlist().filter((a) => a.slug !== slug)
  );
}

// ---- Continue Watching ----

export function getContinueWatching(): ContinueItem[] {
  return readJson<ContinueItem[]>(CONTINUE_KEY, []);
}

export function addContinueWatching(item: Omit<ContinueItem, "ts">) {
  const list = getContinueWatching().filter((c) => c.slug !== item.slug);
  const next = [{ ...item, ts: Date.now() }, ...list].slice(0, CONTINUE_LIMIT);
  writeJson(CONTINUE_KEY, next);
}

export function removeContinueWatching(slug: string) {
  writeJson(
    CONTINUE_KEY,
    getContinueWatching().filter((c) => c.slug !== slug)
  );
}
