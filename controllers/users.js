import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Users from '../models/users.js';
import { setVerificationCode, sendVerificationEmail, sendPasswordResetEmail, generateVerificationCode } from './userSendMail.js';

// check password and confirmPassword
function isMatch(password, confirm_password) {
    if (password === confirm_password) return true
    return false
}

// validate email
function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

// validate password
function validatePassword(password) {
    const re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
    return re.test(password);
}

// create refresh token
function createRefreshToken(payload) {
  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' })
}

// create access token
function createAccessToken(payload) {
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' })
}

// user sign-up
export const signUp = async (req, res) => {
    try {
        const { personal_id, name, email, password, confirmPassword, address, phone_number } = req.body;

        if (!personal_id || !name || !email || !password || !confirmPassword) {
            return res.status(400).json({ message: "Please fill in all fields" });
        }

        if (name.length < 3) return res.status(400).json({ message: "Your name must be at least 3 letters long" });

        if (!isMatch(password, confirmPassword)) return res.status(400).json({ message: "Password did not match" });

        if (!validateEmail(email)) return res.status(400).json({ message: "Invalid email format" });

        if (!validatePassword(password)) {
            return res.status(400).json({ 
                message: "Password must be 6-20 characters long and contain at least one number, one lowercase letter, and one uppercase letter" 
            });
        }

        const existingUser = await Users.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "This email is already registered" });
        }

        const newUser = new Users({
            personal_id,
            name,
            email,
            password,
            address,
            phone_number
        });

        await newUser.save();

        // Generate and set verification code
        const verificationCode = await setVerificationCode(newUser._id);
        
        // Send verification email
        if (verificationCode) {
            const emailSent = await sendVerificationEmail(email, verificationCode);
            
            if (!emailSent) {
                console.log("Verification email could not be sent");
                // Continue with registration even if email fails
            }
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
        return res.status(500).json({ message: error.message });
    }
}

// user sign-in
export const signIn = async (req, res) => {
  try {
      const { email, password } = req.body;

      const user = await Users.findOne({ email });

      if (!email || !password) return res.status(400).json({ message: "Please fill in all fields" });

      if (!user) return res.status(400).json({ message: "Invalid Credentials" });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ message: "Invalid Credentials" });

      // check if user is verified
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

// user information
export const userInfor = async (req, res) => {
  try {
      const userId = req.user.id;
      const userInfor = await Users.findById(userId).select("-password");

      if (!userInfor) {
          return res.status(404).json({ message: "User not found" });
      }

      res.json(userInfor);
  } catch (error) {
      return res.status(500).json({ message: error.message });
  }
}

// verify email
export const verifyEmail = async (req, res) => {
  try {
    const { email, code } = req.body;
    
    if (!email || !code) {
      return res.status(400).json({ message: "Email and verification code are required" });
    }
    
    const user = await Users.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.verified) {
      return res.status(400).json({ message: "Email is already verified" });
    }

    if (user.verificationCode !== code || user.verificationExpires < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired verification code" });
    }

    user.verified = true;
    user.verificationCode = null;
    user.verificationExpires = null;
    await user.save();

    res.json({ message: "Email verified successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

// resend verification code
export const resendVerificationCode = async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }
    
    const user = await Users.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.verified) {
      return res.status(400).json({ message: "Email is already verified" });
    }

    // Generate and set new verification code
    const verificationCode = await setVerificationCode(user._id);
    
    // Send verification email
    if (verificationCode) {
      const emailSent = await sendVerificationEmail(email, verificationCode);
      
      if (!emailSent) {
        return res.status(500).json({ message: "Failed to send verification email" });
      }
    } else {
      return res.status(500).json({ message: "Failed to generate verification code" });
    }

    res.json({ message: "Verification code sent successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

// forgot password
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }
    
    const user = await Users.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate reset token
    const resetToken = generateVerificationCode();
    const resetExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    
    user.verificationCode = resetToken;
    user.verificationExpires = resetExpires;
    await user.save();
    
    // Send password reset email
    const emailSent = await sendPasswordResetEmail(email, resetToken);
    
    if (!emailSent) {
      return res.status(500).json({ message: "Failed to send password reset email" });
    }

    res.json({ message: "Password reset instructions sent to your email" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

// reset password
export const resetPassword = async (req, res) => {
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
    
    const user = await Users.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.verificationCode !== code || user.verificationExpires < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired reset code" });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    
    user.password = hashedPassword;
    user.verificationCode = null;
    user.verificationExpires = null;
    await user.save();

    res.json({ message: "Password reset successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

// refresh token
export const refreshToken = async (req, res) => {
  try {
    const rf_token = req.cookies.refreshtoken;
    
    if (!rf_token) {
      return res.status(400).json({ message: "Please login now!" });
    }

    jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, async (err, result) => {
      if (err) {
        return res.status(400).json({ message: "Please login now!" });
      }

      const user = await Users.findById(result.id).select("-password");
      
      if (!user) {
        return res.status(404).json({ message: "User does not exist." });
      }

      const access_token = createAccessToken({ id: result.id });
      
      res.json({
        access_token,
        user
      });
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

// logout
export const logout = async (req, res) => {
  try {
    res.clearCookie('refreshtoken', { path: '/api/user/refresh_token' });
    return res.json({ message: "Logged out successfully!" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

// get all users (admin only)
export const getAllUsers = async (req, res) => {
    try {
        const users = await Users.find().select('-password -verificationCode -resetPasswordToken');
        return res.status(200).json(users);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// update user (admin only)
export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, role, address, phone_number } = req.body;

        const user = await Users.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // update fields if provided
        if (name) user.name = name;
        if (email) user.email = email;
        if (role) user.role = role;
        if (address) user.address = address;
        if (phone_number) user.phone_number = phone_number;

        await user.save();
        return res.status(200).json({ message: "User updated successfully" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// delete user (admin only)
export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await Users.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        await user.deleteOne();
        return res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};