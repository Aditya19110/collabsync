# 🧩 CollabSync

**A Real-Time Project & Team Management Web App built with the MERN Stack**

CollabSync is a web-based project management platform inspired by Trello/Asana, designed to help teams plan, organize, and track their projects efficiently. It allows users to create boards, lists, and draggable tasks — supporting real-time updates and collaboration among team members.

---

## 🚀 Features

| Feature | Description |
|---------|-------------|
| 🔐 **User Authentication** | Register/Login using JWT and bcrypt for secure password storage |
| 🧑‍🤝‍🧑 **Team Management** | Invite team members to boards via email |
| 📋 **Board & Task System** | Create boards, lists, and tasks under each board |
| 🖱️ **Drag-and-Drop Interface** | Move tasks between lists using React Beautiful DnD |
| 💬 **Real-time Updates** | Socket.IO integration for instant task updates among team members |
| 📆 **Due Dates & Priority** | Assign due dates and priority levels for each task |
| 📊 **Dashboard** | Visual overview of project progress |
| ☁️ **Deployment Ready** | Full deployment on Render (backend) and Vercel (frontend) |

---

## 🛠️ Tech Stack

### Frontend
- **React.js** - UI Library
- **Redux Toolkit** - State Management
- **React Router** - Routing
- **Axios** - HTTP Client
- **Tailwind CSS** - Styling
- **React Beautiful DnD** - Drag & Drop
- **Socket.IO Client** - Real-time Communication

### Backend
- **Node.js** - Runtime
- **Express.js** - Web Framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password Hashing
- **Socket.IO** - Real-time Communication
- **Nodemailer** - Email Service

### Database
- **MongoDB Atlas** - Cloud Database

### Deployment
- **Render** - Backend Hosting
- **Vercel** - Frontend Hosting
- **MongoDB Atlas** - Database Hosting

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account (or local MongoDB)
- npm or yarn

### Installation

#### 1. Clone the repository

```bash
git clone https://github.com/Aditya19110/collabsync.git
cd collabsync
```

#### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=ur_mongo_atlas
JWT_SECRET=your_jwt_secret_key_here_change_in_production
JWT_EXPIRE=30d

# Email Configuration (Nodemailer)
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-specific-password

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000
```

Start the backend server:

```bash
npm run dev
```

The backend will run on `http://localhost:5000`

#### 3. Frontend Setup

```bash
cd ..  # Back to root directory
npm install
```

Create a `.env` file in the root directory:

```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_SOCKET_URL=http://localhost:5000
```

Start the frontend:

```bash
npm start
```

The frontend will run on `http://localhost:3000`

---

## 🎯 Usage

1. **Register/Login**: Create an account or log in
2. **Create Board**: Click "Create New Board" on the dashboard
3. **Add Lists**: Click "+ Add another list" on the board
4. **Add Tasks**: Click "+ Add a card" in any list
5. **Drag & Drop**: Drag tasks between lists or reorder them
6. **Real-time Collaboration**: Changes are instantly visible to all board members
7. **Manage Tasks**: Set priority, due dates, mark as complete

---

## 📡 API Endpoints

### Authentication
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - Login user
- `GET /api/users/profile` - Get user profile (Protected)
- `PUT /api/users/profile` - Update user profile (Protected)
- `GET /api/users/search?email=` - Search users by email (Protected)

### Boards
- `GET /api/boards` - Get all boards (Protected)
- `GET /api/boards/:id` - Get single board (Protected)
- `POST /api/boards` - Create board (Protected)
- `PUT /api/boards/:id` - Update board (Protected)
- `DELETE /api/boards/:id` - Delete board (Protected)
- `POST /api/boards/:id/members` - Add member to board (Protected)
- `DELETE /api/boards/:id/members/:memberId` - Remove member (Protected)

### Lists
- `GET /api/lists/board/:boardId` - Get lists by board (Protected)
- `POST /api/lists` - Create list (Protected)
- `PUT /api/lists/:id` - Update list (Protected)
- `DELETE /api/lists/:id` - Delete list (Protected)
- `PUT /api/lists/:id/move` - Move list (Protected)

### Tasks
- `GET /api/tasks/list/:listId` - Get tasks by list (Protected)
- `GET /api/tasks/:id` - Get single task (Protected)
- `POST /api/tasks` - Create task (Protected)
- `PUT /api/tasks/:id` - Update task (Protected)
- `DELETE /api/tasks/:id` - Delete task (Protected)
- `PUT /api/tasks/:id/move` - Move task (Protected)
- `POST /api/tasks/:id/comments` - Add comment (Protected)

---

## 🔌 Socket.IO Events

### Client → Server
- `joinBoard` - Join a board room
- `leaveBoard` - Leave a board room
- `taskCreated` - Broadcast task creation
- `taskUpdated` - Broadcast task update
- `taskDeleted` - Broadcast task deletion
- `taskMoved` - Broadcast task movement
- `listCreated` - Broadcast list creation
- `listUpdated` - Broadcast list update
- `listDeleted` - Broadcast list deletion

### Server → Client
- `taskCreated` - Receive new task
- `taskUpdated` - Receive task update
- `taskDeleted` - Receive task deletion
- `taskMoved` - Receive task movement
- `listCreated` - Receive new list
- `listUpdated` - Receive list update
- `listDeleted` - Receive list deletion

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

**Aditya Kulkarni**

- GitHub: [@adityakulkarni](https://github.com/Aditya19110)
- LinkedIn: [Aditya Kulkarni](https://linkedin.com/in/aditya191103)

---


## 🔮 Future Enhancements

- [ ] File attachments for tasks
- [ ] Task comments and activity feed
- [ ] Email notifications for task assignments
- [ ] Board templates
- [ ] Calendar view
- [ ] Task search and filters
- [ ] Mobile app (React Native)
- [ ] OAuth integration (Google, GitHub)
- [ ] Board analytics and reports
- [ ] Dark mode

---

**Made with ❤️ by Aditya Kulkarni**