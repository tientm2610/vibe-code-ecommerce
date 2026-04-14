'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageTransition } from '@/components/animations';
import { LoadingSkeleton } from '@/components/ui/skeleton';
import { ErrorState } from '@/components/ui/error-state';
import { 
  HeroSection, 
  CategorySection, 
  FeaturedProducts, 
  BestSellers, 
  FeaturesBar,
  PromotionSection 
} from '@/components/home';
import { homeService, type HomepageData } from '@/lib/services/home.service';

export default function HomePage() {
  const [email, setEmail] = useState('');

  const { data: homepageData, isLoading, error, refetch } = useQuery({
    queryKey: ['homepage'],
    queryFn: () => homeService.getHomepageData(),
  });

  if (isLoading) {
    return (
      <PageTransition>
        <div className="min-h-screen">
          {/* Hero skeleton */}
          <section className="relative h-[80vh] min-h-[600px] bg-slate-900 animate-pulse" />
          {/* Features skeleton */}
          <FeaturesBar />
          {/* Products skeleton */}
          <section className="py-16 md:py-24">
            <div className="container mx-auto px-4">
              <LoadingSkeleton type="card" count={4} />
            </div>
          </section>
        </div>
      </PageTransition>
    );
  }

  if (error || !homepageData) {
    return (
      <PageTransition>
        <ErrorState 
          onRetry={refetch}
          title="Failed to load homepage"
          message="We couldn't load the homepage content. Please try again."
        />
      </PageTransition>
    );
  }

  const { hero, categories, featuredProducts, bestSellers, promotion } = homepageData;

  return (
    <PageTransition>
      <div className="min-h-screen">
        <HeroSection 
          hero={hero}
          featuredProductImage={featuredProducts[0]?.imageUrl}
        />

        <FeaturesBar />

        <CategorySection categories={categories} />

        <FeaturedProducts products={featuredProducts} />

        <PromotionSection promotion={promotion} />

        <BestSellers products={bestSellers} />

        {/* Newsletter CTA */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-2xl mx-auto text-center"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Stay in the Loop
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Subscribe to get exclusive offers, new arrivals, and special discounts.
              </p>
              
              <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 h-12 rounded-lg border border-input bg-background px-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <Button type="submit" size="lg" className="h-12 px-8">
                  Subscribe
                </Button>
              </form>
              
              <p className="text-xs text-muted-foreground mt-4">
                By subscribing, you agree to our Terms of Service and Privacy Policy.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Trust Badges */}
        <section className="py-12 border-t">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-60">
              <span className="text-lg font-semibold">Apple</span>
              <span className="text-lg font-semibold">Samsung</span>
              <span className="text-lg font-semibold">Sony</span>
              <span className="text-lg font-semibold">Nike</span>
              <span className="text-lg font-semibold">Adidas</span>
            </div>
          </div>
        </section>
      </div>
    </PageTransition>
  );
}
