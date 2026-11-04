import React, { useState, useEffect } from 'react';
import { authApi } from '../api/authApi';
import { AuthContext } from './AuthContextValue';

function readStoredAuth() {
  const savedToken = localStorage.getItem('sect_token');
  const savedUser = localStorage.getItem('sect_user');

  if (!savedToken || !savedUser) {
    return { token: null, user: null };
  }

  try {
    return { token: savedToken, user: JSON.parse(savedUser) };
  } catch {
    localStorage.removeItem('sect_token');
    localStorage.removeItem('sect_user');
    return { token: null, user: null };
  }
}

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(readStoredAuth);
  const { user, token } = auth;
  const loading = false;

  useEffect(() => {
    const handleAuthExpired = () => {
      setAuth({ token: null, user: null });
    };

    window.addEventListener('sect_auth_expired', handleAuthExpired);
    return () => window.removeEventListener('sect_auth_expired', handleAuthExpired);
  }, []);

  const login = async (credentials) => {
    const res = await authApi.login(credentials);
    if (res.success && res.data) {
      const { token: receivedToken, user: receivedUser } = res.data;
      setAuth({ token: receivedToken, user: receivedUser });
      localStorage.setItem('sect_token', receivedToken);
      localStorage.setItem('sect_user', JSON.stringify(receivedUser));
    }
    return res;
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } finally {
      setAuth({ token: null, user: null });
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
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
