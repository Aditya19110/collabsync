import { Draggable } from 'react-beautiful-dnd';
import { useState } from 'react';

function TaskCard({ task, index, onDelete, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);

  const handleSave = () => {
    if (editTitle.trim() !== task.title) {
      onUpdate(task._id, { title: editTitle.trim() });
    }
    setIsEditing(false);
  };

  const handleToggleComplete = () => {
    onUpdate(task._id, { isCompleted: !task.isCompleted });
  };

  const priorityColors = {
    low: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-orange-100 text-orange-800',
    urgent: 'bg-red-100 text-red-800',
  };

  return (
    <Draggable draggableId={task._id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`bg-white rounded shadow-sm p-3 mb-2 cursor-pointer hover:shadow-md transition-shadow ${
            snapshot.isDragging ? 'opacity-50 rotate-2' : ''
          } ${task.isCompleted ? 'opacity-60' : ''}`}
        >
          {isEditing ? (
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onBlur={handleSave}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSave();
                if (e.key === 'Escape') {
                  setEditTitle(task.title);
                  setIsEditing(false);
                }
              }}
              autoFocus
              className="w-full px-2 py-1 border border-primary rounded focus:outline-none focus:ring-2 focus:ring-primary"
            />
          ) : (
            <div>
              <div className="flex justify-between items-start gap-2">
                <h4
                  onClick={() => setIsEditing(true)}
                  className={`font-medium text-gray-800 flex-1 ${
                    task.isCompleted ? 'line-through' : ''
                  }`}
                >
                  {task.title}
                </h4>
                <button
                  onClick={() => onDelete(task._id)}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  ×
                </button>
              </div>

              {task.description && (
                <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                  {task.description}
                </p>
              )}

              <div className="flex items-center gap-2 mt-3 flex-wrap">
                {task.priority && (
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      priorityColors[task.priority]
                    }`}
                  >
                    {task.priority}
                  </span>
                )}

                {task.dueDate && (
                  <span className="text-xs text-gray-500">
                    Due: {new Date(task.dueDate).toLocaleDateString()}
                  </span>
                )}

                <button
                  onClick={handleToggleComplete}
                  className={`ml-auto text-xs px-2 py-1 rounded ${
                    task.isCompleted
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {task.isCompleted ? '✓ Done' : 'Mark Done'}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </Draggable>
  );
}

export default TaskCard;
