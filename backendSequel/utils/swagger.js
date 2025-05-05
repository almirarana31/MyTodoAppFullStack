// utils/swagger.js
import swaggerJsDoc from "swagger-jsdoc";
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *      User:
 *         type: object
 *         required:
 *            - personal_id
 *            - name
 *            - email
 *            - password
 *         properties:
 *            _id:
 *               type: string
 *               description: Unique identifier for the user
 *            user_image:
 *               type: string
 *               description: Image of the user
 *            personal_id:
 *               type: string
 *               description: User's Personal ID (Student ID, Employee ID, etc.)
 *            name:
 *               type: string
 *               description: Full name of the user
 *            email:
 *               type: string
 *               description: Email address of the user
 *            password:
 *               type: string
 *               description: Hashed password of the user
 *            address:
 *               type: string
 *               description: User's address
 *            phone_number:
 *               type: string
 *               description: User's phone number
 *            role:
 *               type: string
 *               enum: [user, admin]
 *               description: User's role in the system
 *            verified:
 *               type: boolean
 *               description: Whether the user's email is verified
 *            joinedAt:
 *               type: string
 *               format: date-time
 *               description: Date when the user joined
 *            updatedAt:
 *               type: string
 *               format: date-time
 *               description: Last date when the user's information was updated
 *         example:
 *            _id: "uniqueKeyUser"
 *            personal_id: "2702378956"
 *            user_image: "https://api.dicebear.com/9.x/big-ears-neutral/svg?seed=Alexander"
 *            name: "almira"
 *            email: "almira.rana31@gmail.com"
*            password: "Almira123"
*            address: "Jakarta, Indonesia"
*            phone_number: "085972573889"
*            role: "user"
*            verified: false
*      Todo:
*         type: object
*         required:
*            - todo_name
*            - todo_desc
*            - todo_status
*         properties:
*            _id:
*               type: string
*               description: Unique identifier for the todo list
*            todo_name:
*               type: string
*               description: Name of the todo list
*            todo_desc:
*               type: string
*               description: Description of the todo list
*            todo_status:
*               type: string
*               description: status of the todo list (active or finished)
*            todo_priority:
*               type: string
*               description: Priority of the todo list (low, medium, high)
*            due_date:
*               type: Date
*               description: Due date of the todo list 
*            createdAt:
*               type: string
*               format: date-time
*               description: Date when the todo was created
*            updatedAt:
*               type: string
*               format: date-time
*               description: Last date when the todo was updated
*         example:
*            _id: "uniqueKeyTodo"
*            todo_name: "Work on WADS Assignment 8"
*            todo_desc: "Go to lecture slides and see instructions"
*            todo_status: "active"
*            todo_priority: "high"
*/

const swaggerSpec = swaggerJsDoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Todo List Management API",
      version: "1.0.0",
      description: "API for managing todo list, including user authentication and todo list management.",
    },
    servers: [
      {
        url: 'http://localhost:5001/service/user',
        description: 'Development - user',
      },
      {
        url: "http://localhost:5001/service/todo",
        description: 'Development - todo'
      }
    ],
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: [
    join(__dirname, '..', 'routes', '*.js'),
    join(__dirname, 'swagger.js'),
  ],
});

export default swaggerSpec;