import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

// 🚨 THE FIX: A Smart Interceptor that intercepts every outgoing request
// 🚨 THE FIX: A Smart Interceptor that intercepts every outgoing request
axios.interceptors.request.use(
  (config) => {
    // 1. Safety check added: Make sure config.url exists before running .includes()
    if (config.url && (config.url.includes('jikan.moe') || config.url.includes('themoviedb.org'))) {
      delete config.headers['Authorization'];
    } else {
      // 2. If talking to our backend, attach the VIP pass!
      const token = localStorage.getItem('token');
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      setUser(JSON.parse(storedUser));
      // (Removed the old axios.defaults.headers line from here)
    }
    setLoading(false);
  }, []);

  const login = (token, userData) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    // (Removed the old axios.defaults.headers line from here)
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    // (Removed the old axios.defaults.headers line from here)
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};