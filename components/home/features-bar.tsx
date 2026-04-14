'use client';

import { motion } from 'framer-motion';
import { Truck, Shield, RefreshCw, Zap } from 'lucide-react';

interface Feature {
  icon: typeof Truck;
  title: string;
  description: string;
}

const defaultFeatures: Feature[] = [
  { icon: Truck, title: 'Free Shipping', description: 'On orders over $50' },
  { icon: Shield, title: 'Secure Payment', description: '100% secure checkout' },
  { icon: RefreshCw, title: 'Easy Returns', description: '30-day return policy' },
  { icon: Zap, title: 'Fast Delivery', description: '2-4 business days' },
];

interface FeaturesBarProps {
  features?: Feature[];
}

export function FeaturesBar({ features = defaultFeatures }: FeaturesBarProps) {
  return (
    <section className="bg-slate-50 dark:bg-slate-900/50 border-b">
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <feature.icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-sm">{feature.title}</p>
                <p className="text-xs text-muted-foreground">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
