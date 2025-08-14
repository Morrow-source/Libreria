import { BookSearch } from '@/components/book-search';
import { BookList } from '@/components/book-list';
import { BookOpenText, ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Users } from 'lucide-react';

async function getBooks(
  page,
  search,
  sort,
  languages
) {
  const params = new URLSearchParams();
  params.append('page', page.toString());
  if (search) params.append('search', search);
  if (sort) {
    params.append('sort', sort);
  } else {
    params.append('sort', 'popular');
  }
  if (languages) params.append('languages', languages);

  try {
    const res = await fetch(`https://gutendex.com/books?${params.toString()}`);
    if (!res.ok) {
      console.error('Failed to fetch books:', res.statusText);
      return { books: [], hasNext: false, hasPrev: false };
    }
    const data = await res.json();
    return {
      books: data.results,
      hasNext: !!data.next,
      hasPrev: !!data.previous,
    };
  } catch (error) {
    console.error(error);
    return { books: [], hasNext: false, hasPrev: false };
  }
}

export default async function Home({
  searchParams,
}) {
  const page = searchParams.page ? parseInt(searchParams.page, 10) : 1;
  const search = searchParams.search || undefined;
  const sort = searchParams.sort || undefined;
  const languages = searchParams.languages || undefined;

  const { books, hasNext, hasPrev } = await getBooks(
    page,
    search,
    sort,
    languages
  );

  const createPageUrl = (newPage) => {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (sort) params.set('sort', sort);
    if (languages) params.set('languages', languages);
    params.set('page', newPage.toString());
    return `/?${params.toString()}`;
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <main className="flex-grow container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <div className="flex justify-center items-center gap-4 mb-2">
            <BookOpenText className="w-12 h-12 text-primary" />
            <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary">
              Gutendex Explorer
            </h1>
          </div>
          <p className="text-lg text-muted-foreground font-body">
            Discover classic literature from Project Gutenberg.
          </p>
        </header>

        <div className="flex justify-between items-center mb-8">
          <div className="flex-grow">
            <BookSearch />
          </div>
          <Button asChild variant="outline" className="ml-4">
            <Link href="/authors">
              <Users className="mr-2 h-4 w-4" /> Browse Authors
            </Link>
          </Button>
        </div>

        <BookList books={books} />

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
