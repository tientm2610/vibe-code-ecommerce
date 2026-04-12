import { Request, Response } from 'express';
import { cartService } from '../services/cart.service';
import { asyncHandler } from '../middleware/async-handler';
import { z } from 'zod';
import AppError from '../utils/app-error';

const addToCartSchema = z.object({
  productId: z.string().uuid(),
  quantity: z.number().int().positive().min(1)
});

const updateQuantitySchema = z.object({
  quantity: z.number().int().positive().min(1)
});

const validate = <T>(schema: z.ZodSchema<T>, data: unknown): T => {
  const result = schema.safeParse(data);
  if (!result.success) {
    const details = result.error.errors.map(e => ({ field: e.path.join('.'), message: e.message }));
    throw new AppError('Validation failed', 422, 'VALIDATION_ERROR');
  }
  return result.data;
};

export const getCart = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user!.id;
  const cart = await cartService.getCart(userId);
  res.json({ success: true, data: cart });
});

export const addItem = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user!.id;
  const data = validate(addToCartSchema, req.body);
  const cart = await cartService.addToCart(userId, data);
  res.status(201).json({ success: true, data: cart, message: 'Item added to cart' });
});

export const updateItem = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user!.id;
  const { productId } = req.params;
  const data = validate(updateQuantitySchema, req.body);
  const cart = await cartService.updateQuantity(userId, productId, data);
  res.json({ success: true, data: cart, message: 'Quantity updated' });
});

export const removeItem = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user!.id;
  const { productId } = req.params;
  const cart = await cartService.removeFromCart(userId, productId);
  res.json({ success: true, data: cart, message: 'Item removed from cart' });
});

export const clearCart = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user!.id;
  await cartService.clearCart(userId);
  res.json({ success: true, message: 'Cart cleared' });
});