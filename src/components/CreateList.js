import { useState } from 'react';

function CreateList({ onCreateList }) {
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim()) {
      onCreateList(title.trim());
      setTitle('');
      setIsAdding(false);
    }
  };

  if (!isAdding) {
    return (
      <div className="bg-white bg-opacity-20 rounded-lg w-72 flex-shrink-0 p-3">
        <button
          onClick={() => setIsAdding(true)}
          className="w-full text-left px-3 py-2 text-white hover:bg-white hover:bg-opacity-10 rounded transition-colors"
        >
          + Add another list
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 rounded-lg w-72 flex-shrink-0 p-3">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter list title..."
          autoFocus
          className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-transparent"
        />
        <div className="flex gap-2 mt-2">
          <button
            type="submit"
            className="px-4 py-2 bg-primary text-white rounded hover:bg-blue-600 transition-colors"
          >
            Add List
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

export default CreateList;
