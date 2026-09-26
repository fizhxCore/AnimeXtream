import { NextRequest, NextResponse } from "next/server";
import { searchAnimeLive } from "@/lib/sanka";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim();
  if (!q) return NextResponse.json({ error: "Parameter q wajib diisi" }, { status: 400 });

  try {
    const results = await searchAnimeLive(q);
    return NextResponse.json(results);
  } catch (err) {
    return NextResponse.json(
      { error: "Gagal search", detail: (err as Error).message },
      { status: 502 }
    );
  }
}
