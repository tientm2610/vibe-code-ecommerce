import { Request, Response } from 'express';
import { orderService } from '../services/order.service';
import { asyncHandler } from '../middleware/async-handler';
import AppError from '../utils/app-error';
import { z } from 'zod';

const checkoutSchema = z.object({
  shippingAddress: z.string().min(1),
  billingAddress: z.string().min(1),
  notes: z.string().optional()
});

const paginationSchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(20)
});

const validate = <T>(schema: z.ZodSchema<T>, data: unknown): T => {
  const result = schema.safeParse(data);
  if (!result.success) {
    throw new AppError('Validation failed', 422, 'VALIDATION_ERROR');
  }
  return result.data;
};

export const checkout = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user!.id;
  const data = validate(checkoutSchema, req.body);
  const order = await orderService.checkout(userId, data);
  res.status(201).json({ success: true, data: order, message: 'Order created successfully' });
});

export const getOrders = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user!.id;
  const { page, limit } = validate(paginationSchema, req.query);
  const result = await orderService.getOrders(userId, page, limit);
  res.json({ success: true, data: result.orders, pagination: result.pagination });
});

export const getOrder = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user!.id;
  const { id } = req.params;
  const order = await orderService.getOrderById(id, userId);
  res.json({ success: true, data: order });
});

export const cancelOrder = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user!.id;
  const { id } = req.params;
  const order = await orderService.cancelOrder(id, userId);
  res.json({ success: true, data: order, message: 'Order cancelled successfully' });
});