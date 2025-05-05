import api from './api';


const authService = {
  login: async (email, password) => {
    try {
      const response = await api.post('/service/user/signin', { email, password });
      if (response.data.access_token) {
        localStorage.setItem('token', response.data.access_token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        api.defaults.headers.common['Authorization'] = `Bearer ${response.data.access_token}`;
        return response.data;
      } else {
        throw new Error('No access token received from server');
      }
    } catch (error) {
      console.error('Login error:', error.response?.data || error);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      throw error;
    }
  },

  register: async (name, email, password, personal_id) => {
    const response = await api.post('/service/user/signup', {
      personal_id,
      name,
      email,
      password,
      confirmPassword: password,
      address: "Not specified", 
      phone_number: "Not specified"
    });
    return response.data;
  },

  logout: () => {
    api.post('/service/user/logout').catch(err => console.error('Logout error:', err));
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  verifyEmailWithCode: async (email, code) => {
    const response = await api.post('/service/user/verify-email', { email, code });
    return response.data;
  },

  resendVerificationCode: async (email) => {
    const response = await api.post('/service/user/resend-verification', { email });
    return response.data;
  },

  forgotPassword: async (email) => {
    const response = await api.post('/service/user/forgot-password', { email });
    return response.data;
  },

  resetPassword: async (code, password, email) => {
    const response = await api.post('/service/user/reset-password', { 
      code, 
      newPassword: password,
      confirmPassword: password,
      email
    });
    return response.data;
  },

  getUserInfo: async () => {
    try {
      const response = await api.get('/service/user/user-infor');
      return response.data;
    } catch (error) {
      console.error('Error fetching user info:', error);  
      throw error.response?.data || error.message;
    }
  },

  updateUser: async (userId, userData) => {
    try {
        const currentUser = JSON.parse(localStorage.getItem('user'));
        
        const userIdToUse = currentUser.id || currentUser._id;
        
        const response = await api.patch(`/service/user/users/${userIdToUse}`, userData);

        if (response.data && response.data.user) {

            const updatedUser = {
                ...response.data.user,
                id: response.data.user._id || response.data.user.id
            };
            localStorage.setItem('user', JSON.stringify(updatedUser));
        }

        return response.data;
    } catch (error) {
        console.error('Error updating user:', error);
        throw error.response?.data || error.message;
    }
  }
};

export default authService;