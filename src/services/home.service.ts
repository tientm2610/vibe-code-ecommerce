import { productRepository } from '../repositories/product.repository';
import { categoryRepository } from '../repositories/category.repository';

interface HomepageProduct {
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
  createdAt: Date;
  updatedAt: Date;
}

interface HomepageCategory {
  id: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
}

interface HomepageData {
  hero: {
    title: string;
    subtitle: string;
    cta: string;
    featuredCta: string;
  };
  categories: HomepageCategory[];
  featuredProducts: HomepageProduct[];
  bestSellers: HomepageProduct[];
  promotion: {
    title: string;
    subtitle: string;
    cta: string;
    discount: number;
  };
}

export class HomeService {
  async getHomepageData(): Promise<HomepageData> {
    const [categories, featuredProducts, bestSellers] = await Promise.all([
      categoryRepository.findHomepage(6),
      productRepository.findFeatured(4),
      productRepository.findBestSellers(4)
    ]);

    return {
      hero: {
        title: 'Discover Premium Products',
        subtitle: 'Shop the latest trends with confidence. Quality products, unbeatable prices, and exceptional service.',
        cta: 'Shop Now',
        featuredCta: 'New Arrivals'
      },
      categories: categories.map(c => ({
        id: c.id,
        name: c.name,
        description: c.description,
        imageUrl: c.imageUrl
      })),
      featuredProducts: this.transformProducts(featuredProducts),
      bestSellers: this.transformProducts(bestSellers),
      promotion: {
        title: 'Save Up to 40%',
        subtitle: 'On selected premium products. Don\'t miss out on these exclusive deals.',
        cta: 'Shop Sale',
        discount: 40
      }
    };
  }

  private transformProducts(products: any[]): HomepageProduct[] {
    return products.map(p => ({
      id: p.id,
      name: p.name,
      description: p.description,
      sku: p.sku,
      price: Number(p.price),
      originalPrice: p.originalPrice ? Number(p.originalPrice) : null,
      stock: p.stock,
      imageUrl: p.imageUrl,
      badge: p.badge,
      categoryId: p.categoryId,
      category: p.category || { id: p.categoryId, name: '' },
      createdAt: p.createdAt,
      updatedAt: p.updatedAt
    }));
  }
}

export const homeService = new HomeService();
