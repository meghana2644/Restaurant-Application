import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  // Try to restore user from localStorage for fast UI hydration
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        setUser(null);
        localStorage.removeItem('user');
        return;
      }

      // If user is in localStorage, set it immediately for fast UI
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }

      // Always fetch latest user info from backend
      const response = await axios.get('http://localhost:5000/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(response.data);
      localStorage.setItem('user', JSON.stringify(response.data));
      setError(null);
    } catch (err) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      setError('Authentication failed');
    } finally {
      setLoading(false);
    }
  };  const login = async ({ email, password, role }) => {
    try {
      setLoading(true);
      // Support admin and restaurant_owner login endpoints
      let url = 'http://localhost:5000/api/auth/login';
      if (role === 'restaurant_owner') {
        url = 'http://localhost:5000/api/restaurant-owner/login';
      }
      const response = await axios.post(url, {
        email,
        password
      });

      // Extract token and user data, handling both response formats
      const { token, user: userData } = response.data;
      
      if (!token || !userData) {
        console.error('Invalid login response format:', response.data);
        throw new Error('Invalid server response');
      }
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      setError(null);
      return userData;
    } catch (err) {
      let errorMessage = 'Login failed';
      if (err.response) {
        switch (err.response.status) {
          case 401:
            errorMessage = 'Invalid email or password';
            break;
          case 404:
            errorMessage = 'Account not found';
            break;
          case 400:
            errorMessage = err.response.data.message || 'Invalid input';
            break;
          default:
            errorMessage = 'Something went wrong. Please try again.';
        }
      }
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  const register = async ({ name, email, password }) => {
    try {
      setLoading(true);
      const response = await axios.post('http://localhost:5000/api/auth/register', {
        name,
        email,
        password
      });

      const { token, user: userData } = response.data;
      localStorage.setItem('token', token);
      setUser(userData);
      setError(null);
      return userData;
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setError(null);
    window.location.href = '/'; // Redirect to home page after logout
  };
  const updateProfile = async (userData) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.put('http://localhost:5000/api/auth/profile', userData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setUser(response.data);
      setError(null);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Profile update failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile,
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 