export type AnimeCard = {
  slug: string;
  title: string;
  thumbnail: string;
  episode?: string;
  updatedOn?: string;
  status?: string;
};

export type AnimeDetail = {
  slug: string;
  title: string;
  thumbnail: string;
  synopsis: string;
  genres: string[];
  status: string;
  episodes: { slug: string; title: string }[];
};

export type EpisodeStream = {
  slug: string;
  title: string;
  streamServers: { name: string; url: string }[];
  qualityServers: { quality: string; servers: { name: string; serverId: string }[] }[];
  downloadLinks: { resolution: string; links: { host: string; url: string }[] }[];
};
