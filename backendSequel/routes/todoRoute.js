// routes/todoRoute.js
import { Router } from 'express';
import { createTodo, deleteTodo, getAllTodos, updateTodo } from '../controllers/todolist.js';
import { auth } from '../middleware/auth.js';
import { validateTodoId, checkTodoExists, validateCreateTodo, validateUpdateTodo } from '../middleware/todoMiddleware.js';

const router = Router();

/**
 * @openapi
 * tags:
 *   - name: Todo
 *     description: Todo list related operations
 */

/**
 * @openapi
 * /get_all:
 *   get:
 *     tags:
 *       - Todo
 *     summary: Get all todo list from database (requires authentication)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Success
 *       '403':
 *         description: Unauthorized
 *       '500':
 *         description: Internal server error
 */
router.get("/get_all", auth, getAllTodos);

/**
 * @openapi
 * /add_todo:
 *   post:
 *     tags:
 *       - Todo
 *     summary: Add a new todo list (requires authentication)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               todo_name:
 *                 type: string
 *                 example: "Create to-do list backend"
 *               todo_desc:
 *                 type: string
 *                 example: "Continue MERN Stack part 2 tutorial to complete backend with authentication"
 *               todo_status:
 *                 type: string
 *                 example: "active"
 *               todo_priority:
 *                 type: string
 *                 example: "high"
 *               due_date:
 *                 type: string
 *                 format: date
 *                 example: "2025-05-15"
 *     responses:
 *       '200':
 *         description: Add todo successfully
 *       '403':
 *         description: Unauthorized
 *       '400':
 *         description: Bad request
 *       '500':
 *         description: Internal server error
 */
router.post("/add_todo", auth, validateCreateTodo, createTodo);

/**
 * @openapi
 * /update_todo/{id}:
 *   patch:
 *     tags:
 *       - Todo
 *     summary: Update todo list (requires authentication)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: todo ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               todo_name:
 *                 type: string
 *                 example: "Continue to-do list backend"
 *               todo_desc:
 *                 type: string
 *                 example: "Implement OTP, Docker, and updated middleware"
 *               todo_status:
 *                 type: string
 *                 example: "active"
 *               todo_priority:
 *                 type: string
 *                 example: "high"
 *               due_date:
 *                 type: string
 *                 format: date
 *                 example: "2025-05-15"
 *     responses:
 *       '200':
 *         description: Todo list updated
 *       '400':
 *         description: Bad request
 *       '404':
 *         description: Not Found
 *       '500':
 *         description: Internal server error
 */
router.patch("/update_todo/:id", auth, validateTodoId, checkTodoExists, validateUpdateTodo, updateTodo);

/**
 * @openapi
 * /delete_todo/{id}:
 *   delete:
 *     tags:
 *       - Todo
 *     summary: Delete a todo (requires authentication)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Todo ID
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Todo deleted
 *       '400':
 *         description: Bad request
 *       '404':
 *         description: Not Found
 *       '500':
 *         description: Internal server error
 */
router.delete("/delete_todo/:id", auth, validateTodoId, checkTodoExists, deleteTodo);

export default router;