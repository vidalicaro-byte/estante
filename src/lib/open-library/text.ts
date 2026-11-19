import { detectLanguage } from "./language";
import type { TextSection } from "./types";

function readText(value: string | { value: string } | undefined): string {
  if (value === undefined) return "";
  return typeof value === "string" ? value : value.value;
}

function stripMarkdown(text: string): string {
  return text
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/(\*\*|__)/g, "")
    .trim();
}

const SEPARATOR = /^[-=_*\s]{3,}$/;

/**
 * Splits free text into sections of clean paragraphs. A line made only of dashes
 * (Open Library puts "----------" between translations) starts a new section.
 */
function splitSections(value: string | { value: string } | undefined): string[][] {
  const text = readText(value)
    .replace(/\r\n?/g, "\n")
    // Make sure a separator line always sits in its own paragraph.
    .replace(/^[ \t]*[-=_*]{3,}[ \t]*$/gm, "\n$&\n");

  let current: string[] = [];
  const sections = [current];
  for (const raw of text.split(/\n{2,}/)) {
    const paragraph = stripMarkdown(raw);
    if (paragraph === "") continue;
    if (SEPARATOR.test(paragraph)) {
      current = [];
      sections.push(current);
    } else {
      current.push(paragraph);
    }
  }
  return sections.filter((section) => section.length > 0);
}

/** Flat list of clean paragraphs, separators dropped. */
export function toParagraphs(value: string | { value: string } | undefined): string[] {
  return splitSections(value).flat();
}

export function toSections(value: string | { value: string } | undefined): TextSection[] {
  return splitSections(value).map((paragraphs) => ({
    language: detectLanguage(paragraphs.join(" ")),
    paragraphs,
  }));
}

/** Portuguese sections first (the site is in pt-BR); everything else keeps its order. */
export function preferPortuguese(sections: TextSection[]): TextSection[] {
  return [
    ...sections.filter((section) => section.language === "pt"),
    ...sections.filter((section) => section.language !== "pt"),
  ];
}
