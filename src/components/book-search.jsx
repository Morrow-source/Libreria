'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search } from 'lucide-react';
import { Card } from '@/components/ui/card';

export function BookSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState('popular');
  const [language, setLanguage] = useState('all');

  useEffect(() => {
    setQuery(searchParams.get('search') || '');
    setSort(searchParams.get('sort') || 'popular');
    setLanguage(searchParams.get('languages') || 'all');
  }, [searchParams]);

  const updateUrlParams = (
    newQuery,
    newSort,
    newLanguage
  ) => {
    const params = new URLSearchParams();
    if (newQuery) {
      params.set('search', newQuery);
    }
    if (newSort) {
      params.set('sort', newSort);
    }
    if (newLanguage && newLanguage !== 'all') {
      params.set('languages', newLanguage);
    }
    // Reset to page 1 for new searches/filters
    params.set('page', '1');
    router.push(`/?${params.toString()}`);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateUrlParams(query, sort, language);
  };

  const handleSortChange = (value) => {
    setSort(value);
    updateUrlParams(query, value, language);
  };

  const handleLanguageChange = (value) => {
    setLanguage(value);
    updateUrlParams(query, sort, value);
  };

  return (
    <Card className="p-4 md:p-6 shadow-md bg-card/80 backdrop-blur-sm">
      <form
        onSubmit={handleSearchSubmit}
        className="flex flex-col md:flex-row items-center gap-4 flex-grow"
      >
        <div className="relative w-full md:flex-grow">
          <Input
            type="text"
            placeholder="Search by title or author..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10 h-12 text-base"
            aria-label="Search for books"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <Select value={language} onValueChange={handleLanguageChange}>
            <SelectTrigger
              className="w-full md:w-[180px] h-12 text-base"
              aria-label="Filter by language"
            >
              <SelectValue placeholder="Language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any Language</SelectItem>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="fr">French</SelectItem>
              <SelectItem value="es">Spanish</SelectItem>
              <SelectItem value="de">German</SelectItem>
              <SelectItem value="it">Italian</SelectItem>
              <SelectItem value="pt">Portuguese</SelectItem>
              <SelectItem value="fi">Finnish</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sort} onValueChange={handleSortChange}>
            <SelectTrigger
              className="w-full md:w-[180px] h-12 text-base"
              aria-label="Sort by"
            >
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="popular">Popularity</SelectItem>
              <SelectItem value="ascending">Title (A-Z)</SelectItem>
              <SelectItem value="descending">Title (Z-A)</SelectItem>
            </SelectContent>
          </Select>
          <Button type="submit" size="lg" className="h-12 px-6 font-headline">
            Search
          </Button>
        </div>
      </form>
    </Card>
  );
}
