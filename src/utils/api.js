import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
});

// Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// List API
export const listAPI = {
  getListsByBoard: (boardId) => api.get(`/api/lists/board/${boardId}`),
  createList: (data) => api.post('/api/lists', data),
  updateList: (id, data) => api.put(`/api/lists/${id}`, data),
  deleteList: (id) => api.delete(`/api/lists/${id}`),
  moveList: (id, newPosition) => api.put(`/api/lists/${id}/move`, { newPosition }),
};

// Task API
export const taskAPI = {
  getTasksByList: (listId) => api.get(`/api/tasks/list/${listId}`),
  getTaskById: (id) => api.get(`/api/tasks/${id}`),
  createTask: (data) => api.post('/api/tasks', data),
  updateTask: (id, data) => api.put(`/api/tasks/${id}`, data),
  deleteTask: (id) => api.delete(`/api/tasks/${id}`),
  moveTask: (id, newListId, newPosition) =>
    api.put(`/api/tasks/${id}/move`, { newListId, newPosition }),
  addComment: (id, text) => api.post(`/api/tasks/${id}/comments`, { text }),
};

// Board API
export const boardAPI = {
  getBoards: () => api.get('/api/boards'),
  getBoardById: (id) => api.get(`/api/boards/${id}`),
  createBoard: (data) => api.post('/api/boards', data),
  updateBoard: (id, data) => api.put(`/api/boards/${id}`, data),
  deleteBoard: (id) => api.delete(`/api/boards/${id}`),
  addMember: (boardId, userId, role) =>
    api.post(`/api/boards/${boardId}/members`, { userId, role }),
  removeMember: (boardId, memberId) =>
    api.delete(`/api/boards/${boardId}/members/${memberId}`),
};

// User API
export const userAPI = {
  searchUsers: (email) => api.get(`/api/users/search?email=${email}`),
  getProfile: () => api.get('/api/users/profile'),
  updateProfile: (data) => api.put('/api/users/profile', data),
};

export default api;
