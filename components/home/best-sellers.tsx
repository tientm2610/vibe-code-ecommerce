'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { ProductCard } from '@/components/product-card';

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  originalPrice: number | null;
  imageUrl: string | null;
  sku: string;
  badge: string | null;
  stock: number;
}

interface BestSellersProps {
  products: Product[];
  title?: string;
  subtitle?: string;
}

export function BestSellers({ 
  products, 
  title = 'Best Sellers', 
  subtitle = 'Top picks from our customers' 
}: BestSellersProps) {
  const badgeMap: Record<string, 'sale' | 'new' | 'hot'> = {
    sale: 'sale',
    new: 'new',
    hot: 'hot',
  };

  return (
    <section className="py-16 md:py-24 bg-slate-50 dark:bg-slate-900/30">
      <div className="container mx-auto px-4">
        <div className="flex items-end justify-between mb-10">
          <div>
            <span className="text-sm font-medium text-primary">Popular</span>
            <h2 className="text-2xl md:text-3xl font-bold mt-1">{title}</h2>
            <p className="text-muted-foreground mt-2">{subtitle}</p>
          </div>
          <Link href="/products?sort=bestsellers" className="hidden md:flex items-center gap-1 text-primary hover:gap-2 transition-all">
            View All <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <ProductCard
                id={product.id}
                name={product.name}
                description={product.description}
                price={product.price}
                imageUrl={product.imageUrl}
                sku={product.sku}
                originalPrice={product.originalPrice || undefined}
                badge={product.badge ? badgeMap[product.badge] : undefined}
                stock={product.stock}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
