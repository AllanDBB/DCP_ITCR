"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiService } from '@/utils/api';
import Toast from '@/components/Toast';

interface User {
  id: string;
  username: string;
  email: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<any>;
  register: (username: string, email: string, password: string) => Promise<any>;
  logout: () => Promise<void>;
  showToast: (message: string, type: 'success' | 'error' | 'info') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type: 'success' | 'error' | 'info';
  }>({
    show: false,
    message: '',
    type: 'info'
  });

  const isAuthenticated = !!user && apiService.isAuthenticated();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        if (apiService.isAuthenticated()) {
          const isValid = await apiService.verifyToken();
          if (isValid) {
            const userData = await apiService.getProfile();
            setUser(userData.user);
          } else {
            apiService.removeToken();
          }
        }
      } catch (error) {
        console.error('Error al inicializar autenticación:', error);
        apiService.removeToken();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);  const login = async (email: string, password: string) => {
    try {
      console.log('Iniciando login...');
      const response = await apiService.login({ email, password });
      console.log('Login response:', response);
      setUser(response.user);
      console.log('Usuario establecido:', response.user);
      showToast(`¡Bienvenido/a de vuelta, ${response.user.username}! 🎉`, 'success');
      return response;
    } catch (error) {
      console.error('Error en login del contexto:', error);
      throw error;
    }
  };

  const register = async (username: string, email: string, password: string) => {
    try {
      console.log('Iniciando registro...');
      const response = await apiService.register({ username, email, password });
      console.log('Register response:', response);
      setUser(response.user);
      console.log('Usuario establecido:', response.user);
      showToast(`¡Cuenta creada exitosamente! Bienvenido/a, ${response.user.username}! 🎉`, 'success');
      return response;
    } catch (error) {
      console.error('Error en registro del contexto:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await apiService.logout();
      setUser(null);
      showToast('Sesión cerrada exitosamente. ¡Hasta luego! 👋', 'info');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      // Aún así limpiamos el estado local
      setUser(null);
      apiService.removeToken();
    }
  };

  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    setToast({
      show: true,
      message,
      type
    });
  };

  const handleCloseToast = () => {
    setToast(prev => ({ ...prev, show: false }));
  };
  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    showToast,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
      <Toast
        message={toast.message}
        type={toast.type}
        show={toast.show}
        onClose={handleCloseToast}
        duration={4000}
      />
    </AuthContext.Provider>
  );
};
