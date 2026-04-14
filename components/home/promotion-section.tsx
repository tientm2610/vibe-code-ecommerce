'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PromotionData {
  title: string;
  subtitle: string;
  cta: string;
  discount: number;
}

interface PromotionSectionProps {
  promotion: PromotionData;
}

export function PromotionSection({ promotion }: PromotionSectionProps) {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 p-8 md:p-16"
        >
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.4' fill-rule='evenodd'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/svg%3E")`
          }} />
          
          <div className="relative z-10 max-w-2xl">
            <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white/90 text-sm font-medium mb-4">
              Limited Time Offer • Up to {promotion.discount}% Off
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              {promotion.title}
            </h2>
            <p className="text-lg text-white/80 mb-8">
              {promotion.subtitle}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/products?sale=true">
                <Button size="lg" className="h-12 px-8 bg-white text-primary hover:bg-white/90">
                  {promotion.cta}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
