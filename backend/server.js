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

dotenv.config();
connectDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to CollabSync API' });
});

app.use('/api/users', userRoutes);
app.use('/api/boards', boardRoutes);
app.use('/api/lists', listRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/activity', activityRoutes);

app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  socket.on('joinBoard', (boardId) => {
    socket.join(boardId);
  });

  socket.on('leaveBoard', (boardId) => {
    socket.leave(boardId);
  });

  socket.on('taskCreated', (data) => {
    socket.to(data.boardId).emit('taskCreated', data.task);
  });

  socket.on('taskUpdated', (data) => {
    socket.to(data.boardId).emit('taskUpdated', data.task);
  });

  socket.on('taskDeleted', (data) => {
    socket.to(data.boardId).emit('taskDeleted', data.taskId);
  });

  socket.on('taskMoved', (data) => {
    socket.to(data.boardId).emit('taskMoved', data);
  });

  socket.on('listCreated', (data) => {
    socket.to(data.boardId).emit('listCreated', data.list);
  });

  socket.on('listUpdated', (data) => {
    socket.to(data.boardId).emit('listUpdated', data.list);
  });

  socket.on('listDeleted', (data) => {
    socket.to(data.boardId).emit('listDeleted', data.listId);
  });

  socket.on('boardUpdated', (data) => {
    socket.to(data.boardId).emit('boardUpdated', data.board);
  });

  socket.on('memberAdded', (data) => {
    socket.to(data.boardId).emit('memberAdded', data);
  });

  socket.on('memberRemoved', (data) => {
    socket.to(data.boardId).emit('memberRemoved', data);
  });

  socket.on('typing', (data) => {
    socket.to(data.boardId).emit('typing', {
      userId: data.userId,
      userName: data.userName,
    });
  });

  socket.on('stopTyping', (data) => {
    socket.to(data.boardId).emit('stopTyping', {
      userId: data.userId,
    });
  });

  socket.on('disconnect', () => {});
});

export { io };

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
