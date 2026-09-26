import type { AnimeCard as AnimeCardType } from "@/lib/types";
import AnimeCard from "./components/anime-card";

export default function Rail({
  title,
  items,
  emptyHint,
}: {
  title: string;
  items: AnimeCardType[];
  emptyHint?: string;
}) {
  if (items.length === 0) {
    return (
      <section className="mb-10">
        <h2 className="font-display text-lg font-bold mb-3">{title}</h2>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          {emptyHint || "Belum ada data."}
        </p>
      </section>
    );
  }

  return (
    <section className="mb-10">
      <h2 className="font-display text-lg font-bold mb-3">{title}</h2>
      <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 snap-x snap-mandatory scrollbar-none">
        {items.map((a) => (
          <div key={a.slug} className="shrink-0 w-[130px] sm:w-[160px] snap-start">
            <AnimeCard anime={a} />
          </div>
        ))}
      </div>
    </section>
  );
}
