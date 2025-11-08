import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const initialState = {
  boards: [],
  currentBoard: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

// Get all boards
export const getBoards = createAsyncThunk('boards/getAll', async (_, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token;
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await axios.get(`${API_URL}/api/boards`, config);
    return response.data;
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

// Get single board
export const getBoardById = createAsyncThunk(
  'boards/getById',
  async (id, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.get(`${API_URL}/api/boards/${id}`, config);
      return response.data;
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Create board
export const createBoard = createAsyncThunk(
  'boards/create',
  async (boardData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.post(`${API_URL}/api/boards`, boardData, config);
      return response.data;
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Update board
export const updateBoard = createAsyncThunk(
  'boards/update',
  async ({ id, boardData }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.put(
        `${API_URL}/api/boards/${id}`,
        boardData,
        config
      );
      return response.data;
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Delete board
export const deleteBoard = createAsyncThunk(
  'boards/delete',
  async (id, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      await axios.delete(`${API_URL}/api/boards/${id}`, config);
      return id;
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const boardSlice = createSlice({
  name: 'boards',
  initialState,
  reducers: {
    reset: (state) => initialState,
    setCurrentBoard: (state, action) => {
      state.currentBoard = action.payload;
    },
    updateTaskInBoard: (state, action) => {
      if (state.currentBoard) {
        const { listId, task } = action.payload;
        const list = state.currentBoard.lists.find(
          (l) => l._id === listId
        );
        if (list) {
          const taskIndex = list.tasks.findIndex((t) => t._id === task._id);
          if (taskIndex !== -1) {
            list.tasks[taskIndex] = task;
          }
        }
      }
    },
    addTaskToBoard: (state, action) => {
      if (state.currentBoard) {
        const { listId, task } = action.payload;
        const list = state.currentBoard.lists.find(
          (l) => l._id === listId
        );
        if (list) {
          list.tasks.push(task);
        }
      }
    },
    removeTaskFromBoard: (state, action) => {
      if (state.currentBoard) {
        const { listId, taskId } = action.payload;
        const list = state.currentBoard.lists.find(
          (l) => l._id === listId
        );
        if (list) {
          list.tasks = list.tasks.filter((t) => t._id !== taskId);
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getBoards.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getBoards.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.boards = action.payload;
      })
      .addCase(getBoards.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getBoardById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getBoardById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.currentBoard = action.payload;
      })
      .addCase(getBoardById.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(createBoard.fulfilled, (state, action) => {
        state.boards.push(action.payload);
      })
      .addCase(updateBoard.fulfilled, (state, action) => {
        const index = state.boards.findIndex((b) => b._id === action.payload._id);
        if (index !== -1) {
          state.boards[index] = action.payload;
        }
        if (state.currentBoard && state.currentBoard._id === action.payload._id) {
          state.currentBoard = { ...state.currentBoard, ...action.payload };
        }
      })
      .addCase(deleteBoard.fulfilled, (state, action) => {
        state.boards = state.boards.filter((b) => b._id !== action.payload);
      });
  },
});

export const { reset, setCurrentBoard, updateTaskInBoard, addTaskToBoard, removeTaskFromBoard } =
  boardSlice.actions;
export default boardSlice.reducer;
