import asyncHandler from 'express-async-handler';
import List from '../models/listModel.js';
import Board from '../models/boardModel.js';
import Task from '../models/taskModel.js';

const getListsByBoard = asyncHandler(async (req, res) => {
  const board = await Board.findById(req.params.boardId);

  if (!board) {
    res.status(404);
    throw new Error('Board not found');
  }

  const isMember = board.members.some(
    (member) => member.user.toString() === req.user._id.toString()
  );
  const isOwner = board.owner.toString() === req.user._id.toString();

  if (!isOwner && !isMember) {
    res.status(403);
    throw new Error('Not authorized to access this board');
  }

  const lists = await List.find({ board: req.params.boardId })
    .populate({
      path: 'tasks',
      populate: {
        path: 'assignedTo',
        select: 'name email avatar',
      },
    })
    .sort('position');

  res.json(lists);
});

const createList = asyncHandler(async (req, res) => {
  const { title, board, position } = req.body;

  if (!title || !board) {
    res.status(400);
    throw new Error('Please add title and board');
  }

  const boardDoc = await Board.findById(board);

  if (!boardDoc) {
    res.status(404);
    throw new Error('Board not found');
  }

  const isMember = boardDoc.members.some(
    (member) => member.user.toString() === req.user._id.toString()
  );
  const isOwner = boardDoc.owner.toString() === req.user._id.toString();

  if (!isOwner && !isMember) {
    res.status(403);
    throw new Error('Not authorized to add lists to this board');
  }

  let listPosition = position;
  if (listPosition === undefined || listPosition === null) {
    const lists = await List.find({ board });
    listPosition = lists.length;
  }

  const list = await List.create({
    title,
    board,
    position: listPosition,
  });

  // Add list to board
  boardDoc.lists.push(list._id);
  await boardDoc.save();

  const populatedList = await List.findById(list._id).populate('tasks');

  res.status(201).json(populatedList);
});

const updateList = asyncHandler(async (req, res) => {
  const list = await List.findById(req.params.id);

  if (!list) {
    res.status(404);
    throw new Error('List not found');
  }

  const board = await Board.findById(list.board);
  const isMember = board.members.some(
    (member) => member.user.toString() === req.user._id.toString()
  );
  const isOwner = board.owner.toString() === req.user._id.toString();

  if (!isOwner && !isMember) {
    res.status(403);
    throw new Error('Not authorized to update this list');
  }

  list.title = req.body.title || list.title;
  if (req.body.position !== undefined) {
    list.position = req.body.position;
  }

  const updatedList = await list.save();

  const populatedList = await List.findById(updatedList._id).populate('tasks');

  res.json(populatedList);
});

const deleteList = asyncHandler(async (req, res) => {
  const list = await List.findById(req.params.id);

  if (!list) {
    res.status(404);
    throw new Error('List not found');
  }

  const board = await Board.findById(list.board);
  const isMember = board.members.some(
    (member) => member.user.toString() === req.user._id.toString()
  );
  const isOwner = board.owner.toString() === req.user._id.toString();

  if (!isOwner && !isMember) {
    res.status(403);
    throw new Error('Not authorized to delete this list');
  }

  // Delete all tasks in this list
  await Task.deleteMany({ list: list._id });

  // Remove list from board
  board.lists = board.lists.filter(
    (listId) => listId.toString() !== list._id.toString()
  );
  await board.save();

  await list.deleteOne();

  res.json({ message: 'List removed' });
});

const moveList = asyncHandler(async (req, res) => {
  const { newPosition } = req.body;

  if (newPosition === undefined || newPosition === null) {
    res.status(400);
    throw new Error('Please provide new position');
  }

  const list = await List.findById(req.params.id);

  if (!list) {
    res.status(404);
    throw new Error('List not found');
  }

  const board = await Board.findById(list.board);
  const isMember = board.members.some(
    (member) => member.user.toString() === req.user._id.toString()
  );
  const isOwner = board.owner.toString() === req.user._id.toString();

  if (!isOwner && !isMember) {
    res.status(403);
    throw new Error('Not authorized to move this list');
  }

  const oldPosition = list.position;

  // Update positions of other lists
  if (newPosition < oldPosition) {
    // Moving left
    await List.updateMany(
      {
        board: list.board,
        position: { $gte: newPosition, $lt: oldPosition },
      },
      { $inc: { position: 1 } }
    );
  } else if (newPosition > oldPosition) {
    // Moving right
    await List.updateMany(
      {
        board: list.board,
        position: { $gt: oldPosition, $lte: newPosition },
      },
      { $inc: { position: -1 } }
    );
  }

  list.position = newPosition;
  await list.save();

  // Return all lists in new order
  const lists = await List.find({ board: list.board })
    .populate('tasks')
    .sort('position');

  res.json(lists);
});

export {
  getListsByBoard,
  createList,
  updateList,
  deleteList,
  moveList,
};
