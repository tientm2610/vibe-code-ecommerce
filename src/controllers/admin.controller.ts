import { Request, Response } from 'express';
import { adminService } from '../services/admin.service';
import { asyncHandler } from '../middleware/async-handler';
import { AuthRequest } from '../middleware/auth';
import AppError from '../utils/app-error';
import { z } from 'zod';
import { OrderStatus, UserRole } from '@prisma/client';

const paginationSchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(20)
});

const productSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  sku: z.string().min(1),
  price: z.number().positive(),
  stock: z.number().int().min(0),
  imageUrl: z.string().url().optional(),
  categoryId: z.string().uuid()
});

const productUpdateSchema = productSchema.partial().omit({ sku: true });

const categorySchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  parentId: z.string().uuid().optional()
});

const categoryUpdateSchema = categorySchema.partial();

const orderStatusSchema = z.object({
  status: z.enum(['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'])
});

const userUpdateSchema = z.object({
  fullName: z.string().optional(),
  isActive: z.boolean().optional(),
  role: z.enum(['USER', 'ADMIN']).optional()
});

const validate = <T>(schema: z.ZodSchema<T>, data: unknown): T => {
  const result = schema.safeParse(data);
  if (!result.success) throw new AppError('Validation failed', 422, 'VALIDATION_ERROR');
  return result.data;
};

export const getProducts = asyncHandler(async (req: Request, res: Response) => {
  const { page, limit } = validate(paginationSchema, req.query);
  const filters = req.query;
  const result = await adminService.getProducts(page, limit, {
    categoryId: filters.categoryId as string,
    isActive: filters.isActive === 'true' ? true : filters.isActive === 'false' ? false : undefined,
    search: filters.search as string
  });
  res.json({ success: true, data: result.products, pagination: result.pagination });
});

export const getProduct = asyncHandler(async (req: Request, res: Response) => {
  const product = await adminService.getProduct(req.params.id);
  res.json({ success: true, data: product });
});

export const createProduct = asyncHandler(async (req: Request, res: Response) => {
  const data = validate(productSchema, req.body);
  const product = await adminService.createProduct(data);
  res.status(201).json({ success: true, data: product, message: 'Product created' });
});

export const updateProduct = asyncHandler(async (req: Request, res: Response) => {
  const data = validate(productUpdateSchema, req.body);
  const product = await adminService.updateProduct(req.params.id, data);
  res.json({ success: true, data: product, message: 'Product updated' });
});

export const deleteProduct = asyncHandler(async (req: Request, res: Response) => {
  await adminService.deleteProduct(req.params.id);
  res.json({ success: true, message: 'Product deleted' });
});

export const getCategories = asyncHandler(async (req: Request, res: Response) => {
  const { page, limit } = validate(paginationSchema, req.query);
  const result = await adminService.getCategories(page, limit);
  res.json({ success: true, data: result.categories, pagination: result.pagination });
});

export const getCategory = asyncHandler(async (req: Request, res: Response) => {
  const category = await adminService.getCategory(req.params.id);
  res.json({ success: true, data: category });
});

export const createCategory = asyncHandler(async (req: Request, res: Response) => {
  const data = validate(categorySchema, req.body);
  const category = await adminService.createCategory(data);
  res.status(201).json({ success: true, data: category, message: 'Category created' });
});

export const updateCategory = asyncHandler(async (req: Request, res: Response) => {
  const data = validate(categoryUpdateSchema, req.body);
  const category = await adminService.updateCategory(req.params.id, data);
  res.json({ success: true, data: category, message: 'Category updated' });
});

export const deleteCategory = asyncHandler(async (req: Request, res: Response) => {
  await adminService.deleteCategory(req.params.id);
  res.json({ success: true, message: 'Category deleted' });
});

export const getOrders = asyncHandler(async (req: Request, res: Response) => {
  const { page, limit } = validate(paginationSchema, req.query);
  const status = req.query.status as OrderStatus | undefined;
  const result = await adminService.getOrders(page, limit, status);
  res.json({ success: true, data: result.orders, pagination: result.pagination });
});

export const getOrder = asyncHandler(async (req: Request, res: Response) => {
  const order = await adminService.getOrder(req.params.id);
  res.json({ success: true, data: order });
});

export const updateOrderStatus = asyncHandler(async (req: Request, res: Response) => {
  const { status } = validate(orderStatusSchema, req.body);
  const order = await adminService.updateOrderStatus(req.params.id, status);
  res.json({ success: true, data: order, message: 'Order status updated' });
});

export const getUsers = asyncHandler(async (req: Request, res: Response) => {
  const { page, limit } = validate(paginationSchema, req.query);
  const result = await adminService.getUsers(page, limit);
  res.json({ success: true, data: result.users, pagination: result.pagination });
});

export const getUser = asyncHandler(async (req: Request, res: Response) => {
  const user = await adminService.getUser(req.params.id);
  res.json({ success: true, data: user });
});

export const updateUser = asyncHandler(async (req: Request, res: Response) => {
  const data = validate(userUpdateSchema, req.body);
  const user = await adminService.updateUser(req.params.id, data);
  res.json({ success: true, data: user, message: 'User updated' });
});