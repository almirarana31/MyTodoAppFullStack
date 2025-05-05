// controllers/todolist.js
import TodoList from '../models/todolist.js';

// create todo
export async function createTodo(req, res) {
  try {
    const { todo_name, todo_desc, todo_status, todo_priority, due_date } = req.body;

    if (!todo_name || !todo_desc) {
      return res.status(400).json({ message: "Please fill in the required fields." });
    }

    const newTodo = await TodoList.create({
      todo_name,
      todo_desc,
      todo_status: todo_status || 'active',
      todo_priority: todo_priority || 'low',
      due_date,
      user: req.user.id.toString() // id as string
    });

    res.status(200).json({ message: "Create a to do list successfully!", newTodo });
  } catch (error) {
    console.error('Create todo error:', error);
    return res.status(500).json({ message: error.message });
  }
}

// get all todo
export async function getAllTodos(req, res) {
  try {
    const todos = await TodoList.findAll({ 
      user: req.user.id.toString()
    });
    res.status(200).json(todos);
  } catch (error) {
    console.error('Get all todos error:', error);
    return res.status(500).json({ message: error.message });
  }
}

// update todo
export async function updateTodo(req, res) {
  try {
    const { id } = req.params;
    const { todo_name, todo_desc, todo_status, todo_priority, due_date } = req.body;

    // debug
    console.log('Update Todo Request:');
    console.log('Todo ID:', id);
    console.log('User ID from token:', req.user.id);
    console.log('Todo data:', req.body);

    const updateData = {};
    if (todo_name) updateData.todo_name = todo_name;
    if (todo_desc !== undefined) updateData.todo_desc = todo_desc;
    if (todo_status) updateData.todo_status = todo_status;
    if (todo_priority) updateData.todo_priority = todo_priority;
    if (due_date !== undefined) updateData.due_date = due_date;

    const todo = await TodoList.findOne({ 
      _id: id, 
      user: req.user.id.toString()
    });

    if (!todo) {
      return res.status(404).json({ message: "Todo not found or you don't have permission to access it" });
    }

    await TodoList.update(
      { _id: id },
      { $set: updateData } 
    );
    
    const updatedTodo = await TodoList.findOne({ _id: id });

    res.status(200).json({ message: "To-do updated successfully!", updatedTodo });
  } catch (error) {
    console.error('Update todo error:', error);
    return res.status(500).json({ message: error.message });
  }
}

// delete todo
export async function deleteTodo(req, res) {
  try {
    const { id } = req.params;
    

    const todo = await TodoList.findOne({ 
      _id: id,  
      user: req.user.id.toString()
    });

    if (!todo) {
      return res.status(404).json({ message: "To-do not found or you don't have permission to access it" });
    }
    
    await TodoList.delete({ _id: id });

    res.status(200).json({ message: "To-do deleted successfully!" });
  } catch (error) {
    console.error('Delete todo error:', error);
    return res.status(500).json({ message: error.message });
  }
}