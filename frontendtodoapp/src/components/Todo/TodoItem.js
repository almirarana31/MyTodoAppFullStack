import React, { useState } from 'react';
import { useTodo } from '../../context/todoContext';
import EditTodo from './EditTodo';

const TodoItem = ({ todo }) => {
  const { updateTodo, deleteTodo } = useTodo();
  const [showEditModal, setShowEditModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleToggleComplete = async () => {
    try {
      // This should pass the correct data format your API expects
      await updateTodo(todo._id, {
        ...todo,
        todo_status: todo.todo_status === 'active' ? 'finished' : 'active'
      });
    } catch (error) {
      console.error("Error toggling todo completion:", error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this todo?')) {
      setIsDeleting(true);
      await deleteTodo(todo._id);
      setIsDeleting(false);
    }
  };

  // Format the date
  const formatDate = (dateString) => {
    // If null, undefined, or empty string
    if (dateString == null || dateString === '') return "No due date";
    
    const date = new Date(dateString);
    // Check if date is valid
    if (isNaN(date.getTime())) return "Invalid date format";
    
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div
      className={`rounded-lg bg-white p-6 shadow-md transition-all duration-300 ${
        todo.completed ? 'opacity-75' : ''
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={handleToggleComplete}
            className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <div className="ml-4">
            <div className="flex items-center gap-2">
              <h3
                className={`text-lg font-medium ${
                  todo.completed ? 'line-through text-gray-500' : 'text-gray-800'
                }`}
              >
                {todo.todo_name}
              </h3>
              <span className={`rounded-full px-2 py-1 text-xs font-medium ${getPriorityColor(todo.todo_priority)}`}>
                {todo.todo_priority}
              </span>
            </div>
            <p className="mt-1 text-sm text-gray-600">{todo.todo_desc}</p>
            <p className="mt-2 text-xs text-gray-500">
              {todo.createdAt && `Created: ${formatDate(todo.createdAt)}`}
            </p>
            <p className="mt-2 text-xs text-gray-500">
                Due: {formatDate(todo.due_date)}
            </p>
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowEditModal(true)}
            className="rounded-md bg-gray-100 p-2 text-gray-600 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className={`rounded-md bg-red-100 p-2 text-red-600 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 ${
              isDeleting ? 'cursor-not-allowed opacity-50' : ''
            }`}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>

      {showEditModal && (
        <EditTodo
          todo={todo}
          onClose={() => setShowEditModal(false)}
        />
      )}
    </div>
  );
};

export default TodoItem;