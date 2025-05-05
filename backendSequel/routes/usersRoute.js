// routes/usersRoute.js
import { 
  signIn, 
  signUp, 
  userInfor, 
  verifyEmail, 
  resendVerificationCode,
  forgotPassword,
  resetPassword,
  refreshToken, // Make sure this is imported
  logout,
  getAllUsers,
  updateUser,
  deleteUser
} from '../controllers/users.js';
import { auth } from '../middleware/auth.js';
import { checkRole } from '../middleware/roleMiddleware.js';
import express from 'express';

const router = express.Router();

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
 *       '403':
 *         description: Unauthorized
 *       '500':
 *         description: Internal server error
 */
router.get("/user-infor", auth, userInfor);

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
router.post("/signup", signUp);

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
router.post("/signin", signIn);

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
 *       '400':
 *         description: Invalid request
 *       '404':
 *         description: User not found
 *       '500':
 *         description: Internal server error
 */
router.post("/verify-email", verifyEmail);

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
 *       '400':
 *         description: Invalid request
 *       '404':
 *         description: User not found
 *       '500':
 *         description: Internal server error
 */
router.post("/resend-verification", resendVerificationCode);

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
 *       '400':
 *         description: Invalid request
 *       '404':
 *         description: User not found
 *       '500':
 *         description: Internal server error
 */
router.post("/forgot-password", forgotPassword);

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
 *       '400':
 *         description: Invalid request
 *       '404':
 *         description: User not found
 *       '500':
 *         description: Internal server error
 */
router.post("/reset-password", resetPassword);

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
router.post("/logout", logout);

/**
 * @swagger
 * /refresh_token:
 *   post:
 *     tags:
 *       - User
 *     summary: Get new access token using refresh token
 *     description: Use the refresh token stored in cookie to generate a new access token
 *     responses:
 *       '200':
 *         description: New access token generated successfully
 *       '400':
 *         description: Invalid refresh token
 *       '500':
 *         description: Internal server error
 */
router.post("/refresh_token", refreshToken);

// Admin routes
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
 *       '403':
 *         description: Unauthorized
 *       '500':
 *         description: Internal server error
 */
router.get("/users", auth, checkRole(['admin']), getAllUsers);

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
 *               bio:
 *                 type: string
 *                 example: "New bio description"
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
router.patch("/users/:id", auth, updateUser);

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
router.delete("/users/:id", auth, checkRole(['admin']), deleteUser);

export default router;