// middleware/todoMiddleware.js
import { Types } from 'mongoose';
import TodoList from '../models/todolist.js';

// Middleware to validate ID
export function validateTodoId(req, res, next) {
  const { id } = req.params;
  
  if (!Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid todo ID format" });
  }
  
  next();
}

// Validate todo fields
export function validateTodoFields(req, res, next) {
  console.log('Request body in middleware:', req.body);
  console.log('Content-Type:', req.headers['content-type']);
  const { todo_name, todo_status, todo_desc, todo_priority } = req.body;
  
  if (!todo_name) {
    return res.status(400).json({ message: "Todo name is required" });
  }
  
  if (!todo_desc) {
    return res.status(400).json({ message: "Todo description is required" });
  }
  
  if (todo_name.length < 3) {
    return res.status(400).json({ message: "Todo name must be at least 3 characters long" });
  }
  
  if (todo_status && !["active", "finished"].includes(todo_status)) {
    return res.status(400).json({ message: "Todo status must be either 'active' or 'finished'" });
  }
  
  if (todo_desc && todo_desc.length > 500) {
    return res.status(400).json({ message: "Todo description cannot exceed 500 characters" });
  }

  if (todo_priority && !["low", "medium", "high"].includes(todo_priority)) {
    return res.status(400).json({ message: "Todo priority must be either 'low', 'medium', or 'high'" });
  }

  req.body.todo_name = todo_name.trim();
  if (todo_desc) req.body.todo_desc = todo_desc.trim();
  
  next();
}

// Check if todo exists (and belongs to user)
export async function checkTodoExists(req, res, next) {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    console.log('Looking for todo:', { id, userId });
    
    // Fixed query format to match MongoModel's expectations
    const todo = await TodoList.findOne({
      _id: id, // Use MongoDB's _id field
      user: userId.toString() // Ensure userId is a string to match the model definition
    });
    
    console.log('Found todo:', todo);
    
    if (!todo) {
      return res.status(404).json({ message: "Todo not found or you don't have permission to access it" });
    }

    req.todo = todo;
    next();
  } catch (error) {
    console.error('Check todo exists error:', error);
    return res.status(500).json({ message: error.message });
  }
}

// Validate todo creation request
export function validateCreateTodo(req, res, next) {
  const { todo_name, todo_desc, todo_status, todo_priority } = req.body;
  
  if (!todo_name) {
    return res.status(400).json({ message: "Todo name is required" });
  }
  
  if (todo_name.length < 3) {
    return res.status(400).json({ message: "Todo name must be at least 3 characters long" });
  }
  
  if (todo_desc && todo_desc.length > 500) {
    return res.status(400).json({ message: "Todo description cannot exceed 500 characters" });
  }
  
  if (todo_status && !["active", "finished"].includes(todo_status)) {
    return res.status(400).json({ message: "Todo status must be either 'active' or 'finished'" });
  }

  if (todo_priority && !["low", "medium", "high"].includes(todo_priority)) {
    return res.status(400).json({ message: "Todo priority must be either 'low', 'medium', or 'high'" });
  }
  
  next();
}

// Validate todo update request
export function validateUpdateTodo(req, res, next) {
  const { todo_name, todo_desc, todo_status, todo_priority } = req.body;
  
  if (todo_name && todo_name.length < 3) {
    return res.status(400).json({ message: "Todo name must be at least 3 characters long" });
  }
  
  if (todo_desc && todo_desc.length > 500) {
    return res.status(400).json({ message: "Todo description cannot exceed 500 characters" });
  }
  
  if (todo_status && !["active", "finished"].includes(todo_status)) {
    return res.status(400).json({ message: "Todo status must be either 'active' or 'finished'" });
  }

  if (todo_priority && !["low", "medium", "high"].includes(todo_priority)) {
    return res.status(400).json({ message: "Todo priority must be either 'low', 'medium', or 'high'" });
  }
  
  next();
}