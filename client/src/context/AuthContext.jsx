import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { jwtDecode } from 'jwt-decode';
import { authService } from '../services/auth';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    user: null,
    token: null,
    refreshToken: null,
    loading: true,
    error: null
  });

  const loadAuthState = () => {
    try {
      const savedData = localStorage.getItem('authData');
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        if (isTokenValid(parsedData.token)) {
          setAuthState({
            user: parsedData.user,
            token: parsedData.token,
            refreshToken: parsedData.refreshToken,
            loading: false,
            error: null
          });
          api.defaults.headers.common['Authorization'] = `Bearer ${parsedData.token}`;
        } else {
          refreshToken();
        }
      } else {
        setAuthState(prev => ({ ...prev, loading: false }));
      }
    } catch (error) {
      console.error('Auth yükleme hatası:', error);
      setAuthState(prev => ({ ...prev, loading: false }));
    }
  };

  const isTokenValid = (token) => {
    if (!token) return false;
    try {
      const decoded = jwtDecode(token);
      return decoded.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  };

  const refreshToken = async () => {
    try {
      if (!authState.refreshToken) {
        throw new Error('Yenileme token\'ı bulunamadı');
      }

      const response = await authService.refreshToken(authState.refreshToken);
      if (response.data) {
        const { token, user, refreshToken: newRefreshToken } = response.data;
        
        setAuthState({
          user,
          token,
          refreshToken: newRefreshToken,
          loading: false,
          error: null
        });

        localStorage.setItem('authData', JSON.stringify({
          user,
          token,
          refreshToken: newRefreshToken
        }));

        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      } else {
        throw new Error('Token yenileme başarısız');
      }
    } catch (error) {
      console.error('Token yenileme hatası:', error);
      logout();
    }
  };

  const login = async (credentials) => {
    try {
      const response = await authService.login(credentials);
      const { token, user, refreshToken } = response.data;

      const authData = {
        user,
        token,
        refreshToken
      };

      setAuthState({
        ...authData,
        loading: false,
        error: null
      });

      localStorage.setItem('authData', JSON.stringify(authData));
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      return authData;
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        error: error.response?.data?.message || 'Giriş başarısız'
      }));
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Çıkış hatası:', error);
    } finally {
      localStorage.removeItem('authData');
      delete api.defaults.headers.common['Authorization'];
      setAuthState({
        user: null,
        token: null,
        refreshToken: null,
        loading: false,
        error: null
      });
    }
  };

  const value = useMemo(() => ({
    user: authState.user,
    token: authState.token,
    loading: authState.loading,
    error: authState.error,
    login,
    logout,
    isAdmin: () => authState.user?.role === 'admin',
    hasPermission: (permission) => authState.user?.permissions?.includes(permission),
    isAuthenticated: !!authState.token && isTokenValid(authState.token)
  }), [authState]);

  useEffect(() => {
    loadAuthState();
  }, []);

  if (authState.loading) {
    return <div>Yükleniyor...</div>;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
