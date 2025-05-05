// controllers/userSendMail.js
import { createTransport } from 'nodemailer';
import { randomBytes } from 'crypto';
import User from '../models/user.js';

// Generate verification code
export function generateVerificationCode() {
  return randomBytes(3).toString('hex');
}

// Send verification email
export async function sendVerificationEmail(email, code) {
  try {
    const transporter = createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: `"Todo App" <${process.env.EMAIL}>`,
      to: email,
      subject: "Verify your Email",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 5px;">
          <h2 style="color: #333;">Todo App Email Verification</h2>
          <p>Thank you for registering with our Todo App. Please verify your email address to complete the registration process.</p>
          <div style="background-color: #f4f4f4; padding: 10px; border-radius: 5px; margin: 20px 0; text-align: center;">
            <h3 style="margin: 0;">Your verification code is:</h3>
            <h2 style="margin: 10px 0; color: #4285f4; letter-spacing: 5px;">${code}</h2>
            <p style="margin: 0; font-size: 12px;">This code will expire in 10 minutes</p>
          </div>
          <p>If you did not request this verification, please ignore this email.</p>
          <p>Best regards,<br>Todo App Team</p>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    return info;
    
  } catch (error) {
    throw new Error(`Failed to send verification email: ${error.message}`);
  }
}

// Send password reset email
export async function sendPasswordResetEmail(email, code) {
  try {
    const transporter = createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: `"Todo App" <${process.env.EMAIL}>`,
      to: email,
      subject: "Password Reset Request",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 5px;">
          <h2 style="color: #333;">Todo App Password Reset</h2>
          <p>We received a request to reset your password. Please use the code below to reset your password:</p>
          <div style="background-color: #f4f4f4; padding: 10px; border-radius: 5px; margin: 20px 0; text-align: center;">
            <h3 style="margin: 0;">Your reset code is:</h3>
            <h2 style="margin: 10px 0; color: #4285f4; letter-spacing: 5px;">${code}</h2>
            <p style="margin: 0; font-size: 12px;">This code will expire in 10 minutes</p>
          </div>
          <p>If you did not request a password reset, please ignore this email and your password will remain unchanged.</p>
          <p>Best regards,<br>Todo App Team</p>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    return info;
    
  } catch (error) {
    throw new Error(`Failed to send password reset email: ${error.message}`);
  }
}