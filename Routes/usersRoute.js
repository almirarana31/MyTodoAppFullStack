import express from 'express';
import { 
    signIn, 
    signUp, 
    userInfor, 
    verifyEmail, 
    resendVerificationCode,
    forgotPassword,
    resetPassword,
    logout,
    getAllUsers,
    updateUser,
    deleteUser
} from '../controllers/users.js';
import { auth } from '../middleware/auth.js';
import { checkRole } from '../middleware/roleMiddleware.js';

const router = express.Router()

/**
 * @openapi
 * tags:
 *   - name: User
 *     description: User related operations
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
router.get("/user-infor", auth, userInfor)

/**
 * @openapi
 * /signup:
 *   post:
 *     tags:
 *       - User
 *     summary: Sign up a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               personal_id:
 *                 type: string
 *                 example: "2702378956"
 *               name:
 *                 type: string
 *                 example: "almira"
 *               email:
 *                 type: string
 *                 example: "almira.rana31@gmail.com"
 *               password:
 *                 type: string
 *                 example: "Almira123"
 *               confirmPassword:
 *                 type: string
 *                 example: "Almira123"
 *               address:
 *                 type: string
 *                 example: "Jakarta, Indonesia"
 *               phone_number:
 *                 type: string
 *                 example: "085972573889"
 *     responses:
 *       '200':
 *         description: New user registration successfully
 *       '403':
 *         description: Requested resource is forbidden
 *       '400':
 *         description: Bad request
 *       '500':
 *         description: Internal server error
 */
router.post("/signup", signUp)

/**
 * @openapi
 * /signin:
 *   post:
 *     tags:
 *       - User
 *     summary: Sign in user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "almira.rana31@gmail.com"
 *               password:
 *                 type: string
 *                 example: "Almira123"
 *     responses:
 *       '200':
 *         description: Sign in successfully
 *       '403':
 *         description: Requested resource is forbidden
 *       '400':
 *         description: Bad request
 *       '500':
 *         description: Internal server error
 */
router.post("/signin", signIn)

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
router.post("/verify-email", verifyEmail)

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
router.post("/resend-verification", resendVerificationCode)

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
router.post("/forgot-password", forgotPassword)

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
router.post("/reset-password", resetPassword)

/**
 * @swagger
 * /logout:
 *   post:
 *     tags:
 *       - User
 *     summary: Log out user
 *     description: Logs out the user by clearing the refresh token cookie.
 *     responses:
 *       '200':
 *         description: Logged out successfully
 *       '500':
 *         description: Internal server error
 */
router.post("/logout", logout)

// admin routes
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
router.get("/users", auth, checkRole(['admin']), getAllUsers)

/**
 * @swagger
 * /users/{id}:
 *   patch:
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
 *                 example: "Almira"
 *               email:
 *                 type: string
 *                 example: "new.email@gmail.com"
 *               role:
 *                 type: string
 *                 enum: [user, admin]
 *                 example: "user"
 *               address:
 *                 type: string
 *                 example: "New Address"
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
router.patch("/users/:id", auth, checkRole(['admin']), updateUser)

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
router.delete("/users/:id", auth, checkRole(['admin']), deleteUser)

export default router