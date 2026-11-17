export const searchFixture = {
  numFound: 85,
  start: 0,
  numFoundExact: true,
  q: "dom casmurro",
  offset: null,
  docs: [
    {
      author_key: ["OL93286A"],
      author_name: ["Machado de Assis"],
      cover_i: 647501,
      first_publish_year: 1899,
      key: "/works/OL1003040W",
      language: ["fre", "por"],
      title: "Dom Casmurro",
      subject: ["Fiction", "Brazilian literature"],
    },
    {
      author_key: ["OL12495093A"],
      author_name: ["Joaquim Maria Machado de Assis"],
      first_publish_year: 2020,
      key: "/works/OL35798215W",
      language: ["por"],
      title: "Dom Casmurro : a Novel",
    },
  ],
};

export const workFixture = {
  key: "/works/OL1003040W",
  title: "Dom Casmurro",
  authors: [{ author: { key: "/authors/OL93286A" }, type: { key: "/type/author_role" } }],
  covers: [647501, 123224, -1, 2152130],
  subjects: ["Fiction", "Brazilian literature"],
  description: {
    type: "/type/text",
    value: "**Dom Casmurro**, publicado em 1899, é um romance realista.\r\n\r\nSegundo parágrafo.",
  },
  links: [
    {
      title: "Free eBook",
      url: "https://projectoadamastor.org/dom-casmurro-machado-de-assis/",
      type: { key: "/type/link" },
    },
    { title: "Malicious", url: "javascript:alert(1)", type: { key: "/type/link" } },
  ],
};

export const authorFixture = {
  key: "/authors/OL93286A",
  name: "Machado de Assis",
  birth_date: "21 June 1839",
  death_date: "29 September 1908",
  photos: [8569287, -1],
  bio: "Machado de Assis was a pioneer Brazilian novelist.\r\n\r\n----------\r\n\r\nMachado de Assis foi um escritor brasileiro.",
  links: [
    {
      title: "Wikipédia",
      url: "https://pt.wikipedia.org/wiki/Machado_de_Assis",
      type: { key: "/type/link" },
    },
  ],
};
