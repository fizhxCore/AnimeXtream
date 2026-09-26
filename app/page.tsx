import { getOngoingCached, getCompleteCached } from "@/lib/sanka";
import Hero from "./hero";
import Rail from "./rail";
import ContinueWatching from "./components/continue-watching";

export const revalidate = 300;

const INDO_DAYS = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

export default async function HomePage() {
  const [ongoing, complete] = await Promise.all([getOngoingCached(), getCompleteCached()]);

  const today = INDO_DAYS[new Date().getDay()];
  const todaySchedule = ongoing.filter((a) =>
    (a.updatedOn || "").toLowerCase().includes(today.toLowerCase())
  );

  return (
    <>
      {ongoing[0] && <Hero anime={ongoing[0]} />}

      <ContinueWatching />

      <Rail
        title={`Jadwal Hari Ini (${today})`}
        items={todaySchedule}
        emptyHint="Nggak ada jadwal rilis khusus hari ini di data terbaru."
      />
      <Rail
        title="Ongoing"
        items={ongoing}
        emptyHint="Belum ada data. Jalankan scraper dulu."
      />
      <Rail
        title="Complete"
        items={complete}
        emptyHint="Belum ada data. Jalankan scraper dulu."
      />
    </>
  );
}
