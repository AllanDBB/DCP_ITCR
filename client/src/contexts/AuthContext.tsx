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
        const token = apiService.getToken();
        console.log('🔄 Inicializando autenticación...');
        console.log('🔍 Token en localStorage:', token ? token : 'NO EXISTE');
        
        if (apiService.isAuthenticated()) {
          console.log('✅ Token encontrado, verificando validez...');
          try {
            const isValid = await apiService.verifyToken();
            console.log('🔍 Token válido:', isValid);
            
            if (isValid) {
              console.log('📝 Obteniendo perfil del usuario...');
              const userData = await apiService.getProfile();
              console.log('👤 Usuario obtenido:', userData.user);
              setUser(userData.user);
              console.log('✅ Usuario establecido en context:', userData.user);
              console.log('🔑 Token actual:', token);
            } else {
              console.log('❌ Token no válido, eliminando...');
              apiService.removeToken();
              setUser(null);
            }
          } catch (profileError) {
            console.error('❌ Error al obtener perfil:', profileError);
            // No eliminar el token inmediatamente, solo si es un error de autenticación
            if ((profileError as any)?.message?.includes('401') || (profileError as any)?.message?.includes('Token')) {
              console.log('🔐 Error de autenticación, eliminando token');
              apiService.removeToken();
              setUser(null);
            } else {
              console.log('🔄 Error temporal, manteniendo token para próximo intento');
              // Intentar una vez más en caso de error de red
              setTimeout(() => {
                initializeAuth();
              }, 2000);
              return;
            }
          }
        } else {
          console.log('❌ No hay token, usuario no autenticado');
          setUser(null);
        }
        // Log extra para depuración
        console.log('🧑‍💼 Estado final usuario:', user);
        console.log('🔑 Estado final token:', token);
      } catch (error) {
        console.error('❌ Error al inicializar autenticación:', error);
        // Solo eliminar token si es claramente un error de autenticación
        if ((error as any)?.message?.includes('401') || (error as any)?.message?.includes('Token')) {
          apiService.removeToken();
          setUser(null);
        }
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
