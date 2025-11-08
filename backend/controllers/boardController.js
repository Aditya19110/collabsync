import asyncHandler from 'express-async-handler';
import Board from '../models/boardModel.js';
import User from '../models/userModel.js';
import List from '../models/listModel.js';
import Task from '../models/taskModel.js';

// @desc    Get all boards for user
// @route   GET /api/boards
// @access  Private
const getBoards = asyncHandler(async (req, res) => {
  const boards = await Board.find({
    $or: [
      { owner: req.user._id },
      { 'members.user': req.user._id },
    ],
  })
    .populate('owner', 'name email avatar')
    .populate('members.user', 'name email avatar')
    .sort('-updatedAt');

  res.json(boards);
});

// @desc    Get single board with lists and tasks
// @route   GET /api/boards/:id
// @access  Private
const getBoardById = asyncHandler(async (req, res) => {
  const board = await Board.findById(req.params.id)
    .populate('owner', 'name email avatar')
    .populate('members.user', 'name email avatar')
    .populate({
      path: 'lists',
      populate: {
        path: 'tasks',
        populate: {
          path: 'assignedTo',
          select: 'name email avatar',
        },
      },
    });

  if (!board) {
    res.status(404);
    throw new Error('Board not found');
  }

  // Check if user is owner or member
  const isMember = board.members.some(
    (member) => member.user._id.toString() === req.user._id.toString()
  );
  const isOwner = board.owner._id.toString() === req.user._id.toString();

  if (!isOwner && !isMember) {
    res.status(403);
    throw new Error('Not authorized to access this board');
  }

  res.json(board);
});

// @desc    Create new board
// @route   POST /api/boards
// @access  Private
const createBoard = asyncHandler(async (req, res) => {
  const { title, description, backgroundColor, backgroundImage } = req.body;

  if (!title) {
    res.status(400);
    throw new Error('Please add a board title');
  }

  const board = await Board.create({
    title,
    description,
    owner: req.user._id,
    backgroundColor: backgroundColor || '#0079bf',
    backgroundImage: backgroundImage || '',
    members: [
      {
        user: req.user._id,
        role: 'admin',
      },
    ],
  });

  // Add board to user's boards array
  await User.findByIdAndUpdate(req.user._id, {
    $push: { boards: board._id },
  });

  const populatedBoard = await Board.findById(board._id)
    .populate('owner', 'name email avatar')
    .populate('members.user', 'name email avatar');

  res.status(201).json(populatedBoard);
});

// @desc    Update board
// @route   PUT /api/boards/:id
// @access  Private
const updateBoard = asyncHandler(async (req, res) => {
  const board = await Board.findById(req.params.id);

  if (!board) {
    res.status(404);
    throw new Error('Board not found');
  }

  // Check if user is owner or admin
  const isOwner = board.owner.toString() === req.user._id.toString();
  const isAdmin = board.members.some(
    (member) =>
      member.user.toString() === req.user._id.toString() &&
      member.role === 'admin'
  );

  if (!isOwner && !isAdmin) {
    res.status(403);
    throw new Error('Not authorized to update this board');
  }

  board.title = req.body.title || board.title;
  board.description = req.body.description !== undefined ? req.body.description : board.description;
  board.backgroundColor = req.body.backgroundColor || board.backgroundColor;
  board.backgroundImage = req.body.backgroundImage !== undefined ? req.body.backgroundImage : board.backgroundImage;

  const updatedBoard = await board.save();

  const populatedBoard = await Board.findById(updatedBoard._id)
    .populate('owner', 'name email avatar')
    .populate('members.user', 'name email avatar');

  res.json(populatedBoard);
});

// @desc    Delete board
// @route   DELETE /api/boards/:id
// @access  Private
const deleteBoard = asyncHandler(async (req, res) => {
  const board = await Board.findById(req.params.id);

  if (!board) {
    res.status(404);
    throw new Error('Board not found');
  }

  // Only owner can delete board
  if (board.owner.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to delete this board');
  }

  // Delete all lists and tasks associated with board
  const lists = await List.find({ board: board._id });
  for (const list of lists) {
    await Task.deleteMany({ list: list._id });
  }
  await List.deleteMany({ board: board._id });

  // Remove board from all members' boards array
  await User.updateMany(
    { boards: board._id },
    { $pull: { boards: board._id } }
  );

  await board.deleteOne();

  res.json({ message: 'Board removed' });
});

// @desc    Add member to board
// @route   POST /api/boards/:id/members
// @access  Private
const addMemberToBoard = asyncHandler(async (req, res) => {
  const { userId, role } = req.body;
  const board = await Board.findById(req.params.id);

  if (!board) {
    res.status(404);
    throw new Error('Board not found');
  }

  // Check if user is owner or admin
  const isOwner = board.owner.toString() === req.user._id.toString();
  const isAdmin = board.members.some(
    (member) =>
      member.user.toString() === req.user._id.toString() &&
      member.role === 'admin'
  );

  if (!isOwner && !isAdmin) {
    res.status(403);
    throw new Error('Not authorized to add members');
  }

  // Check if user exists
  const userToAdd = await User.findById(userId);
  if (!userToAdd) {
    res.status(404);
    throw new Error('User not found');
  }

  // Check if user is already a member
  const isMember = board.members.some(
    (member) => member.user.toString() === userId
  );

  if (isMember) {
    res.status(400);
    throw new Error('User is already a member');
  }

  board.members.push({
    user: userId,
    role: role || 'member',
  });

  await board.save();

  // Add board to user's boards array
  await User.findByIdAndUpdate(userId, {
    $push: { boards: board._id },
  });

  const updatedBoard = await Board.findById(board._id)
    .populate('owner', 'name email avatar')
    .populate('members.user', 'name email avatar');

  res.json(updatedBoard);
});

// @desc    Remove member from board
// @route   DELETE /api/boards/:id/members/:memberId
// @access  Private
const removeMemberFromBoard = asyncHandler(async (req, res) => {
  const board = await Board.findById(req.params.id);

  if (!board) {
    res.status(404);
    throw new Error('Board not found');
  }

  // Check if user is owner or admin
  const isOwner = board.owner.toString() === req.user._id.toString();
  const isAdmin = board.members.some(
    (member) =>
      member.user.toString() === req.user._id.toString() &&
      member.role === 'admin'
  );

  if (!isOwner && !isAdmin) {
    res.status(403);
    throw new Error('Not authorized to remove members');
  }

  // Remove member
  board.members = board.members.filter(
    (member) => member.user.toString() !== req.params.memberId
  );

  await board.save();

  // Remove board from user's boards array
  await User.findByIdAndUpdate(req.params.memberId, {
    $pull: { boards: board._id },
  });

  const updatedBoard = await Board.findById(board._id)
    .populate('owner', 'name email avatar')
    .populate('members.user', 'name email avatar');

  res.json(updatedBoard);
});

export {
  getBoards,
  getBoardById,
  createBoard,
  updateBoard,
  deleteBoard,
  addMemberToBoard,
  removeMemberFromBoard,
};
