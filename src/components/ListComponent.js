import { Draggable, Droppable } from 'react-beautiful-dnd';
import TaskCard from './TaskCard';
import CreateTask from './CreateTask';
import { taskAPI } from '../utils/api';
import socketService from '../utils/socketService';
import { useState } from 'react';

function ListComponent({ list, index, boardId, onDeleteList }) {
  const [tasks, setTasks] = useState(list.tasks || []);

  const handleCreateTask = async (title) => {
    try {
      const response = await taskAPI.createTask({
        title,
        list: list._id,
        board: boardId,
        position: tasks.length,
      });
      setTasks([...tasks, response.data]);
      socketService.emit('taskCreated', {
        boardId,
        task: response.data,
      });
    } catch (error) {
      return;
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await taskAPI.deleteTask(taskId);
        setTasks(tasks.filter((t) => t._id !== taskId));
        socketService.emit('taskDeleted', { boardId, taskId });
      } catch (error) {
        return;
      }
    }
  };

  const handleUpdateTask = async (taskId, updates) => {
    try {
      const updatedTasks = tasks.map((t) =>
        t._id === taskId ? { ...t, ...updates } : t
      );
      setTasks(updatedTasks);
      await taskAPI.updateTask(taskId, updates);
      socketService.emit('taskUpdated', { boardId, taskId, updates });
    } catch (error) {
      return;
    }
  };

  return (
    <Draggable draggableId={list._id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={`bg-gray-100 rounded-lg w-72 flex-shrink-0 ${
            snapshot.isDragging ? 'opacity-50' : ''
          }`}
        >
          <div
            {...provided.dragHandleProps}
            className="p-3 font-semibold text-gray-800 flex justify-between items-center"
          >
            <h3 className="truncate">{list.title}</h3>
            <button
              onClick={() => onDeleteList(list._id)}
              className="text-gray-500 hover:text-red-500 transition-colors"
            >
              &times;
            </button>
          </div>

          <Droppable droppableId={list._id} type="task">
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={`p-2 min-h-[100px] max-h-[calc(100vh-250px)] overflow-y-auto ${
                  snapshot.isDraggingOver ? 'bg-blue-50' : ''
                }`}
              >
                {(list.tasks || tasks).map((task, index) => (
                  <TaskCard
                    key={task._id}
                    task={task}
                    index={index}
                    onDelete={handleDeleteTask}
                    onUpdate={handleUpdateTask}
                  />
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>

          <CreateTask onCreateTask={handleCreateTask} />
        </div>
      )}
    </Draggable>
  );
}

export default ListComponent;
