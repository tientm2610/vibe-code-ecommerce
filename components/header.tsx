'use client';

import Link from 'next/link';
import { useAuthStore } from '@/lib/auth-store';
import { ThemeToggle } from './theme-toggle';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { cartService } from '@/lib/services/cart.service';

export function Header() {
  const { isAuthenticated, user, logout } = useAuthStore();
  
  const { data: cartData } = useQuery({
    queryKey: ['cart'],
    queryFn: () => cartService.getCart(),
    enabled: isAuthenticated,
  });

  const cartItemCount = cartData?.data?.totalItems || 0;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center px-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="font-semibold text-lg">
            Store
          </Link>
          <nav className="hidden md:flex items-center gap-4 text-sm">
            <Link href="/products" className="text-muted-foreground hover:text-foreground transition-fast">
              Products
            </Link>
            {isAuthenticated && (
              <Link href="/cart" className="text-muted-foreground hover:text-foreground transition-fast">
                Cart
              </Link>
            )}
          </nav>
        </div>
        
        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
          
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground hidden sm:inline">
                {user?.email}
              </span>
              <Button variant="ghost" size="sm" onClick={logout}>
                Logout
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" size="sm">Login</Button>
              </Link>
              <Link href="/register">
                <Button variant="primary" size="sm">Sign up</Button>
              </Link>
            </div>
          )}
          
          {isAuthenticated && (
            <Link href="/cart" className="relative ml-2">
              <Button variant="ghost" size="icon">
                <ShoppingCart className="h-5 w-5" />
              </Button>
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-medium">
                  {cartItemCount}
                </span>
              )}
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
