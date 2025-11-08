import express from 'express';
import {
  getBoardActivity,
  getTaskActivity,
} from '../controllers/activityController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/board/:boardId', protect, getBoardActivity);
router.get('/task/:taskId', protect, getTaskActivity);

export default router;
