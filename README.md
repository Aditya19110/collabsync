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

## 📂 Project Structure

```
collabsync/
│
├── backend/
│   ├── server.js                 # Entry point with Socket.IO
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── models/
│   │   ├── userModel.js          # User schema
│   │   ├── boardModel.js         # Board schema
│   │   ├── listModel.js          # List schema
│   │   └── taskModel.js          # Task schema
│   ├── routes/
│   │   ├── userRoutes.js         # Auth & user routes
│   │   ├── boardRoutes.js        # Board CRUD routes
│   │   ├── listRoutes.js         # List CRUD routes
│   │   └── taskRoutes.js         # Task CRUD routes
│   ├── controllers/
│   │   ├── userController.js     # User logic
│   │   ├── boardController.js    # Board logic
│   │   ├── listController.js     # List logic
│   │   └── taskController.js     # Task logic
│   ├── middleware/
│   │   └── authMiddleware.js     # JWT verification
│   ├── utils/
│   │   └── generateToken.js      # JWT token generator
│   └── package.json
│
├── frontend/ (root directory)
│   ├── src/
│   │   ├── components/
│   │   │   ├── ListComponent.js  # List with tasks
│   │   │   ├── TaskCard.js       # Individual task card
│   │   │   ├── CreateTask.js     # Task creation form
│   │   │   └── CreateList.js     # List creation form
│   │   ├── pages/
│   │   │   ├── Login.js          # Login page
│   │   │   ├── Register.js       # Registration page
│   │   │   ├── Dashboard.js      # User dashboard
│   │   │   └── BoardView.js      # Board with drag-drop
│   │   ├── redux/
│   │   │   ├── store.js          # Redux store
│   │   │   └── slices/
│   │   │       ├── authSlice.js  # Auth state
│   │   │       └── boardSlice.js # Board state
│   │   ├── utils/
│   │   │   ├── socketService.js  # Socket.IO client
│   │   │   └── api.js            # Axios API helpers
│   │   ├── App.js                # Main app with routes
│   │   └── index.js              # Entry point
│   ├── public/
│   └── package.json
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account (or local MongoDB)
- npm or yarn

### Installation

#### 1. Clone the repository

```bash
git clone https://github.com/yourusername/collabsync.git
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
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/collabsync?retryWrites=true&w=majority
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

## 🚀 Deployment

### Backend Deployment (Render)

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Set the root directory to `backend`
4. Set build command: `npm install`
5. Set start command: `npm start`
6. Add environment variables from `.env.example`
7. Deploy

### Frontend Deployment (Vercel)

1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in the root directory
3. Follow the prompts
4. Set environment variables:
   - `REACT_APP_API_URL` - Your Render backend URL
   - `REACT_APP_SOCKET_URL` - Your Render backend URL
5. Deploy with `vercel --prod`

### Database (MongoDB Atlas)

1. Create a cluster on MongoDB Atlas
2. Create a database user
3. Whitelist IP addresses (or allow from anywhere for testing)
4. Get connection string and add to backend `.env`

---

## 🧪 Testing

### Backend Tests

```bash
cd backend
npm test
```

### Frontend Tests

```bash
npm test
```

---

## 📝 Environment Variables

### Backend (.env)
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=<your-mongodb-uri>
JWT_SECRET=<your-secret-key>
JWT_EXPIRE=30d
EMAIL_SERVICE=gmail
EMAIL_USER=<your-email>
EMAIL_PASS=<your-app-password>
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_SOCKET_URL=http://localhost:5000
```

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

- GitHub: [@adityakulkarni](https://github.com/yourusername)
- LinkedIn: [Aditya Kulkarni](https://linkedin.com/in/yourprofile)

---

## 🙏 Acknowledgments

- Inspired by Trello and Asana
- Built for demonstrating full-stack MERN development skills
- Designed to showcase API integration and real-time collaboration features

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


In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
