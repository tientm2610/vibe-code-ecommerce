'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cartService, Cart, CartItem } from '@/lib/services/cart.service';
import { useAuthStore } from '@/lib/auth-store';

function CartItemCard({ item, onUpdateQuantity, onRemove }: { item: CartItem; onUpdateQuantity: (qty: number) => void; onRemove: () => void }) {
  const formattedPrice = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(item.productPrice);
  const formattedSubtotal = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(item.subtotal);

  return (
    <div className="flex gap-4 py-4 border-b">
      <Link href={`/products/${item.productId}`} className="w-20 h-20 flex-shrink-0 bg-slate-100 rounded-md overflow-hidden">
        {item.productImageUrl ? (
          <Image src={item.productImageUrl} alt={item.productName} width={80} height={80} className="object-cover w-full h-full" />
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground text-xs">No Image</div>
        )}
      </Link>
      <div className="flex-1 min-w-0">
        <Link href={`/products/${item.productId}`} className="font-medium hover:text-primary line-clamp-1">{item.productName}</Link>
        <p className="text-sm text-muted-foreground">SKU: {item.productSku}</p>
        <p className="font-medium mt-1">{formattedPrice}</p>
      </div>
      <div className="flex flex-col items-end gap-2">
        <Button variant="ghost" size="icon" onClick={onRemove} className="text-muted-foreground hover:text-destructive">
          <Trash2 className="h-4 w-4" />
        </Button>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => onUpdateQuantity(item.quantity - 1)} disabled={item.quantity <= 1}>
            <Minus className="h-3 w-3" />
          </Button>
          <span className="w-8 text-center text-sm">{item.quantity}</span>
          <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => onUpdateQuantity(item.quantity + 1)}>
            <Plus className="h-3 w-3" />
          </Button>
        </div>
        <span className="font-medium">{formattedSubtotal}</span>
      </div>
    </div>
  );
}

function CartSummary({ cart }: { cart: Cart }) {
  const formattedTotal = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cart.totalAmount);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleCheckout = async () => {
    setIsCheckingOut(true);
    // TODO: Navigate to checkout page or show checkout modal
    window.location.href = '/checkout';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Subtotal ({cart.totalItems} items)</span>
          <span>{formattedTotal}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Shipping</span>
          <span>Calculated at checkout</span>
        </div>
        <div className="flex justify-between font-bold text-lg pt-4 border-t">
          <span>Total</span>
          <span>{formattedTotal}</span>
        </div>
        <Button className="w-full" size="lg" onClick={handleCheckout} disabled={isCheckingOut}>
          Proceed to Checkout
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
}

export default function CartPage() {
  const { isAuthenticated } = useAuthStore();
  const queryClient = useQueryClient();

  const { data: cartData, isLoading, error } = useQuery({
    queryKey: ['cart'],
    queryFn: () => cartApi.getCart(),
    enabled: isAuthenticated,
  });

  const updateMutation = useMutation({
    mutationFn: ({ productId, quantity }: { productId: string; quantity: number }) => cartApi.updateItem(productId, quantity),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cart'] }),
  });

  const removeMutation = useMutation({
    mutationFn: (productId: string) => cartApi.removeItem(productId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cart'] }),
  });

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
        <h1 className="text-2xl font-bold mb-2">Sign in to view your cart</h1>
        <p className="text-muted-foreground mb-6">Please log in to see your shopping cart items</p>
        <Link href="/login">
          <Button>Login</Button>
        </Link>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Shopping Cart</h1>
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-4 py-4 border-b">
              <div className="w-20 h-20 bg-slate-200 rounded-md" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-slate-200 rounded w-3/4" />
                <div className="h-3 bg-slate-200 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="text-destructive mb-4">Failed to load cart</p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    );
  }

  const cart = cartData?.data;

  if (!cart || cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
        <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
        <p className="text-muted-foreground mb-6">Looks like you haven't added any items to your cart yet</p>
        <Link href="/products">
          <Button>Continue Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Shopping Cart</h1>
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-4">
              {cart.items.map((item) => (
                <CartItemCard
                  key={item.id}
                  item={item}
                  onUpdateQuantity={(qty) => updateMutation.mutate({ productId: item.productId, quantity: qty })}
                  onRemove={() => removeMutation.mutate(item.productId)}
                />
              ))}
            </CardContent>
          </Card>
        </div>
        <div>
          <CartSummary cart={cart} />
        </div>
      </div>
    </div>
  );
}