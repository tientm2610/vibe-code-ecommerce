'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { ProductGrid } from '@/components/product-grid';
import { LoadingSkeleton } from '@/components/ui/skeleton';
import { ErrorState } from '@/components/ui/error-state';
import { EmptyState } from '@/components/ui/empty-state';
import { Button } from '@/components/ui/button';
import { PageTransition } from '@/components/animations';
import { productService, ProductFilters } from '@/lib/services/product.service';

export default function ProductsPage() {
  const [searchInput, setSearchInput] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState<ProductFilters['sortBy']>('createdAt');
  const [order, setOrder] = useState<ProductFilters['order']>('desc');
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const filters: Partial<ProductFilters> = {
    sortBy,
    order,
    categoryId: selectedCategory || undefined,
    search: searchInput || undefined,
  };

  const {
    data,
    isLoading,
    isError,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ['products', 'infinite', filters],
    queryFn: ({ pageParam = 1 }) =>
      productService.getProducts({
        ...filters,
        page: pageParam,
        limit: 12,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (!lastPage.pagination) return undefined;
      const { page, totalPages } = lastPage.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
  });

  const products = data?.pages.flatMap((page) => page.data) || [];
  const allLoaded = !hasNextPage && !isFetchingNextPage && (data?.pages.length ?? 0) > 0;

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { rootMargin: '100px', threshold: 0.1 }
    );

    const target = loadMoreRef.current;
    if (target) observer.observe(target);

    return () => {
      if (target) observer.unobserve(target);
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    refetch();
  };

  const handleClearFilters = useCallback(() => {
    setSearchInput('');
    setSelectedCategory('');
    setSortBy('createdAt');
    setOrder('desc');
  }, []);

  return (
    <PageTransition>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="text-muted-foreground mt-2">Browse our collection of products</p>
        </div>

        <div className="mb-6 space-y-4">
          <form onSubmit={handleSearch} className="flex gap-4">
            <input
              type="search"
              placeholder="Search products..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <Button type="submit">Search</Button>
          </form>

          <div className="flex flex-wrap gap-4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="">All Categories</option>
              <option value="1">Electronics</option>
              <option value="2">Accessories</option>
              <option value="3">Storage</option>
            </select>

            <select
              value={`${sortBy}-${order}`}
              onChange={(e) => {
                const [newSortBy, newOrder] = e.target.value.split('-') as [
                  ProductFilters['sortBy'],
                  ProductFilters['order']
                ];
                setSortBy(newSortBy);
                setOrder(newOrder);
              }}
              className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="createdAt-desc">Newest</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name-asc">Name</option>
            </select>
          </div>
        </div>

        {isLoading && products.length === 0 ? (
          <LoadingSkeleton type="card" count={12} />
        ) : isError ? (
          <ErrorState
            onRetry={() => refetch()}
            title="Failed to load products"
            message="We couldn't load the products. Please try again."
          />
        ) : products.length === 0 ? (
          <EmptyState
            type="search"
            title="No products found"
            description="Try adjusting your search or filters"
            actionLabel="Clear Filters"
            onAction={handleClearFilters}
          />
        ) : (
          <>
            <ProductGrid products={products} />

            <div ref={loadMoreRef} className="mt-8 flex justify-center">
              {isFetchingNextPage ? (
                <LoadingSkeleton type="card" count={4} />
              ) : allLoaded ? (
                <p className="text-muted-foreground text-sm">
                  You have reached the end
                </p>
              ) : (
                <Button
                  variant="outline"
                  onClick={() => fetchNextPage()}
                  disabled={!hasNextPage || isFetchingNextPage}
                >
                  Load More
                </Button>
              )}
            </div>
          </>
        )}
      </div>
    </PageTransition>
  );
}