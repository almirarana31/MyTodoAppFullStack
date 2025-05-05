import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/authContext';
import Alert from '../common/Alert';
import Loading from '../common/Loading';

const ResetPasswordConfirm = () => {
  const [email, setEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { resetPassword } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Clear previous errors
    setError('');
    
    // Front-end validation
    if (!email.trim()) {
      setError('Please enter your email');
      return;
    }
    
    if (!resetCode.trim()) {
      setError('Please enter your reset code');
      return;
    }

    if (!password.trim()) {
      setError('Please enter a new password');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }
    
    try {
      setMessage('');
      setLoading(true);
      
      // Log the values being sent (for debugging)
      console.log('Sending reset request with:', { token: resetCode, password, email });
      
      const response = await resetPassword(resetCode, password, email);
      console.log('Reset password response:', response);
      
      if (response && response.success) {
        setMessage('Password has been reset successfully');
        // Redirect to login page after a short delay
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        // Handle specific error messages from the server
        const errorMsg = response?.error || 'Failed to reset password. Please try again.';
        setError(errorMsg);
      }
    } catch (err) {
      console.error('Password reset error:', err);
      setError('Failed to reset password. ' + (err.message || 'Please check your reset code and try again.'));
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (setter) => (e) => {
    setter(e.target.value);
    // Clear error when user types
    if (error) setError('');
  };

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="px-6 py-8">
          <div className="mb-6">
            <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-pink-100 mb-4">
              <svg className="h-12 w-12 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"></path>
              </svg>
            </div>
            <h2 className="text-center text-3xl font-extrabold text-gray-900">
              Reset Password
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Enter your email, reset code and create a new password
            </p>
          </div>
          
          {error && <Alert type="error" message={error} />}
          {message && <Alert type="success" message={message} />}
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={handleInputChange(setEmail)}
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="resetCode" className="block text-sm font-medium text-gray-700">
                Reset Code
              </label>
              <div className="mt-1">
                <input
                  id="resetCode"
                  name="resetCode"
                  type="text"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                  placeholder="Enter your reset code"
                  value={resetCode}
                  onChange={handleInputChange(setResetCode)}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                New Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                  placeholder="Create a new password"
                  value={password}
                  onChange={handleInputChange(setPassword)}
                />
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm New Password
              </label>
              <div className="mt-1">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                  placeholder="Confirm your new password"
                  value={confirmPassword}
                  onChange={handleInputChange(setConfirmPassword)}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition-colors"
              >
                Reset Password
              </button>
            </div>

            <div className="flex flex-col space-y-2">
              <Link
                to="/forgot-password"
                className="text-center text-sm text-pink-600 hover:text-pink-800 transition-colors"
              >
                Need a new reset code?
              </Link>
            </div>
          </form>
        </div>
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <p className="text-xs text-center text-gray-500">
            Remember your password? <Link to="/login" className="font-medium text-pink-600 hover:text-pink-500">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordConfirm;