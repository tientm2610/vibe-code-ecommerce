import { Request, Response, NextFunction } from 'express';
import AppError from '../utils/app-error';

export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
  const statusCode = (err as any).statusCode || 500;
  const isOperational = err instanceof AppError;

  console.error('Error:', err.message);

  if (!isOperational) {
    return res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'An unexpected error occurred' }
    });
  }

  res.status(statusCode).json({
    success: false,
    error: { code: (err as any).code || 'ERROR', message: err.message }
  });
}