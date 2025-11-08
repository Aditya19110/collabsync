import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getBoards, createBoard, deleteBoard } from '../redux/slices/boardSlice';
import { logout } from '../redux/slices/authSlice';

function Dashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { boards, isLoading } = useSelector((state) => state.boards);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newBoard, setNewBoard] = useState({
    title: '',
    description: '',
    backgroundColor: '#0079bf',
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      dispatch(getBoards());
    }
  }, [user, navigate, dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const handleCreateBoard = (e) => {
    e.preventDefault();
    dispatch(createBoard(newBoard));
    setNewBoard({ title: '', description: '', backgroundColor: '#0079bf' });
    setShowCreateModal(false);
  };

  const handleDeleteBoard = (id) => {
    if (window.confirm('Are you sure you want to delete this board?')) {
      dispatch(deleteBoard(id));
    }
  };

  const colors = ['#0079bf', '#d29034', '#519839', '#b04632', '#89609e', '#cd5a91'];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-primary">CollabSync</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-700">Welcome, {user?.name}</span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Your Boards</h2>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
          >
            + Create New Board
          </button>
        </div>

        {/* Boards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {boards.map((board) => (
            <div
              key={board._id}
              className="rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-xl transition-shadow"
              style={{ backgroundColor: board.backgroundColor }}
            >
              <div
                onClick={() => navigate(`/board/${board._id}`)}
                className="p-6 h-32 flex flex-col justify-between"
              >
                <h3 className="text-white font-semibold text-lg">{board.title}</h3>
                <p className="text-white text-sm opacity-90">
                  {board.lists?.length || 0} lists
                </p>
              </div>
              <div className="bg-white bg-opacity-20 p-3 flex justify-end">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteBoard(board._id);
                  }}
                  className="text-white hover:text-red-200 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {boards.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No boards yet. Create your first board to get started!
            </p>
          </div>
        )}
      </main>

      {/* Create Board Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <h3 className="text-2xl font-bold mb-4">Create New Board</h3>
            <form onSubmit={handleCreateBoard} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Board Title
                </label>
                <input
                  type="text"
                  value={newBoard.title}
                  onChange={(e) =>
                    setNewBoard({ ...newBoard, title: e.target.value })
                  }
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Enter board title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description (optional)
                </label>
                <textarea
                  value={newBoard.description}
                  onChange={(e) =>
                    setNewBoard({ ...newBoard, description: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Enter board description"
                  rows="3"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Background Color
                </label>
                <div className="flex gap-2">
                  {colors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() =>
                        setNewBoard({ ...newBoard, backgroundColor: color })
                      }
                      className={`w-12 h-12 rounded-lg ${
                        newBoard.backgroundColor === color
                          ? 'ring-4 ring-blue-400'
                          : ''
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  type="submit"
                  className="flex-1 bg-primary text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Create Board
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
