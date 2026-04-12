import { Request, Response } from 'express';
import { productService } from '../services/product.service';
import { asyncHandler } from '../middleware/async-handler';
import AppError from '../utils/app-error';
import { z } from 'zod';

const paginationSchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(20)
});

const validate = <T>(schema: z.ZodSchema<T>, data: unknown): T => {
  const result = schema.safeParse(data);
  if (!result.success) throw new AppError('Validation failed', 422, 'VALIDATION_ERROR');
  return result.data;
};

export const getProducts = asyncHandler(async (req: Request, res: Response) => {
  const { page, limit } = validate(paginationSchema, req.query);
  const filters = req.query;
  const result = await productService.getProducts(page, limit, {
    categoryId: filters.categoryId as string,
    isActive: filters.isActive === 'true' ? true : filters.isActive === 'false' ? false : undefined,
    search: filters.search as string
  });
  res.json({ success: true, data: result.products, pagination: { page, limit, total: result.total } });
});

export const getProduct = asyncHandler(async (req: Request, res: Response) => {
  const product = await productService.getProduct(req.params.id);
  res.json({ success: true, data: product });
});