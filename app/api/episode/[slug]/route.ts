import { NextRequest, NextResponse } from "next/server";
import { getEpisodeStreamLive } from "@/lib/sanka";

export const dynamic = "force-dynamic";

export async function GET(_req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const data = await getEpisodeStreamLive(params.slug);
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { error: "Gagal ambil link streaming", detail: (err as Error).message },
      { status: 502 }
    );
  }
}
