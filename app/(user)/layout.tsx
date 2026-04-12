'use client';

import Link from 'next/link';
import { ShoppingCart, User, Menu, X, LogOut } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/lib/auth-store';

export default function UserLayout({ children }: { children: React.ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuthStore();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="text-xl font-bold">
              ShopHub
            </Link>

            <nav className="hidden md:flex items-center gap-6">
              <Link href="/products" className="hover:text-primary">Products</Link>
              <Link href="/categories" className="hover:text-primary">Categories</Link>
            </nav>

            <div className="flex items-center gap-4">
              <Link href="/cart">
                <Button variant="ghost" size="icon">
                  <ShoppingCart className="h-5 w-5" />
                </Button>
              </Link>

              {isAuthenticated ? (
                <div className="flex items-center gap-2">
                  <Link href="/orders">
                    <Button variant="ghost">Orders</Button>
                  </Link>
                  <Link href="/profile">
                    <Button variant="ghost" size="icon">
                      <User className="h-5 w-5" />
                    </Button>
                  </Link>
                  {user?.role === 'ADMIN' && (
                    <Link href="/admin">
                      <Button variant="outline">Admin</Button>
                    </Link>
                  )}
                  <Button variant="ghost" size="icon" onClick={logout}>
                    <LogOut className="h-5 w-5" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link href="/login">
                    <Button variant="ghost">Login</Button>
                  </Link>
                  <Link href="/register">
                    <Button>Register</Button>
                  </Link>
                </div>
              )}

              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>

        {isMenuOpen && (
          <nav className="md:hidden border-t p-4 space-y-2">
            <Link href="/products" className="block py-2">Products</Link>
            <Link href="/categories" className="block py-2">Categories</Link>
            {isAuthenticated && <Link href="/orders" className="block py-2">Orders</Link>}
          </nav>
        )}
      </header>

      <main className="flex-1">
        {children}
      </main>

      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; 2024 ShopHub. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}