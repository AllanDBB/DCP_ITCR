'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { apiService } from '@/utils/api';
import { useRouter } from 'next/navigation';

interface Dataset {
  _id: string;
  name: string;
  description: string;
  category: string;
  difficulty: string;
  length: number;
  status: string;
  expectedChangePoints: number;
  createdAt: string;
}

interface User {
  _id: string;
  username: string;
  email: string;
  role: string;
  assignedDatasets: Array<{
    dataset: Dataset;
    assignedAt: string;
    status: string;
    completedAt?: string;
    evaluationCount: number;
  }>;
  createdAt: string;
}

interface AdminStats {
  total: number;
  byStatus: { active: number; inactive: number; completed: number };
  byDifficulty: { easy: number; medium: number; hard: number };
  byCategory: Record<string, number>;
  averageLength: number;
  averageExpectedCP: number;
}

interface UserStats {
  totalUsers: number;
  usersByRole: { admin: number; user: number };
  assignments: {
    usersWithAssignments: number;
    totalAssignments: number;
    byStatus: { pending: number; in_progress: number; completed: number };
  };
}

export default function AdminPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'upload' | 'datasets' | 'users' | 'stats'>('upload');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  // Estados para carga de CSV
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [datasetInfo, setDatasetInfo] = useState({
    name: '',
    description: '',
    source: '',
    category: 'general',
    difficulty: 'medium',
    expectedChangePoints: 0,
    tags: ''
  });
  
  // Estados para gestión de datasets
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    status: '',
    difficulty: '',
    category: ''
  });
  
  // Estados para gestión de usuarios
  const [users, setUsers] = useState<User[]>([]);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [userPage, setUserPage] = useState(1);
  const [userTotalPages, setUserTotalPages] = useState(1);
  const [userFilters, setUserFilters] = useState({
    role: ''
  });
  
  // Estados para asignaciones
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [selectedDataset, setSelectedDataset] = useState<string>('');

  // Cargar datos cuando se cambie de tab o filtros
  useEffect(() => {
    if (isAuthenticated && user && user.role === 'admin') {
      if (activeTab === 'datasets') {
        loadDatasets();
      } else if (activeTab === 'users') {
        loadUsers();
      } else if (activeTab === 'stats') {
        loadStats();
        loadUserStats();
      }
    }
  }, [isAuthenticated, user, activeTab, currentPage, filters, userPage, userFilters]);

  const loadDatasets = async () => {
    try {
      setLoading(true);
      const response = await apiService.getAllDatasets({
        page: currentPage,
        limit: 10,
        ...filters
      });
      setDatasets(response.data.datasets);
      setTotalPages(response.data.pagination.pages);
    } catch (error) {
      console.error('Error al cargar datasets:', error);
      setMessage({ type: 'error', text: 'Error al cargar datasets' });
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await apiService.getAllUsers({
        page: userPage,
        limit: 10,
        ...userFilters
      });
      setUsers(response.data.users);
      setUserTotalPages(response.data.pagination.pages);
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
      setMessage({ type: 'error', text: 'Error al cargar usuarios' });
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await apiService.getAdminStats();
      setStats(response.data);
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
    }
  };

  const loadUserStats = async () => {
    try {
      const response = await apiService.getUserStats();
      setUserStats(response.data);
    } catch (error) {
      console.error('Error al cargar estadísticas de usuarios:', error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'text/csv') {
      setCsvFile(file);
      setMessage(null);
    } else {
      setMessage({ type: 'error', text: 'Por favor selecciona un archivo CSV válido' });
    }
  };

  const handleUpload = async () => {
    if (!csvFile) {
      setMessage({ type: 'error', text: 'Por favor selecciona un archivo CSV' });
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('csvFile', csvFile);
      formData.append('name', datasetInfo.name);
      formData.append('description', datasetInfo.description);
      formData.append('source', datasetInfo.source);
      formData.append('category', datasetInfo.category);
      formData.append('difficulty', datasetInfo.difficulty);
      formData.append('expectedChangePoints', datasetInfo.expectedChangePoints.toString());
      formData.append('tags', datasetInfo.tags);

      const response = await apiService.uploadDatasetFromCSV(formData);
      
      setMessage({ type: 'success', text: `Dataset "${response.data.name}" cargado exitosamente con ${response.data.points} puntos` });
      
      // Limpiar formulario
      setCsvFile(null);
      setDatasetInfo({
        name: '',
        description: '',
        source: '',
        category: 'general',
        difficulty: 'medium',
        expectedChangePoints: 0,
        tags: ''
      });
      
      // Recargar datos
      loadDatasets();
      loadStats();
      
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Error al subir dataset' });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (datasetId: string, status: string) => {
    try {
      await apiService.updateDatasetStatus(datasetId, { status });
      setMessage({ type: 'success', text: 'Estado actualizado exitosamente' });
      loadDatasets();
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Error al actualizar estado' });
    }
  };

  const handleDeleteDataset = async (datasetId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este dataset? Esta acción no se puede deshacer.')) {
      return;
    }

    try {
      await apiService.deleteDataset(datasetId);
      setMessage({ type: 'success', text: 'Dataset eliminado exitosamente' });
      loadDatasets();
      loadStats();
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Error al eliminar dataset' });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-black';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-black';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-black';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-black">Panel de Administración</h1>
          <p className="text-black mt-2">Gestiona datasets y configuración del sistema</p>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('upload')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'upload'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-black hover:text-black hover:border-gray-300'
                }`}
              >
                📤 Cargar Dataset
              </button>
              <button
                onClick={() => setActiveTab('datasets')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'datasets'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-black hover:text-black hover:border-gray-300'
                }`}
              >
                📊 Gestionar Datasets
              </button>
              <button
                onClick={() => setActiveTab('stats')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'stats'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-black hover:text-black hover:border-gray-300'
                }`}
              >
                📈 Estadísticas
              </button>
            </nav>
          </div>
        </div>

        {/* Mensajes */}
        {message && (
          <div className={`mb-6 p-4 rounded-md ${
            message.type === 'success' 
              ? 'bg-green-50 border border-green-200 text-green-800' 
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}>
            {message.text}
          </div>
        )}

        {/* Tab Content */}
        {activeTab === 'upload' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4 text-black">Cargar Dataset desde CSV</h2>
            <p className="text-black mb-6">
              Sube un archivo CSV con datos de series temporales. El archivo debe contener columnas 'x' e 'y' o 'index' y 'value'.
            </p>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Archivo CSV
                </label>
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-black file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                {csvFile && (
                  <p className="text-sm text-black mt-1">
                    Archivo seleccionado: {csvFile.name} ({(csvFile.size / 1024).toFixed(1)} KB)
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Nombre del Dataset
                  </label>
                  <input
                    type="text"
                    value={datasetInfo.name}
                    onChange={(e) => setDatasetInfo({ ...datasetInfo, name: e.target.value })}
                    placeholder="Ej: Temperatura mensual 2023"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Categoría
                  </label>
                  <select
                    value={datasetInfo.category}
                    onChange={(e) => setDatasetInfo({ ...datasetInfo, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="general">General</option>
                    <option value="clima">Clima</option>
                    <option value="finanzas">Finanzas</option>
                    <option value="salud">Salud</option>
                    <option value="tecnologia">Tecnología</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Descripción
                </label>
                <textarea
                  value={datasetInfo.description}
                  onChange={(e) => setDatasetInfo({ ...datasetInfo, description: e.target.value })}
                  placeholder="Describe el dataset y su contexto..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Fuente
                  </label>
                  <input
                    type="text"
                    value={datasetInfo.source}
                    onChange={(e) => setDatasetInfo({ ...datasetInfo, source: e.target.value })}
                    placeholder="Ej: NOAA, Yahoo Finance"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Dificultad
                  </label>
                  <select
                    value={datasetInfo.difficulty}
                    onChange={(e) => setDatasetInfo({ ...datasetInfo, difficulty: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="easy">Fácil</option>
                    <option value="medium">Medio</option>
                    <option value="hard">Difícil</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Change Points Esperados
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={datasetInfo.expectedChangePoints}
                    onChange={(e) => setDatasetInfo({ ...datasetInfo, expectedChangePoints: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Etiquetas (separadas por comas)
                </label>
                <input
                  type="text"
                  value={datasetInfo.tags}
                  onChange={(e) => setDatasetInfo({ ...datasetInfo, tags: e.target.value })}
                  placeholder="Ej: temperatura, mensual, 2023"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button 
                onClick={handleUpload} 
                disabled={!csvFile || loading}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? 'Subiendo...' : '📤 Subir Dataset'}
              </button>
            </div>
          </div>
        )}

        {activeTab === 'datasets' && (
          <div className="space-y-6">
            {/* Filtros */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4 text-black">Filtros</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-black mb-2">Estado</label>
                  <select
                    value={filters.status}
                    onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Todos los estados</option>
                    <option value="active">Activo</option>
                    <option value="inactive">Inactivo</option>
                    <option value="completed">Completado</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-2">Dificultad</label>
                  <select
                    value={filters.difficulty}
                    onChange={(e) => setFilters({ ...filters, difficulty: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Todas las dificultades</option>
                    <option value="easy">Fácil</option>
                    <option value="medium">Medio</option>
                    <option value="hard">Difícil</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-2">Categoría</label>
                  <select
                    value={filters.category}
                    onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Todas las categorías</option>
                    <option value="general">General</option>
                    <option value="clima">Clima</option>
                    <option value="finanzas">Finanzas</option>
                    <option value="salud">Salud</option>
                    <option value="tecnologia">Tecnología</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Lista de datasets */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-black">Datasets ({datasets.length})</h3>
              </div>
              <div className="p-6">
                {loading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : datasets.length === 0 ? (
                  <div className="text-center py-8 text-black">
                    No se encontraron datasets
                  </div>
                ) : (
                  <div className="space-y-4">
                    {datasets.map((dataset) => (
                      <div key={dataset._id} className="border rounded-lg p-4 hover:bg-gray-50">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg text-black">{dataset.name}</h3>
                            <p className="text-black text-sm mt-1">{dataset.description}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(dataset.status)}`}>
                                {dataset.status === 'active' ? 'Activo' : 
                                 dataset.status === 'inactive' ? 'Inactivo' : 'Completado'}
                              </span>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(dataset.difficulty)}`}>
                                {dataset.difficulty === 'easy' ? 'Fácil' :
                                 dataset.difficulty === 'medium' ? 'Medio' : 'Difícil'}
                              </span>
                              <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-black">
                                {dataset.category}
                              </span>
                              <span className="text-sm text-black">
                                {dataset.length} puntos • {dataset.expectedChangePoints} CP esperados
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleUpdateStatus(dataset._id, 
                                dataset.status === 'active' ? 'inactive' : 'active')}
                              className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50"
                            >
                              ✏️ Editar
                            </button>
                            {user?.role === 'superadmin' && (
                              <button
                                onClick={() => handleDeleteDataset(dataset._id)}
                                className="px-3 py-1 text-sm border border-red-300 text-red-600 rounded hover:bg-red-50"
                              >
                                🗑️ Eliminar
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Paginación */}
                {totalPages > 1 && (
                  <div className="flex justify-center mt-6">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setCurrentPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
                      >
                        Anterior
                      </button>
                      <span className="text-sm text-black">
                        Página {currentPage} de {totalPages}
                      </span>
                      <button
                        onClick={() => setCurrentPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
                      >
                        Siguiente
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'stats' && stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-black">Total Datasets</h3>
                <span className="text-2xl font-bold">{stats.total}</span>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-black">Promedio de Puntos</h3>
                <span className="text-2xl font-bold">{stats.averageLength}</span>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-black">CP Promedio Esperados</h3>
                <span className="text-2xl font-bold">{stats.averageExpectedCP}</span>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-black">Activos</h3>
                <span className="text-2xl font-bold text-green-600">{stats.byStatus.active}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 