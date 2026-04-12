import { cartService } from '../../src/services/cart.service';
import { mockCartRepository, mockProductRepository } from './__mocks__/repositories';
import AppError from '../../src/utils/app-error';

describe('CartService', () => {
  const mockProduct = {
    id: 'prod-1',
    name: 'Test Product',
    sku: 'TEST-001',
    price: 100,
    stock: 10,
    is_active: true,
    image_url: 'http://example.com/image.jpg',
    description: 'Test description',
    category_id: 'cat-1',
    created_at: new Date(),
    updated_at: new Date(),
  };

  const mockCart = {
    id: 'cart-1',
    user_id: 'user-1',
    is_active: true,
    created_at: new Date(),
    updated_at: new Date(),
    items: [
      {
        id: 'item-1',
        cart_id: 'cart-1',
        product_id: 'prod-1',
        quantity: 2,
        created_at: new Date(),
        updated_at: new Date(),
        product: mockProduct,
      },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getCart', () => {
    it('should return existing cart', async () => {
      (mockCartRepository.findActiveCartByUserId as jest.Mock).mockResolvedValue(mockCart);
      const result = await cartService.getCart('user-1');
      expect(result.id).toBe('cart-1');
      expect(result.items).toHaveLength(1);
      expect(result.totalItems).toBe(2);
    });

    it('should create new cart if none exists', async () => {
      (mockCartRepository.findActiveCartByUserId as jest.Mock).mockResolvedValue(null);
      (mockCartRepository.createCart as jest.Mock).mockResolvedValue({ ...mockCart, items: [] });
      const result = await cartService.getCart('user-1');
      expect(mockCartRepository.createCart).toHaveBeenCalledWith('user-1');
      expect(result.id).toBe('cart-1');
    });
  });

  describe('addToCart', () => {
    it('should throw error if product not found', async () => {
      (mockProductRepository.findById as jest.Mock).mockResolvedValue(null);
      await expect(cartService.addToCart('user-1', { productId: 'invalid', quantity: 1 }))
        .rejects.toThrow(new AppError('Product not found', 404, 'PRODUCT_NOT_FOUND'));
    });

    it('should throw error if product is inactive', async () => {
      (mockProductRepository.findById as jest.Mock).mockResolvedValue({ ...mockProduct, is_active: false });
      await expect(cartService.addToCart('user-1', { productId: 'prod-1', quantity: 1 }))
        .rejects.toThrow(new AppError('Product is not available', 400, 'PRODUCT_NOT_AVAILABLE'));
    });

    it('should throw error if insufficient stock', async () => {
      (mockProductRepository.findById as jest.Mock).mockResolvedValue({ ...mockProduct, stock: 5 });
      await expect(cartService.addToCart('user-1', { productId: 'prod-1', quantity: 10 }))
        .rejects.toThrow(new AppError('Insufficient stock', 400, 'INSUFFICIENT_STOCK'));
    });

    it('should add new item to cart', async () => {
      (mockProductRepository.findById as jest.Mock).mockResolvedValue(mockProduct);
      (mockCartRepository.findActiveCartByUserId as jest.Mock).mockResolvedValue(null);
      (mockCartRepository.createCart as jest.Mock).mockResolvedValue(mockCart);
      (mockCartRepository.findCartItem as jest.Mock).mockResolvedValue(null);
      (mockCartRepository.addCartItem as jest.Mock).mockResolvedValue({});
      (mockCartRepository.getCartWithItems as jest.Mock).mockResolvedValue(mockCart);

      const result = await cartService.addToCart('user-1', { productId: 'prod-1', quantity: 2 });
      expect(mockCartRepository.addCartItem).toHaveBeenCalledWith('cart-1', 'prod-1', 2);
      expect(result.items).toHaveLength(1);
    });

    it('should update quantity if item exists', async () => {
      (mockProductRepository.findById as jest.Mock).mockResolvedValue(mockProduct);
      (mockCartRepository.findActiveCartByUserId as jest.Mock).mockResolvedValue(mockCart);
      (mockCartRepository.findCartItem as jest.Mock).mockResolvedValue({ id: 'item-1', quantity: 2 });
      (mockCartRepository.updateCartItemQuantity as jest.Mock).mockResolvedValue({});
      (mockCartRepository.getCartWithItems as jest.Mock).mockResolvedValue({
        ...mockCart,
        items: [{ ...mockCart.items[0], quantity: 4 }],
      });

      await cartService.addToCart('user-1', { productId: 'prod-1', quantity: 2 });
      expect(mockCartRepository.updateCartItemQuantity).toHaveBeenCalledWith('cart-1', 'prod-1', 4);
    });

    it('should throw error when total quantity exceeds stock', async () => {
      (mockProductRepository.findById as jest.Mock).mockResolvedValue(mockProduct);
      (mockCartRepository.findActiveCartByUserId as jest.Mock).mockResolvedValue(mockCart);
      (mockCartRepository.findCartItem as jest.Mock).mockResolvedValue({ id: 'item-1', quantity: 8 });

      await expect(cartService.addToCart('user-1', { productId: 'prod-1', quantity: 5 }))
        .rejects.toThrow(new AppError('Insufficient stock for requested quantity', 400, 'INSUFFICIENT_STOCK'));
    });
  });

  describe('updateQuantity', () => {
    it('should throw error if cart not found', async () => {
      (mockCartRepository.findActiveCartByUserId as jest.Mock).mockResolvedValue(null);
      await expect(cartService.updateQuantity('user-1', 'prod-1', { quantity: 5 }))
        .rejects.toThrow(new AppError('Cart not found', 404, 'CART_NOT_FOUND'));
    });

    it('should throw error if product not found', async () => {
      (mockCartRepository.findActiveCartByUserId as jest.Mock).mockResolvedValue(mockCart);
      (mockProductRepository.findById as jest.Mock).mockResolvedValue(null);
      await expect(cartService.updateQuantity('user-1', 'invalid', { quantity: 5 }))
        .rejects.toThrow(new AppError('Product not found', 404, 'PRODUCT_NOT_FOUND'));
    });

    it('should throw error if insufficient stock', async () => {
      (mockCartRepository.findActiveCartByUserId as jest.Mock).mockResolvedValue(mockCart);
      (mockProductRepository.findById as jest.Mock).mockResolvedValue({ ...mockProduct, stock: 3 });
      await expect(cartService.updateQuantity('user-1', 'prod-1', { quantity: 5 }))
        .rejects.toThrow(new AppError('Insufficient stock', 400, 'INSUFFICIENT_STOCK'));
    });

    it('should throw error if item not in cart', async () => {
      (mockCartRepository.findActiveCartByUserId as jest.Mock).mockResolvedValue(mockCart);
      (mockProductRepository.findById as jest.Mock).mockResolvedValue(mockProduct);
      (mockCartRepository.findCartItem as jest.Mock).mockResolvedValue(null);
      await expect(cartService.updateQuantity('user-1', 'prod-999', { quantity: 5 }))
        .rejects.toThrow(new AppError('Item not found in cart', 404, 'CART_ITEM_NOT_FOUND'));
    });

    it('should update quantity successfully', async () => {
      (mockCartRepository.findActiveCartByUserId as jest.Mock).mockResolvedValue(mockCart);
      (mockProductRepository.findById as jest.Mock).mockResolvedValue(mockProduct);
      (mockCartRepository.findCartItem as jest.Mock).mockResolvedValue({ id: 'item-1', quantity: 2 });
      (mockCartRepository.updateCartItemQuantity as jest.Mock).mockResolvedValue({});
      (mockCartRepository.getCartWithItems as jest.Mock).mockResolvedValue(mockCart);

      await cartService.updateQuantity('user-1', 'prod-1', { quantity: 5 });
      expect(mockCartRepository.updateCartItemQuantity).toHaveBeenCalledWith('cart-1', 'prod-1', 5);
    });
  });

  describe('removeFromCart', () => {
    it('should throw error if cart not found', async () => {
      (mockCartRepository.findActiveCartByUserId as jest.Mock).mockResolvedValue(null);
      await expect(cartService.removeFromCart('user-1', 'prod-1'))
        .rejects.toThrow(new AppError('Cart not found', 404, 'CART_NOT_FOUND'));
    });

    it('should throw error if item not in cart', async () => {
      (mockCartRepository.findActiveCartByUserId as jest.Mock).mockResolvedValue(mockCart);
      (mockCartRepository.findCartItem as jest.Mock).mockResolvedValue(null);
      await expect(cartService.removeFromCart('user-1', 'prod-999'))
        .rejects.toThrow(new AppError('Item not found in cart', 404, 'CART_ITEM_NOT_FOUND'));
    });

    it('should remove item successfully', async () => {
      (mockCartRepository.findActiveCartByUserId as jest.Mock).mockResolvedValue(mockCart);
      (mockCartRepository.findCartItem as jest.Mock).mockResolvedValue({ id: 'item-1' });
      (mockCartRepository.removeCartItem as jest.Mock).mockResolvedValue();
      (mockCartRepository.getCartWithItems as jest.Mock).mockResolvedValue({ ...mockCart, items: [] });

      await cartService.removeFromCart('user-1', 'prod-1');
      expect(mockCartRepository.removeCartItem).toHaveBeenCalledWith('cart-1', 'prod-1');
    });
  });

  describe('clearCart', () => {
    it('should throw error if cart not found', async () => {
      (mockCartRepository.findActiveCartByUserId as jest.Mock).mockResolvedValue(null);
      await expect(cartService.clearCart('user-1'))
        .rejects.toThrow(new AppError('Cart not found', 404, 'CART_NOT_FOUND'));
    });

    it('should clear cart successfully', async () => {
      (mockCartRepository.findActiveCartByUserId as jest.Mock).mockResolvedValue(mockCart);
      (mockCartRepository.clearCart as jest.Mock).mockResolvedValue();
      await cartService.clearCart('user-1');
      expect(mockCartRepository.clearCart).toHaveBeenCalledWith('cart-1');
    });
  });
});