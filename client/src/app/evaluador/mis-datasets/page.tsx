'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { apiService } from '@/utils/api';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Dataset {
  _id: string;
  name: string;
  description: string;
  category: string;
  difficulty: string;
  length: number;
  expectedChangePoints: number;
  data: number[][];
}

interface AssignedDataset {
  dataset: Dataset;
  assignedAt: string;
  status: 'pending' | 'in_progress' | 'completed';
  completedAt?: string;
  evaluationCount: number;
}

export default function MyAssignedDatasetsPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [assignedDatasets, setAssignedDatasets] = useState<AssignedDataset[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/iniciar-sesion');
      return;
    }
    
    if (user) {
      loadAssignedDatasets();
    }
  }, [isAuthenticated, user, router]);

  const loadAssignedDatasets = async () => {
    try {
      setLoading(true);
      const response = await apiService.getMyAssignedDatasets(statusFilter === 'all' ? undefined : statusFilter);
      setAssignedDatasets(response.data);
    } catch (error: any) {
      console.error('Error al cargar datasets asignados:', error);
      setMessage({ type: 'error', text: error.message || 'Error al cargar datasets' });
    } finally {
      setLoading(false);
    }
  };

  const updateDatasetStatus = async (datasetId: string, newStatus: string) => {
    try {
      await apiService.updateAssignedDatasetStatus(datasetId, newStatus);
      setMessage({ type: 'success', text: 'Estado actualizado exitosamente' });
      loadAssignedDatasets();
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Error al actualizar estado' });
    }
  };

  const filteredDatasets = assignedDatasets.filter(assigned => 
    statusFilter === 'all' || assigned.status === statusFilter
  );

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Acceso Denegado</h1>
          <p className="text-gray-600">Debes iniciar sesión para ver esta página.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/evaluador" className="inline-flex items-center text-blue-500 hover:text-blue-600 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Volver al Evaluador
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Mis Datasets Asignados</h1>
          <p className="mt-2 text-gray-600">
            Datasets que han sido asignados específicamente para ti por los administradores
          </p>
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

        {/* Filtros */}
        <div className="mb-6 bg-white p-4 rounded-lg shadow">
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-gray-700">Filtrar por estado:</label>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setTimeout(loadAssignedDatasets, 100);
              }}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="all">Todos</option>
              <option value="pending">Pendientes</option>
              <option value="in_progress">En Progreso</option>
              <option value="completed">Completados</option>
            </select>
            <button
              onClick={loadAssignedDatasets}
              className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 text-sm"
            >
              Actualizar
            </button>
          </div>
        </div>

        {/* Contenido */}
        {loading ? (
          <div className="bg-white shadow rounded-lg p-8 text-center">
            <p className="text-gray-600">Cargando datasets asignados...</p>
          </div>
        ) : filteredDatasets.length === 0 ? (
          <div className="bg-white shadow rounded-lg p-8 text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No tienes datasets asignados
            </h3>
            <p className="text-gray-600 mb-6">
              Los administradores pueden asignarte datasets específicos para evaluar.
              Mientras tanto, puedes usar el evaluador general.
            </p>
            <Link
              href="/evaluador"
              className="inline-flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Ir al Evaluador General
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-white shadow rounded-lg p-6">
              <div className="mb-4">
                <h2 className="text-xl font-semibold">
                  Datasets Asignados ({filteredDatasets.length})
                </h2>
              </div>
              
              <div className="grid gap-6">
                {filteredDatasets.map((assigned) => (
                  <div key={assigned.dataset._id} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          {assigned.dataset.name}
                        </h3>
                        <p className="text-gray-600 mt-1">
                          {assigned.dataset.description}
                        </p>
                      </div>
                      <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                        assigned.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        assigned.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {assigned.status === 'pending' ? 'Pendiente' :
                         assigned.status === 'in_progress' ? 'En Progreso' :
                         'Completado'}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <span className="text-sm text-gray-500">Categoría</span>
                        <p className="font-medium">{assigned.dataset.category}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Dificultad</span>
                        <p className={`font-medium ${
                          assigned.dataset.difficulty === 'easy' ? 'text-green-600' :
                          assigned.dataset.difficulty === 'medium' ? 'text-yellow-600' :
                          'text-red-600'
                        }`}>
                          {assigned.dataset.difficulty}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Puntos de datos</span>
                        <p className="font-medium">{assigned.dataset.length}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Change Points esperados</span>
                        <p className="font-medium">{assigned.dataset.expectedChangePoints}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-500">
                        Asignado: {new Date(assigned.assignedAt).toLocaleDateString()}
                        {assigned.completedAt && (
                          <span className="ml-4">
                            Completado: {new Date(assigned.completedAt).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                      
                      <div className="flex space-x-2">
                        {assigned.status === 'pending' && (
                          <button
                            onClick={() => updateDatasetStatus(assigned.dataset._id, 'in_progress')}
                            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm"
                          >
                            Comenzar Evaluación
                          </button>
                        )}
                        
                        {assigned.status === 'in_progress' && (
                          <button
                            onClick={() => updateDatasetStatus(assigned.dataset._id, 'completed')}
                            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 text-sm"
                          >
                            Marcar como Completado
                          </button>
                        )}
                        
                        <Link
                          href={`/evaluador/manual?dataset=${assigned.dataset._id}`}
                          className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 text-sm inline-flex items-center"
                        >
                          Evaluar
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
