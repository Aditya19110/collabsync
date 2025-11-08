import asyncHandler from 'express-async-handler';
import Task from '../models/taskModel.js';
import List from '../models/listModel.js';
import Board from '../models/boardModel.js';
import Activity from '../models/activityModel.js';

// @desc    Get all tasks for a list
// @route   GET /api/tasks/list/:listId
// @access  Private
const getTasksByList = asyncHandler(async (req, res) => {
  const list = await List.findById(req.params.listId);

  if (!list) {
    res.status(404);
    throw new Error('List not found');
  }

  // Check if user has access to board
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

// @desc    Get single task
// @route   GET /api/tasks/:id
// @access  Private
const getTaskById = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id)
    .populate('assignedTo', 'name email avatar')
    .populate('list')
    .populate('board');

  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  // Check if user has access to board
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

// @desc    Create new task
// @route   POST /api/tasks
// @access  Private
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

  // Check if board exists and user has access
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

  // Get the max position if not provided
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

  // Add task to list
  const listDoc = await List.findById(list);
  listDoc.tasks.push(task._id);
  await listDoc.save();

  const populatedTask = await Task.findById(task._id).populate(
    'assignedTo',
    'name email avatar'
  );

  res.status(201).json(populatedTask);
});

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  // Check if user has access to the board
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

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  // Check if user has access to the board
  const board = await Board.findById(task.board);
  const isMember = board.members.some(
    (member) => member.user.toString() === req.user._id.toString()
  );
  const isOwner = board.owner.toString() === req.user._id.toString();

  if (!isOwner && !isMember) {
    res.status(403);
    throw new Error('Not authorized to delete this task');
  }

  // Remove task from list
  const list = await List.findById(task.list);
  list.tasks = list.tasks.filter(
    (taskId) => taskId.toString() !== task._id.toString()
  );
  await list.save();

  await task.deleteOne();

  res.json({ message: 'Task removed' });
});

// @desc    Move task (same list or different list)
// @route   PUT /api/tasks/:id/move
// @access  Private
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

  // Check if user has access to the board
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

  // If moving to a different list
  if (oldListId !== newListId) {
    // Remove from old list
    const oldList = await List.findById(oldListId);
    oldList.tasks = oldList.tasks.filter(
      (taskId) => taskId.toString() !== task._id.toString()
    );
    await oldList.save();

    // Update positions in old list
    await Task.updateMany(
      { list: oldListId, position: { $gt: oldPosition } },
      { $inc: { position: -1 } }
    );

    // Add to new list
    const newList = await List.findById(newListId);
    newList.tasks.push(task._id);
    await newList.save();

    // Update positions in new list
    await Task.updateMany(
      { list: newListId, position: { $gte: newPosition } },
      { $inc: { position: 1 } }
    );

    task.list = newListId;
    task.position = newPosition;
  } else {
    // Moving within the same list
    if (newPosition < oldPosition) {
      // Moving up
      await Task.updateMany(
        {
          list: oldListId,
          position: { $gte: newPosition, $lt: oldPosition },
        },
        { $inc: { position: 1 } }
      );
    } else if (newPosition > oldPosition) {
      // Moving down
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

  // Return updated task
  const updatedTask = await Task.findById(task._id).populate(
    'assignedTo',
    'name email avatar'
  );

  res.json(updatedTask);
});

// @desc    Add comment to task
// @route   POST /api/tasks/:id/comments
// @access  Private
const addComment = asyncHandler(async (req, res) => {
  const { text } = req.body;

  const task = await Task.findById(req.params.id);

  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  // Check if user has access to the board
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

// @desc    Search tasks in a board
// @route   GET /api/tasks/search/:boardId
// @access  Private
const searchTasks = asyncHandler(async (req, res) => {
  const { query, priority, assignedTo, labels, dueDate } = req.query;

  // Verify board access
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

  // Build search query
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

// @desc    Toggle task completion status
// @route   PUT /api/tasks/:id/complete
// @access  Private
const toggleTaskComplete = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  // Check if user has access to board
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

  // Log activity
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
