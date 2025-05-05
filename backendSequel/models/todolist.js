import { sequelize } from '../db/connection.js';

const TodoList = sequelize.define('TodoList', {
  user: {
    type: String,
    required: true,
    ref: 'User'
  },
  todo_name: {
    type: String,
    required: true,
    trim: true,
    minlength: [3, 'Todo name must be at least 3 characters long'],
  },
  todo_desc: {
    type: String,
    maxlength: [500, 'Description cannot exceed 500 characters'],
    default: "",
    trim: true
  },
  todo_status: {
    type: String,
    required: true,
    default: "active",
    enum: {
      values: ["active", "finished"],
      message: '{VALUE} is not a valid status. Must be either "active" or "finished"'
    }
  },
  todo_priority: {
    type: String,
    enum: {
      values: ["low", "medium", "high"],
      message: '{VALUE} is not a valid priority. Must be either "low", "medium", or "high"'
    },
    default: "low"
  },
  due_date: {
    type: Date,
    default: null,
  }
}, {
  timestamps: true
});

export default TodoList;