import express from 'express';
import {
  getTasksByList,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  moveTask,
  addComment,
  searchTasks,
  toggleTaskComplete,
} from '../controllers/taskController.js';
import { getComments, createComment } from '../controllers/commentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').post(protect, createTask);
router.get('/list/:listId', protect, getTasksByList);
router.get('/search/:boardId', protect, searchTasks);

router
  .route('/:id')
  .get(protect, getTaskById)
  .put(protect, updateTask)
  .delete(protect, deleteTask);

router.put('/:id/move', protect, moveTask);
router.put('/:id/complete', protect, toggleTaskComplete);

// Comment routes for tasks
router
  .route('/:taskId/comments')
  .get(protect, getComments)
  .post(protect, createComment);

export default router;
