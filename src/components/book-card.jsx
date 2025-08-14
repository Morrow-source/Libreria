import Image from 'next/image';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { User, Languages, Download } from 'lucide-react';

export function BookCard({ book }) {
  const author = book.authors[0]?.name || 'Unknown Author';
  const language = book.languages.join(', ').toUpperCase() || 'N/A';
  const downloadCount = book.download_count || 0;

  return (
    <Card className="flex flex-col h-full overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl hover:z-10">
      <CardHeader className="p-0">
        <div className="relative aspect-[2/3] w-full">
          <Image
            src={book.formats['image/jpeg'] || 'https://placehold.co/400x600.png'}
            alt={`Cover of ${book.title}`}
            fill
            className="object-cover rounded-t-md"
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
            data-ai-hint="book cover"
          />
        </div>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col p-4">
        <CardTitle className="text-lg font-headline leading-tight mb-2 h-14 line-clamp-2">
          {book.title}
        </CardTitle>
        <div className="mt-auto pt-2 border-t space-y-2 text-sm text-muted-foreground">
          <CardDescription className="flex items-center gap-2">
            <User className="w-4 h-4" />
            <span className="truncate">{author}</span>
          </CardDescription>
           <CardDescription className="flex items-center gap-2">
            <Languages className="w-4 h-4" />
            <span className="truncate">{language}</span>
          </CardDescription>
          <CardDescription className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            <span className="truncate">{downloadCount.toLocaleString()} downloads</span>
          </CardDescription>
        </div>
      </CardContent>
    </Card>
  );
}
