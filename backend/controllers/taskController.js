import asyncHandler from 'express-async-handler';
import Task from '../models/taskModel.js';
import List from '../models/listModel.js';
import Board from '../models/boardModel.js';
import Activity from '../models/activityModel.js';

const getTasksByList = asyncHandler(async (req, res) => {
  const list = await List.findById(req.params.listId);

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
    throw new Error('Not authorized to access this list');
  }

  const tasks = await Task.find({ list: req.params.listId })
    .populate('assignedTo', 'name email avatar')
    .sort('position');

  res.json(tasks);
});

const getTaskById = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id)
    .populate('assignedTo', 'name email avatar')
    .populate('list')
    .populate('board');

  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  const board = await Board.findById(task.board);
  const isMember = board.members.some(
    (member) => member.user.toString() === req.user._id.toString()
  );
  const isOwner = board.owner.toString() === req.user._id.toString();

  if (!isOwner && !isMember) {
    res.status(403);
    throw new Error('Not authorized to access this task');
  }

  res.json(task);
});

const createTask = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    list,
    board,
    position,
    priority,
    dueDate,
    assignedTo,
  } = req.body;

  if (!title || !list || !board) {
    res.status(400);
    throw new Error('Please add title, list, and board');
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
    throw new Error('Not authorized to add tasks to this board');
  }

  let taskPosition = position;
  if (taskPosition === undefined || taskPosition === null) {
    const tasks = await Task.find({ list });
    taskPosition = tasks.length;
  }

  const task = await Task.create({
    title,
    description: description || '',
    list,
    board,
    position: taskPosition,
    priority: priority || 'medium',
    dueDate: dueDate || null,
    assignedTo: assignedTo || [],
  });

  const listDoc = await List.findById(list);
  listDoc.tasks.push(task._id);
  await listDoc.save();

  const populatedTask = await Task.findById(task._id).populate(
    'assignedTo',
    'name email avatar'
  );

  res.status(201).json(populatedTask);
});

const updateTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  const board = await Board.findById(task.board);
  const isMember = board.members.some(
    (member) => member.user.toString() === req.user._id.toString()
  );
  const isOwner = board.owner.toString() === req.user._id.toString();

  if (!isOwner && !isMember) {
    res.status(403);
    throw new Error('Not authorized to update this task');
  }

  task.title = req.body.title || task.title;
  task.description = req.body.description !== undefined ? req.body.description : task.description;
  task.priority = req.body.priority || task.priority;
  task.dueDate = req.body.dueDate !== undefined ? req.body.dueDate : task.dueDate;
  task.isCompleted = req.body.isCompleted !== undefined ? req.body.isCompleted : task.isCompleted;
  task.assignedTo = req.body.assignedTo !== undefined ? req.body.assignedTo : task.assignedTo;
  task.labels = req.body.labels !== undefined ? req.body.labels : task.labels;
  task.checklist = req.body.checklist !== undefined ? req.body.checklist : task.checklist;

  const updatedTask = await task.save();

  const populatedTask = await Task.findById(updatedTask._id).populate(
    'assignedTo',
    'name email avatar'
  );

  res.json(populatedTask);
});

const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  const board = await Board.findById(task.board);
  const isMember = board.members.some(
    (member) => member.user.toString() === req.user._id.toString()
  );
  const isOwner = board.owner.toString() === req.user._id.toString();

  if (!isOwner && !isMember) {
    res.status(403);
    throw new Error('Not authorized to delete this task');
  }

  const list = await List.findById(task.list);
  list.tasks = list.tasks.filter(
    (taskId) => taskId.toString() !== task._id.toString()
  );
  await list.save();

  await task.deleteOne();

  res.json({ message: 'Task removed' });
});

const moveTask = asyncHandler(async (req, res) => {
  const { newListId, newPosition } = req.body;

  if (!newListId || newPosition === undefined || newPosition === null) {
    res.status(400);
    throw new Error('Please provide new list and position');
  }

  const task = await Task.findById(req.params.id);

  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  const board = await Board.findById(task.board);
  const isMember = board.members.some(
    (member) => member.user.toString() === req.user._id.toString()
  );
  const isOwner = board.owner.toString() === req.user._id.toString();

  if (!isOwner && !isMember) {
    res.status(403);
    throw new Error('Not authorized to move this task');
  }

  const oldListId = task.list.toString();
  const oldPosition = task.position;

  if (oldListId !== newListId) {
    const oldList = await List.findById(oldListId);
    oldList.tasks = oldList.tasks.filter(
      (taskId) => taskId.toString() !== task._id.toString()
    );
    await oldList.save();

    await Task.updateMany(
      { list: oldListId, position: { $gt: oldPosition } },
      { $inc: { position: -1 } }
    );

    const newList = await List.findById(newListId);
    newList.tasks.push(task._id);
    await newList.save();

    await Task.updateMany(
      { list: newListId, position: { $gte: newPosition } },
      { $inc: { position: 1 } }
    );

    task.list = newListId;
    task.position = newPosition;
  } else {
    if (newPosition < oldPosition) {
      await Task.updateMany(
        {
          list: oldListId,
          position: { $gte: newPosition, $lt: oldPosition },
        },
        { $inc: { position: 1 } }
      );
    } else if (newPosition > oldPosition) {
      await Task.updateMany(
        {
          list: oldListId,
          position: { $gt: oldPosition, $lte: newPosition },
        },
        { $inc: { position: -1 } }
      );
    }

    task.position = newPosition;
  }

  await task.save();

  const updatedTask = await Task.findById(task._id).populate(
    'assignedTo',
    'name email avatar'
  );

  res.json(updatedTask);
});

const addComment = asyncHandler(async (req, res) => {
  const { text } = req.body;

  const task = await Task.findById(req.params.id);

  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  const board = await Board.findById(task.board);
  const isMember = board.members.some(
    (member) => member.user.toString() === req.user._id.toString()
  );
  const isOwner = board.owner.toString() === req.user._id.toString();

  if (!isOwner && !isMember) {
    res.status(403);
    throw new Error('Not authorized to comment on this task');
  }

  if (!task.comments) {
    task.comments = [];
  }

  task.comments.push({
    user: req.user._id,
    text,
    createdAt: Date.now(),
  });

  await task.save();

  const updatedTask = await Task.findById(task._id)
    .populate('assignedTo', 'name email avatar')
    .populate('comments.user', 'name email avatar');

  res.json(updatedTask);
});

const searchTasks = asyncHandler(async (req, res) => {
  const { query, priority, assignedTo, labels, dueDate } = req.query;

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

  const searchQuery = { board: req.params.boardId, isArchived: false };

  if (query) {
    searchQuery.$or = [
      { title: { $regex: query, $options: 'i' } },
      { description: { $regex: query, $options: 'i' } },
    ];
  }

  if (priority) {
    searchQuery.priority = priority;
  }

  if (assignedTo) {
    searchQuery.assignedTo = assignedTo;
  }

  if (labels) {
    searchQuery['labels.text'] = { $in: labels.split(',') };
  }

  if (dueDate) {
    const date = new Date(dueDate);
    searchQuery.dueDate = {
      $gte: date,
      $lt: new Date(date.getTime() + 24 * 60 * 60 * 1000),
    };
  }

  const tasks = await Task.find(searchQuery)
    .populate('assignedTo', 'name email avatar')
    .populate('list', 'name')
    .sort('-createdAt');

  res.json(tasks);
});

const toggleTaskComplete = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  const board = await Board.findById(task.board);
  const isMember = board.members.some(
    (member) => member.user.toString() === req.user._id.toString()
  );
  const isOwner = board.owner.toString() === req.user._id.toString();

  if (!isOwner && !isMember) {
    res.status(403);
    throw new Error('Not authorized to update this task');
  }

  task.isCompleted = !task.isCompleted;
  const updatedTask = await task.save();

  await Activity.create({
    board: task.board,
    task: task._id,
    user: req.user._id,
    action: task.isCompleted ? 'completed_task' : 'reopened_task',
    description: `${req.user.name} ${task.isCompleted ? 'completed' : 'reopened'} "${task.title}"`,
  });

  res.json(updatedTask);
});

export {
  getTasksByList,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  moveTask,
  addComment,
  searchTasks,
  toggleTaskComplete,
};
