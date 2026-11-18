import type { MetadataRoute } from "next";
import { getFeaturedAuthorIds, getFeaturedWorkIds } from "@/lib/catalog";
import { GENRES } from "@/lib/genres";
import { SITE_URL } from "@/lib/site";

/** Lists the pages prerendered at build time; the rest is discovered through links. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [workIds, authorIds] = await Promise.all([getFeaturedWorkIds(), getFeaturedAuthorIds()]);

  const entry = (path: string, priority: number) => ({ url: `${SITE_URL}${path}`, priority });

  return [
    entry("/", 1),
    ...GENRES.map((genre) => entry(`/generos/${genre.slug}`, 0.7)),
    ...workIds.map((id) => entry(`/livros/${id}`, 0.8)),
    ...authorIds.map((id) => entry(`/autores/${id}`, 0.6)),
  ];
}
