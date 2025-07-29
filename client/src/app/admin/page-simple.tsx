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

interface UserStats {
  totalUsers: number;
  usersByRole: { admin: number; user: number };
  assignments: {
    usersWithAssignments: number;
    totalAssignments: number;
    byStatus: { pending: number; in_progress: number; completed: number };
  };
}

export default function AdminPageSimple() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'upload' | 'datasets' | 'users' | 'assignments'>('upload');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  // Estados para datasets
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  
  // Estados para formularios
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [selectedDataset, setSelectedDataset] = useState<string>('');

  // Verificar autenticación y permisos
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/iniciar-sesion');
      return;
    }
    
    if (!user || user.role !== 'admin') {
      router.push('/');
      return;
    }
  }, [isAuthenticated, user, router]);

  // Cargar datos cuando cambie el tab
  useEffect(() => {
    if (isAuthenticated && user && user.role === 'admin') {
      if (activeTab === 'datasets') {
        loadDatasets();
      } else if (activeTab === 'users') {
        loadUsers();
        loadUserStats();
      }
    }
  }, [activeTab]);

  const loadDatasets = async () => {
    try {
      setLoading(true);
      const response = await apiService.getAllDatasets({ limit: 50 });
      setDatasets(response.data.datasets);
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
      const response = await apiService.getAllUsers({ limit: 50 });
      setUsers(response.data.users);
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
      setMessage({ type: 'error', text: 'Error al cargar usuarios' });
    } finally {
      setLoading(false);
    }
  };

  const loadUserStats = async () => {
    try {
      const response = await apiService.getUserStats();
      setUserStats(response.data);
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
    }
  };

  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!csvFile) {
      setMessage({ type: 'error', text: 'Por favor selecciona un archivo CSV' });
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('csvFile', csvFile);
      formData.append('name', csvFile.name.replace('.csv', ''));
      formData.append('description', `Dataset cargado desde ${csvFile.name}`);
      formData.append('category', 'uploaded');
      formData.append('difficulty', 'medium');

      await apiService.uploadDatasetFromCSV(formData);
      setMessage({ type: 'success', text: 'Dataset subido exitosamente' });
      setCsvFile(null);
      if (activeTab === 'datasets') {
        loadDatasets();
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Error al subir dataset' });
    } finally {
      setLoading(false);
    }
  };

  const handleAssignDataset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser || !selectedDataset) {
      setMessage({ type: 'error', text: 'Selecciona usuario y dataset' });
      return;
    }

    try {
      setLoading(true);
      await apiService.assignDatasetToUser(selectedUser, selectedDataset);
      setMessage({ type: 'success', text: 'Dataset asignado exitosamente' });
      setSelectedUser('');
      setSelectedDataset('');
      loadUsers();
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Error al asignar dataset' });
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveAssignment = async (userId: string, datasetId: string) => {
    if (!confirm('¿Seguro que quieres remover esta asignación?')) return;

    try {
      await apiService.removeDatasetAssignment(userId, datasetId);
      setMessage({ type: 'success', text: 'Asignación removida exitosamente' });
      loadUsers();
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Error al remover asignación' });
    }
  };

  if (!isAuthenticated || !user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Acceso Denegado</h1>
          <p className="text-gray-600">No tienes permisos para acceder a esta página.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Panel de Administración</h1>
          <p className="mt-2 text-gray-600">Gestiona datasets, usuarios y asignaciones</p>
        </div>

        {/* Mensajes */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {message.text}
            <button 
              onClick={() => setMessage(null)}
              className="ml-4 text-sm underline"
            >
              Cerrar
            </button>
          </div>
        )}

        {/* Navegación de tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            {['upload', 'datasets', 'users', 'assignments'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab === 'upload' && 'Subir CSV'}
                {tab === 'datasets' && 'Datasets'}
                {tab === 'users' && 'Usuarios'}
                {tab === 'assignments' && 'Asignaciones'}
              </button>
            ))}
          </nav>
        </div>

        {/* Contenido de los tabs */}
        {activeTab === 'upload' && (
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Subir Dataset desde CSV</h2>
            <form onSubmit={handleFileUpload} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Archivo CSV
                </label>
                <input
                  type="file"
                  accept=".csv"
                  onChange={(e) => setCsvFile(e.target.files?.[0] || null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading || !csvFile}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Subiendo...' : 'Subir Dataset'}
              </button>
            </form>
          </div>
        )}

        {activeTab === 'datasets' && (
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Datasets</h2>
              <button
                onClick={loadDatasets}
                className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
              >
                Actualizar
              </button>
            </div>
            
            {loading ? (
              <p>Cargando datasets...</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Categoría</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dificultad</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Puntos</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {datasets.map((dataset) => (
                      <tr key={dataset._id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{dataset.name}</div>
                            <div className="text-sm text-gray-500">{dataset.description}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {dataset.category}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            dataset.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                            dataset.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {dataset.difficulty}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            dataset.status === 'active' ? 'bg-green-100 text-green-800' :
                            dataset.status === 'inactive' ? 'bg-gray-100 text-gray-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {dataset.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {dataset.length}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'users' && (
          <div className="space-y-6">
            {/* Estadísticas de usuarios */}
            {userStats && (
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Estadísticas de Usuarios</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{userStats.totalUsers}</div>
                    <div className="text-sm text-gray-600">Total Usuarios</div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{userStats.assignments.usersWithAssignments}</div>
                    <div className="text-sm text-gray-600">Con Asignaciones</div>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">{userStats.assignments.totalAssignments}</div>
                    <div className="text-sm text-gray-600">Total Asignaciones</div>
                  </div>
                </div>
              </div>
            )}

            {/* Lista de usuarios */}
            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Usuarios</h2>
                <button
                  onClick={loadUsers}
                  className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
                >
                  Actualizar
                </button>
              </div>
              
              {loading ? (
                <p>Cargando usuarios...</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Usuario</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rol</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Asignaciones</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Registro</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users.map((user) => (
                        <tr key={user._id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{user.username}</div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {user.assignedDatasets.length}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'assignments' && (
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-6">Gestión de Asignaciones</h2>
            
            {/* Formulario para asignar dataset */}
            <div className="mb-8 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-medium mb-4">Asignar Dataset a Usuario</h3>
              <form onSubmit={handleAssignDataset} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Usuario</label>
                  <select
                    value={selectedUser}
                    onChange={(e) => setSelectedUser(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  >
                    <option value="">Seleccionar usuario</option>
                    {users.filter(u => u.role === 'user').map(user => (
                      <option key={user._id} value={user._id}>
                        {user.username} ({user.email})
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Dataset</label>
                  <select
                    value={selectedDataset}
                    onChange={(e) => setSelectedDataset(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  >
                    <option value="">Seleccionar dataset</option>
                    {datasets.filter(d => d.status === 'active').map(dataset => (
                      <option key={dataset._id} value={dataset._id}>
                        {dataset.name} ({dataset.category})
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="flex items-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
                  >
                    {loading ? 'Asignando...' : 'Asignar'}
                  </button>
                </div>
              </form>
            </div>

            {/* Lista de asignaciones existentes */}
            <div>
              <h3 className="text-lg font-medium mb-4">Asignaciones Existentes</h3>
              {users.filter(u => u.assignedDatasets.length > 0).map(user => (
                <div key={user._id} className="mb-4 p-4 border border-gray-200 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium text-gray-900">
                      {user.username} ({user.email})
                    </h4>
                    <span className="text-sm text-gray-500">
                      {user.assignedDatasets.length} asignación(es)
                    </span>
                  </div>
                  <div className="space-y-2">
                    {user.assignedDatasets.map(assignment => (
                      <div key={assignment.dataset._id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <div>
                          <span className="font-medium">{assignment.dataset.name}</span>
                          <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            assignment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            assignment.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {assignment.status}
                          </span>
                        </div>
                        <button
                          onClick={() => handleRemoveAssignment(user._id, assignment.dataset._id)}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Remover
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
