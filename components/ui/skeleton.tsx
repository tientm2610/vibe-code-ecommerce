import { cn } from '@/lib/utils';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'circular' | 'text';
}

export function Skeleton({ className, variant = 'default', ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse bg-muted',
        variant === 'circular' && 'rounded-full',
        variant === 'text' && 'h-4 rounded',
        variant === 'default' && 'rounded-md',
        className
      )}
      {...props}
    />
  );
}

interface LoadingSkeletonProps {
  type?: 'card' | 'list' | 'table' | 'detail';
  count?: number;
  className?: string;
}

export function LoadingSkeleton({ type = 'card', count = 4, className }: LoadingSkeletonProps) {
  if (type === 'card') {
    return (
      <div className={cn('grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6', className)}>
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="bg-card rounded-xl overflow-hidden border">
            <Skeleton className="aspect-square rounded-none" />
            <div className="p-4 space-y-3">
              <Skeleton className="h-5 w-3/4" variant="text" />
              <Skeleton className="h-4 w-full" variant="text" />
              <Skeleton className="h-4 w-1/2" variant="text" />
              <div className="flex justify-between pt-2">
                <Skeleton className="h-6 w-24" variant="text" />
                <Skeleton className="h-9 w-28" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'list') {
    return (
      <div className={cn('space-y-3', className)}>
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 p-4 bg-card rounded-lg border">
            <Skeleton className="h-12 w-12 rounded-lg" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-1/3" variant="text" />
              <Skeleton className="h-4 w-1/2" variant="text" />
            </div>
            <Skeleton className="h-9 w-24" />
          </div>
        ))}
      </div>
    );
  }

  if (type === 'table') {
    return (
      <div className={cn('bg-card rounded-xl border overflow-hidden', className)}>
        <div className="grid grid-cols-4 gap-4 p-4 border-b bg-muted/50">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-4 w-20" variant="text" />
          ))}
        </div>
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="grid grid-cols-4 gap-4 p-4 border-b last:border-0">
            {Array.from({ length: 4 }).map((_, j) => (
              <Skeleton key={j} className="h-4" variant="text" />
            ))}
          </div>
        ))}
      </div>
    );
  }

  // detail
  return (
    <div className={cn('grid md:grid-cols-2 gap-8', className)}>
      <Skeleton className="aspect-square rounded-xl" />
      <div className="space-y-4">
        <Skeleton className="h-6 w-32" variant="text" />
        <Skeleton className="h-8 w-3/4" variant="text" />
        <Skeleton className="h-10 w-1/3" variant="text" />
        <Skeleton className="h-20 w-full" />
        <div className="flex gap-4 pt-4">
          <Skeleton className="h-12 flex-1" />
          <Skeleton className="h-12 flex-1" />
        </div>
      </div>
    </div>
  );
}
