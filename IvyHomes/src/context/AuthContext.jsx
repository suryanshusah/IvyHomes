import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { login as apiLogin } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('ivy_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('ivy_user');
    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    setLoading(false);
  }, [token]);

  const login = async (email, password) => {
    try {
      const data = await apiLogin(email, password);
      
      const { access_token, refresh_token, user: userData } = data;
      
      localStorage.setItem('ivy_token', access_token);
      if (refresh_token) {
        localStorage.setItem('ivy_refresh_token', refresh_token);
      }
      localStorage.setItem('ivy_user', JSON.stringify(userData));
      
      setToken(access_token);
      setUser(userData);
      
      axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('ivy_token');
    localStorage.removeItem('ivy_refresh_token');
    localStorage.removeItem('ivy_user');
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, setAuth: (t, u) => { setToken(t); setUser(u); } }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
