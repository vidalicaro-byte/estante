export interface Shelf {
  title: string;
  /** Open Library search query. */
  query: string;
}

export const SHELVES: Shelf[] = [
  { title: "Machado de Assis", query: 'author:"Machado de Assis"' },
  { title: "Clarice Lispector", query: 'author:"Clarice Lispector"' },
  { title: "Guimarães Rosa", query: 'author:"João Guimarães Rosa"' },
  { title: "Lima Barreto", query: 'author:"Lima Barreto"' },
];
