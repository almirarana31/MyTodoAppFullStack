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

/** 
 * @swagger 
 * /users:
 *   get:
 *     tags:
 *       - User
 *     summary: Get all users (admin only)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: List of users retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       '403':
 *         description: Unauthorized
 *       '500':
 *         description: Internal server error
 */

/**
 * @swagger
 * /user-infor:
 *   get:
 *     tags:
 *       - User
 *     summary: Get your information (authenticated user)
 *     description: Returns the information of the currently authenticated user based on the provided access token.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: User information retrieved
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *             example:
 *               _id: "6811faf886c1b58737cb135c"
 *               personal_id: "2702378956"
 *               user_image: "https://api.dicebear.com/9.x/big-ears-neutral/svg?seed=Alexander"
 *               name: "almira"
 *               email: "almira.rana31@gmail.com"
 *               address: "Jakarta, Indonesia"
 *               phone_number: "085972573889"
 *               role: "admin"
 *               verified: true
 *               joinedAt: "2025-04-30T10:27:04.811+00:00"
 *               updatedAt: "2025-04-30T10:27:58.184+00:00"
 *       '403':
 *         description: Unauthorized
 *       '500':
 *         description: Internal server error
 */

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     tags:
 *       - User
 *     summary: Update user
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [user, admin]
 *               address:
 *                 type: string
 *               phone_number:
 *                 type: string
 *     responses:
 *       '200':
 *         description: User updated successfully
 *       '403':
 *         description: Unauthorized
 *       '404':
 *         description: User not found
 *       '500':
 *         description: Internal server error
 */

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     tags:
 *       - User
 *     summary: Delete user (admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: User deleted successfully
 *       '403':
 *         description: Unauthorized
 *       '404':
 *         description: User not found
 *       '500':
 *         description: Internal server error
 */

/**
 * @swagger
 * /verify-email:
 *   post:
 *     tags:
 *       - User
 *     summary: Verify user's email address
 *     description: Verify a user's email address using the verification code sent to their email
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - code
 *             properties:
 *               email:
 *                 type: string
 *                 description: User's email address
 *                 example: "almira.rana31@gmail.com"
 *               code:
 *                 type: string
 *                 description: Verification code received via email
 *                 example: "a1b2c3"
 *     responses:
 *       '200':
 *         description: Email verified successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Email verified successfully"
 *       '400':
 *         description: Invalid request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Email and verification code are required"
 *       '404':
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User not found"
 *       '500':
 *         description: Internal server error
 */

/**
 * @swagger
 * /resend-verification:
 *   post:
 *     tags:
 *       - User
 *     summary: Resend verification code
 *     description: Resend the verification code to the user's email address
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 description: User's email address
 *                 example: "almira.rana31@gmail.com"
 *     responses:
 *       '200':
 *         description: Verification code resent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Verification code has been resent to your email"
 *       '400':
 *         description: Invalid request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Email is required"
 *       '404':
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User not found"
 *       '500':
 *         description: Internal server error
 */

/**
 * @swagger
 * /forgot-password:
 *   post:
 *     tags:
 *       - User
 *     summary: Request password reset
 *     description: Send a password reset code to the user's email
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 description: User's email address
 *                 example: "almira.rana31@gmail.com"
 *     responses:
 *       '200':
 *         description: Password reset instructions sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Password reset instructions sent to your email"
 *       '400':
 *         description: Invalid request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Email is required"
 *       '404':
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User not found"
 *       '500':
 *         description: Internal server error
 */

/**
 * @swagger
 * /reset-password:
 *   post:
 *     tags:
 *       - User
 *     summary: Reset password
 *     description: Reset user's password using the reset code
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - code
 *               - newPassword
 *               - confirmPassword
 *             properties:
 *               email:
 *                 type: string
 *                 description: User's email address
 *                 example: "almira.rana31@gmail.com"
 *               code:
 *                 type: string
 *                 description: Reset code received via email
 *                 example: "a1b2c3"
 *               newPassword:
 *                 type: string
 *                 description: New password
 *                 example: "NewPassword123"
 *               confirmPassword:
 *                 type: string
 *                 description: Confirm new password
 *                 example: "NewPassword123"
 *     responses:
 *       '200':
 *         description: Password reset successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Password reset successfully"
 *       '400':
 *         description: Invalid request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "All fields are required"
 *       '404':
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User not found"
 *       '500':
 *         description: Internal server error
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