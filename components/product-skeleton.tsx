'use client';

import { Card, CardContent,  } from '@/components/ui/card';

interface ProductSkeletonProps {
  count?: number;
}

export function ProductSkeleton({ count = 8 }: ProductSkeletonProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i} className="overflow-hidden">
          <div className="aspect-square bg-slate-200 animate-pulse" />
          <CardContent className="p-4 space-y-2">
            <div className="h-5 bg-slate-200 rounded animate-pulse w-3/4" />
            <div className="h-4 bg-slate-200 rounded animate-pulse w-full" />
            <div className="h-3 bg-slate-200 rounded animate-pulse w-1/2" />
          </CardContent>
          {/* <CardFooter className="p-4 pt-0 flex justify-between">
            <div className="h-6 bg-slate-200 rounded animate-pulse w-20" />
            <div className="h-8 bg-slate-200 rounded animate-pulse w-24" />
          </CardFooter> */}
        </Card>
      ))}
    </div>
  );
}