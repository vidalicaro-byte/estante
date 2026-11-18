import type { CardBook } from "@/lib/card-book";
import { BookCard } from "./book-card";

export function BookGrid({
  books,
  eagerCount = 0,
}: {
  books: CardBook[];
  /** How many of the first covers are above the fold and should load eagerly. */
  eagerCount?: number;
}) {
  return (
    <ul className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-4 lg:grid-cols-5">
      {books.map((book, index) => (
        <li key={book.id}>
          <BookCard book={book} eager={index < eagerCount} />
        </li>
      ))}
    </ul>
  );
}
