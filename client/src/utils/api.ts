const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  token?: string;
  user?: {
    id: string;
    username: string;
    email: string;
    createdAt: string;
  };
  data?: T;
  errors?: any[];
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface AuthResponse {
  token: string;
  user: {
    id: string;
    username: string;
    email: string;
    createdAt: string;
  };
}

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include',
      ...options,
    };

    // Agregar token de autorización si existe
    const token = this.getToken();
    if (token) {
      config.headers = {
        ...config.headers,
        'Authorization': `Bearer ${token}`,
      };
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error en la solicitud');
      }

      return data;
    } catch (error) {
      console.error('Error en API:', error);
      throw error;
    }
  }
  // Métodos de autenticación
  async register(userData: RegisterData): Promise<AuthResponse> {
    const response = await this.request<any>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    
    if (response.success && response.token && response.user) {
      this.setToken(response.token);
      return {
        token: response.token,
        user: response.user
      };
    }
    
    throw new Error(response.message || 'Error en el registro');
  }

  async login(credentials: LoginData): Promise<AuthResponse> {
    const response = await this.request<any>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    if (response.success && response.token && response.user) {
      this.setToken(response.token);
      return {
        token: response.token,
        user: response.user
      };
    }
    
    throw new Error(response.message || 'Error en el inicio de sesión');
  }

  async logout(): Promise<void> {
    try {
      await this.request('/auth/logout', {
        method: 'POST',
      });
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    } finally {
      this.removeToken();
    }
  }
  async getProfile(): Promise<any> {
    const response = await this.request('/auth/profile');
    
    if (response.success && response.user) {
      return response;
    }
    
    throw new Error(response.message || 'Error al obtener el perfil');
  }

  async verifyToken(): Promise<boolean> {
    try {
      const response = await this.request('/auth/verify');
      return response.success;
    } catch (error) {
      this.removeToken();
      return false;
    }
  }

  // Métodos para manejo de tokens
  setToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
    }
  }

  getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_token');
    }
    return null;
  }

  removeToken(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

export const apiService = new ApiService();
export type { RegisterData, LoginData, AuthResponse };
