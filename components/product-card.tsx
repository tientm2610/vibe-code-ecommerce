'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { cartApi } from '@/lib/api/cart';
import { useAuthStore } from '@/lib/auth-store';
import { useToast } from '@/components/toast';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface ProductCardProps {
  id: string;
  name: string;
  description: string | null;
  price: number;
  imageUrl: string | null;
  sku: string;
}

export function ProductCard({ id, name, description, price, imageUrl, sku }: ProductCardProps) {
  const { isAuthenticated } = useAuthStore();
  const { showToast } = useToast();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isAdded, setIsAdded] = useState(false);

  const addMutation = useMutation({
    mutationFn: () => cartApi.addItem(id, 1),
    onSuccess: () => {
      setIsAdded(true);
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      showToast('Added to cart', 'success');
      setTimeout(() => setIsAdded(false), 2000);
    },
    onError: (error: Error) => {
      showToast(error.message, 'error');
    },
  });

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    addMutation.mutate();
  };

  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);

  return (
    <Card className="overflow-hidden group">
      <Link href={`/products/${id}`}>
        <div className="aspect-square relative overflow-hidden bg-slate-100">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              No Image
            </div>
          )}
        </div>
      </Link>
      <CardContent className="p-4">
        <Link href={`/products/${id}`}>
          <h3 className="font-semibold text-lg truncate hover:text-primary transition-colors">
            {name}
          </h3>
        </Link>
        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
          {description || 'No description available'}
        </p>
        <p className="text-xs text-muted-foreground mt-2">SKU: {sku}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex items-center justify-between">
        <span className="text-lg font-bold">{formattedPrice}</span>
        <Button size="sm" variant="outline" onClick={handleAddToCart} disabled={addMutation.isPending}>
          {isAdded ? (
            <>
              <Check className="h-4 w-4 mr-2" />
              Added
            </>
          ) : (
            <>
              <ShoppingCart className="h-4 w-4 mr-2" />
              Add to Cart
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}