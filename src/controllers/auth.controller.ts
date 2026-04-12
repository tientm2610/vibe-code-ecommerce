import { Request, Response } from 'express';
import { authService } from '../services/auth.service';
import { userService } from '../services/user.service';
import { asyncHandler } from '../middleware/async-handler';
import AppError from '../utils/app-error';
import { z } from 'zod';

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  fullName: z.string().optional()
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

const refreshSchema = z.object({
  refreshToken: z.string().min(1)
});

const validate = <T>(schema: z.ZodSchema<T>, data: unknown): T => {
  const result = schema.safeParse(data);
  if (!result.success) {
    throw new AppError('Validation failed', 422, 'VALIDATION_ERROR');
  }
  return result.data;
};

export const register = asyncHandler(async (req: Request, res: Response) => {
  const data = validate(registerSchema, req.body);
  const result = await authService.register(data);
  res.status(201).json({ success: true, data: result, message: 'Registration successful' });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const data = validate(loginSchema, req.body);
  const result = await authService.login(data);
  res.json({ success: true, data: result, message: 'Login successful' });
});

export const refresh = asyncHandler(async (req: Request, res: Response) => {
  const data = validate(refreshSchema, req.body);
  const result = await authService.refresh(data.refreshToken);
  res.json({ success: true, data: result });
});

export const me = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user!.id;
  const profile = await userService.getProfile(userId);
  res.json({ success: true, data: profile });
});