import { z } from "zod";
import type { BookSummary } from "@/lib/open-library";

export const cardBookSchema = z.object({
  id: z.string().regex(/^OL\d+W$/),
  title: z.string(),
  authors: z.string(),
  coverId: z.number().int().positive().optional(),
  firstPublishYear: z.number().int().optional(),
});

export type CardBook = z.infer<typeof cardBookSchema>;

export function toCardBook(book: BookSummary): CardBook {
  return {
    id: book.id,
    title: book.title,
    authors: book.authors.map((author) => author.name).join(", "),
    coverId: book.coverId,
    firstPublishYear: book.firstPublishYear,
  };
}
