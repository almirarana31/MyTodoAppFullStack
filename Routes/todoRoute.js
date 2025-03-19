import express from "express";
import { createTodo } from "../controllers/todolist.js";

const router = express.Router()

router.post("/add_todo", createTodo)

export default router