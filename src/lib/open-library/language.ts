import type { TextLanguage } from "./types";

// Small stop-word lists. "de"/"da"/"do" are left out on purpose: they show up inside
// names ("Machado de Assis") and would skew English text.
const PORTUGUESE = new Set([
  "que",
  "não",
  "foi",
  "com",
  "para",
  "por",
  "uma",
  "um",
  "os",
  "em",
  "ao",
  "pelo",
  "pela",
  "seu",
  "sua",
  "dos",
  "das",
  "também",
  "mais",
  "entre",
  "sobre",
  "são",
  "ser",
  "como",
  "muito",
  "é",
  "nos",
  "nas",
  "ou",
]);

const ENGLISH = new Set([
  "the",
  "and",
  "of",
  "was",
  "is",
  "with",
  "for",
  "by",
  "that",
  "his",
  "her",
  "from",
  "which",
  "are",
  "this",
  "an",
  "it",
  "he",
  "she",
  "who",
  "has",
  "have",
  "been",
  "were",
  "their",
  "its",
  "to",
  "in",
  "on",
  "at",
  "be",
]);

/** Rough pt/en guess by counting stop words. Good enough to order bios, not a real detector. */
export function detectLanguage(text: string): TextLanguage {
  let portuguese = 0;
  let english = 0;

  for (const word of text.toLowerCase().match(/\p{L}+/gu) ?? []) {
    if (PORTUGUESE.has(word)) portuguese++;
    else if (ENGLISH.has(word)) english++;
  }

  if (portuguese > english) return "pt";
  if (english > portuguese) return "en";
  return "other";
}
