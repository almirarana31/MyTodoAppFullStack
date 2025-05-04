import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/authContext';
import Alert from '../common/Alert';
import Loading from '../common/Loading';

const VerifyEmail = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { verifyEmail } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const token = new URLSearchParams(location.search).get('token');
        if (!token) {
          setError('Verification token is missing');
          setLoading(false);
          return;
        }

        await verifyEmail(token);
        setSuccess('Email verified successfully! You can now login.');
        setTimeout(() => navigate('/login'), 3000);
      } catch (err) {
        setError(err.message || 'Failed to verify email');
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, [location, navigate, verifyEmail]);

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Email Verification
          </h2>
        </div>
        {error && <Alert type="error" message={error} />}
        {success && <Alert type="success" message={success} />}
      </div>
    </div>
  );
};

export default VerifyEmail;