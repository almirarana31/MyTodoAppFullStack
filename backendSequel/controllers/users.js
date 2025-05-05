import jwt from 'jsonwebtoken';
import { compare, genSalt, hash } from 'bcrypt';
import User from '../models/user.js';
import { generateVerificationCode, sendVerificationEmail, sendPasswordResetEmail } from './userSendMail.js';
import  verify  from 'jsonwebtoken';

// Check password and confirmPassword
function isMatch(password, confirm_password) {
  return password === confirm_password;
}

// Validate email
function validateEmail(email) {
  const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

// Validate password
function validatePassword(password) {
  const re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
  return re.test(password);
}

// Create refresh token
function createRefreshToken(payload) {
  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
}

// Create access token
function createAccessToken(payload) {
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
}

// User sign-up
export async function signUp(req, res) {
  try {
    const { personal_id, name, email, password, confirmPassword, address, phone_number } = req.body;

    if (!personal_id || !name || !email || !password || !confirmPassword) {
      return res.status(400).json({ message: "Please fill in all fields" });
    }

    if (name.length < 3) {
      return res.status(400).json({ message: "Your name must be at least 3 letters long" });
    }

    if (!isMatch(password, confirmPassword)) {
      return res.status(400).json({ message: "Password did not match" });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    if (!validatePassword(password)) {
      return res.status(400).json({ 
        message: "Password must be 6-20 characters long and contain at least one number, one lowercase letter, and one uppercase letter" 
      });
    }

    // Use Sequelize methods to find existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "This email is already registered" });
    }

    // Hash password
    const salt = await genSalt(10);
    const hashedPassword = await hash(password, salt);

    // Create new user with Sequelize
    const newUser = await User.create({
      personal_id,
      name,
      email,
      password: hashedPassword,
      address,
      phone_number
    });

    // Generate verification code
    const verificationCode = generateVerificationCode();
    const verificationExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    
    // Update the user with verification code
    await User.update(
      { _id: newUser._id },
      { $set: {
        verificationCode,
        verificationExpires
      }}
    );
    
    // Send verification email
    try {
      await sendVerificationEmail(email, verificationCode);
    } catch (emailError) {
      console.error("Failed to send verification email:", emailError);
      // Continue with registration even if email fails
    }

    res.status(200).json({
      message: "User registered successfully. Please check your email for verification code.",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email
      }
    });
  } catch (error) {
    console.error("Error in signUp:", error);
    return res.status(500).json({ message: error.message });
  }
}

// User sign-in
export async function signIn(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please fill in all fields" });
    }

    // Use User model methods
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    // Since comparePassword is integrated in the MongoModel class
    const isPasswordMatch = await compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    // Check if user is verified
    if (!user.verified) {
      return res.status(403).json({ 
        message: "Please verify your email before signing in",
        needsVerification: true,
        email: user.email
      });
    }

    const refresh_token = createRefreshToken({ id: user._id });
    const access_token = createAccessToken({ id: user._id, role: user.role });

    const expiry = 24 * 60 * 60 * 1000; // 1 day

    res.cookie('refreshtoken', refresh_token, {
      httpOnly: true,
      path: '/api/user/refresh_token',
      maxAge: expiry,
      expires: new Date(Date.now() + expiry)
    });

    res.json({
      message: "Sign In successfully!",
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      },
      access_token
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

// User information
export async function userInfor(req, res) {
  try {
    const userId = req.user.id;
    const userInfo = await User.findOne({ _id: userId });

    if (!userInfo) {
      return res.status(404).json({ message: "User not found" });
    }

    // Remove sensitive information
    const userResponse = {
      _id: userInfo._id,
      personal_id: userInfo.personal_id,
      user_image: userInfo.user_image,
      name: userInfo.name,
      bio: userInfo.bio,
      email: userInfo.email,
      address: userInfo.address,
      phone_number: userInfo.phone_number,
      role: userInfo.role,
      verified: userInfo.verified,
      joinedAt: userInfo.joinedAt,
      updatedAt: userInfo.updatedAt
    };

    res.json(userResponse);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

// Verify email
export async function verifyEmail(req, res) {
  try {
    const { email, code } = req.body;
    
    if (!email || !code) {
      return res.status(400).json({ message: "Email and verification code are required" });
    }
    
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.verified) {
      return res.status(400).json({ message: "Email is already verified" });
    }

    if (user.verificationCode !== code || user.verificationExpires < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired verification code" });
    }

    await User.update(
      { _id: user._id },
      { $set: {
        verified: true,
        verificationCode: null,
        verificationExpires: null
      }}
    );

    res.json({ message: "Email verified successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

// Resend verification code
export async function resendVerificationCode(req, res) {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }
    
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.verified) {
      return res.status(400).json({ message: "Email is already verified" });
    }

    // Generate new verification code
    const verificationCode = generateVerificationCode();
    const verificationExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    
    await User.update(
      { _id: user._id },
      { $set: {
        verificationCode,
        verificationExpires
      }}
    );
    
    // Send verification email
    try {
      await sendVerificationEmail(email, verificationCode);
      res.json({ message: "Verification code sent successfully" });
    } catch (emailError) {
      return res.status(500).json({ message: "Failed to send verification email" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

// Forgot password
export async function forgotPassword(req, res) {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }
    
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate reset token
    const resetToken = generateVerificationCode();
    const resetExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    
    await User.update(
      { _id: user._id },
      { $set: {
        verificationCode: resetToken,
        verificationExpires: resetExpires
      }}
    );
    
    // Send password reset email
    try {
      await sendPasswordResetEmail(email, resetToken);
      res.json({ message: "Password reset instructions sent to your email" });
    } catch (emailError) {
      return res.status(500).json({ message: "Failed to send password reset email" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

// Reset password
export async function resetPassword(req, res) {
  try {
    const { email, code, newPassword, confirmPassword } = req.body;
    
    if (!email || !code || !newPassword || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }
    
    if (!isMatch(newPassword, confirmPassword)) {
      return res.status(400).json({ message: "Passwords do not match" });
    }
    
    if (!validatePassword(newPassword)) {
      return res.status(400).json({
        message: "Password should be 6 to 20 characters long with a numeric, 1 lowercase and 1 uppercase letters"
      });
    }
    
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.verificationCode !== code || user.verificationExpires < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired reset code" });
    }

    // Hash new password
    const salt = await genSalt(10);
    const hashedPassword = await hash(newPassword, salt);
    
    await User.update(
      { _id: user._id },
      { $set: {
        password: hashedPassword,
        verificationCode: null,
        verificationExpires: null
      }}
    );

    res.json({ message: "Password reset successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

// Refresh token
export async function refreshToken(req, res) {
  try {
    const rf_token = req.cookies.refreshtoken;
    
    if (!rf_token) {
      return res.status(400).json({ message: "Please login now!" });
    }

    verify(rf_token, process.env.REFRESH_TOKEN_SECRET, async (err, result) => {
      if (err) {
        return res.status(400).json({ message: "Please login now!" });
      }

      const user = await User.findOne({ _id: result.id });
      
      if (!user) {
        return res.status(404).json({ message: "User does not exist." });
      }

      const access_token = createAccessToken({ id: result.id, role: user.role });
      
      // Create a user object without the password
      const userResponse = {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      };

      res.json({
        access_token,
        user: userResponse
      });
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

// Logout
export async function logout(req, res) {
  try {
    res.clearCookie('refreshtoken', { path: '/api/user/refresh_token' });
    return res.json({ message: "Logged out successfully!" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

// Get all users (admin only)
export async function getAllUsers(req, res) {
  try {
    const users = await User.findAll();
    
    // Map users to remove password and sensitive fields
    const safeUsers = users.map(user => ({
      _id: user._id,
      personal_id: user.personal_id,
      name: user.name,
      email: user.email,
      role: user.role,
      address: user.address,
      phone_number: user.phone_number,
      bio: user.bio,
      verified: user.verified,
      joinedAt: user.joinedAt,
      updatedAt: user.updatedAt
    }));
    
    return res.status(200).json(safeUsers);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

// Update user
export async function updateUser(req, res) {
  try {
    const { id } = req.params;
    const { name, email, address, phone_number, bio, user_image, role } = req.body;

    // Check if user exists
    const user = await User.findOne({ _id: id });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Allow users to update their own profile or admins to update any profile
    if (req.user.id !== id && req.user.role !== 'admin') {
      return res.status(403).json({ message: "You can only update your own profile" });
    }

    // Create update object with only allowed fields
    const updateData = {};
    
    // If not admin, restrict updatable fields
    if (req.user.role !== 'admin') {
      // Regular users can only update these fields
      if (name) updateData.name = name;
      if (address) updateData.address = address;
      if (phone_number) updateData.phone_number = phone_number;
      if (bio !== undefined) updateData.bio = bio;
      if (user_image) updateData.user_image = user_image;
    } else {
      // Admins can update all fields including role and email
      if (name) updateData.name = name;
      if (email) updateData.email = email;
      if (role) updateData.role = role;
      if (address) updateData.address = address;
      if (phone_number) updateData.phone_number = phone_number;
      if (bio !== undefined) updateData.bio = bio;
      if (user_image) updateData.user_image = user_image;
    }

    await User.update({ _id: id }, { $set: updateData });
    // Fetch the updated user
    const updatedUser = await User.findOne({ _id: id });
    
    // Create a response without sensitive fields
    const userResponse = {
      id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      bio: updatedUser.bio,
      address: updatedUser.address,
      phone_number: updatedUser.phone_number,
      role: updatedUser.role,
      user_image: updatedUser.user_image
    };

    return res.status(200).json({ 
      message: "Profile updated successfully",
      user: userResponse
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

// Delete user (admin only)
export async function deleteUser(req, res) {
  try {
    const { id } = req.params;

    const user = await User.findOne({ _id: id });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await User.delete({ _id: id });
    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}