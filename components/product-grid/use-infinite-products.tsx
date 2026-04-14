'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { useCallback, useEffect, useRef } from 'react';
import { productService, ProductFilters, Product } from '@/lib/services/product.service';

export interface UseInfiniteProductsOptions {
  initialFilters?: Partial<ProductFilters>;
  limit?: number;
}

export interface UseInfiniteProductsResult {
  products: Product[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
  refetch: () => void;
  allLoaded: boolean;
}

export function useInfiniteProducts(
  options: UseInfiniteProductsOptions = {}
): UseInfiniteProductsResult {
  const { initialFilters, limit = 12 } = options;
  
  const {
    data,
    isLoading,
    isError,
    error,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ['products', 'infinite', initialFilters],
    queryFn: ({ pageParam = 1 }) =>
      productService.getProducts({
        ...initialFilters,
        page: pageParam,
        limit,
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

  return {
    products,
    isLoading,
    isError,
    error: error as Error | null,
    hasNextPage: hasNextPage ?? false,
    isFetchingNextPage,
    fetchNextPage,
    refetch,
    allLoaded,
  };
}

export function useIntersectionObserver(
  callback: () => void,
  options: IntersectionObserverInit = {}
) {
  const targetRef = useRef<HTMLElement>(null);
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    const target = targetRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          callbackRef.current();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '100px',
        ...options,
      }
    );

    observer.observe(target);

    return () => observer.disconnect();
  }, [options]);

  return targetRef;
}