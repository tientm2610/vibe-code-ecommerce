'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Check, Flame } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { cartService } from '@/lib/services/cart.service';
import { useAuthStore } from '@/lib/auth-store';
// import { useToast } from '@/components/toast';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

type BadgeType = 'sale' | 'new' | 'hot' | null;

interface ProductCardProps {
  id: string;
  name: string;
  description: string | null;
  price: number;
  imageUrl: string | null;
  sku: string;
  originalPrice?: number;
  badge?: BadgeType;
  stock?: number;
}

export function ProductCard({ 
  id, 
  name, 
  description, 
  price, 
  imageUrl, 
  sku,
  originalPrice,
  badge = null,
  stock = 10
}: ProductCardProps) {
  const { isAuthenticated } = useAuthStore();
  // const { showToast } = useToast();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isAdded, setIsAdded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const isOnSale = originalPrice && originalPrice > price;
  const discount = isOnSale ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;
  const isOutOfStock = stock === 0;

  const addMutation = useMutation({
    mutationFn: () => cartService.addItem(id, 1),
    onSuccess: () => {
      setIsAdded(true);
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      // showToast('Added to cart', 'success');
      setTimeout(() => setIsAdded(false), 2000);
    },
    onError: (error: Error) => {
      // showToast(error.message, 'error');
    },
  });

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    if (isOutOfStock) return;
    addMutation.mutate();
  };

  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);

  const formattedOriginalPrice = originalPrice 
    ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(originalPrice)
    : null;

  const badgeColors = {
    sale: 'bg-red-500 text-white',
    new: 'bg-green-500 text-white',
    hot: 'bg-orange-500 text-white',
  };

  const badgeLabels = {
    sale: `-${discount}%`,
    new: 'New',
    hot: 'Hot',
  };

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.2 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="h-full"
    >
      <Card className="overflow-hidden group h-full flex flex-col relative">
        {/* Badge */}
        {badge && (
          <div className={`absolute top-3 left-3 z-10 px-2.5 py-1 rounded-full text-xs font-semibold ${badgeColors[badge]}`}>
            {badge === 'sale' && <span>{badgeLabels.sale}</span>}
            {badge === 'new' && <span>{badgeLabels.new}</span>}
            {badge === 'hot' && <span className="flex items-center gap-1"><Flame className="w-3 h-3" />{badgeLabels.hot}</span>}
          </div>
        )}

        {/* Quick Add Button - appears on hover */}
        <AnimatePresence>
          {isHovered && !isOutOfStock && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.15 }}
              className="absolute top-3 right-3 z-10"
            >
              <motion.div whileTap={{ scale: 0.9 }}>
                <Button
                  size="icon"
                  variant="secondary"
                  onClick={handleAddToCart}
                  disabled={addMutation.isPending}
                  className="h-9 w-9 shadow-md"
                >
                  {isAdded ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <ShoppingCart className="h-4 w-4" />
                  )}
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <Link href={`/products/${id}`} className="block">
          <div className="aspect-square relative overflow-hidden bg-muted rounded-t-xl">
            {imageUrl ? (
              <motion.div
                animate={{ scale: isHovered ? 1.08 : 1 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className="absolute inset-0"
              >
                <Image
                  src={imageUrl}
                  alt={name}
                  fill
                  className="object-cover"
                  priority={false}
                />
              </motion.div>
            ) : (
              <div className="flex items-center justify-center h-full bg-slate-100">
                <span className="text-muted-foreground text-sm">No Image</span>
              </div>
            )}

            {/* Overlay gradient on hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Out of stock overlay */}
            {isOutOfStock && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <span className="bg-slate-900 text-white px-4 py-1.5 rounded-full text-sm font-medium">
                  Out of Stock
                </span>
              </div>
            )}
          </div>
        </Link>

        <CardContent className="p-4 flex-1">
          <Link href={`/products/${id}`}>
            <h3 className="font-semibold text-sm sm:text-base truncate hover:text-primary transition-colors line-clamp-2 min-h-[2.5rem]">
              {name}
            </h3>
          </Link>
          
          {description && (
            <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 mt-1.5">
              {description}
            </p>
          )}

          {/* Price section */}
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-lg sm:text-xl font-bold text-primary">
              {formattedPrice}
            </span>
            {isOnSale && formattedOriginalPrice && (
              <span className="text-sm text-muted-foreground line-through">
                {formattedOriginalPrice}
              </span>
            )}
          </div>

          {/* Stock indicator */}
          {!isOutOfStock && stock <= 5 && (
            <p className="text-xs text-orange-600 mt-1.5 font-medium">
              Only {stock} left in stock
            </p>
          )}
        </CardContent>

        <CardFooter className="p-4 pt-0">
          <motion.div 
            whileTap={{ scale: 0.95 }} 
            className="w-full"
          >
            <Button 
              className="w-full" 
              onClick={handleAddToCart}
              disabled={addMutation.isPending || isOutOfStock}
              variant={isOutOfStock ? 'outline' : 'primary'}
            >
              {isOutOfStock ? (
                'Out of Stock'
              ) : isAdded ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Added to Cart
                </>
              ) : (
                <>
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart
                </>
              )}
            </Button>
          </motion.div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
