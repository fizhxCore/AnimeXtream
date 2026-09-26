"use client";

import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import { addContinueWatching } from "@/lib/watchlist";

type QualityServer = { quality: string; servers: { name: string; serverId: string }[] };
type EpisodeStream = {
  title: string;
  streamServers: { name: string; url: string }[];
  qualityServers: QualityServer[];
  downloadLinks: { resolution: string; links: { host: string; url: string }[] }[];
};

export default function Player({ slug }: { slug: string }) {
  const [data, setData] = useState<EpisodeStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentUrl, setCurrentUrl] = useState<string | null>(null);
  const [resolving, setResolving] = useState<string | null>(null); // serverId lagi di-resolve
  const [reloadKey, setReloadKey] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    setData(null);
    setError(null);
    setCurrentUrl(null);
    setLoading(true);

    fetch(`/api/episode/${slug}`)
      .then((r) => {
        if (!r.ok) throw new Error(`Server balas status ${r.status}`);
        return r.json();
      })
      .then((json) => {
        if (json.error) throw new Error(json.detail || json.error);
        setData(json);
        setCurrentUrl(json.streamServers?.[0]?.url || null);
        addContinueWatching({
          slug,
          title: json.title || slug.replace(/-/g, " "),
        });
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [slug, reloadKey]);

  const isHls = currentUrl?.includes(".m3u8");

  useEffect(() => {
    if (!isHls || !currentUrl || !videoRef.current) return;
    const video = videoRef.current;
    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(currentUrl);
      hls.attachMedia(video);
      return () => hls.destroy();
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = currentUrl;
    }
  }, [currentUrl, isHls]);

  async function pickServer(serverId: string) {
    setResolving(serverId);
    try {
      const res = await fetch(`/api/server/${serverId}`);
      const json = await res.json();
      if (json.url) setCurrentUrl(json.url);
    } finally {
      setResolving(null);
    }
  }

  if (loading) {
    return (
      <div
        className="aspect-video rounded-lg flex flex-col items-center justify-center gap-2"
        style={{ backgroundColor: "var(--surface)" }}
      >
        <div
          className="w-6 h-6 border-2 rounded-full animate-spin"
          style={{ borderColor: "var(--border)", borderTopColor: "var(--accent)" }}
        />
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          Mengambil link streaming...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="aspect-video rounded-lg flex flex-col items-center justify-center gap-3 px-4 text-center"
        style={{ backgroundColor: "var(--surface)" }}
      >
        <p className="text-sm text-red-400">{error}</p>
        <button
          onClick={() => setReloadKey((k) => k + 1)}
          className="text-sm font-semibold px-4 py-2 rounded"
          style={{ backgroundColor: "var(--accent)", color: "#0b0c12" }}
        >
          Coba lagi
        </button>
      </div>
    );
  }

  if (!data || !currentUrl)
    return (
      <div
        className="aspect-video rounded-lg flex items-center justify-center"
        style={{ backgroundColor: "var(--surface)" }}
      >
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          Server streaming tidak ditemukan untuk episode ini.
        </p>
      </div>
    );

  return (
    <div>
      <div className="aspect-video bg-black rounded-lg overflow-hidden mb-4">
        {isHls ? (
          <video ref={videoRef} controls autoPlay className="w-full h-full" />
        ) : (
          <iframe
            key={currentUrl}
            src={currentUrl}
            allowFullScreen
            className="w-full h-full"
            referrerPolicy="no-referrer"
          />
        )}
      </div>

      {data.qualityServers.length > 0 && (
        <div className="space-y-3 mb-6">
          {data.qualityServers.map((q) => (
            <div key={q.quality}>
              <p className="text-xs font-semibold mb-1.5" style={{ color: "var(--text-muted)" }}>
                {q.quality}
              </p>
              <div className="flex flex-wrap gap-2">
                {q.servers.map((s) => (
                  <button
                    key={s.serverId}
                    onClick={() => pickServer(s.serverId)}
                    disabled={resolving === s.serverId}
                    className="text-sm px-3 py-1.5 rounded transition-colors disabled:opacity-50"
                    style={{ backgroundColor: "var(--surface)" }}
                  >
                    {resolving === s.serverId ? "..." : s.name}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {data.downloadLinks.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold mb-2" style={{ color: "var(--text-muted)" }}>
            Download
          </h3>
          <div className="space-y-1">
            {data.downloadLinks.map((d) => (
              <div key={d.resolution} className="text-sm">
                <span style={{ color: "var(--text-muted)" }}>{d.resolution}: </span>
                {d.links.map((l, i) => (
                  <a
                    key={i}
                    href={l.url}
                    target="_blank"
                    className="hover:underline mr-2"
                    style={{ color: "var(--accent)" }}
                  >
                    {l.host}
                  </a>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
