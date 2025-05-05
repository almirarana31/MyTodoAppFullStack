import React, { useState } from 'react';
import { useTodo } from '../../context/todoContext';
import TodoItem from './TodoItem';
import AddTodo from './AddTodo';

const TodoList = () => {
  const { todos, loading, error, resetError } = useTodo();
  const [showAddModal, setShowAddModal] = useState(false);
  const [filter, setFilter] = useState('all'); // 'all', 'active', 'completed'

  const filteredTodos = todos.filter((todo) => {
    if (filter === 'active') return todo.todo_status === 'active';
    if (filter === 'completed') return todo.todo_status === 'finished';
    return true;
  });

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
    resetError(); // Reset error when filter changes
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center text-gray-500">
          <svg
            className="mx-auto h-12 w-12 animate-spin text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <p className="mt-3 text-lg font-medium">Loading todos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex flex-col justify-between sm:flex-row">
        <h1 className="mb-4 text-3xl font-bold text-gray-800 sm:mb-0">My Todo List</h1>
        <div className="flex items-center">
          <div className="mr-4">
            <select
              className="rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              value={filter}
              onChange={handleFilterChange}
            >
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Add New
          </button>
        </div>
      </div>

      {error && (
        <div
          className="mb-4 rounded bg-red-100 p-3 text-red-700"
          role="alert"
          aria-live="assertive"
        >
          {error}
        </div>
      )}

      {todos.length === 0 ? (
        <div
          className="rounded-lg bg-white p-6 text-center shadow-md"
          role="alert"
          aria-live="polite"
        >
          <p className="text-xl text-gray-500">No todos yet. Add one to get started!</p>
        </div>
      ) : filteredTodos.length === 0 ? (
        <div
          className="rounded-lg bg-white p-6 text-center shadow-md"
          role="alert"
          aria-live="polite"
        >
          <p className="text-xl text-gray-500">No {filter} todos found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredTodos.map((todo) => (
            <TodoItem key={todo._id} todo={todo} />
          ))}
        </div>
      )}

      {showAddModal && <AddTodo onClose={() => setShowAddModal(false)} />}
    </div>
  );
};

export default TodoList;