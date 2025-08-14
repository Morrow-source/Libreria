'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Search } from 'lucide-react';

export function AuthorSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [year, setYear] = useState('');

  useEffect(() => {
    setYear(searchParams.get('year') || '');
  }, [searchParams]);

  const updateUrlParams = (newYear) => {
    const params = new URLSearchParams();
    if (newYear) {
      params.set('year', newYear);
    }
    // Reset to page 1 for new filters
    params.set('page', '1');
    router.push(`/authors?${params.toString()}`);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateUrlParams(year);
  };

  const handleClear = () => {
    setYear('');
    const params = new URLSearchParams();
    params.set('page', '1');
    router.push(`/authors?${params.toString()}`);
  }

  return (
    <Card className="p-4 shadow-md bg-card/80 backdrop-blur-sm">
      <form
        onSubmit={handleSearchSubmit}
        className="flex flex-col sm:flex-row items-center gap-4"
      >
        <div className="relative w-full sm:flex-grow">
          <Input
            type="number"
            placeholder="List authors alive in year..."
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="pl-10 h-12 text-base"
            aria-label="Filter authors by year"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        </div>
        <Button type="submit" size="lg" className="h-12 px-6 font-headline">
          Filter
        </Button>
        {year && (
          <Button
            type="button"
            variant="ghost"
            onClick={handleClear}
          >
            Clear
          </Button>
        )}
      </form>
    </Card>
  );
}
