import { Router } from 'express';
import { authMiddleware, requireRole } from '../middleware/auth';
import { UserRole } from '@prisma/client';
import * as adminController from '../controllers/admin.controller';

const router = Router();

router.use(authMiddleware);
router.use(requireRole(UserRole.ADMIN));

router.get('/products', adminController.getProducts);
router.post('/products', adminController.createProduct);
router.get('/products/:id', adminController.getProduct);
router.put('/products/:id', adminController.updateProduct);
router.delete('/products/:id', adminController.deleteProduct);

router.get('/categories', adminController.getCategories);
router.post('/categories', adminController.createCategory);
router.put('/categories/:id', adminController.updateCategory);
router.delete('/categories/:id', adminController.deleteCategory);

router.get('/orders', adminController.getOrders);
router.get('/orders/:id', adminController.getOrder);
router.patch('/orders/:id/status', adminController.updateOrderStatus);

router.get('/users', adminController.getUsers);
router.get('/users/:id', adminController.getUser);
router.patch('/users/:id', adminController.updateUser);

export default router;