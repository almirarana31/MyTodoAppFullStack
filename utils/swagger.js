import swaggerJsDoc from "swagger-jsdoc";
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
 *               type: object
 *               properties:
 *                  $oid:
 *                     type: string
 *                     description: Unique identifier for the user
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
 *            _id:
 *               $oid: "uniqueKeyUser"
 *            personal_id: "2702378956"
 *            user_image: "https://api.dicebear.com/9.x/fun-emoji/svg?backgroundColor=b6e3f4,c0aede,d1d4f9"
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
 *            - todo_image
 *            - todo_status
 *         properties:
 *            _id:
 *               type: object
 *               properties:
 *                  $oid:
 *                     type: string
 *                     description: Unique identifier for the todo list
 *            todo_name:
 *               type: string
 *               description: Name of the todo list
 *            todo_desc:
 *               type: string
 *               description: Description of the todo list
 *            todo_status:
 *               type: string
 *               description: status of the todo list (active or finished)
 *            createdAt:
 *               type: string
 *               format: date-time
 *               description: Date when the user joined
 *            updatedAt:
 *               type: string
 *               format: date-time
 *               description: Last date when the user's information was updated
 *         example:
 *            _id:
 *               $oid: "uniqueKeyUser"
 *            todo_name: "Work on WADS Assignment 8"
 *            todo_image: "https://api.dicebear.com/9.x/notionists-neutral/svg?seed=Felix"
 *            todo_desc: "Go to lecture slides and see instructions"
 *            todo_status: "active"
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
        path.join(__dirname, '..', 'Routes', '*.js'),
        path.join(__dirname, '..', 'Routes', '*.ts'),
        path.join(__dirname, 'swagger.js'),
        path.join(__dirname, 'swagger.ts'),
    ],
});

export default swaggerSpec;