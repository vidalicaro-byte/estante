export interface Genre {
  slug: string;
  label: string;
  /** One-line editorial text shown on the genre page. */
  blurb: string;
  /** Open Library search query. */
  query: string;
}

export const GENRES: Genre[] = [
  {
    slug: "literatura-brasileira",
    label: "Literatura brasileira",
    blurb:
      "Romances, contos e crônicas que contam o Brasil, dos clássicos do século XIX à produção contemporânea.",
    query: 'subject:"brazilian literature"',
  },
  {
    slug: "ficcao-cientifica",
    label: "Ficção científica",
    blurb: "Futuros possíveis, outros mundos e as grandes perguntas sobre tecnologia e humanidade.",
    query: 'subject:"science fiction"',
  },
  {
    slug: "fantasia",
    label: "Fantasia",
    blurb: "Magia, reinos imaginários e jornadas épicas, dos clássicos às sagas mais recentes.",
    query: 'subject:"fantasy"',
  },
  {
    slug: "misterio",
    label: "Mistério e suspense",
    blurb: "Crimes, segredos e reviravoltas para ler sem conseguir parar.",
    query: 'subject:"mystery"',
  },
  {
    slug: "romance",
    label: "Romance",
    blurb: "Histórias de amor, desencontros e reencontros em todas as épocas.",
    query: 'subject:"romance"',
  },
  {
    slug: "poesia",
    label: "Poesia",
    blurb: "Versos para ler devagar, de poetas consagrados a vozes novas.",
    query: 'subject:"poetry"',
  },
  {
    slug: "historia",
    label: "História",
    blurb: "O passado em perspectiva: povos, guerras, ideias e transformações.",
    query: 'subject:"history"',
  },
  {
    slug: "biografia",
    label: "Biografias",
    blurb: "Vidas contadas de perto: pessoas que marcaram a sua época.",
    query: 'subject:"biography"',
  },
];

export function findGenre(slug: string): Genre | undefined {
  return GENRES.find((genre) => genre.slug === slug);
}
