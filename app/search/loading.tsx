function Pulse({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-md ${className}`}
      style={{ backgroundColor: "var(--surface)" }}
    />
  );
}

export default function SearchLoading() {
  return (
    <div>
      <Pulse className="h-6 w-56 mb-4" />
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <Pulse key={i} className="aspect-[2/3]" />
        ))}
      </div>
    </div>
  );
}
