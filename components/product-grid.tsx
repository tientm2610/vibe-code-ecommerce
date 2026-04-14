'use client';

import { ProductCard } from './product-card';
import { EmptyState } from '@/components/ui/empty-state';

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  imageUrl: string | null;
  sku: string;
  originalPrice?: number;
  badge?: 'sale' | 'new' | 'hot';
  stock?: number;
}

interface ProductGridProps {
  products: Product[];
  loading?: boolean;
  onBrowse?: () => void;
}

export function ProductGrid({ products, loading, onBrowse }: ProductGridProps) {
  if (!loading && products.length === 0) {
    return (
      <EmptyState
        type="products"
        title="No products found"
        description="We couldn't find any products matching your criteria."
        actionLabel="Clear filters"
        onAction={onBrowse}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          id={product.id}
          name={product.name}
          description={product.description}
          price={product.price}
          imageUrl={product.imageUrl}
          sku={product.sku}
          originalPrice={product.originalPrice}
          badge={product.badge}
          stock={product.stock}
        />
      ))}
    </div>
  );
}
