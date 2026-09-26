import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center text-center py-20">
      <p className="font-display text-6xl font-bold mb-2" style={{ color: "var(--accent)" }}>
        404
      </p>
      <h1 className="font-display text-xl font-bold mb-2">Halaman/anime nggak ketemu</h1>
      <p className="text-sm mb-6 max-w-sm" style={{ color: "var(--text-muted)" }}>
        Mungkin slug-nya salah ketik, atau datanya belum ada di sumber Sanka API.
      </p>
      <Link
        href="/"
        className="font-semibold text-sm px-5 py-2.5 rounded"
        style={{ backgroundColor: "var(--accent)", color: "#0b0c12" }}
      >
        Kembali ke Beranda
      </Link>
    </div>
  );
}
