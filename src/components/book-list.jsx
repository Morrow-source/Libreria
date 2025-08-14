'use client';

import { BookCard } from './book-card';
import { Frown } from 'lucide-react';

export function BookList({ books }) {
  if (books.length === 0) {
    return (
      <div className="text-center text-muted-foreground col-span-full mt-16 flex flex-col items-center gap-4">
        <Frown className="w-16 h-16 text-primary/50" />
        <p className="font-headline text-2xl">No books found.</p>
        <p className="font-body">Try a different search query or check for typos.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {books.map((book, index) => (
        <div
          key={book.id}
          className="animate-in fade-in-0 slide-in-from-bottom-5"
          style={{
            animationDelay: `${index * 50}ms`,
            animationFillMode: 'backwards',
          }}
        >
          <BookCard book={book} />
        </div>
      ))}
    </div>
  );
}
