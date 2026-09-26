import Player from "./player";

export default function WatchPage({ params }: { params: { slug: string } }) {
  return (
    <div>
      <h1 className="text-lg font-semibold mb-3">{params.slug.replace(/-/g, " ")}</h1>
      <Player slug={params.slug} />
    </div>
  );
}
