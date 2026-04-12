'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ProductGrid } from '@/components/product-grid';
import { ProductSkeleton } from '@/components/product-skeleton';
import { productApi, ProductFilters, Product } from '@/lib/api/product';
import { Button } from '@/components/ui/button';

export default function ProductsPage() {
  const [filters, setFilters] = useState<ProductFilters>({
    page: 1,
    limit: 12,
    sortBy: 'createdAt',
    order: 'desc',
  });

  const [searchInput, setSearchInput] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const { data, isLoading, error, isError } = useQuery({
    queryKey: ['products', filters],
    queryFn: () => productApi.getProducts(filters),
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters((prev) => ({ ...prev, search: searchInput, page: 1 }));
  };

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setFilters((prev) => ({ ...prev, categoryId: categoryId || undefined, page: 1 }));
  };

  const handleSortChange = (sortBy: string) => {
    setFilters((prev) => ({ ...prev, sortBy: sortBy as ProductFilters['sortBy'], page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const products: Product[] = data?.data || [];
  const pagination = data?.pagination;

  return (
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
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="">All Categories</option>
            <option value="1">Electronics</option>
            <option value="2">Accessories</option>
            <option value="3">Storage</option>
          </select>

          <select
            value={`${filters.sortBy}-${filters.order}`}
            onChange={(e) => handleSortChange(e.target.value.split('-')[0])}
            className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="createdAt-desc">Newest</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name-asc">Name</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <ProductSkeleton count={12} />
      ) : isError ? (
        <div className="text-center py-12">
          <p className="text-destructive mb-4">Failed to load products</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      ) : (
        <>
          <ProductGrid products={products} />

          {pagination && pagination.totalPages > 1 && (
            <div className="mt-8 flex justify-center gap-2">
              <Button
                variant="outline"
                disabled={pagination.page <= 1}
                onClick={() => handlePageChange(pagination.page - 1)}
              >
                Previous
              </Button>
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={page === pagination.page ? 'default' : 'outline'}
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </Button>
              ))}
              <Button
                variant="outline"
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => handlePageChange(pagination.page + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}