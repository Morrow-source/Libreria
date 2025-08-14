import { AuthorSearch } from '@/components/author-search';
import { AuthorList } from '@/components/author-list';
import { Users, ArrowLeft, ArrowRight, Home } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

async function getAuthors(
  page,
  year
) {
  const params = new URLSearchParams();
  params.append('page', page.toString());
  if (year) {
    // We want authors who were alive during the given year.
    // This means their birth_year must be less than or equal to the year,
    // and their death_year must be greater than or equal to the year.
    params.append('author_year_start', String(year));
    params.append('author_year_end', String(year));
  }
  
  let authors = [];
  let hasNext = false;
  let hasPrev = false;

  try {
    const res = await fetch(`https://gutendex.com/books?${params.toString()}`);
    if (!res.ok) {
      console.error('Failed to fetch books for authors:', res.statusText);
      return { authors: [], hasNext: false, hasPrev: false };
    }
    const data = await res.json();
    
    // The API might return books with authors that don't fit the year criteria
    // because it's book-centric. We need to filter authors on the client-side.
    const allAuthors = new Map();
    data.results.forEach((book) => {
      book.authors.forEach((author) => {
        if (author.name && !allAuthors.has(author.name)) {
          if (year) {
            const birthYear = author.birth_year;
            const deathYear = author.death_year;
            // Only add author if they were alive in the given year.
            if (birthYear && birthYear <= year && (!deathYear || deathYear >= year)) {
               allAuthors.set(author.name, author);
            }
          } else {
             allAuthors.set(author.name, author);
          }
        }
      });
    });

    authors = Array.from(allAuthors.values());
    hasNext = !!data.next;
    hasPrev = !!data.previous;

  } catch (error) {
    console.error(error);
  }

  // Sort authors by name
  authors.sort((a, b) => a.name.localeCompare(b.name));

  return { authors, hasNext, hasPrev };
}

export default async function AuthorsPage({
  searchParams,
}) {
  const page = searchParams.page ? parseInt(searchParams.page, 10) : 1;
  const year = searchParams.year ? parseInt(searchParams.year, 10) : undefined;

  const { authors, hasNext, hasPrev } = await getAuthors(
    page,
    year && !isNaN(year) ? year : undefined
  );

  const createPageUrl = (newPage) => {
    const params = new URLSearchParams();
    if (year) params.set('year', String(year));
    params.set('page', newPage.toString());
    return `/authors?${params.toString()}`;
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <main className="flex-grow container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <div className="flex justify-center items-center gap-4 mb-2">
            <Users className="w-12 h-12 text-primary" />
            <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary">
              Authors
            </h1>
          </div>
          <p className="text-lg text-muted-foreground font-body">
            Explore authors from Project Gutenberg.
          </p>
        </header>

        <div className="flex justify-between items-center mb-8">
          <div className="flex-grow">
            <AuthorSearch />
          </div>
           <Button asChild variant="outline" className="ml-4">
            <Link href="/">
              <Home className="mr-2 h-4 w-4" /> Back to Books
            </Link>
          </Button>
        </div>

        <AuthorList authors={authors} />

        <div className="flex justify-center items-center gap-4 mt-12">
          {hasPrev && (
            <Button asChild variant="outline">
              <Link href={createPageUrl(page - 1)}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Previous
              </Link>
            </Button>
          )}
          <span className="text-muted-foreground">Page {page}</span>
          {hasNext && (
            <Button asChild variant="outline">
              <Link href={createPageUrl(page + 1)}>
                Next <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          )}
        </div>
      </main>
      <footer className="text-center py-6 border-t mt-12">
        <p className="text-sm text-muted-foreground font-body">
          Powered by the{' '}
          <a
            href="https://gutendex.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-primary transition-colors"
          >
            Gutendex API
          </a>
          .
        </p>
      </footer>
    </div>
  );
}
