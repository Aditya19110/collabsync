import express from 'express';
import {
  getListsByBoard,
  createList,
  updateList,
  deleteList,
  moveList,
} from '../controllers/listController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').post(protect, createList);
router.get('/board/:boardId', protect, getListsByBoard);

router
  .route('/:id')
  .put(protect, updateList)
  .delete(protect, deleteList);

router.put('/:id/move', protect, moveList);

export default router;
