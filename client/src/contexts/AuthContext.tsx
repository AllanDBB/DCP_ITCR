"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiService, type User, type UpdateProfileData, type ChangePasswordData } from '@/utils/api';
import Toast from '@/components/Toast';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<any>;
  register: (username: string, email: string, password: string, university?: string) => Promise<any>;
  logout: () => Promise<void>;
  updateProfile: (profileData: UpdateProfileData) => Promise<any>;
  updateProfilePhoto: (photoUrl: string) => Promise<any>;
  changePassword: (passwordData: ChangePasswordData) => Promise<any>;
  deleteAccount: (password: string) => Promise<any>;
  completeTraining: () => Promise<any>;
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

  const register = async (username: string, email: string, password: string, university?: string) => {
    try {
      console.log('Iniciando registro...');
      const registerData: any = { username, email, password };
      
      // Agregar campo opcional si está presente
      if (university) registerData.university = university;
      
      const response = await apiService.register(registerData);
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

  const updateProfile = async (profileData: UpdateProfileData) => {
    try {
      console.log('=== DEBUG Frontend updateProfile ===');
      console.log('Datos enviados desde el frontend:', profileData);
      
      const response = await apiService.updateProfile(profileData);
      
      console.log('Respuesta del servidor:', response);
      console.log('Usuario actualizado recibido:', response.user);
      
      setUser(response.user);
      showToast('Perfil actualizado exitosamente! ✅', 'success');
      return response;
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      throw error;
    }
  };

  const updateProfilePhoto = async (photoUrl: string) => {
    try {
      const response = await apiService.updateProfilePhoto(photoUrl);
      setUser(response.user);
      showToast('Foto de perfil actualizada exitosamente! 📸', 'success');
      return response;
    } catch (error) {
      console.error('Error al actualizar foto de perfil:', error);
      throw error;
    }
  };

  const changePassword = async (passwordData: ChangePasswordData) => {
    try {
      const response = await apiService.changePassword(passwordData);
      showToast('Contraseña cambiada exitosamente! 🔒', 'success');
      return response;
    } catch (error) {
      console.error('Error al cambiar contraseña:', error);
      throw error;
    }
  };

  const deleteAccount = async (password: string) => {
    try {
      const response = await apiService.deleteAccount(password);
      setUser(null);
      showToast('Cuenta eliminada exitosamente. ¡Gracias por usar DCP-ITCR! 👋', 'info');
      return response;
    } catch (error) {
      console.error('Error al eliminar cuenta:', error);
      throw error;
    }
  };

  const completeTraining = async () => {
    try {
      const response = await apiService.completeTraining();
      setUser(response.user);
      showToast('¡Felicitaciones! Has completado la capacitación exitosamente 🎉', 'success');
      return response;
    } catch (error) {
      console.error('Error al completar capacitación:', error);
      throw error;
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
    updateProfile,
    updateProfilePhoto,
    changePassword,
    deleteAccount,
    completeTraining,
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
