import * as cartRepository from '../src/repositories/cart.repository';
import * as productRepository from '../src/repositories/product.repository';

export const mockCartRepository = {
  findActiveCartByUserId: jest.fn(),
  createCart: jest.fn(),
  findCartItem: jest.fn(),
  addCartItem: jest.fn(),
  updateCartItemQuantity: jest.fn(),
  removeCartItem: jest.fn(),
  clearCart: jest.fn(),
  getCartWithItems: jest.fn(),
};

export const mockProductRepository = {
  findById: jest.fn(),
  findBySku: jest.fn(),
};

jest.mock('../src/repositories/cart.repository', () => mockCartRepository);
jest.mock('../src/repositories/product.repository', () => mockProductRepository);