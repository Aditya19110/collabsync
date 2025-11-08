import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import boardRoutes from './routes/boardRoutes.js';
import listRoutes from './routes/listRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import commentRoutes from './routes/commentRoutes.js';
import activityRoutes from './routes/activityRoutes.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// CORS configuration
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  })
);

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to CollabSync API' });
});

app.use('/api/users', userRoutes);
app.use('/api/boards', boardRoutes);
app.use('/api/lists', listRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/activity', activityRoutes);

// Error handler middleware
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

// Create HTTP server
const httpServer = createServer(app);

// Initialize Socket.IO
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  },
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log(`✅ User connected: ${socket.id}`);

  // Join a board room
  socket.on('joinBoard', (boardId) => {
    socket.join(boardId);
    console.log(`User ${socket.id} joined board: ${boardId}`);
  });

  // Leave a board room
  socket.on('leaveBoard', (boardId) => {
    socket.leave(boardId);
    console.log(`User ${socket.id} left board: ${boardId}`);
  });

  // Real-time task created
  socket.on('taskCreated', (data) => {
    socket.to(data.boardId).emit('taskCreated', data.task);
  });

  // Real-time task updated
  socket.on('taskUpdated', (data) => {
    socket.to(data.boardId).emit('taskUpdated', data.task);
  });

  // Real-time task deleted
  socket.on('taskDeleted', (data) => {
    socket.to(data.boardId).emit('taskDeleted', data.taskId);
  });

  // Real-time task moved
  socket.on('taskMoved', (data) => {
    socket.to(data.boardId).emit('taskMoved', data);
  });

  // Real-time list created
  socket.on('listCreated', (data) => {
    socket.to(data.boardId).emit('listCreated', data.list);
  });

  // Real-time list updated
  socket.on('listUpdated', (data) => {
    socket.to(data.boardId).emit('listUpdated', data.list);
  });

  // Real-time list deleted
  socket.on('listDeleted', (data) => {
    socket.to(data.boardId).emit('listDeleted', data.listId);
  });

  // Real-time board updated
  socket.on('boardUpdated', (data) => {
    socket.to(data.boardId).emit('boardUpdated', data.board);
  });

  // Real-time member added
  socket.on('memberAdded', (data) => {
    socket.to(data.boardId).emit('memberAdded', data);
  });

  // Real-time member removed
  socket.on('memberRemoved', (data) => {
    socket.to(data.boardId).emit('memberRemoved', data);
  });

  // User typing indicator
  socket.on('typing', (data) => {
    socket.to(data.boardId).emit('typing', {
      userId: data.userId,
      userName: data.userName,
    });
  });

  // User stopped typing
  socket.on('stopTyping', (data) => {
    socket.to(data.boardId).emit('stopTyping', {
      userId: data.userId,
    });
  });

  // Disconnect
  socket.on('disconnect', () => {
    console.log(`❌ User disconnected: ${socket.id}`);
  });
});

// Export io for use in other files if needed
export { io };

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
