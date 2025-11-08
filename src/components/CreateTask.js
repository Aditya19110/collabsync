import { useState } from 'react';

function CreateTask({ onCreateTask }) {
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim()) {
      onCreateTask(title.trim());
      setTitle('');
      setIsAdding(false);
    }
  };

  if (!isAdding) {
    return (
      <div className="p-2">
        <button
          onClick={() => setIsAdding(true)}
          className="w-full text-left px-3 py-2 text-gray-600 hover:bg-gray-200 rounded transition-colors"
        >
          + Add a card
        </button>
      </div>
    );
  }

  return (
    <div className="p-2">
      <form onSubmit={handleSubmit}>
        <textarea
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter a title for this card..."
          autoFocus
          className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
          rows="3"
        />
        <div className="flex gap-2 mt-2">
          <button
            type="submit"
            className="px-4 py-2 bg-primary text-white rounded hover:bg-blue-600 transition-colors"
          >
            Add Card
          </button>
          <button
            type="button"
            onClick={() => {
              setIsAdding(false);
              setTitle('');
            }}
            className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateTask;
