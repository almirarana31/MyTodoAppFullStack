import mongoose from 'mongoose';
import TodolistModel from "../models/todolistModel.js";

// create to-do
export const createTodo = async (req, res) => {
    try {
        const { todo_name, todo_desc, todo_status, todo_priority, due_date } = req.body

        if ( !todo_name || !todo_desc || !todo_status) {
            return res.status(400).json({ message: "Please fill in the required fields." })
        }

        const newTodo = await TodolistModel.create({
            todo_name,
            todo_desc,
            todo_status,
            todo_priority,
            due_date,
            user: req.user.id
        });

        res.status(200).json({ message: "Create a to do list successfully!", newTodo })
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

// get all to-dos
export const getAllTodos = async (req, res) => {
    try {
        const todos = await TodolistModel.find({ user: req.user.id });
        res.status(200).json(todos);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// update to-do
export const updateTodo = async (req, res) => {
    try {
        const { id } = req.params;
        const { todo_name, todo_desc, todo_status, todo_priority, due_date } = req.body;

        // Log for debugging
        console.log('Update Todo Request:');
        console.log('Todo ID:', id);
        console.log('User ID from token:', req.user.id);
        console.log('Todo data:', req.body);

        const updateData = {
            todo_name,
            todo_desc,
            todo_status,
            todo_priority,
            due_date
        };

        // Convert the user ID to a string to ensure consistent comparison
        const userId = req.user.id.toString();
        
        // Find and update the todo document
        const updatedTodo = await TodolistModel.findOneAndUpdate(
            { 
                _id: id, 
                user: mongoose.Types.ObjectId.isValid(userId) ? new mongoose.Types.ObjectId(userId) : userId 
            },
            updateData,
            { new: true }
        );

        if (!updatedTodo) {
            return res.status(404).json({ message: "Todo not found or you don't have permission to access it" });
        }

        res.status(200).json({ message: "To-do updated successfully!", updatedTodo });
    } catch (error) {
        console.error('Error updating todo:', error);
        return res.status(500).json({ message: error.message });
    }
};

// delete to-do
export const deleteTodo = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedTodo = await TodolistModel.findByIdAndDelete(id);

        if (!deletedTodo) {
            return res.status(404).json({ message: "To-do not found." });
        }

        res.status(200).json({ message: "To-do deleted successfully!" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};