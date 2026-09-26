import { searchAnimeLive } from "@/lib/sanka";
import AnimeCard from "../components/anime-card";

export const dynamic = "force-dynamic";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const q = (searchParams.q || "").trim();
  const results = q ? await searchAnimeLive(q).catch(() => []) : [];

  return (
    <div>
      <h1 className="font-display text-xl font-bold mb-4">
        Hasil untuk &quot;{q}&quot;
      </h1>

      {results.length === 0 ? (
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          {q ? "Nggak ada anime yang cocok." : "Ketik sesuatu di kotak pencarian."}
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
          {results.map((a) => (
            <AnimeCard key={a.slug} anime={a} />
          ))}
        </div>
      )}
    </div>
  );
}
