function Pulse({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-md ${className}`}
      style={{ backgroundColor: "var(--surface)" }}
    />
  );
}

export default function HomeLoading() {
  return (
    <div>
      <Pulse className="h-[46vh] min-h-[280px] max-h-[460px] w-full mb-10 rounded-xl" />
      {[0, 1, 2].map((row) => (
        <section key={row} className="mb-10">
          <Pulse className="h-5 w-40 mb-3" />
          <div className="flex gap-3 overflow-hidden -mx-4 px-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Pulse key={i} className="shrink-0 w-[130px] sm:w-[160px] aspect-[2/3]" />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
