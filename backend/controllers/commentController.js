import asyncHandler from 'express-async-handler';
import Comment from '../models/commentModel.js';
import Task from '../models/taskModel.js';
import Activity from '../models/activityModel.js';

// @desc    Get all comments for a task
// @route   GET /api/tasks/:taskId/comments
// @access  Private
export const getComments = asyncHandler(async (req, res) => {
  const comments = await Comment.find({ task: req.params.taskId })
    .populate('user', 'name email avatar')
    .populate('mentions', 'name email')
    .sort({ createdAt: -1 });

  res.json(comments);
});

// @desc    Create a new comment
// @route   POST /api/tasks/:taskId/comments
// @access  Private
export const createComment = asyncHandler(async (req, res) => {
  const { text, mentions, attachments } = req.body;

  // Verify task exists
  const task = await Task.findById(req.params.taskId).populate('board');
  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  const comment = await Comment.create({
    task: req.params.taskId,
    user: req.user._id,
    text,
    mentions: mentions || [],
    attachments: attachments || [],
  });

  const populatedComment = await Comment.findById(comment._id)
    .populate('user', 'name email avatar')
    .populate('mentions', 'name email');

  // Create activity log
  await Activity.create({
    board: task.board._id,
    task: task._id,
    user: req.user._id,
    action: 'added_comment',
    description: `${req.user.name} commented on "${task.title}"`,
    metadata: { commentId: comment._id },
  });

  res.status(201).json(populatedComment);
});

// @desc    Update a comment
// @route   PUT /api/comments/:id
// @access  Private
export const updateComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.id);

  if (!comment) {
    res.status(404);
    throw new Error('Comment not found');
  }

  // Check if user owns the comment
  if (comment.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to edit this comment');
  }

  comment.text = req.body.text || comment.text;
  comment.edited = true;
  comment.editedAt = Date.now();

  const updatedComment = await comment.save();
  await updatedComment.populate('user', 'name email avatar');

  res.json(updatedComment);
});

// @desc    Delete a comment
// @route   DELETE /api/comments/:id
// @access  Private
export const deleteComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.id);

  if (!comment) {
    res.status(404);
    throw new Error('Comment not found');
  }

  // Check if user owns the comment
  if (comment.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to delete this comment');
  }

  await comment.deleteOne();
  res.json({ message: 'Comment removed' });
});
