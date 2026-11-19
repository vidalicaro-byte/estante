import { describe, expect, it } from "vitest";
import { detectLanguage } from "./language";
import { preferPortuguese, toParagraphs, toSections } from "./text";

const EN_BIO =
  "Machado de Assis was a pioneer Brazilian novelist, poet, playwright and short story writer, widely regarded as the greatest writer of Brazilian literature.";
const PT_BIO =
  "Machado de Assis foi um escritor brasileiro, considerado por muitos críticos, estudiosos, escritores e leitores o maior nome da literatura brasileira. Escreveu em praticamente todos os gêneros literários.";

describe("detectLanguage", () => {
  it("recognizes English and Portuguese", () => {
    expect(detectLanguage(EN_BIO)).toBe("en");
    expect(detectLanguage(PT_BIO)).toBe("pt");
    expect(detectLanguage("Machado de Assis was a pioneer Brazilian novelist.")).toBe("en");
    expect(detectLanguage("Machado de Assis foi um escritor brasileiro.")).toBe("pt");
    expect(
      detectLanguage(
        "Who's crazy? This is the question proposed in this book. In this narrative, Machado de Assis tells the story of the eminent Dr. Simão Bacamarte.",
      ),
    ).toBe("en");
    expect(
      detectLanguage(
        "Dom Casmurro, publicado pela primeira vez em 1899, é um dos romances realistas mais importantes de Machado de Assis, considerado por alguns sua obra-prima.",
      ),
    ).toBe("pt");
  });

  it("gives up when there is no signal", () => {
    expect(detectLanguage("")).toBe("other");
    expect(detectLanguage("1899 — 1908")).toBe("other");
  });
});

describe("toSections", () => {
  it("splits translations at the separator line (CRLF input)", () => {
    const raw = `${EN_BIO}\r\n\r\n----------\r\n\r\n${PT_BIO}`;
    expect(toSections(raw)).toEqual([
      { language: "en", paragraphs: [EN_BIO] },
      { language: "pt", paragraphs: [PT_BIO] },
    ]);
  });

  it("handles a separator written without blank lines around it", () => {
    const sections = toSections(`${EN_BIO}\n----------\n${PT_BIO}`);
    expect(sections.map((section) => section.language)).toEqual(["en", "pt"]);
  });

  it("keeps a single section when there is no separator, and accepts { value }", () => {
    const sections = toSections({
      value: "**Dom Casmurro**, um romance.\r\n\r\nSegundo parágrafo, que continua.",
    });
    expect(sections).toHaveLength(1);
    expect(sections[0]?.paragraphs).toEqual([
      "Dom Casmurro, um romance.",
      "Segundo parágrafo, que continua.",
    ]);
  });

  it("returns nothing for empty input", () => {
    expect(toSections(undefined)).toEqual([]);
    expect(toSections("  \n\n ---- \n\n ")).toEqual([]);
  });
});

describe("preferPortuguese", () => {
  it("moves Portuguese first and keeps the rest in order", () => {
    const sections = toSections(`${EN_BIO}\n\n----------\n\n${PT_BIO}`);
    expect(preferPortuguese(sections).map((section) => section.language)).toEqual(["pt", "en"]);
  });

  it("keeps the order when nothing is Portuguese", () => {
    const sections = toSections(`${EN_BIO}\n\n----------\n\n1899`);
    expect(preferPortuguese(sections).map((section) => section.language)).toEqual(["en", "other"]);
  });
});

describe("toParagraphs", () => {
  it("flattens sections and drops separators", () => {
    expect(toParagraphs(`${EN_BIO}\r\n\r\n----------\r\n\r\n${PT_BIO}`)).toEqual([EN_BIO, PT_BIO]);
  });
});
