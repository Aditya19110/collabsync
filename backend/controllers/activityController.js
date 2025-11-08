import asyncHandler from 'express-async-handler';
import Activity from '../models/activityModel.js';
import Board from '../models/boardModel.js';

export const getBoardActivity = asyncHandler(async (req, res) => {
  const { limit = 50, skip = 0 } = req.query;

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

export const getTaskActivity = asyncHandler(async (req, res) => {
  const activities = await Activity.find({ task: req.params.taskId })
    .populate('user', 'name email avatar')
    .sort({ createdAt: -1 });

  res.json(activities);
});

export const createActivity = async (data) => {
  try {
    await activity.save();
  } catch (error) {
    return;
  }
};

