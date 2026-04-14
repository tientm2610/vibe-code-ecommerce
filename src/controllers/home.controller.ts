import { Request, Response } from 'express';
import { homeService } from '../services/home.service';
import { asyncHandler } from '../middleware/async-handler';

export const getHomepageData = asyncHandler(async (req: Request, res: Response) => {
  const data = await homeService.getHomepageData();
  res.json({ success: true, data });
});
