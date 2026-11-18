export interface Genre {
  slug: string;
  label: string;
  /** Open Library search query. */
  query: string;
}

export const GENRES: Genre[] = [
  {
    slug: "literatura-brasileira",
    label: "Literatura brasileira",
    query: 'subject:"brazilian literature"',
  },
  { slug: "ficcao-cientifica", label: "Ficção científica", query: 'subject:"science fiction"' },
  { slug: "fantasia", label: "Fantasia", query: 'subject:"fantasy"' },
  { slug: "misterio", label: "Mistério e suspense", query: 'subject:"mystery"' },
  { slug: "romance", label: "Romance", query: 'subject:"romance"' },
  { slug: "poesia", label: "Poesia", query: 'subject:"poetry"' },
  { slug: "historia", label: "História", query: 'subject:"history"' },
  { slug: "biografia", label: "Biografias", query: 'subject:"biography"' },
];

export function findGenre(slug: string): Genre | undefined {
  return GENRES.find((genre) => genre.slug === slug);
}
