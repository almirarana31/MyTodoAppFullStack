import React, { createContext, useState, useEffect, useContext } from 'react';
import todoService from '../services/todoService';
import { useAuth } from './authContext';

const TodoContext = createContext(null);

export const TodoProvider = ({ children }) => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (currentUser) {
      fetchTodos();
    } else {
      setTodos([]);
      setLoading(false);
    }
  }, [currentUser]);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await todoService.getAllTodos();
      setTodos(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch todos');
    } finally {
      setLoading(false);
    }
  };

  const addTodo = async (todo) => {
    const tempTodo = { ...todo, _id: Date.now().toString() }; 
    setTodos((prevTodos) => [...prevTodos, tempTodo]);

    try {
      setError(null);
      const newTodo = await todoService.addTodo(todo);
      setTodos((prevTodos) =>
        prevTodos.map((t) => (t._id === tempTodo._id ? newTodo : t))
      );
      return { success: true };
    } catch (err) {
      setTodos((prevTodos) => prevTodos.filter((t) => t._id !== tempTodo._id)); 
      setError(err.response?.data?.message || 'Failed to add todo');
      return { success: false, error: err.response?.data?.message || 'Failed to add todo' };
    }
  };

  const updateTodo = async (id, todo) => {
    try {
      setError(null);
      const updatedTodo = await todoService.updateTodo(id, todo);
      setTodos((prevTodos) =>
        prevTodos.map((t) => (t._id === id ? updatedTodo : t))
      );
      return { success: true };
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update todo');
      return { success: false, error: err.response?.data?.message || 'Failed to update todo' };
    }
  };

  const deleteTodo = async (id) => {
    const tempTodos = todos.filter((t) => t._id !== id); 
    setTodos(tempTodos);

    try {
      setError(null);
      await todoService.deleteTodo(id);
      return { success: true };
    } catch (err) {
      setTodos(tempTodos); 
      setError(err.response?.data?.message || 'Failed to delete todo');
      return { success: false, error: err.response?.data?.message || 'Failed to delete todo' };
    }
  };

  const resetError = () => {
    setError(null);
  };

  const value = {
    todos,
    loading,
    error,
    fetchTodos,
    addTodo,
    updateTodo,
    deleteTodo,
    resetError, 
  };

  return <TodoContext.Provider value={value}>{children}</TodoContext.Provider>;
};

export const useTodo = () => {
  return useContext(TodoContext);
};

export default TodoContext;