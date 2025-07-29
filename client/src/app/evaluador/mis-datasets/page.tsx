'use client';

import React, { useState, useEffect, useCallback } from 'react';
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

  const loadAssignedDatasets = useCallback(async () => {
    try {
      setLoading(true);
      console.log('=== DEBUG: Cargando datasets asignados ===');
      console.log('User:', user);
      console.log('StatusFilter:', statusFilter);
      
      const response = await apiService.getMyAssignedDatasets(statusFilter === 'all' ? undefined : statusFilter);
      console.log('=== DEBUG: Respuesta recibida ===', response);
      
      setAssignedDatasets(response.data || []);
      setMessage(null); // Limpiar mensajes de error previos
    } catch (error: any) {
      console.error('=== DEBUG: Error completo ===', error);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      
      let errorMessage = 'Error al cargar los datasets asignados';
      
      // Proporcionar más detalles específicos del error
      if (error.message) {
        if (error.message.includes('401') || error.message.includes('Unauthorized')) {
          errorMessage = 'No autorizado. Por favor, inicia sesión nuevamente.';
        } else if (error.message.includes('403') || error.message.includes('Forbidden')) {
          errorMessage = 'No tienes permisos para acceder a tus datasets asignados.';
        } else if (error.message.includes('404')) {
          errorMessage = 'No se encontró el endpoint de datasets asignados.';
        } else if (error.message.includes('500')) {
          errorMessage = 'Error interno del servidor. Por favor, contacta al administrador.';
        } else {
          errorMessage = `Error: ${error.message}`;
        }
      }
      
      setMessage({ type: 'error', text: errorMessage });
    } finally {
      setLoading(false);
    }
  }, [statusFilter, user]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/iniciar-sesion');
      return;
    }
    
    if (user) {
      loadAssignedDatasets();
    }
  }, [isAuthenticated, user, router, loadAssignedDatasets]);

  useEffect(() => {
    if (user) {
      loadAssignedDatasets();
    }
  }, [statusFilter, user, loadAssignedDatasets]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pendiente';
      case 'in_progress':
        return 'En Progreso';
      case 'completed':
        return 'Completado';
      default:
        return status;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'hard':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-black">Mis Datasets Asignados</h1>
          <p className="mt-2 text-black">Aquí puedes ver y evaluar los datasets que tienes asignados</p>
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
        <div className="mb-6 bg-white shadow rounded-lg p-4">
          <div className="flex flex-wrap gap-4 items-center">
            <label className="text-sm font-medium text-black">Filtrar por estado:</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="all">Todos</option>
              <option value="pending">Pendientes</option>
              <option value="in_progress">En Progreso</option>
              <option value="completed">Completados</option>
            </select>
            <button
              onClick={loadAssignedDatasets}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm"
            >
              Actualizar
            </button>
          </div>
        </div>

        {/* Lista de datasets */}
        {loading ? (
          <div className="bg-white shadow rounded-lg p-8 text-center">
            <p className="text-black">Cargando datasets asignados...</p>
          </div>
        ) : assignedDatasets.length === 0 ? (
          <div className="bg-white shadow rounded-lg p-8 text-center">
            <p className="text-black">No tienes datasets asignados en este momento.</p>
            <p className="text-sm text-gray-600 mt-2">
              Los administradores pueden asignarte datasets para evaluar.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {assignedDatasets.map((assigned) => (
              <div key={assigned.dataset._id} className="bg-white shadow rounded-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-black">{assigned.dataset.name}</h3>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(assigned.status)}`}>
                    {getStatusText(assigned.status)}
                  </span>
                </div>
                
                <p className="text-sm text-black mb-4">{assigned.dataset.description}</p>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-black">Categoría:</span>
                    <span className="text-black">{assigned.dataset.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-black">Dificultad:</span>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getDifficultyColor(assigned.dataset.difficulty)}`}>
                      {assigned.dataset.difficulty}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-black">Puntos de datos:</span>
                    <span className="text-black">{assigned.dataset.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-black">Change points esperados:</span>
                    <span className="text-black">{assigned.dataset.expectedChangePoints}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-black">Evaluaciones realizadas:</span>
                    <span className="text-black">{assigned.evaluationCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-black">Asignado:</span>
                    <span className="text-black">{new Date(assigned.assignedAt).toLocaleDateString()}</span>
                  </div>
                  {assigned.completedAt && (
                    <div className="flex justify-between">
                      <span className="text-black">Completado:</span>
                      <span className="text-black">{new Date(assigned.completedAt).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>

                <div className="mt-6 space-y-2">
                  {assigned.status !== 'completed' && (
                    <Link
                      href={`/evaluador/manual?datasetId=${assigned.dataset._id}`}
                      className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-center block"
                    >
                      {assigned.status === 'pending' ? 'Comenzar Evaluación' : 'Continuar Evaluación'}
                    </Link>
                  )}
                  
                  <Link
                    href={`/evaluador/automatico?datasetId=${assigned.dataset._id}`}
                    className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 text-center block"
                  >
                    Evaluación Automática
                  </Link>
                  
                  {assigned.evaluationCount > 0 && (
                    <button
                      onClick={() => {
                        // TODO: Implementar ver resultados
                        alert('Ver resultados - Por implementar');
                      }}
                      className="w-full bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
                    >
                      Ver Resultados
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
