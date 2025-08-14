'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Frown, BookUser } from 'lucide-react';

export function AuthorList({ authors }) {
  if (authors.length === 0) {
    return (
      <div className="text-center text-muted-foreground col-span-full mt-16 flex flex-col items-center gap-4">
        <Frown className="w-16 h-16 text-primary/50" />
        <p className="font-headline text-2xl">No authors found.</p>
        <p className="font-body">
          Try a different year or clear the filter.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {authors.map((author, index) => (
        <div
          key={author.name + index}
          className="animate-in fade-in-0 slide-in-from-bottom-5"
          style={{
            animationDelay: `${index * 50}ms`,
            animationFillMode: 'backwards',
          }}
        >
          <Card className="flex flex-col h-full text-center">
            <CardHeader>
              <div className="flex justify-center mb-4">
                  <BookUser className="w-16 h-16 text-primary" />
              </div>
              <CardTitle className="font-headline">{author.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                {author.birth_year} - {author.death_year || 'Present'}
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  );
}
