import { NextRequest, NextResponse } from "next/server";
import { resolveServerLive } from "@/lib/sanka";

export const dynamic = "force-dynamic";

export async function GET(_req: NextRequest, { params }: { params: { serverId: string } }) {
  try {
    const url = await resolveServerLive(params.serverId);
    if (!url) return NextResponse.json({ error: "Server tidak ditemukan" }, { status: 404 });
    return NextResponse.json({ url });
  } catch (err) {
    return NextResponse.json(
      { error: "Gagal resolve server", detail: (err as Error).message },
      { status: 502 }
    );
  }
}
