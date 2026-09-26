function Pulse({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-md ${className}`}
      style={{ backgroundColor: "var(--surface)" }}
    />
  );
}

export default function AnimeDetailLoading() {
  return (
    <div className="grid md:grid-cols-[240px_1fr] gap-6">
      <Pulse className="aspect-[2/3] rounded-lg" />
      <div>
        <Pulse className="h-8 w-3/4 mb-3" />
        <div className="flex gap-2 mb-4">
          <Pulse className="h-6 w-16" />
          <Pulse className="h-6 w-16" />
          <Pulse className="h-6 w-16" />
        </div>
        <Pulse className="h-4 w-full mb-2" />
        <Pulse className="h-4 w-full mb-2" />
        <Pulse className="h-4 w-2/3 mb-6" />
        <Pulse className="h-5 w-24 mb-2" />
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
          {Array.from({ length: 10 }).map((_, i) => (
            <Pulse key={i} className="h-10" />
          ))}
        </div>
      </div>
    </div>
  );
}
