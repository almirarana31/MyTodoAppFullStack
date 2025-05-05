import React, { createContext, useState, useEffect, useContext } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const user = authService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      setError(null);
      // authService.login already returns the server response which includes access_token
      const data = await authService.login(email, password);
      
      // Update the current user in context
      setCurrentUser(data.user);
      
      // Return the server response directly - it already contains access_token
      return data;
    } catch (err) {
      console.error('Login error in context:', err);
      setCurrentUser(null);
      setError(err.response?.data?.message || err.message || 'Failed to login');
      return { 
        success: false, 
        message: err.response?.data?.message || err.message || 'Failed to login' 
      };
    }
  };

  const register = async (formData) => {
    try {
      setError(null);
      await authService.register(
        formData.name,
        formData.email,
        formData.password,
        formData.personal_id
      );
      return { success: true };
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to register');
      return { success: false, error: err.response?.data?.message || 'Failed to register' };
    }
  };

  const logout = () => {
    authService.logout();
    setCurrentUser(null);
    // Redirect to login page after logout
    window.location.href = '/login';
  };

  const updateProfile = async (userId, userData) => {
    try {
      setError(null);
      console.log('Updating profile in context:', { userId, userData }); // Debug log

      const updated = await authService.updateUser(userId, userData);
      console.log('Server response:', updated); // Debug log

      if (!updated) {
        throw new Error('No response from server');
      }

      // Dynamically update the current user state
      setCurrentUser((prev) => ({ ...prev, ...updated.user }));
      return { success: true };
    } catch (err) {
      console.error('Profile update error:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to update profile';
      setError(errorMessage);
      return { 
        success: false, 
        error: errorMessage 
      };
    }
  };

  const verifyEmailWithCode = async (email, token) => {
    try {
      setError(null);
      await authService.verifyEmailWithCode(email, token);
      return { success: true };
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to verify email');
      return { success: false, error: err.response?.data?.message || 'Failed to verify email' };
    }
  };

  const resendVerificationCode = async (email) => {
    try {
      setError(null);
      await authService.resendVerificationCode(email);
      return { success: true };
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend verification code');
      return { success: false, error: err.response?.data?.message || 'Failed to resend verification code' };
    }
  };

  const forgotPassword = async (email) => {
    try {
      setError(null);
      await authService.forgotPassword(email);
      return { success: true };
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send reset link');
      return { success: false, error: err.response?.data?.message || 'Failed to send reset link' };
    }
  };

  const resetPassword = async (token, password, email) => {
    try {
      setError(null);
      await authService.resetPassword(token, password, email);
      return { success: true };
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password');
      return { success: false, error: err.response?.data?.message || 'Failed to reset password' };
    }
  };

  // Reset error state when navigating or retrying actions
  const resetError = () => {
    setError(null);
  };

  const value = {
    currentUser,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile,
    verifyEmailWithCode,
    resendVerificationCode,
    forgotPassword,
    resetPassword,
    resetError, // Expose resetError to the context
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthContext;