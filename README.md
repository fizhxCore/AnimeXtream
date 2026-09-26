# AnimeXtream

Situs streaming anime sub Indo — Next.js 14, data dari Sanka API (wrapper otakudesu
yang udah jadi), tampilan ala Netflix (hero + rail horizontal per kategori).

## Arsitektur (versi terbaru — jauh lebih simpel)

Sempat dibangun pakai scraper Puppeteer sendiri di Pterodactyl buat nembus Cloudflare,
tapi ternyata ada **Sanka API** (https://www.sankavollerei.web.id) yang udah nyediain
data otakudesu siap pakai (ongoing, complete, detail, episode + link streaming, search,
genre). Jadi sekarang:

- **Nggak ada lagi scraper/Puppeteer/Pterodactyl** — semua data di-fetch langsung dari
  Sanka API lewat `lib/sanka.ts`, pakai Next.js fetch cache (`revalidate`) biar hemat
  rate limit (60 request/menit di Sanka API)
- Link streaming per episode (`/api/episode/[slug]`) dan resolve server
  (`/api/server/[serverId]`) tetap live (nggak di-cache), karena link-nya sering
  berubah/expired
- Search (`/api/search`, halaman `/search`) juga live

## Kalau Vercel kena 403 dari Sanka API

Serverless function Vercel kadang keblokir WAF di upstream (IP datacenter dianggap
bot). Solusinya: pakai **Cloudflare Worker** sebagai reverse proxy (edge network beda,
biasanya nggak kena block yang sama).

1. Buka `cloudflare-worker-proxy.js` di root project ini
2. Deploy ke Cloudflare Workers (dash.cloudflare.com → Workers & Pages → Create) —
   caranya ada di komentar paling atas file itu
3. Set env var di Vercel: `SANKA_API_FALLBACK=https://nama-worker-kamu.workers.dev`

Kode di `lib/sanka.ts` otomatis coba `SANKA_API_FALLBACK` kalau base utama gagal.

## Setup

1. Push ke GitHub, deploy ke Vercel — **nggak perlu env var apapun** buat jalan basic
   (Sanka API base udah di-hardcode default)
2. Kalau nanti kena 403, isi `SANKA_API_FALLBACK` (lihat di atas)

## Fitur

- Homepage: hero banner + rail "Jadwal Hari Ini", Ongoing, Complete
- Halaman detail anime: sinopsis, genre, daftar episode
- Player: server default otomatis + pilihan kualitas/server on-demand, download link
- Search

## Struktur

```
app/
  page.tsx, hero.tsx, rail.tsx     homepage ala Netflix
  anime/[slug]/page.tsx            detail anime
  watch/[slug]/                    player
  search/page.tsx                  hasil pencarian
  api/episode/[slug]/              proxy live ke Sanka API (streaming link)
  api/server/[serverId]/           resolve satu server jadi URL embed
  api/search/                      proxy live ke Sanka API (search)
lib/
  sanka.ts                         semua fungsi fetch ke Sanka API + fallback
cloudflare-worker-proxy.js         reverse proxy (dipakai kalau kena 403)
```

## Catatan

Data anime dari Sanka API (pihak ketiga), yang scrape dari otakudesu. Dibuat untuk
belajar — bukan buat komersial.

## Upgrade terbaru

**UI**
- Skeleton loading (`loading.tsx`) di homepage, detail anime, dan search
- Halaman 404 & error boundary bertema, bukan default Next.js polos
- `AnimeCard` jadi komponen bersama (`app/components/anime-card.tsx`) — sebelumnya
  duplikat di `rail.tsx` dan `search/page.tsx`

**Fitur baru (client-only, localStorage, tanpa backend)**
- **Watchlist** — tombol "+ Watchlist" di halaman detail anime, halaman `/watchlist`
  buat lihat/hapus, link di header
- **Lanjutkan Menonton** — otomatis kecatat tiap buka episode di `/watch/[slug]`,
  muncul sebagai rail di homepage kalau ada riwayat

**SEO / kode**
- `generateMetadata` per anime (title, description, OG image) di halaman detail
- `app/sitemap.ts` & `app/robots.ts`

### Roadmap (belum diimplementasi, butuh keputusan lebih lanjut)
- Filter/browse per genre — nunggu konfirmasi Sanka API punya endpoint genre atau nggak
- Pagination "muat lebih banyak" di rail Ongoing/Complete (saat ini cuma page 1)
- Rating & komentar publik — butuh backend/DB (mis. Supabase), nggak bisa client-only
  kalau mau kelihatan orang lain
