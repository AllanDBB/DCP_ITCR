'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
    dataset: Dataset | null;
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
  const [activeTab, setActiveTab] = useState<'upload' | 'datasets' | 'users' | 'assignments' | 'evaluations'>('upload');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  // Debug logging para verificar usuario
  console.log('🏠 AdminPageSimple - Estado del usuario:');
  console.log('  🧑‍💼 Usuario:', user);
  console.log('  🔑 Autenticado:', isAuthenticated);
  console.log('  👮‍♂️ Rol:', user?.role);
  console.log('  📧 Email:', user?.email);
  
  // Estados para datasets
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [evaluations, setEvaluations] = useState<any[]>([]);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  
  // Estados para formularios
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [selectedDatasets, setSelectedDatasets] = useState<string[]>([]);
  const [datasetQuery, setDatasetQuery] = useState<string>('');

  const activeDatasets = useMemo(() => datasets.filter(d => d.status === 'active'), [datasets]);
  const filteredDatasets = useMemo(() => {
    const q = datasetQuery.trim().toLowerCase();
    if (!q) return activeDatasets;
    return activeDatasets.filter(d =>
      d.name.toLowerCase().includes(q) ||
      (d.category || '').toLowerCase().includes(q)
    );
  }, [activeDatasets, datasetQuery]);
  
  // Estados para análisis dinámico del CSV
  const [csvPreview, setCsvPreview] = useState<{
    columns: string[];
    timeSeriesColumns: string[];
    sampleData: any[];
  } | null>(null);
  const [uploadMode, setUploadMode] = useState<'single' | 'multiple'>('multiple');

  const loadEvaluations = useCallback(async () => {
    try {
      setLoading(true);
      console.log('🔄 Iniciando carga de evaluaciones...');
      console.log('🧑‍💼 Usuario actual:', user);
      console.log('🔑 Usuario autenticado:', isAuthenticated);
      console.log('👮‍♂️ Rol del usuario:', user?.role);
      
      // Verificar que el usuario sea admin antes de hacer la llamada
      if (!user || user.role !== 'admin') {
        throw new Error('Usuario no tiene permisos de administrador');
      }
      
      const response = await apiService.getAllLabels({ limit: 100 });
      console.log('✅ Respuesta de evaluaciones:', response);
      
      setEvaluations(response.data?.labels || []);
      console.log('📋 Evaluaciones cargadas:', response.data?.labels?.length || 0);
      
    } catch (error: any) {
      console.error('❌ Error al cargar evaluaciones:', error);
      console.error('❌ Error response:', error.response?.data);
      console.error('❌ Error status:', error.response?.status);
      
      let errorMessage = 'Error al cargar evaluaciones';
      if (error.message && error.message.includes('permisos de administrador')) {
        errorMessage = 'Acceso denegado: Necesita permisos de administrador para ver las evaluaciones';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.status === 403) {
        errorMessage = 'No tienes permisos para ver las evaluaciones';
      } else if (error.response?.status === 401) {
        errorMessage = 'Tu sesión ha expirado. Por favor inicia sesión nuevamente';
      }
      
      setMessage({ type: 'error', text: errorMessage });
    } finally {
      setLoading(false);
    }
  }, [user, isAuthenticated]);

  // Función para descargar evaluaciones en CSV
  const downloadEvaluationsCSV = useCallback(async () => {
    try {
      setLoading(true);
      console.log('📥 Iniciando descarga de CSV...');
      
      // Verificar que el usuario sea admin antes de hacer la llamada
      if (!user || user.role !== 'admin') {
        throw new Error('Usuario no tiene permisos de administrador');
      }
      
      const blob = await apiService.downloadLabelsCSV();
      console.log('✅ CSV descargado exitosamente');
      
      // Crear URL del blob y descargar
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      
      // Generar nombre de archivo con timestamp
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
      a.download = `evaluaciones_dcp_${timestamp}.csv`;
      
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      setMessage({ type: 'success', text: 'CSV descargado exitosamente' });
      console.log('📁 Archivo descargado:', a.download);
      
    } catch (error: any) {
      console.error('❌ Error al descargar CSV:', error);
      
      let errorMessage = 'Error al descargar CSV';
      if (error.message && error.message.includes('permisos de administrador')) {
        errorMessage = 'Acceso denegado: Necesita permisos de administrador para descargar evaluaciones';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setMessage({ type: 'error', text: errorMessage });
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Función para descargar serie etiquetada individual
  const downloadLabeledSeries = useCallback(async (labelId: string, datasetName: string, username: string) => {
    try {
      console.log('📥 Iniciando descarga de serie etiquetada...', { labelId, datasetName, username });
      
      // Verificar que el usuario sea admin antes de hacer la llamada
      if (!user || user.role !== 'admin') {
        throw new Error('Usuario no tiene permisos de administrador');
      }
      
      const blob = await apiService.downloadLabeledSeriesCSV(labelId);
      console.log('✅ Serie etiquetada descargada exitosamente');
      
      // Crear URL del blob y descargar
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      
      // Generar nombre de archivo
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
      const sanitizedDataset = datasetName.replace(/[^a-zA-Z0-9\-_]/g, '_');
      const sanitizedUsername = username.replace(/[^a-zA-Z0-9\-_]/g, '_');
      a.download = `serie_etiquetada_${sanitizedUsername}_${sanitizedDataset}_${timestamp}.csv`;
      
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      setMessage({ type: 'success', text: `Serie etiquetada descargada: ${datasetName}` });
      console.log('📁 Archivo descargado:', a.download);
      
    } catch (error: any) {
      console.error('❌ Error al descargar serie etiquetada:', error);
      
      let errorMessage = 'Error al descargar serie etiquetada';
      if (error.message && error.message.includes('permisos de administrador')) {
        errorMessage = 'Acceso denegado: Necesita permisos de administrador';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setMessage({ type: 'error', text: errorMessage });
    }
  }, [user]);

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
      } else if (activeTab === 'evaluations') {
        loadEvaluations();
      } else if (activeTab === 'assignments') {
        // Asegurar datos necesarios para asignaciones
        loadUsers();
        loadDatasets();
      }
    }
  }, [activeTab, isAuthenticated, user, loadEvaluations]);

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

  // Función para analizar CSV
  const analyzeCSV = async (file: File) => {
    try {
      const text = await file.text();
      const lines = text.split('\n').filter(line => line.trim());
      
      if (lines.length < 2) {
        throw new Error('El archivo CSV debe tener al menos una fila de datos');
      }

      const headers = lines[0].split(',').map(h => h.trim());
      const sampleData = lines.slice(1, 6).map(line => {
        const values = line.split(',');
        const row: any = {};
        headers.forEach((header, index) => {
          row[header] = values[index]?.trim() || '';
        });
        return row;
      });

      // Detectar columnas de series de tiempo (que empiecen con 's' seguido de números)
      const timeSeriesColumns = headers.filter(col => 
        /^s\d+$/i.test(col) && 
        sampleData.some(row => !isNaN(parseFloat(row[col])))
      );

      setCsvPreview({
        columns: headers,
        timeSeriesColumns,
        sampleData
      });

      // Si hay múltiples columnas de series de tiempo, sugerir modo múltiple
      if (timeSeriesColumns.length > 1) {
        setUploadMode('multiple');
      } else {
        setUploadMode('single');
      }

    } catch (error) {
      console.error('Error analizando CSV:', error);
      setMessage({ type: 'error', text: 'Error al analizar el archivo CSV' });
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
      formData.append('description', `Dataset cargado desde ${csvFile.name}`);
      formData.append('category', 'uploaded');
      formData.append('difficulty', 'medium');

      let result;
      if (uploadMode === 'multiple' && csvPreview && csvPreview.timeSeriesColumns.length > 1) {
        // Usar endpoint múltiple
        result = await apiService.uploadMultipleDatasetsFromCSV(formData);
        setMessage({ 
          type: 'success', 
          text: `${result.datasets?.length || 0} datasets creados exitosamente` 
        });
      } else {
        // Usar endpoint simple
        formData.append('name', csvFile.name.replace('.csv', ''));
        result = await apiService.uploadDatasetFromCSV(formData);
        setMessage({ type: 'success', text: 'Dataset subido exitosamente' });
      }

      setCsvFile(null);
      setCsvPreview(null);
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
    if (!selectedUser || selectedDatasets.length === 0) {
      setMessage({ type: 'error', text: 'Selecciona usuario y al menos un dataset' });
      return;
    }

    try {
      setLoading(true);
      const results = await Promise.allSettled(
        selectedDatasets.map((ds) => apiService.assignDatasetToUser(selectedUser, ds))
      );

      let assigned = 0, already = 0, failed = 0;
      results.forEach(r => {
        if (r.status === 'fulfilled') {
          assigned++;
        } else {
          const msg = (r.reason?.message || '').toLowerCase();
          if (msg.includes('ya está asignado') || msg.includes('ya est') && msg.includes('asignado')) {
            already++;
          } else {
            failed++;
          }
        }
      });

      const summary = `Asignaciones: ${assigned} ok` +
        (already ? `, ${already} ya asignada(s)` : '') +
        (failed ? `, ${failed} fallida(s)` : '');
      setMessage({ type: failed > 0 && assigned === 0 ? 'error' as const : 'success', text: summary });
      setSelectedUser('');
      setSelectedDatasets([]);
      await loadUsers();
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Error al asignar dataset' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDataset = async (dataset: Dataset) => {
    if (!dataset?._id) return;
    const ok = confirm(`¿Seguro que deseas eliminar el dataset "${dataset.name}"? Esta acción es permanente.`);
    if (!ok) return;
    try {
      setDeletingId(dataset._id);
      await apiService.deleteDataset(dataset._id);
      setMessage({ type: 'success', text: 'Dataset eliminado exitosamente' });
      await loadDatasets();
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Error al eliminar dataset' });
    } finally {
      setDeletingId(null);
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

  const handleDownloadEvaluation = async (evaluation: any) => {
    try {
      // Crear objeto con datos de la evaluación para descarga
      const evaluationData = {
        usuario: evaluation.userId?.username || 'Usuario desconocido',
        email: evaluation.userId?.email || '',
        dataset: evaluation.datasetId?.name || 'Dataset desconocido',
        categoria: evaluation.datasetId?.category || '',
        dificultad: evaluation.datasetId?.difficulty || '',
        estado: evaluation.status || 'sin estado',
        sinChangePoints: evaluation.noChangePoints || false,
        changePoints: evaluation.changePoints || [],
        confianza: evaluation.confidence || 0,
        tiempoGastado: evaluation.timeSpent || 0,
        fechaCreacion: evaluation.createdAt,
        fechaActualizacion: evaluation.updatedAt
      };

      // Convertir a JSON y descargar
      const dataStr = JSON.stringify(evaluationData, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileDefaultName = `evaluacion_${evaluation.userId?.username || 'usuario'}_${evaluation.datasetId?.name || 'dataset'}_${new Date().toISOString().split('T')[0]}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
    } catch (error: any) {
      setMessage({ type: 'error', text: 'Error al descargar evaluación' });
    }
  };

  const handleViewEvaluation = (evaluation: any) => {
    // Mostrar detalles de la evaluación en un alert por ahora
    // En el futuro se puede implementar un modal más sofisticado
    const details = `
Evaluación de ${evaluation.userId?.username || 'Usuario desconocido'}
Dataset: ${evaluation.datasetId?.name || 'Dataset desconocido'}
Estado: ${evaluation.status || 'Sin estado'}
${evaluation.noChangePoints ? 'Sin change points detectados' : `Change points encontrados: ${evaluation.changePoints?.length || 0}`}
Confianza: ${evaluation.confidence || 0}
Fecha: ${new Date(evaluation.createdAt).toLocaleString()}
    `;
    alert(details);
  };

  if (!isAuthenticated || !user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Acceso Denegado</h1>
          <p className="text-gray-800">No tienes permisos para acceder a esta página.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Panel de Administración</h1>
          <p className="mt-2 text-gray-700">Gestiona datasets, usuarios y asignaciones</p>
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
            {['upload', 'datasets', 'users', 'assignments', 'evaluations'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-700 hover:text-gray-900'
                }`}
              >
                {tab === 'upload' && 'Subir CSV'}
                {tab === 'datasets' && 'Datasets'}
                {tab === 'users' && 'Usuarios'}
                {tab === 'assignments' && 'Asignaciones'}
                {tab === 'evaluations' && 'Evaluaciones'}
              </button>
            ))}
          </nav>
        </div>

        {/* Contenido de los tabs */}
        {activeTab === 'upload' && (
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">Subir Dataset desde CSV</h2>
            <form onSubmit={handleFileUpload} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">
                  Archivo CSV
                </label>
                <input
                  type="file"
                  accept=".csv"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    setCsvFile(file);
                    if (file) {
                      analyzeCSV(file);
                    } else {
                      setCsvPreview(null);
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>

              {/* Preview del CSV */}
              {csvPreview && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2">Análisis del archivo:</h3>
                  <div className="space-y-2 text-sm text-gray-800">
                    <p className="text-gray-800"><span className="font-medium">Columnas encontradas:</span> {csvPreview.columns.length}</p>
                    <p className="text-gray-800"><span className="font-medium">Series de tiempo detectadas:</span> {csvPreview.timeSeriesColumns.length}</p>
                    {csvPreview.timeSeriesColumns.length > 0 && (
                      <p className="text-gray-800"><span className="font-medium">Columnas de series:</span> {csvPreview.timeSeriesColumns.join(', ')}</p>
                    )}
                  </div>

                  {/* Selector de modo */}
                  {csvPreview.timeSeriesColumns.length > 1 && (
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-800 mb-2">
                        Modo de procesamiento:
                      </label>
                      <div className="space-y-2">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            value="multiple"
                            checked={uploadMode === 'multiple'}
                            onChange={(e) => setUploadMode(e.target.value as 'multiple')}
                            className="mr-2"
                          />
                          <span className="text-sm text-gray-800">
                            Crear múltiples datasets (uno por cada serie de tiempo) - Recomendado
                          </span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            value="single"
                            checked={uploadMode === 'single'}
                            onChange={(e) => setUploadMode(e.target.value as 'single')}
                            className="mr-2"
                          />
                          <span className="text-sm text-gray-800">
                            Crear un solo dataset (solo primera serie de tiempo)
                          </span>
                        </label>
                      </div>
                    </div>
                  )}

                  {/* Preview de datos */}
                  {csvPreview.sampleData.length > 0 && (
                    <div className="mt-4">
                      <h4 className="font-medium text-gray-900 mb-2">Vista previa (primeras filas):</h4>
                      <div className="overflow-x-auto">
                        <table className="min-w-full text-xs border">
                          <thead>
                            <tr className="bg-gray-100">
                              {csvPreview.columns.slice(0, 6).map((col) => (
                                <th key={col} className="border px-2 py-1 text-left text-black">
                                  {col}
                                </th>
                              ))}
                              {csvPreview.columns.length > 6 && (
                                <th className="border px-2 py-1 text-left text-black">...</th>
                              )}
                            </tr>
                          </thead>
                          <tbody>
                            {csvPreview.sampleData.slice(0, 3).map((row, i) => (
                              <tr key={i}>
                                {csvPreview.columns.slice(0, 6).map((col) => (
                                  <td key={col} className="border px-2 py-1 text-black">
                                    {row[col]}
                                  </td>
                                ))}
                                {csvPreview.columns.length > 6 && (
                                  <td className="border px-2 py-1 text-black">...</td>
                                )}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !csvFile}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Procesando...' : 
                 uploadMode === 'multiple' && csvPreview && csvPreview.timeSeriesColumns.length > 1 
                   ? `Crear ${csvPreview.timeSeriesColumns.length} Datasets` 
                   : 'Subir Dataset'}
              </button>
            </form>
          </div>
        )}

        {activeTab === 'datasets' && (
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Datasets</h2>
              <button
                onClick={loadDatasets}
                className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
              >
                Actualizar
              </button>
            </div>
            
            {loading ? (
              <p className="text-gray-800">Cargando datasets...</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Nombre</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Categoría</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Dificultad</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Estado</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Puntos</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {datasets.map((dataset) => (
                      <tr key={dataset._id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-black">{dataset.name}</div>
                            <div className="text-sm text-black">{dataset.description}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
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
                            dataset.status === 'inactive' ? 'bg-gray-100 text-black' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {dataset.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                          {dataset.length}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleDeleteDataset(dataset)}
                            disabled={deletingId === dataset._id}
                            className="text-red-600 hover:text-red-800 disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Eliminar dataset"
                          >
                            {deletingId === dataset._id ? 'Eliminando...' : 'Eliminar'}
                          </button>
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
                <h3 className="text-lg font-semibold mb-4 text-black">Estadísticas de Usuarios</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{userStats.totalUsers}</div>
                    <div className="text-sm text-black">Total Usuarios</div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{userStats.assignments.usersWithAssignments}</div>
                    <div className="text-sm text-black">Con Asignaciones</div>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">{userStats.assignments.totalAssignments}</div>
                    <div className="text-sm text-black">Total Asignaciones</div>
                  </div>
                </div>
              </div>
            )}

            {/* Lista de usuarios */}
            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-black">Usuarios</h2>
                <button
                  onClick={loadUsers}
                  className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
                >
                  Actualizar
                </button>
              </div>
              
              {loading ? (
                <p className="text-black">Cargando usuarios...</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase">Usuario</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase">Rol</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase">Asignaciones</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase">Registro</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users.map((user) => (
                        <tr key={user._id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{user.username}</div>
                              <div className="text-sm text-gray-600">{user.email}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                            }`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                            {user.assignedDatasets.length}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
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
            <h2 className="text-xl font-semibold mb-6 text-black">Gestión de Asignaciones</h2>
            
            {/* Formulario para asignar dataset */}
            <div className="mb-8 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-medium mb-4 text-gray-900">Asignar Dataset a Usuario</h3>
              <form onSubmit={handleAssignDataset} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Usuario</label>
                  <select
                    value={selectedUser}
                    onChange={(e) => setSelectedUser(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="" className="text-gray-500">Seleccionar usuario</option>
                    {users.filter(u => u.role === 'user').map(user => (
                      <option key={user._id} value={user._id} className="text-gray-900">
                        {user.username} ({user.email})
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Datasets</label>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                    <input
                      type="text"
                      value={datasetQuery}
                      onChange={(e) => setDatasetQuery(e.target.value)}
                      placeholder="Buscar por nombre o categoría..."
                      className="w-full sm:w-2/3 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                    />
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-gray-700">{filteredDatasets.length} visibles</span>
                      <span className="text-xs text-gray-700">{selectedDatasets.length} seleccionados</span>
                      <button
                        type="button"
                        onClick={() => setSelectedDatasets(filteredDatasets.map(d => d._id))}
                        className="text-xs px-2 py-1 rounded border border-gray-300 hover:bg-gray-100 text-gray-800"
                      >
                        Seleccionar visibles
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedDatasets([])}
                        className="text-xs px-2 py-1 rounded border border-gray-300 hover:bg-gray-100 text-gray-800"
                      >
                        Limpiar
                      </button>
                    </div>
                  </div>
                  <div className="border border-gray-200 rounded-md max-h-64 overflow-auto divide-y">
                    {filteredDatasets.map((dataset) => {
                      const checked = selectedDatasets.includes(dataset._id);
                      return (
                        <label key={dataset._id} className="flex items-center justify-between px-3 py-2 hover:bg-gray-50 cursor-pointer">
                          <div className="flex items-center gap-3">
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={(e) => {
                                setSelectedDatasets((prev) => {
                                  if (e.target.checked) return Array.from(new Set([...prev, dataset._id]));
                                  return prev.filter(id => id !== dataset._id);
                                });
                              }}
                              className="h-4 w-4"
                            />
                            <div>
                              <div className="text-sm font-medium text-gray-900">{dataset.name}</div>
                              <div className="text-xs text-gray-600">{dataset.description}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="inline-flex px-2 py-0.5 text-[10px] font-semibold rounded-full bg-gray-100 text-gray-800">
                              {dataset.category}
                            </span>
                            <span className={`inline-flex px-2 py-0.5 text-[10px] font-semibold rounded-full ${
                              dataset.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                              dataset.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {dataset.difficulty}
                            </span>
                          </div>
                        </label>
                      );
                    })}
                    {filteredDatasets.length === 0 && (
                      <div className="px-3 py-6 text-sm text-gray-600">No se encontraron datasets activos.</div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-end">
                  <button
                    type="submit"
                    disabled={loading || !selectedUser || selectedDatasets.length === 0}
                    className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Asignando...' : `Asignar (${selectedDatasets.length})`}
                  </button>
                </div>
              </form>
            </div>

            {/* Lista de asignaciones existentes */}
            <div>
              <h3 className="text-lg font-medium mb-4 text-black">Asignaciones Existentes</h3>
              {users.filter(u => u.assignedDatasets.length > 0).map(user => (
                <div key={user._id} className="mb-4 p-4 border border-gray-200 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium text-black">
                      {user.username} ({user.email})
                    </h4>
                    <span className="text-sm text-black">
                      {user.assignedDatasets.length} asignación(es)
                    </span>
                  </div>
                  <div className="space-y-2">
                    {user.assignedDatasets.map((assignment, idx) => (
                      <div key={assignment.dataset?._id || `${user._id}-${idx}`} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <div>
                          <span className="font-medium text-black">{assignment.dataset?.name || 'Dataset no disponible'}</span>
                          <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            assignment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            assignment.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {assignment.status}
                          </span>
                        </div>
                        {assignment.dataset?._id ? (
                          <button
                            onClick={() => handleRemoveAssignment(user._id, assignment.dataset!._id)}
                            className="text-red-600 hover:text-red-800 text-sm"
                          >
                            Remover
                          </button>
                        ) : (
                          <span className="text-sm text-gray-500">No disponible</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'evaluations' && (
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Evaluaciones Completadas</h2>
              <div className="flex space-x-2">
                <button
                  onClick={downloadEvaluationsCSV}
                  disabled={loading}
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>Descargar CSV</span>
                </button>
                <button
                  onClick={loadEvaluations}
                  disabled={loading}
                  className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Actualizar
                </button>
              </div>
            </div>
            
            {loading ? (
              <p className="text-gray-700">Cargando evaluaciones...</p>
            ) : evaluations.length === 0 ? (
              <p className="text-gray-700">No hay evaluaciones disponibles.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase">Usuario</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase">Dataset</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase">Estado</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase">Change Points</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase">Fecha</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {evaluations.map((evaluation) => (
                      <tr key={evaluation._id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {evaluation.userId?.username || 'Usuario desconocido'}
                            </div>
                            <div className="text-sm text-gray-600">
                              {evaluation.userId?.email || ''}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {evaluation.datasetId?.name || 'Dataset desconocido'}
                            </div>
                            <div className="text-sm text-gray-600">
                              {evaluation.datasetId?.category || ''}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            evaluation.status === 'completed' ? 'bg-green-100 text-green-800' :
                            evaluation.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {evaluation.status === 'completed' ? 'Completada' :
                             evaluation.status === 'draft' ? 'Borrador' :
                             evaluation.status || 'Sin estado'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {evaluation.noChangePoints ? 
                            'Sin change points' : 
                            `${evaluation.changePoints?.length || 0} CP(s)`}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {new Date(evaluation.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => downloadLabeledSeries(
                              evaluation._id,
                              evaluation.datasetId?.name || 'dataset',
                              evaluation.userId?.username || 'user'
                            )}
                            className="text-blue-600 hover:text-blue-900 mr-4 flex items-center space-x-1"
                            title="Descargar serie etiquetada"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <span>Serie CSV</span>
                          </button>
                          <button
                            onClick={() => handleViewEvaluation(evaluation)}
                            className="text-green-600 hover:text-green-900"
                            title="Ver detalles"
                          >
                            👁️ Ver
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
