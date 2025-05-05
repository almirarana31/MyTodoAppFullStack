import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/authContext';
import authService from '../../services/authService';

const UserProfile = () => {
  const { currentUser, updateProfile } = useAuth();
  const [name, setname] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [address, setAddress] = useState('');
  const [phone_number, setPhoneNumber] = useState('');
  const [user_image, setUserImage] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Focus name input on load
  useEffect(() => {
    if (!loading) {
      document.getElementById('name').focus();
    }
  }, [loading]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setError('');
        const userData = await authService.getUserInfo();
        setname(userData.name || '');
        setEmail(userData.email || '');
        setBio(userData.bio || '');
        setAddress(userData.address || '');
        setPhoneNumber(userData.phone_number || '');
        setUserImage(userData.user_image || '');
        console.log('User data loaded successfully:', userData);
      } catch (err) {
        console.error('User data fetch error:', err);
        setError('Failed to load user data: ' + (err.message || 'Unknown error'));
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleInputChange = (setter) => (e) => {
    setter(e.target.value);
    setError('');
    setSuccess('');
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
  
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }
  
    const cloudName = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
    console.log('Using cloud name:', cloudName); // Debug log
    
    if (!cloudName) {
      setError('Cloudinary configuration is missing');
      return;
    }
  
    try {
      setUploading(true);
      setError('');
      
      // Create form data
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'profile_picture'); // Make sure this preset exists in your Cloudinary account
      
      // Upload to Cloudinary
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );
  
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error.message);
      }
  
      // Update profile with new image URL
      const userId = currentUser.id || currentUser._id;
      const updateResponse = await updateProfile(userId, {
        user_image: data.secure_url
      });
  
      if (updateResponse.success) {
        setUserImage(data.secure_url);
        setSuccess('Profile image updated successfully');
      } else {
        throw new Error(updateResponse.error);
      }
    } catch (err) {
      console.error('Image upload error:', err);
      setError(err.message || 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!name.trim()) {
      return setError('name is required');
    }

    if (bio.length > 500) {
      return setError('Bio cannot exceed 500 characters');
    }

    try {
      setError('');
      setSuccess('');
      setUpdating(true);

      const userId = currentUser.id || currentUser._id;
      
      // Debug log
      console.log('User IDs:', {
        currentUserId: userId,
        currentUser
      });
      
      const { success, error } = await updateProfile(userId, {
        name: name.trim(),
        bio: bio.trim(),
        address: address.trim(),
        phone_number: phone_number.trim()
      });
      
      if (success) {
        setSuccess('Profile updated successfully');
      } else {
        console.error('Update failed:', error);
        setError(error || 'Failed to update profile');
      }
    } catch (err) {
      console.error('Submit error:', err);
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center text-gray-500">
          <svg className="mx-auto h-12 w-12 animate-spin text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="mt-3 text-lg font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-8 text-3xl font-bold text-gray-800">My Profile</h1>
        
        {error && (
          <div
            className="mb-4 rounded bg-red-100 p-3 text-red-700"
            role="alert"
            aria-live="assertive"
          >
            {error}
          </div>
        )}
        
        {success && (
          <div
            className="mb-4 rounded bg-green-100 p-3 text-green-700"
            role="alert"
            aria-live="polite"
          >
            {success}
          </div>
        )}
        
        <div className="rounded-lg bg-white p-6 shadow-md">
          {/* Profile Image Section */}
          <div className="mb-6 text-center">
            <div className="relative mx-auto mb-4 h-32 w-32 overflow-hidden rounded-full">
              <img
                src={user_image || "https://api.dicebear.com/9.x/big-ears-neutral/svg?seed=Alexander"}
                alt="Profile"
                className="h-full w-full object-cover"
              />
              {uploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-white border-t-transparent"></div>
                </div>
              )}
            </div>
            <label className="cursor-pointer rounded-md bg-gray-100 px-4 py-2 text-sm text-gray-700 hover:bg-gray-200">
              Change Photo
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                disabled={uploading}
              />
            </label>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Name *
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={handleInputChange(setname)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-pink-500 focus:outline-none focus:ring-pink-500"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                disabled
                className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-100 px-3 py-2 shadow-sm"
                aria-label="Email address (cannot be changed)"
              />
              <p className="mt-1 text-sm text-gray-500">Email cannot be changed</p>
            </div>

            <div className="mb-4">
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                Address
              </label>
              <input
                type="text"
                id="address"
                value={address}
                onChange={handleInputChange(setAddress)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-pink-500 focus:outline-none focus:ring-pink-500"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone_number"
                value={phone_number}
                onChange={handleInputChange(setPhoneNumber)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-pink-500 focus:outline-none focus:ring-pink-500"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                User Role
              </label>
              <input
                type="text"
                id="role"
                value={currentUser?.role || 'user'}
                disabled
                className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-100 px-3 py-2 shadow-sm"
                aria-label="User role (cannot be changed)"
              />
              <p className="mt-1 text-sm text-gray-500">Role can only be changed by an administrator</p>
            </div>

            <div className="mb-6">
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                Bio (max 500 characters)
              </label>
              <textarea
                id="bio"
                value={bio}
                onChange={handleInputChange(setBio)}
                rows="4"
                maxLength="500"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-pink-500 focus:outline-none focus:ring-pink-500"
              ></textarea>
              <p className="mt-1 text-sm text-gray-500">{500 - bio.length} characters remaining</p>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={updating}
                className="rounded-md bg-pink-600 py-2 px-4 text-white hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 disabled:bg-pink-300"
                aria-live="polite"
              >
                {updating ? 'Updating...' : 'Update Profile'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;