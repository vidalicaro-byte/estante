import type { Shelf } from "./shelves";

const authorShelf = (title: string, key: string): Shelf => ({
  title,
  query: `author_key:${key}`,
});

/** Curated by author: subject searches for "classics" return unrelated books. */
export const CLASSIC_SHELVES: Shelf[] = [
  authorShelf("Homero", "OL5988788A"),
  authorShelf("Dante Alighieri", "OL29303A"),
  authorShelf("Miguel de Cervantes", "OL66452A"),
  authorShelf("William Shakespeare", "OL9388A"),
  authorShelf("Jane Austen", "OL21594A"),
  authorShelf("Charles Dickens", "OL24638A"),
  authorShelf("Victor Hugo", "OL107571A"),
  authorShelf("Gustave Flaubert", "OL79039A"),
  authorShelf("Fiódor Dostoiévski", "OL22242A"),
  authorShelf("Liev Tolstói", "OL26783A"),
  authorShelf("Franz Kafka", "OL33146A"),
  authorShelf("Eça de Queirós", "OL73090A"),
];

export interface Genre {
  slug: string;
  label: string;
  /** One-line editorial text shown on the genre page. */
  blurb: string;
  /** Open Library search query. */
  query: string;
  /** When present, the genre page shows one shelf per entry instead of a single list. */
  shelves?: Shelf[];
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
    slug: "classicos",
    label: "Clássicos",
    blurb:
      "Os livros que atravessaram séculos: da épica de Homero aos grandes romances do século XIX.",
    query: `author_key:(${CLASSIC_SHELVES.map((shelf) => shelf.query.replace("author_key:", "")).join(" OR ")})`,
    shelves: CLASSIC_SHELVES,
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
