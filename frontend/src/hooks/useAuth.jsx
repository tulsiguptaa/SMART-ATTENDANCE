import { useState, useEffect, useContext, createContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@chakra-ui/react';
import api, { loginUser, getUserProfile } from '../services/api';

// Create context
const AuthContext = createContext();

// Provider component
export const AuthProvider = ({ children }) => {
  const auth = useProvideAuth();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

// Hook to access auth
export const useAuth = () => {
  return useContext(AuthContext);
};

// Core logic
function useProvideAuth() {
  const navigate = useNavigate();
  const toast = useToast();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Show toast message
  const showToast = useCallback((title, status = 'error') => {
    toast({
      title,
      status,
      duration: 5000,
      isClosable: true,
      position: 'top-right',
    });
  }, [toast]);

  // Check if token exists on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchProfile(token);
    } else {
      setLoading(false);
    }
  }, []);

  // Fetch user profile
  const fetchProfile = useCallback(async (token) => {
    try {
      setLoading(true);
      const response = await getUserProfile();
      
      if (response.data.success) {
        setUser({
          ...response.data.user,
          role: response.data.user.role || 'student',
        });
      } else {
        throw new Error(response.data.message || 'Failed to fetch user profile');
      }
    } catch (err) {
      console.error('Auth Error:', err);
      localStorage.removeItem('token');
      setUser(null);
      showToast('Your session has expired. Please log in again.');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  // Login
  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await loginUser({ email, password });
      
      if (response.data.success && response.data.token) {
        const { token, user } = response.data;
        localStorage.setItem('token', token);
        
        setUser({
          ...user,
          role: user.role || 'student',
        });
        
        showToast('Login successful!', 'success');
        return { success: true };
      } else {
        throw new Error(response.data.message || 'Login failed');
      }
    } catch (err) {
      console.error('Login Error:', err);
      const errorMessage = err.response?.data?.message || 'Failed to log in. Please try again.';
      showToast(errorMessage, 'error');
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Register
  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.post('/api/auth/register', userData);
      
      if (response.data.success) {
        showToast('Registration successful! Please log in.', 'success');
        return { success: true };
      } else {
        throw new Error(response.data.message || 'Registration failed');
      }
    } catch (err) {
      console.error('Registration Error:', err);
      const errorMessage = err.response?.data?.message || 'Failed to register. Please try again.';
      showToast(errorMessage, 'error');
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Update profile
  const updateProfile = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.put('/auth/profile', userData);
      
      if (response.data.success) {
        setUser(prev => ({
          ...prev,
          ...response.data.user,
          role: response.data.user.role || prev.role, // Preserve role if not provided
        }));
        
        showToast('Profile updated successfully!', 'success');
        return { success: true };
      } else {
        throw new Error(response.data.message || 'Failed to update profile');
      }
    } catch (err) {
      console.error('Profile Update Error:', err);
      const errorMessage = err.response?.data?.message || 'Failed to update profile. Please try again.';
      showToast(errorMessage, 'error');
      throw err; // Re-throw to allow component to handle the error if needed
    } finally {
      setLoading(false);
    }
  };

  // Change password
  const changePassword = async (currentPassword, newPassword) => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      const response = await axios.put(
        '/api/auth/change-password',
        { currentPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data.success) {
        showToast('Password changed successfully!', 'success');
        return { success: true };
      } else {
        throw new Error(response.data.message || 'Failed to change password');
      }
    } catch (err) {
      console.error('Password Change Error:', err);
      const errorMessage = err.response?.data?.message || 'Failed to change password. Please try again.';
      showToast(errorMessage, 'error');
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  return {
    user,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile,
    isAuthenticated: !!user,
  };
}
