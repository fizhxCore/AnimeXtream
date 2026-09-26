import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const display = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "700"],
  variable: "--font-display",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://animextream.example.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "AnimeXtream — Nonton Anime Sub Indo",
    template: "%s — AnimeXtream",
  },
  description: "Streaming anime sub Indo — dibuat untuk belajar scraping & Next.js",
  openGraph: {
    type: "website",
    siteName: "AnimeXtream",
    locale: "id_ID",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={display.variable}>
      <body>
        <header className="sticky top-0 z-10 border-b border-[var(--border)] bg-[var(--bg)]/90 backdrop-blur px-4 py-3">
          <div className="flex items-center gap-4 max-w-6xl mx-auto">
            <a href="/" className="font-display text-xl font-bold tracking-tight shrink-0">
              Anime<span style={{ color: "var(--accent)" }}>Xtream</span>
            </a>
            <Link
              href="/watchlist"
              className="text-sm font-medium shrink-0 hidden sm:inline"
              style={{ color: "var(--text-muted)" }}
            >
              Watchlist
            </Link>
            <form action="/search" method="GET" className="flex-1 max-w-xs ml-auto">
              <input
                type="text"
                name="q"
                placeholder="Cari anime..."
                aria-label="Cari anime"
                className="w-full text-sm px-3 py-1.5 rounded-full outline-none"
                style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
              />
            </form>
            <Link
              href="/watchlist"
              aria-label="Watchlist"
              className="text-sm font-medium shrink-0 sm:hidden"
              style={{ color: "var(--text-muted)" }}
            >
              ♥
            </Link>
          </div>
        </header>
        <main className="max-w-6xl mx-auto px-4 py-6">{children}</main>
      </body>
    </html>
  );
}
