import { productRepository } from '../repositories/product.repository';

export class ProductService {
  async getProducts(page = 1, limit = 20, filters?: { categoryId?: string; isActive?: boolean; search?: string }) {
    return productRepository.findAll(page, limit, filters);
  }

  async getProduct(id: string) {
    const product = await productRepository.findById(id);
    if (!product) throw new Error('PRODUCT_NOT_FOUND');
    return product;
  }
}

export const productService = new ProductService();