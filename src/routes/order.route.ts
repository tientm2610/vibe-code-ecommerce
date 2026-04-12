import { Router } from 'express';
import { checkout, getOrders, getOrder, cancelOrder } from '../controllers/order.controller';
import authMiddleware from '../middleware/auth';

const router = Router();

router.post('/checkout', authMiddleware, checkout);
router.get('/', authMiddleware, getOrders);
router.get('/:id', authMiddleware, getOrder);
router.patch('/:id/cancel', authMiddleware, cancelOrder);

export default router;