import { Router } from 'express';
import { getHomepageData } from '../controllers/home.controller';

const router = Router();

router.get('/', getHomepageData);

export default router;
