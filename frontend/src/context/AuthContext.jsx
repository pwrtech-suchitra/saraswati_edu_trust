import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api/authApi';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Hydrate authentication state on initial load
    const savedToken = localStorage.getItem('sect_token');
    const savedUser = localStorage.getItem('sect_user');

    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem('sect_token');
        localStorage.removeItem('sect_user');
      }
    }
    setLoading(false);

    // Listen for automatic token expiry
    const handleAuthExpired = () => {
      setToken(null);
      setUser(null);
    };

    window.addEventListener('sect_auth_expired', handleAuthExpired);
    return () => window.removeEventListener('sect_auth_expired', handleAuthExpired);
  }, []);

  const login = async (credentials) => {
    const res = await authApi.login(credentials);
    if (res.success && res.data) {
      const { token: receivedToken, user: receivedUser } = res.data;
      setToken(receivedToken);
      setUser(receivedUser);
      localStorage.setItem('sect_token', receivedToken);
      localStorage.setItem('sect_user', JSON.stringify(receivedUser));
    }
    return res;
  };

  const register = async (data) => {
    return await authApi.register(data);
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } finally {
      setToken(null);
      setUser(null);
      localStorage.removeItem('sect_token');
      localStorage.removeItem('sect_user');
    }
  };

  const isAuthenticated = Boolean(token && user);
  const isAdmin = Boolean(user && (user.role === 'ADMIN' || user.role === 'SUPERADMIN'));

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        isAdmin,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
