import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { getBoardById } from '../redux/slices/boardSlice';
import socketService from '../utils/socketService';
import { listAPI, taskAPI } from '../utils/api';
import ListComponent from '../components/ListComponent';
import CreateList from '../components/CreateList';

function BoardView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { currentBoard, isLoading } = useSelector((state) => state.boards);

  const [lists, setLists] = useState([]);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    dispatch(getBoardById(id));

    // Connect to Socket.IO
    socketService.connect();
    socketService.joinBoard(id);

    // Listen for real-time updates
    socketService.on('taskCreated', (task) => {
      setLists((prevLists) =>
        prevLists.map((list) =>
          list._id === task.list
            ? { ...list, tasks: [...list.tasks, task] }
            : list
        )
      );
    });

    socketService.on('taskUpdated', (task) => {
      setLists((prevLists) =>
        prevLists.map((list) =>
          list._id === task.list
            ? {
                ...list,
                tasks: list.tasks.map((t) => (t._id === task._id ? task : t)),
              }
            : list
        )
      );
    });

    socketService.on('taskDeleted', (taskId) => {
      setLists((prevLists) =>
        prevLists.map((list) => ({
          ...list,
          tasks: list.tasks.filter((t) => t._id !== taskId),
        }))
      );
    });

    socketService.on('listCreated', (list) => {
      setLists((prevLists) => [...prevLists, { ...list, tasks: [] }]);
    });

    socketService.on('listDeleted', (listId) => {
      setLists((prevLists) => prevLists.filter((l) => l._id !== listId));
    });

    return () => {
      socketService.leaveBoard(id);
      socketService.off('taskCreated');
      socketService.off('taskUpdated');
      socketService.off('taskDeleted');
      socketService.off('listCreated');
      socketService.off('listDeleted');
    };
  }, [id, user, navigate, dispatch]);

  useEffect(() => {
    if (currentBoard && currentBoard.lists) {
      setLists(currentBoard.lists.sort((a, b) => a.position - b.position));
    }
  }, [currentBoard]);

  const onDragEnd = async (result) => {
    const { source, destination, type } = result;

    // Dropped outside the list
    if (!destination) {
      return;
    }

    // No movement
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    if (type === 'list') {
      // Reorder lists
      const newLists = Array.from(lists);
      const [removed] = newLists.splice(source.index, 1);
      newLists.splice(destination.index, 0, removed);

      setLists(newLists);

      // Update positions in backend
      try {
        await listAPI.moveList(removed._id, destination.index);
      } catch (error) {
        console.error('Error moving list:', error);
        setLists(lists); // Revert on error
      }
    } else {
      // Reorder tasks
      const sourceListIndex = lists.findIndex((l) => l._id === source.droppableId);
      const destListIndex = lists.findIndex((l) => l._id === destination.droppableId);

      if (sourceListIndex === -1 || destListIndex === -1) return;

      const sourceList = lists[sourceListIndex];
      const destList = lists[destListIndex];

      if (source.droppableId === destination.droppableId) {
        // Same list
        const newTasks = Array.from(sourceList.tasks);
        const [removed] = newTasks.splice(source.index, 1);
        newTasks.splice(destination.index, 0, removed);

        const newLists = [...lists];
        newLists[sourceListIndex] = {
          ...sourceList,
          tasks: newTasks,
        };

        setLists(newLists);

        // Update backend
        try {
          await taskAPI.moveTask(
            removed._id,
            sourceList._id,
            destination.index
          );
          socketService.emit('taskMoved', {
            boardId: id,
            taskId: removed._id,
            sourceListId: sourceList._id,
            destListId: sourceList._id,
            sourceIndex: source.index,
            destIndex: destination.index,
          });
        } catch (error) {
          console.error('Error moving task:', error);
          setLists(lists); // Revert on error
        }
      } else {
        // Different lists
        const sourceTasks = Array.from(sourceList.tasks);
        const destTasks = Array.from(destList.tasks);
        const [removed] = sourceTasks.splice(source.index, 1);
        destTasks.splice(destination.index, 0, removed);

        const newLists = [...lists];
        newLists[sourceListIndex] = {
          ...sourceList,
          tasks: sourceTasks,
        };
        newLists[destListIndex] = {
          ...destList,
          tasks: destTasks,
        };

        setLists(newLists);

        // Update backend
        try {
          await taskAPI.moveTask(removed._id, destList._id, destination.index);
          socketService.emit('taskMoved', {
            boardId: id,
            taskId: removed._id,
            sourceListId: sourceList._id,
            destListId: destList._id,
            sourceIndex: source.index,
            destIndex: destination.index,
          });
        } catch (error) {
          console.error('Error moving task:', error);
          setLists(lists); // Revert on error
        }
      }
    }
  };

  const handleCreateList = async (title) => {
    try {
      const response = await listAPI.createList({
        title,
        board: id,
        position: lists.length,
      });
      setLists([...lists, { ...response.data, tasks: [] }]);
      socketService.emit('listCreated', {
        boardId: id,
        list: response.data,
      });
    } catch (error) {
      console.error('Error creating list:', error);
    }
  };

  const handleDeleteList = async (listId) => {
    if (window.confirm('Are you sure you want to delete this list?')) {
      try {
        await listAPI.deleteList(listId);
        setLists(lists.filter((l) => l._id !== listId));
        socketService.emit('listDeleted', { boardId: id, listId });
      } catch (error) {
        console.error('Error deleting list:', error);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading board...</div>
      </div>
    );
  }

  if (!currentBoard) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Board not found</div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: currentBoard.backgroundColor }}
    >
      {/* Header */}
      <header className="bg-black bg-opacity-20 text-white">
        <div className="px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="px-4 py-2 bg-white bg-opacity-20 rounded hover:bg-opacity-30 transition-colors"
            >
              ← Back
            </button>
            <h1 className="text-2xl font-bold">{currentBoard.title}</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm">
              {currentBoard.members?.length || 0} members
            </span>
          </div>
        </div>
      </header>

      {/* Board Content */}
      <div className="p-4 overflow-x-auto">
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="board" type="list" direction="horizontal">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="flex gap-4"
              >
                {lists.map((list, index) => (
                  <ListComponent
                    key={list._id}
                    list={list}
                    index={index}
                    boardId={id}
                    onDeleteList={handleDeleteList}
                  />
                ))}
                {provided.placeholder}
                <CreateList onCreateList={handleCreateList} />
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </div>
  );
}

export default BoardView;
