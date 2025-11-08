import express from 'express';
import {
  getBoards,
  getBoardById,
  createBoard,
  updateBoard,
  deleteBoard,
  addMemberToBoard,
  removeMemberFromBoard,
} from '../controllers/boardController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(protect, getBoards).post(protect, createBoard);

router
  .route('/:id')
  .get(protect, getBoardById)
  .put(protect, updateBoard)
  .delete(protect, deleteBoard);

router.post('/:id/members', protect, addMemberToBoard);
router.delete('/:id/members/:memberId', protect, removeMemberFromBoard);

export default router;
