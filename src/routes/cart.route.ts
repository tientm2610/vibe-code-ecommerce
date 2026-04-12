import { Router } from 'express';
import { getCart, addItem, updateItem, removeItem, clearCart } from '../controllers/cart.controller';
import authMiddleware from '../middleware/auth';

const router = Router();

router.get('/', authMiddleware, getCart);
router.post('/items', authMiddleware, addItem);
router.patch('/items/:productId', authMiddleware, updateItem);
router.delete('/items/:productId', authMiddleware, removeItem);
router.delete('/', authMiddleware, clearCart);

export default router;