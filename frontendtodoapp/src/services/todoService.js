import api from './api';

const todoService = {
  getAllTodos: async () => {
    const response = await api.get('/service/todo/get_all');
    return response.data;
  },

  addTodo: async (todoData) => {
    console.log('Adding todo:', todoData);
    const todo = {
      todo_name: todoData.todo_name || todoData.title,
      todo_desc: todoData.todo_desc || todoData.description || '',
      todo_status: todoData.todo_status || (todoData.completed ? 'finished' : 'active'),
      todo_priority: todoData.todo_priority || todoData.priority || 'low',
      due_date: todoData.due_date || null
    };
    const response = await api.post('/service/todo/add_todo', todo);
    console.log('Response from server:', response.data);
    return response.data.newTodo;
  },

  updateTodo: async (id, todoData) => {
    console.log('Updating todo with ID:', id);
    console.log('Todo data being sent:', todoData);
    const todo = {
      todo_name: todoData.todo_name || todoData.title,
      todo_desc: todoData.todo_desc || todoData.description || '',
      todo_status: todoData.todo_status,
      todo_priority: todoData.todo_priority || todoData.priority || 'low',
      due_date: todoData.due_date || null
    };
    const response = await api.patch(`/service/todo/update_todo/${id}`, todo);
    return response.data.updatedTodo;
  },

  deleteTodo: async (id) => {
    const response = await api.delete(`/service/todo/delete_todo/${id}`);
    return response.data;
  }
};

export default todoService;