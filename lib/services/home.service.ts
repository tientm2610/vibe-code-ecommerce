import { apiClient } from '../core';

export interface HomepageProduct {
  id: string;
  name: string;
  description: string | null;
  sku: string;
  price: number;
  originalPrice: number | null;
  stock: number;
  imageUrl: string | null;
  badge: string | null;
  categoryId: string;
  category: { id: string; name: string };
  createdAt: string;
  updatedAt: string;
}

export interface HomepageCategory {
  id: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
}

export interface HeroData {
  title: string;
  subtitle: string;
  cta: string;
  featuredCta: string;
}

export interface PromotionData {
  title: string;
  subtitle: string;
  cta: string;
  discount: number;
}

export interface HomepageData {
  hero: HeroData;
  categories: HomepageCategory[];
  featuredProducts: HomepageProduct[];
  bestSellers: HomepageProduct[];
  promotion: PromotionData;
}

export interface HomepageResponse {
  success: boolean;
  data: HomepageData;
}

export const homeService = {
  getHomepageData: async (): Promise<HomepageData> => {
    const response = await apiClient.get<HomepageResponse>('/home');
    return response.data;
  },
};