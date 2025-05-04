import TodolistModel from "../models/todolistModel.js";
import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config();

// middleware to validate id
export const validateTodoId = (req, res, next) => {
  const { id } = req.params;
  
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid todo ID format" });
  }
  
  next();
};

// validate to do fields
export const validateTodoFields = (req, res, next) => {
  const { todo_name, todo_status, todo_desc, todo_priority } = req.body;
  
  if (!todo_name) {
    return res.status(400).json({ message: "Todo name is required" });
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
};

// check if to do exists (and belongs to user)
export const checkTodoExists = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    const todo = await TodolistModel.findOne({ _id: id, user: userId });
    
    if (!todo) {
      return res.status(404).json({ message: "Todo not found or you don't have permission to access it" });
    }

    req.todo = todo;
    next();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const rateLimiter = (req, res, next) => {
  const clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
 
  if (!global.requestCounts) {
    global.requestCounts = {};
  }
  
  const now = Date.now();
  const windowMs = parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000;
  const maxRequests = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100;
  
  if (!global.requestCounts[clientIp]) {
    global.requestCounts[clientIp] = [];
  }
  
  global.requestCounts[clientIp] = global.requestCounts[clientIp].filter(
    timestamp => timestamp > now - windowMs
  );
  
  if (global.requestCounts[clientIp].length >= maxRequests) {
    return res.status(429).json({
      message: "Too many requests, please try again later",
      retryAfter: Math.ceil((global.requestCounts[clientIp][0] + windowMs - now) / 1000)
    });
  }

  global.requestCounts[clientIp].push(now);
  
  next();
};

// validate todo creation request
export const validateCreateTodo = (req, res, next) => {
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
};

// validate todo update request
export const validateUpdateTodo = (req, res, next) => {
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
};