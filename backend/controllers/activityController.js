import asyncHandler from 'express-async-handler';
import Activity from '../models/activityModel.js';
import Board from '../models/boardModel.js';

// @desc    Get activity feed for a board
// @route   GET /api/boards/:boardId/activity
// @access  Private
export const getBoardActivity = asyncHandler(async (req, res) => {
  const { limit = 50, skip = 0 } = req.query;

  // Verify board exists and user has access
  const board = await Board.findById(req.params.boardId);
  if (!board) {
    res.status(404);
    throw new Error('Board not found');
  }

  const isMember = board.members.some(
    (member) => member.user.toString() === req.user._id.toString()
  );

  if (!isMember && board.owner.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to view this board');
  }

  const activities = await Activity.find({ board: req.params.boardId })
    .populate('user', 'name email avatar')
    .populate('task', 'title')
    .populate('list', 'name')
    .sort({ createdAt: -1 })
    .limit(parseInt(limit))
    .skip(parseInt(skip));

  const total = await Activity.countDocuments({ board: req.params.boardId });

  res.json({
    activities,
    total,
    hasMore: total > parseInt(skip) + parseInt(limit),
  });
});

// @desc    Get activity feed for a task
// @route   GET /api/tasks/:taskId/activity
// @access  Private
export const getTaskActivity = asyncHandler(async (req, res) => {
  const activities = await Activity.find({ task: req.params.taskId })
    .populate('user', 'name email avatar')
    .sort({ createdAt: -1 });

  res.json(activities);
});

// @desc    Create activity log (helper function)
// @route   N/A (used internally)
// @access  Private
export const createActivity = async (data) => {
  try {
    await Activity.create(data);
  } catch (error) {
    console.error('Error creating activity log:', error);
  }
};
