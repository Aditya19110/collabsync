import express from 'express';
import {
  getComments,
  createComment,
  updateComment,
  deleteComment,
} from '../controllers/commentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Comment routes
router.route('/:id').put(protect, updateComment).delete(protect, deleteComment);

export default router;
