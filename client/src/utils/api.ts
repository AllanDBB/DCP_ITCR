const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://5c33eb170423.ngrok-free.app/api';

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
  university?: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface User {
  id: string;
  username: string;
  email: string;
  role?: string;
  university?: string;
  phone?: string;
  website?: string;
  location?: string;
  hasCompletedTraining?: boolean;
  trainingCompletedAt?: string;
  createdAt: string;
  updatedAt?: string;
}

interface AuthResponse {
  token: string;
  user: User;
}

interface UpdateProfileData {
  university?: string;
  phone?: string;
  website?: string;
  location?: string;
}

interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

interface Dataset {
  id: string;
  name: string;
  description: string;
  category: string;
  difficulty: string;
  length: number;
  expectedChangePoints: number;
  tags: string[];
  data: [number, number][];
  createdAt: string;
}

interface Label {
  id: string;
  datasetId: string;
  changePoints: Array<{
    position: number;
    type: 'mean' | 'trend' | 'variance' | 'level';
    confidence: number;
    notes?: string;
  }>;
  noChangePoints: boolean;
  confidence: number;
  timeSpent: number;
  status: string;
  createdAt: string;
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
    console.log('=== DEBUG: API Request ===');
    console.log('Endpoint:', endpoint);
    console.log('Full URL:', url);
    console.log('Token exists:', !!token);
    console.log('Token value:', token ? token.substring(0, 20) + '...' : 'NO TOKEN');
    
    if (token) {
      config.headers = {
        ...config.headers,
        'Authorization': `Bearer ${token}`,
      };
      console.log('Authorization header set:', `Bearer ${token.substring(0, 20)}...`);
    }

    try {
      console.log('Making request to:', url);
      const response = await fetch(url, config);
      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));
      
      const data = await response.json();
      console.log('Response data:', data);

      if (!response.ok) {
        console.error('HTTP Error:', response.status, response.statusText);
        console.error('Error data:', data);
        
        // Crear error específico según el código HTTP
        const errorMessage = data.message || `Error ${response.status}: ${response.statusText}`;
        const error = new Error(errorMessage);
        (error as any).status = response.status;
        (error as any).statusText = response.statusText;
        (error as any).data = data;
        
        throw error;
      }

      return data;
    } catch (error) {
      console.error('=== DEBUG: API Request Error ===');
      console.error('Error type:', error?.constructor?.name);
      console.error('Error message:', (error as Error).message);
      console.error('Full error:', error);
      
      // Si es un error de red (no hay respuesta del servidor)
      if (error instanceof TypeError && error.message.includes('fetch')) {
        const networkError = new Error('Error de conexión: No se puede conectar al servidor');
        (networkError as any).isNetworkError = true;
        throw networkError;
      }
      
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

  async updateProfile(profileData: UpdateProfileData): Promise<any> {
    console.log('=== DEBUG API updateProfile ===');
    console.log('Datos a enviar al servidor:', profileData);
    console.log('JSON stringify:', JSON.stringify(profileData));
    
    const response = await this.request('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
    
    console.log('Respuesta cruda del servidor:', response);
    
    if (response.success && response.user) {
      console.log('✅ Actualización exitosa en API');
      return response;
    }
    
    console.log('❌ Error en actualización:', response.message);
    throw new Error(response.message || 'Error al actualizar el perfil');
  }

  async changePassword(passwordData: ChangePasswordData): Promise<any> {
    const response = await this.request('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify(passwordData),
    });
    
    if (response.success) {
      return response;
    }
    
    throw new Error(response.message || 'Error al cambiar la contraseña');
  }

  async deleteAccount(password: string): Promise<any> {
    const response = await this.request('/auth/account', {
      method: 'DELETE',
      body: JSON.stringify({ password }),
    });
    
    if (response.success) {
      this.removeToken();
      return response;
    }
    
    throw new Error(response.message || 'Error al eliminar la cuenta');
  }

  async completeTraining(): Promise<any> {
    const response = await this.request('/auth/complete-training', {
      method: 'POST',
    });
    
    if (response.success && response.user) {
      return response;
    }
    
    throw new Error(response.message || 'Error al marcar capacitación como completada');
  }

  // Métodos para datasets
  async getAvailableDatasets(params?: {
    difficulty?: string;
    category?: string;
    page?: number;
    limit?: number;
  }): Promise<any> {
    const queryParams = new URLSearchParams();
    if (params?.difficulty) queryParams.append('difficulty', params.difficulty);
    if (params?.category) queryParams.append('category', params.category);
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());

    const response = await this.request(`/datasets/available?${queryParams}`);
    
    if (response.success) {
      return response;
    }
    
    throw new Error(response.message || 'Error al obtener datasets');
  }

  async getDatasetById(id: string): Promise<any> {
    const response = await this.request(`/datasets/${id}`);
    
    if (response.success) {
      return response;
    }
    
    throw new Error(response.message || 'Error al obtener dataset');
  }

  // Métodos para etiquetas
  async createLabel(labelData: {
    datasetId: string;
    sessionId?: string;
    changePoints: Array<{
      position: number;
      type: 'mean' | 'trend' | 'variance' | 'level';
      confidence?: number;
      notes?: string;
    }>;
    noChangePoints?: boolean;
    confidence?: number;
    timeSpent?: number;
    currentDatasetIndex?: number;
  }): Promise<any> {
    const response = await this.request('/labels', {
      method: 'POST',
      body: JSON.stringify(labelData),
    });
    
    if (response.success) {
      return response;
    }
    
    throw new Error(response.message || 'Error al crear etiqueta');
  }

  async getUserLabels(params?: {
    page?: number;
    limit?: number;
    status?: string;
    datasetId?: string;
  }): Promise<any> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.status) queryParams.append('status', params.status);
    if (params?.datasetId) queryParams.append('datasetId', params.datasetId);

    const response = await this.request(`/labels?${queryParams}`);
    
    if (response.success) {
      return response;
    }
    
    throw new Error(response.message || 'Error al obtener etiquetas');
  }

  async updateLabel(labelId: string, labelData: {
    changePoints?: Array<{
      position: number;
      type: 'mean' | 'trend' | 'variance' | 'level';
      confidence?: number;
      notes?: string;
    }>;
    noChangePoints?: boolean;
    confidence?: number;
    timeSpent?: number;
    status?: string;
  }): Promise<any> {
    const response = await this.request(`/labels/${labelId}`, {
      method: 'PUT',
      body: JSON.stringify(labelData),
    });
    
    if (response.success) {
      return response;
    }
    
    throw new Error(response.message || 'Error al actualizar etiqueta');
  }

  async getLabelStats(userId?: string): Promise<any> {
    const queryParams = userId ? `?userId=${userId}` : '';
    const response = await this.request(`/labels/stats${queryParams}`);
    
    if (response.success) {
      return response;
    }
    
    throw new Error(response.message || 'Error al obtener estadísticas');
  }

  // Métodos de administración
  async uploadDatasetFromCSV(formData: FormData): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/admin/upload-csv`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.getToken()}`,
      },
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error al subir dataset');
    }

    return data;
  }

  async uploadMultipleDatasetsFromCSV(formData: FormData): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/admin/upload-csv-multiple`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.getToken()}`,
      },
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error al subir datasets múltiples');
    }

    return data;
  }

  async getAllDatasets(params?: {
    page?: number;
    limit?: number;
    status?: string;
    difficulty?: string;
    category?: string;
  }): Promise<any> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.status) queryParams.append('status', params.status);
    if (params?.difficulty) queryParams.append('difficulty', params.difficulty);
    if (params?.category) queryParams.append('category', params.category);

    const response = await this.request(`/admin/datasets?${queryParams}`);
    
    if (response.success) {
      return response;
    }
    
    throw new Error(response.message || 'Error al obtener datasets');
  }

  async updateDatasetStatus(id: string, updateData: {
    status?: string;
    difficulty?: string;
    expectedChangePoints?: number;
  }): Promise<any> {
    const response = await this.request(`/admin/datasets/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
    
    if (response.success) {
      return response;
    }
    
    throw new Error(response.message || 'Error al actualizar dataset');
  }

  async deleteDataset(id: string): Promise<any> {
    const response = await this.request(`/admin/datasets/${id}`, {
      method: 'DELETE',
    });
    
    if (response.success) {
      return response;
    }
    
    throw new Error(response.message || 'Error al eliminar dataset');
  }

  async getAdminStats(): Promise<any> {
    const response = await this.request('/admin/stats');
    
    if (response.success) {
      return response;
    }
    
    throw new Error(response.message || 'Error al obtener estadísticas');
  }

  // Métodos de gestión de usuarios (admin)
  async getAllUsers(params?: {
    page?: number;
    limit?: number;
    role?: string;
  }): Promise<any> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.role) queryParams.append('role', params.role);

    const response = await this.request(`/admin/users?${queryParams}`);
    
    if (response.success) {
      return response;
    }
    
    throw new Error(response.message || 'Error al obtener usuarios');
  }

  async getUserStats(): Promise<any> {
    const response = await this.request('/admin/users/stats');
    
    if (response.success) {
      return response;
    }
    
    throw new Error(response.message || 'Error al obtener estadísticas de usuarios');
  }

  async assignDatasetToUser(userId: string, datasetId: string): Promise<any> {
    const response = await this.request('/admin/users/assign', {
      method: 'POST',
      body: JSON.stringify({ userId, datasetId }),
    });
    
    if (response.success) {
      return response;
    }
    
    throw new Error(response.message || 'Error al asignar dataset');
  }

  async removeDatasetAssignment(userId: string, datasetId: string): Promise<any> {
    const response = await this.request(`/admin/users/${userId}/assignments/${datasetId}`, {
      method: 'DELETE',
    });
    
    if (response.success) {
      return response;
    }
    
    throw new Error(response.message || 'Error al remover asignación');
  }

  async updateUserRole(userId: string, role: string): Promise<any> {
    const response = await this.request(`/admin/users/${userId}/role`, {
      method: 'PUT',
      body: JSON.stringify({ role }),
    });
    
    if (response.success) {
      return response;
    }
    
    throw new Error(response.message || 'Error al actualizar rol');
  }

  // Método para obtener todas las evaluaciones (admin)
  async getAllLabels(params?: {
    limit?: number;
    page?: number;
    userId?: string;
    datasetId?: string;
    status?: string;
  }): Promise<any> {
    const queryParams = params ? Object.entries(params)
      .filter(([_, value]) => value !== undefined && value !== null && value !== '')
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join('&') : '';
    
    const response = await this.request(`/admin/labels?${queryParams}`);
    
    if (response.success) {
      return response;
    }
    
    throw new Error(response.message || 'Error al obtener evaluaciones');
  }

  // Método para descargar evaluaciones en CSV (admin)
  async downloadLabelsCSV(params?: {
    userId?: string;
    datasetId?: string;
    status?: string;
  }): Promise<Blob> {
    const queryParams = params ? Object.entries(params)
      .filter(([_, value]) => value !== undefined && value !== null && value !== '')
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join('&') : '';
    
    const token = this.getToken();
    
    const response = await fetch(`${API_BASE_URL}/admin/labels/download-csv?${queryParams}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Error al descargar CSV' }));
      throw new Error(errorData.message || 'Error al descargar evaluaciones en CSV');
    }
    
    return response.blob();
  }

  // Método para descargar serie etiquetada individual en CSV (admin)
  async downloadLabeledSeriesCSV(labelId: string): Promise<Blob> {
    const token = this.getToken();
    
    const response = await fetch(`${API_BASE_URL}/admin/labels/${labelId}/download-series-csv`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Error al descargar serie etiquetada' }));
      throw new Error(errorData.message || 'Error al descargar serie etiquetada en CSV');
    }
    
    return response.blob();
  }

  // Métodos para usuarios - datasets asignados
  async getMyAssignedDatasets(status?: string): Promise<any> {
    const queryParams = status ? `?status=${status}` : '';
    console.log('=== DEBUG: getMyAssignedDatasets ===');
    console.log('Endpoint:', `/datasets/my/assigned${queryParams}`);
    console.log('Status filter:', status);
    
    try {
      const response = await this.request(`/datasets/my/assigned${queryParams}`);
      console.log('=== DEBUG: Raw response ===', response);
      
      if (response.success) {
        return response;
      }
      
      throw new Error(response.message || 'Error al obtener datasets asignados');
    } catch (error: any) {
      console.error('=== DEBUG: Error en getMyAssignedDatasets ===', error);
      
      // Si es un error de red o parsing
      if (error.name === 'TypeError' || error.name === 'SyntaxError') {
        throw new Error('Error de conexión con el servidor. Verifica tu conexión a internet.');
      }
      
      // Si es un error HTTP específico
      if (error.message.includes('401')) {
        throw new Error('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
      }
      
      if (error.message.includes('403')) {
        throw new Error('No tienes permisos para acceder a tus datasets asignados.');
      }
      
      if (error.message.includes('404')) {
        throw new Error('El servicio de datasets asignados no está disponible.');
      }
      
      if (error.message.includes('500')) {
        throw new Error('Error interno del servidor. Contacta al administrador.');
      }
      
      throw error;
    }
  }

  async updateAssignedDatasetStatus(datasetId: string, status: string): Promise<any> {
    const response = await this.request(`/datasets/my/assigned/${datasetId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
    
    if (response.success) {
      return response;
    }
    
    throw new Error(response.message || 'Error al actualizar status del dataset');
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
    console.log('=== DEBUG: setToken ===');
    console.log('Token to save:', token ? token.substring(0, 20) + '...' : 'NO TOKEN');
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
      console.log('Token saved to localStorage');
    } else {
      console.log('Window not available, cannot save token');
    }
  }

  getToken(): string | null {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token');
      console.log('=== DEBUG: getToken ===');
      console.log('Token retrieved:', token ? token.substring(0, 20) + '...' : 'NO TOKEN');
      return token;
    }
    console.log('=== DEBUG: getToken ===');
    console.log('Window not available, returning null');
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
export type { RegisterData, LoginData, AuthResponse, User, UpdateProfileData, ChangePasswordData, Dataset, Label };
