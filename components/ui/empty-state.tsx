import { cn } from '@/lib/utils';
import { Button } from './button';
import { Package, Search, ShoppingCart, Heart, Inbox } from 'lucide-react';

type EmptyStateType = 'products' | 'search' | 'cart' | 'orders' | 'favorites' | 'general';

interface EmptyStateProps {
  type?: EmptyStateType;
  title?: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
  className?: string;
}

const emptyStateConfig: Record<EmptyStateType, { icon: React.ElementType; defaultTitle: string; defaultDescription: string }> = {
  products: {
    icon: Package,
    defaultTitle: 'No products found',
    defaultDescription: 'We couldn\'t find any products. Please try again later.',
  },
  search: {
    icon: Search,
    defaultTitle: 'No results found',
    defaultDescription: 'Try adjusting your search or filter to find what you\'re looking for.',
  },
  cart: {
    icon: ShoppingCart,
    defaultTitle: 'Your cart is empty',
    defaultDescription: 'Looks like you haven\'t added anything to your cart yet.',
  },
  orders: {
    icon: Inbox,
    defaultTitle: 'No orders yet',
    defaultDescription: 'When you place an order, it will appear here.',
  },
  favorites: {
    icon: Heart,
    defaultTitle: 'No favorites yet',
    defaultDescription: 'Save items you love to see them here.',
  },
  general: {
    icon: Inbox,
    defaultTitle: 'Nothing here yet',
    defaultDescription: 'There\'s nothing to display at the moment.',
  },
};

export function EmptyState({ 
  type = 'general',
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
  className 
}: EmptyStateProps) {
  const config = emptyStateConfig[type];
  const Icon = config.icon;

  return (
    <div className={cn('flex flex-col items-center justify-center py-16 px-4 text-center', className)}>
      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-6">
        <Icon className="w-8 h-8 text-muted-foreground" />
      </div>
      
      <h3 className="text-lg font-semibold text-foreground mb-2">
        {title || config.defaultTitle}
      </h3>
      
      <p className="text-muted-foreground max-w-md mb-6">
        {description || config.defaultDescription}
      </p>
      
      {(actionLabel || onAction) && (
        <div className="flex gap-3">
          {actionHref ? (
            <Button asChild>
              <a href={actionHref}>{actionLabel || 'Browse Products'}</a>
            </Button>
          ) : (
            <Button onClick={onAction}>{actionLabel || 'Browse Products'}</Button>
          )}
        </div>
      )}
    </div>
  );
}
