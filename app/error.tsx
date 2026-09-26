"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center text-center py-20">
      <p className="font-display text-xl font-bold mb-2">Ada yang error</p>
      <p className="text-sm mb-6 max-w-sm" style={{ color: "var(--text-muted)" }}>
        Biasanya karena Sanka API lagi lemot/kena rate limit. Coba lagi sebentar.
      </p>
      <button
        onClick={reset}
        className="font-semibold text-sm px-5 py-2.5 rounded"
        style={{ backgroundColor: "var(--accent)", color: "#0b0c12" }}
      >
        Coba lagi
      </button>
    </div>
  );
}
