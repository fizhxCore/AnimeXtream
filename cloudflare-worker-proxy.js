/**
 * Cloudflare Worker — reverse proxy ke Sanka API.
 *
 * Kenapa perlu ini: kadang serverless function Vercel (jalan dari IP
 * datacenter AWS/GCP) kena block WAF di sisi Sanka API / otakudesu upstream.
 * Cloudflare Worker jalan dari edge network Cloudflare sendiri, jadi originnya
 * beda dan biasanya nggak kena rule block yang sama.
 *
 * Cara pakai:
 * 1. Buka https://dash.cloudflare.com -> Workers & Pages -> Create Worker
 * 2. Hapus kode default, paste isi file ini
 * 3. Deploy -> catat URL worker-nya (misal https://nama-worker.namamu.workers.dev)
 * 4. Di Vercel, isi env var:
 *      SANKA_API_FALLBACK=https://nama-worker.namamu.workers.dev
 *    (tanpa trailing slash)
 */

const UPSTREAM_ORIGIN = "https://www.sankavollerei.web.id";

export default {
  async fetch(request) {
    const incomingUrl = new URL(request.url);
    const upstreamUrl = UPSTREAM_ORIGIN + incomingUrl.pathname + incomingUrl.search;

    const outgoingHeaders = new Headers();
    outgoingHeaders.set(
      "User-Agent",
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36"
    );
    outgoingHeaders.set("Accept", "application/json");
    outgoingHeaders.set("Referer", UPSTREAM_ORIGIN + "/");

    const upstreamResponse = await fetch(upstreamUrl, {
      method: request.method,
      headers: outgoingHeaders,
    });

    const responseHeaders = new Headers(upstreamResponse.headers);
    responseHeaders.set("Access-Control-Allow-Origin", "*");

    return new Response(upstreamResponse.body, {
      status: upstreamResponse.status,
      headers: responseHeaders,
    });
  },
};
