"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { apiService } from '@/utils/api';
import ManualEvaluationHeader from "./components/ManualEvaluationHeaderSimple";
import GraphPagination from "./components/GraphPagination";

// Define an interface for the real dataset structure from backend
interface Dataset {
  _id: string;
  name: string;
  description: string;
  category: string;
  difficulty: string;
  length: number;
  expectedChangePoints: number;
  data: number[];
  createdAt: string;
}

// Define an interface for change points
interface ChangePoint {
  index: number;
  date?: string;
  value: number;
  relativeIndex?: number;
  tipo?: 'media' | 'tendencia';
}

function ManualEvaluationPage() {
  const { user, isAuthenticated } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();
  const datasetId = searchParams.get('datasetId');
  
  // Estado para el dataset actual
  const [currentDataset, setCurrentDataset] = useState<Dataset | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Estado para los change points marcados manualmente
  const [changePoints, setChangePoints] = useState<ChangePoint[]>([]);
  // Estado para indicar que no hay change points
  const [sinChangePoint, setSinChangePoint] = useState(false);
  
  // Estado para el change point siendo editado
  const [editingChangePoint, setEditingChangePoint] = useState<number | null>(null);
  
  // Estados para evaluación existente
  const [existingEvaluation, setExistingEvaluation] = useState<any | null>(null);
  const [evaluationStatus, setEvaluationStatus] = useState<'draft' | 'completed' | 'new'>('new');
  
  // Estado para la paginación de la gráfica
  const [currentPage, setCurrentPage] = useState(1);
  const [pointsPerPage, setPointsPerPage] = useState(100);
  const [totalPages, setTotalPages] = useState(1);
  
  // Estados para el control de escala
  const [escalaY, setEscalaY] = useState(1);
  const [offsetY, setOffsetY] = useState(0);
  
  // Estado para hover del mouse en la gráfica
  const [hoverPosition, setHoverPosition] = useState<{x: number, index: number, mouseX?: number} | null>(null);
  
  // Datos para la gráfica
  const [graphData, setGraphData] = useState<{index: number; value: number; date: string}[]>([]);
  
  const graphRef = useRef<HTMLDivElement>(null);

  // Cargar dataset cuando cambie el datasetId
  useEffect(() => {
    // Función para cargar evaluación existente
    const loadExistingEvaluation = async (datasetId: string, currentGraphData: any[]) => {
      try {
        console.log('🔍 Buscando evaluación existente para dataset:', datasetId);
        
        // Buscar evaluaciones del usuario para este dataset
        const response = await apiService.getUserLabels({ datasetId });
        
        if (response && response.data && response.data.labels && response.data.labels.length > 0) {
          const evaluation = response.data.labels[0]; // Tomar la primera evaluación
          console.log('📋 Evaluación existente encontrada:', evaluation);
          
          setExistingEvaluation(evaluation);
          setEvaluationStatus(evaluation.status || 'completed');
          
          // Cargar change points existentes
          if (evaluation.changePoints && evaluation.changePoints.length > 0) {
            const loadedChangePoints = evaluation.changePoints.map((cp: any) => ({
              index: cp.position,
              value: currentGraphData[cp.position]?.value || 0,
              date: currentGraphData[cp.position]?.date || '',
              tipo: cp.type === 'trend' ? 'tendencia' : 'media'
            }));
            
            setChangePoints(loadedChangePoints);
            setSinChangePoint(false);
          } else if (evaluation.noChangePoints) {
            setSinChangePoint(true);
            setChangePoints([]);
          }
          
          console.log('✅ Evaluación cargada exitosamente');
        } else {
          console.log('💡 No se encontró evaluación existente - nueva evaluación');
          setEvaluationStatus('new');
        }
      } catch (error) {
        console.error('⚠️ Error al cargar evaluación existente:', error);
        // No es un error crítico, continuar con nueva evaluación
        setEvaluationStatus('new');
      }
    };

    const loadDataset = async () => {
      if (!datasetId) {
        setError('No se especificó ID de dataset');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log('Cargando dataset:', datasetId);
        console.log('=== DEBUG: Antes de llamar getDatasetById ===');
        const response = await apiService.getDatasetById(datasetId);
        console.log('=== DEBUG: Response recibido ===');
        console.log('Response completo:', response);
        console.log('Response type:', typeof response);
        console.log('Response.data:', response?.data);
        console.log('Response.data type:', typeof response?.data);
        
        if (!response) {
          throw new Error('No se recibió respuesta del servidor');
        }
        
        if (!response.dataset) {
          console.error('=== ERROR: response.dataset es undefined ===');
          console.error('Keys en response:', Object.keys(response || {}));
          throw new Error('La respuesta del servidor no contiene datos del dataset');
        }
        
        const dataset = response.dataset;
        console.log('Dataset cargado:', dataset);
        setCurrentDataset(dataset);
        
        // Convertir los datos del dataset al formato necesario para el gráfico
        let formattedData;
        if (Array.isArray(dataset.data) && dataset.data.length > 0) {
          // Si dataset.data es un array de números
          if (typeof dataset.data[0] === 'number') {
            formattedData = dataset.data.map((point: number, index: number) => ({
              index,
              value: point,
              date: new Date(2024, 0, 1 + index).toLocaleDateString()
            }));
          } 
          // Si dataset.data es un array de arrays (dataset.data[0] sería [timestamp, value])
          else if (Array.isArray(dataset.data[0]) && dataset.data[0].length >= 2) {
            formattedData = dataset.data.map((point: number[], index: number) => ({
              index,
              value: point[1], // Segundo elemento es el valor
              date: new Date(point[0]).toLocaleDateString() // Primer elemento es timestamp
            }));
          }
          // Si dataset.data es un array de objetos
          else {
            formattedData = dataset.data.map((point: any, index: number) => ({
              index,
              value: point.value || point.y || point[1] || 0,
              date: point.date || point.timestamp || new Date(2024, 0, 1 + index).toLocaleDateString()
            }));
          }
        } else {
          // Datos de fallback si no hay datos válidos
          formattedData = Array.from({ length: dataset.length || 100 }, (_, index) => ({
            index,
            value: 50 + Math.random() * 20,
            date: new Date(2024, 0, 1 + index).toLocaleDateString()
          }));
        }
        
        setGraphData(formattedData);
        setTotalPages(Math.ceil(formattedData.length / pointsPerPage));
        setError(null);
        
        // Cargar evaluación existente si existe
        await loadExistingEvaluation(datasetId, formattedData);
        
      } catch (error: any) {
        console.error('Error al cargar dataset:', error);
        setError(error.message || 'Error al cargar el dataset');
      } finally {
        setLoading(false);
      }
    };

    if (!isAuthenticated) {
      router.push('/iniciar-sesion');
      return;
    }

    if (datasetId) {
      loadDataset();
    } else {
      setLoading(false);
    }
  }, [datasetId, isAuthenticated, router, pointsPerPage]);

  // Actualizar páginas cuando cambie pointsPerPage
  useEffect(() => {
    if (graphData.length > 0) {
      setTotalPages(Math.ceil(graphData.length / pointsPerPage));
      setCurrentPage(1);
    }
  }, [pointsPerPage, graphData.length]);

  // Filtrar los datos para la página actual
  const getCurrentPageData = () => {
    const startIndex = (currentPage - 1) * pointsPerPage;
    const endIndex = Math.min(startIndex + pointsPerPage, graphData.length);
    return graphData.slice(startIndex, endIndex);
  };
  
  // Filtrar los change points para la página actual
  const getCurrentPageChangePoints = () => {
    const startIndex = (currentPage - 1) * pointsPerPage;
    const endIndex = startIndex + pointsPerPage;
    
    return changePoints.filter(cp => 
      cp.index >= startIndex && cp.index < endIndex
    ).map(cp => ({
      ...cp,
      relativeIndex: cp.index - startIndex // Posición relativa en la página actual
    }));
  };

  // Manejar hover del mouse en la gráfica
  const handleGraphMouseMove = (event: React.MouseEvent<SVGSVGElement>) => {
    if (!graphRef.current || !currentDataset || sinChangePoint) {
      setHoverPosition(null);
      return;
    }
    
    const svg = event.currentTarget;
    const rect = svg.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const svgX = (x / rect.width) * 800;
    
    console.log('🖱️ Mouse move:', { x, svgX, rectWidth: rect.width });
    
    // Solo mostrar hover si está en el área de la gráfica
    if (svgX >= 60 && svgX <= 740) {
      const graphAreaWidth = 680;
      const relativeX = svgX - 60;
      const currentPageData = getCurrentPageData();
      
      // Encontrar el punto de datos más cercano al cursor
      const clickRatio = relativeX / graphAreaWidth;
      const exactFloatIndex = clickRatio * (currentPageData.length - 1);
      const relativeIndex = Math.round(exactFloatIndex);
      
      const startIndex = (currentPage - 1) * pointsPerPage;
      const absoluteIndex = startIndex + relativeIndex;
      
      console.log('🖱️ Mouse calculation:', {
        relativeX,
        clickRatio,
        exactFloatIndex,
        relativeIndex,
        absoluteIndex,
        currentPageDataLength: currentPageData.length
      });
      
      if (absoluteIndex >= 0 && absoluteIndex < graphData.length && relativeIndex >= 0 && relativeIndex < currentPageData.length) {
        // Usar la posición del mouse directamente para una mejor sincronización
        // pero limitarla a los puntos de datos válidos
        const snappedX = 60 + (relativeIndex / Math.max(1, currentPageData.length - 1)) * 680;
        setHoverPosition({ 
          x: snappedX, 
          index: absoluteIndex,
          mouseX: svgX // Guardar también la posición exacta del mouse
        });
      } else {
        setHoverPosition(null);
      }
    } else {
      setHoverPosition(null);
    }
  };

  const handleGraphMouseLeave = () => {
    setHoverPosition(null);
  };

  // Manejar el evento de clic en la gráfica para marcar un CP
  const handleGraphClick = (event: React.MouseEvent<SVGSVGElement>) => {
    if (!graphRef.current || !currentDataset || sinChangePoint) return;
    
    const svg = event.currentTarget;
    const rect = svg.getBoundingClientRect();
    const x = event.clientX - rect.left;
    
    // Convertir coordenadas del navegador a coordenadas del SVG
    const svgX = (x / rect.width) * 800; // 800 es el ancho del viewBox
    
    console.log('🔍 Click coordinates:', { x, svgX, rectWidth: rect.width });
    
    // Verificar que el clic esté en el área de la gráfica (entre x=60 y x=740)
    if (svgX < 60 || svgX > 740) {
      console.log('❌ Click outside graph area');
      return;
    }
    
    // Calcular el índice basado en la posición dentro del área de la gráfica
    const graphAreaWidth = 680; // 740 - 60
    const relativeX = svgX - 60; // Posición relativa al inicio del área de la gráfica
    const currentPageData = getCurrentPageData();
    
    // En lugar de interpolar, encontrar el punto de datos más cercano al clic
    const clickRatio = relativeX / graphAreaWidth;
    const exactFloatIndex = clickRatio * (currentPageData.length - 1);
    const relativeIndex = Math.round(exactFloatIndex); // Redondear al punto más cercano
    
    // Calcular el índice absoluto en el dataset completo
    const startIndex = (currentPage - 1) * pointsPerPage;
    const absoluteIndex = startIndex + relativeIndex;
    
    console.log('🔍 Index calculation:', {
      relativeX,
      graphAreaWidth,
      clickRatio,
      exactFloatIndex,
      currentPageDataLength: currentPageData.length,
      relativeIndex,
      startIndex,
      absoluteIndex,
      totalDataLength: graphData.length,
      actualDataPoint: currentPageData[relativeIndex]
    });
    
    // Verificar que el índice esté dentro del rango válido
    if (absoluteIndex >= 0 && absoluteIndex < graphData.length && relativeIndex >= 0 && relativeIndex < currentPageData.length) {
      // Verificar si ya existe un change point en un rango cercano (evitar duplicados)
      const nearby = changePoints.find(cp => 
        Math.abs(cp.index - absoluteIndex) < 1 // Reducir la tolerancia para ser más preciso
      );

      if (nearby) {
        console.log('🗑️ Removing existing change point at:', nearby.index);
        // Eliminar el change point existente si se hace clic cerca
        setChangePoints(changePoints.filter(cp => cp.index !== nearby.index));
      } else {
        console.log('✨ Creating new change point at index:', absoluteIndex);
        console.log('📍 Data point value:', currentPageData[relativeIndex]);
        // Mostrar panel para seleccionar tipo de change point
        setEditingChangePoint(absoluteIndex);
      }
    } else {
      console.log('❌ Invalid index:', { absoluteIndex, relativeIndex, validRange: [0, graphData.length - 1] });
    }
  };

  // Agregar change point con tipo específico
  const addChangePointWithType = (tipo: 'media' | 'tendencia') => {
    if (editingChangePoint === null) return;
    
    console.log('🔍 Adding change point:', { editingChangePoint, tipo });
    
    // Encontrar el valor correcto del punto en el dataset completo
    const pointData = graphData.find(point => point.index === editingChangePoint);
    
    if (!pointData) {
      console.error('❌ No se encontró data para el índice:', editingChangePoint);
      return;
    }
    
    const newCP = {
      index: editingChangePoint,
      date: pointData.date,
      value: pointData.value,
      tipo
    };
    
    console.log('✅ New change point created:', newCP);
    
    setChangePoints([...changePoints, newCP]);
    setEditingChangePoint(null);
  };

  // Función para guardar la evaluación
  const handleSaveEvaluation = async (status: 'draft' | 'completed' = 'completed') => {
    if (!currentDataset) return;
    
    try {
      console.log('🚀 Iniciando guardado de evaluación...');
      
      // Preparar los datos para enviar al backend
      const labelData = {
        datasetId: currentDataset._id,
        changePoints: sinChangePoint ? [] : changePoints.map(cp => ({
          position: cp.index,
          type: (cp.tipo === 'tendencia' ? 'trend' : 'mean') as 'mean' | 'trend' | 'variance' | 'level',
          confidence: 0.8, // Valor por defecto
          notes: `Manual evaluation - ${cp.tipo || 'mean'} change point`
        })),
        noChangePoints: sinChangePoint,
        confidence: 0.8, // Confianza por defecto para evaluación manual
        timeSpent: Math.floor(Date.now() / 1000), // Tiempo aproximado en segundos
        status: status, // Estado de la evaluación
        // Remover sessionId y currentDatasetIndex ya que son opcionales y causan problemas
      };

      console.log('📋 Datos de evaluación preparados:', labelData);
      console.log('📊 Change points a enviar:', labelData.changePoints);
      
      let response;
      if (existingEvaluation && status === 'completed') {
        // Si ya existe una evaluación, actualizarla
        response = await apiService.updateLabel(existingEvaluation._id, labelData);
        console.log('🔄 Evaluación actualizada:', response);
      } else {
        // Crear nueva evaluación
        response = await apiService.createLabel(labelData);
        console.log('✅ Nueva evaluación creada:', response);
      }
      
      // Actualizar estado local
      setExistingEvaluation(response.data);
      setEvaluationStatus(status);
      
      // Mostrar mensaje de éxito
      const actionMessage = existingEvaluation && status === 'completed' ? 'actualizada' : 
                           status === 'draft' ? 'guardada como borrador' : 'finalizada';
      
      alert(sinChangePoint ? 
        `Serie "${currentDataset.name}" marcada como sin change points y ${actionMessage}` :
        `${changePoints.length} change points para "${currentDataset.name}" ${actionMessage}`);
      
      // Solo redirigir si se completa la evaluación
      if (status === 'completed') {
        // Mark assignment as completed on the server so the assignments list shows the updated status
        try {
          await apiService.updateAssignedDatasetStatus(currentDataset._id, 'completed');
        } catch (err) {
          console.error('Error updating assignment status after completing evaluation:', err);
        }

        router.push('/evaluador/mis-datasets');
      }
      
    } catch (error: any) {
      console.error('❌ Error al guardar evaluación:', error);
      console.error('❌ Error details:', error.response?.data);
      
      let errorMessage = 'Error al guardar la evaluación';
      
      if (error.response?.data?.errors) {
        // Si hay errores de validación específicos
        const validationErrors = error.response.data.errors.map((err: any) => err.msg).join(', ');
        errorMessage = `Errores de validación: ${validationErrors}`;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      alert(errorMessage);
    }
  };

  // Manejar cambio de estado "sin change point"
  const handleSinChangePointChange = (value: boolean) => {
    setSinChangePoint(value);
    if (value) {
      setChangePoints([]); // Limpiar change points si se marca "sin change point"
    }
  };

  // Pantallas de estado
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando dataset...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => router.push('/evaluador/mis-datasets')}
            className="text-blue-600 hover:text-blue-800"
          >
            Volver a mis datasets
          </button>
        </div>
      </div>
    );
  }

  if (!datasetId) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Evaluación Manual</h1>
            <p className="text-gray-600">Selecciona un dataset para comenzar la evaluación</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="mb-6">
              <svg className="mx-auto h-24 w-24 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              No hay dataset seleccionado
            </h2>
            
            <p className="text-gray-600 mb-6">
              Para comenzar una evaluación manual, necesitas seleccionar un dataset de tu lista de asignaciones.
            </p>
            
            <button 
              onClick={() => router.push('/evaluador/mis-datasets')}
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              Ver mis datasets asignados
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!currentDataset) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Dataset no encontrado</h1>
          <button 
            onClick={() => router.push('/evaluador/mis-datasets')}
            className="text-blue-600 hover:text-blue-800"
          >
            Volver a mis datasets
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <ManualEvaluationHeader 
        datasetName={currentDataset.name}
        description={currentDataset.description}
        expectedChangePoints={currentDataset.expectedChangePoints}
        currentChangePoints={changePoints.length}
        user={user || undefined}
        onBack={() => router.push('/evaluador/mis-datasets')}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Instrucciones principales */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-3">
            Instrucciones para el Etiquetado
          </h3>
          <p className="text-blue-700 mb-4">
            Analiza cuidadosamente la serie temporal y marca los puntos donde observes un cambio significativo 
            en el comportamiento. Si no detectas ningún change point, marca la casilla correspondiente.
          </p>
          <div className="bg-blue-100 rounded-lg p-4">
            <p className="text-blue-800 font-medium text-sm">
              💡 <strong>Recuerda:</strong> Haz clic directamente en la gráfica donde veas el cambio. 
              Se te pedirá que especifiques si es un change point en la media o en la tendencia.
            </p>
          </div>
        </div>

        {/* Información del dataset */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Puntos Totales</h3>
              <p className="text-2xl font-bold text-blue-600">{graphData.length}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Change Points Esperados</h3>
              <p className="text-2xl font-bold text-orange-600">{currentDataset.expectedChangePoints}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Change Points Marcados</h3>
              <p className="text-2xl font-bold text-green-600">{changePoints.length}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Estado Evaluación</h3>
              <p className={`text-2xl font-bold ${
                evaluationStatus === 'completed' ? 'text-green-600' :
                evaluationStatus === 'draft' ? 'text-yellow-600' :
                'text-purple-600'
              }`}>
                {evaluationStatus === 'completed' ? '✅ Completada' :
                 evaluationStatus === 'draft' ? '📝 Borrador' :
                 '🆕 Nueva'}
              </p>
            </div>
          </div>
          
          {/* Mensaje informativo sobre evaluación existente */}
          {existingEvaluation && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-blue-800 font-medium">
                  Se encontró una evaluación previa para este dataset.
                </span>
              </div>
              <p className="text-blue-700 text-sm mt-1 ml-7">
                Los change points marcados previamente han sido cargados. Puedes modificarlos y guardar como borrador o finalizar la evaluación.
              </p>
            </div>
          )}
        </div>

        {/* Controles superiores */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center mb-4">
            <div className="flex items-center">
              <span className="text-sm text-gray-600 mr-2">Puntos por página:</span>
              <select
                value={pointsPerPage}
                onChange={(e) => setPointsPerPage(Number(e.target.value))}
                className="rounded border-gray-300 text-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value={50}>50</option>
                <option value={100}>100</option>
                <option value={200}>200</option>
              </select>
            </div>

            {/* Controles de escala */}
            <div className="flex items-center space-x-6">
              <div className="flex items-center">
                <span className="text-sm text-gray-600 mr-3">Escala Y:</span>
                <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setEscalaY(prev => Math.max(0.2, prev - 0.2))}
                    className="w-7 h-7 bg-white hover:bg-gray-50 rounded flex items-center justify-center text-sm font-bold transition-colors shadow-sm"
                    title="Reducir escala (zoom out)"
                  >
                    −
                  </button>
                  <span className="text-sm font-semibold w-14 text-center bg-white rounded px-2 py-1">
                    {escalaY.toFixed(1)}x
                  </span>
                  <button
                    onClick={() => setEscalaY(prev => Math.min(5, prev + 0.2))}
                    className="w-7 h-7 bg-white hover:bg-gray-50 rounded flex items-center justify-center text-sm font-bold transition-colors shadow-sm"
                    title="Aumentar escala (zoom in)"
                  >
                    +
                  </button>
                </div>
              </div>
              
              <button
                onClick={() => {
                  setEscalaY(1);
                  setOffsetY(0);
                }}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
                title="Restablecer escala y posición"
              >
                ⟲ Reset
              </button>
            </div>
            
            <div className="ml-auto">
              <GraphPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                // totalPoints={graphData.length}
              />
            </div>
          </div>

          {/* Opción sin change point */}
          <div className="mb-4 p-4 bg-gray-50 rounded-lg">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={sinChangePoint}
                onChange={(e) => handleSinChangePointChange(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="text-gray-700 font-medium">
                Esta serie no presenta change points
              </span>
            </label>
            {sinChangePoint && (
              <p className="text-sm text-gray-600 mt-2 ml-7">
                Ha indicado que esta serie temporal no contiene change points detectables.
              </p>
            )}
          </div>

          {/* Lista de change points marcados */}
          {changePoints.length > 0 && !sinChangePoint && (
            <div className="mb-4 p-4 bg-green-50 rounded-lg border border-green-200">
              <h4 className="text-sm font-semibold text-green-800 mb-3">
                Change Points Identificados ({changePoints.length})
              </h4>
              <div className="space-y-2">
                {changePoints.map((cp) => (
                  <div key={cp.index} className="flex items-center justify-between bg-white p-2 rounded border">
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-medium text-gray-700">
                        Punto {cp.index}
                      </span>
                      <span className="text-xs text-gray-500">
                        Valor: {cp.value?.toFixed(2)}
                      </span>
                      {cp.tipo && (
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          cp.tipo === 'media' ? 'bg-blue-100 text-blue-800' :
                          'bg-purple-100 text-purple-800'
                        }`}>
                          {cp.tipo === 'media' ? 'Media' : 'Tendencia'}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => setChangePoints(changePoints.filter(point => point.index !== cp.index))}
                      className="text-red-500 hover:text-red-700 text-sm font-medium px-2 py-1 rounded hover:bg-red-50"
                      title={`Eliminar change point en posición ${cp.index}`}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Área del gráfico */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Serie Temporal - Puntos {(currentPage - 1) * pointsPerPage + 1} a {Math.min(currentPage * pointsPerPage, graphData.length)}
            </h3>
            <div className="text-sm text-gray-600">
              Haz clic en la gráfica para marcar change points
            </div>
          </div>
          
          <div 
            ref={graphRef}
            className="relative"
          >
            <svg 
              width="100%" 
              height="400" 
              viewBox="0 0 800 400" 
              className="border rounded bg-gradient-to-b from-gray-50 to-white cursor-crosshair"
              onClick={handleGraphClick}
              onMouseMove={handleGraphMouseMove}
              onMouseLeave={handleGraphMouseLeave}
            >
              {/* Definir gradientes */}
              <defs>
                <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.8"/>
                  <stop offset="100%" stopColor="#1E40AF" stopOpacity="1"/>
                </linearGradient>
                <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
                  <feDropShadow dx="0" dy="1" stdDeviation="1" floodOpacity="0.3"/>
                </filter>
              </defs>
              
              {/* Área de fondo de la gráfica */}
              <rect x="60" y="40" width="680" height="310" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1" rx="4"/>
              
              {/* Líneas de cuadrícula */}
              <g stroke="#E5E7EB" strokeWidth="1" opacity="0.6">
                <line x1="60" y1="100" x2="740" y2="100" strokeDasharray="2,4" />
                <line x1="60" y1="165" x2="740" y2="165" strokeDasharray="2,4" />
                <line x1="60" y1="230" x2="740" y2="230" strokeDasharray="2,4" />
                <line x1="60" y1="295" x2="740" y2="295" strokeDasharray="2,4" />
                
                {/* Líneas verticales */}
                <line x1="230" y1="40" x2="230" y2="350" strokeDasharray="2,4" />
                <line x1="400" y1="40" x2="400" y2="350" strokeDasharray="2,4" />
                <line x1="570" y1="40" x2="570" y2="350" strokeDasharray="2,4" />
              </g>
              
              {/* Ejes principales */}
              <line x1="60" y1="350" x2="740" y2="350" stroke="#374151" strokeWidth="2"/>
              <line x1="60" y1="40" x2="60" y2="350" stroke="#374151" strokeWidth="2"/>
              
              {/* Etiquetas del eje Y */}
              <g className="text-xs fill-gray-600" fontFamily="system-ui">
                <text x="50" y="355">{Math.round(0 * escalaY + offsetY)}</text>
                <text x="50" y="295">{Math.round(25 * escalaY + offsetY)}</text>
                <text x="50" y="235">{Math.round(50 * escalaY + offsetY)}</text>
                <text x="50" y="175">{Math.round(75 * escalaY + offsetY)}</text>
                <text x="50" y="115">{Math.round(100 * escalaY + offsetY)}</text>
                <text x="50" y="55">{Math.round(125 * escalaY + offsetY)}</text>
              </g>
              
              {/* Etiquetas del eje X */}
              <g className="text-xs fill-gray-600" fontFamily="system-ui">
                <text x="60" y="370" textAnchor="middle">0</text>
                <text x="230" y="370" textAnchor="middle">{Math.round(pointsPerPage * 0.25)}</text>
                <text x="400" y="370" textAnchor="middle">{Math.round(pointsPerPage * 0.5)}</text>
                <text x="570" y="370" textAnchor="middle">{Math.round(pointsPerPage * 0.75)}</text>
                <text x="740" y="370" textAnchor="middle">{pointsPerPage}</text>
              </g>
              
              {/* Etiquetas de ejes */}
              <text x="400" y="390" textAnchor="middle" className="text-sm fill-gray-700 font-medium">Tiempo (índice)</text>
              <text x="25" y="195" textAnchor="middle" className="text-sm fill-gray-700 font-medium" transform="rotate(-90 25 195)">Valor</text>
                
              {/* Línea de datos principal */}
              {getCurrentPageData().length > 1 && (
                <>
                  {/* Área de relleno debajo de la línea */}
                  <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.1"/>
                    <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.02"/>
                  </linearGradient>
                  
                  {/* Línea principal */}
                  <polyline 
                    points={getCurrentPageData().map((point, index) => {
                      const x = 60 + (index / Math.max(1, getCurrentPageData().length - 1)) * 680;
                      const minValue = Math.min(...getCurrentPageData().map(d => d.value));
                      const maxValue = Math.max(...getCurrentPageData().map(d => d.value));
                      const normalizedValue = maxValue === minValue ? 0.5 : (point.value - minValue) / (maxValue - minValue);
                      const scaledValue = normalizedValue * escalaY;
                      const y = 350 - (scaledValue * 310) + offsetY;
                      return `${x},${Math.max(40, Math.min(350, y))}`;
                    }).join(' ')} 
                    fill="none" 
                    stroke="url(#lineGradient)" 
                    strokeWidth="2.5"
                    filter="url(#shadow)"
                  />
                </>
              )}
              
              {/* Puntos de datos */}
              {getCurrentPageData().map((point, index) => {
                const x = 60 + (index / Math.max(1, getCurrentPageData().length - 1)) * 680;
                const minValue = Math.min(...getCurrentPageData().map(d => d.value));
                const maxValue = Math.max(...getCurrentPageData().map(d => d.value));
                const normalizedValue = maxValue === minValue ? 0.5 : (point.value - minValue) / (maxValue - minValue);
                const scaledValue = normalizedValue * escalaY;
                const y = Math.max(40, Math.min(350, 350 - (scaledValue * 310) + offsetY));
                
                // Verificar si este punto está siendo señalado por el hover
                const startIndex = (currentPage - 1) * pointsPerPage;
                const absoluteIndex = startIndex + index;
                const isHovered = hoverPosition && hoverPosition.index === absoluteIndex;
                
                return (
                  <g key={index}>
                    {/* Círculo de fondo expandido para hover */}
                    {isHovered && (
                      <circle 
                        cx={x} 
                        cy={y} 
                        r="12" 
                        fill="#10B981"
                        opacity="0.2"
                        className="animate-pulse"
                      />
                    )}
                    {/* Círculo principal */}
                    <circle 
                      cx={x} 
                      cy={y} 
                      r={isHovered ? "6" : "4"} 
                      fill={isHovered ? "#FFFFFF" : "#FFFFFF"}
                      stroke={isHovered ? "#059669" : "#3B82F6"}
                      strokeWidth={isHovered ? "3" : "2"}
                      className="transition-all duration-150 cursor-pointer"
                      filter="url(#shadow)"
                    />
                    {/* Círculo interior */}
                    <circle 
                      cx={x} 
                      cy={y} 
                      r={isHovered ? "3" : "2"} 
                      fill={isHovered ? "#059669" : "#3B82F6"}
                      className="pointer-events-none transition-all duration-150"
                    />
                    {/* Etiqueta del valor para punto hover */}
                    {isHovered && (
                      <g>
                        <rect
                          x={x - 25}
                          y={y - 25}
                          width="50"
                          height="16"
                          fill="#059669"
                          rx="8"
                          filter="url(#shadow)"
                        />
                        <text 
                          x={x} 
                          y={y - 13} 
                          textAnchor="middle" 
                          className="text-xs fill-white font-medium"
                          fontFamily="system-ui"
                        >
                          {point.value.toFixed(1)}
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}
                
              {/* Change points marcados */}
              {getCurrentPageChangePoints().map((cp) => {
                const currentPageData = getCurrentPageData();
                const startIndex = (currentPage - 1) * pointsPerPage;
                const relativeIndex = cp.index - startIndex;
                
                // Verificar que el change point está en la página actual
                if (relativeIndex < 0 || relativeIndex >= currentPageData.length) {
                  return null;
                }
                
                // Calcular posición X exacta basada en el índice relativo
                const x = 60 + (relativeIndex / Math.max(1, currentPageData.length - 1)) * 680;
                
                // Encontrar el punto de datos correspondiente en la página actual
                const pointInCurrentPage = currentPageData[relativeIndex];
                if (!pointInCurrentPage) {
                  console.warn('⚠️ No se encontró punto de datos para relativeIndex:', relativeIndex);
                  return null;
                }
                
                // Calcular posición Y basada en el valor real del punto
                const minValue = Math.min(...currentPageData.map(d => d.value));
                const maxValue = Math.max(...currentPageData.map(d => d.value));
                const normalizedValue = maxValue === minValue ? 0.5 : (pointInCurrentPage.value - minValue) / (maxValue - minValue);
                const scaledValue = normalizedValue * escalaY;
                const y = Math.max(40, Math.min(350, 350 - (scaledValue * 310) + offsetY));
                
                console.log('🎯 Rendering change point:', {
                  cpIndex: cp.index,
                  startIndex,
                  relativeIndex,
                  x,
                  y,
                  value: pointInCurrentPage.value,
                  pageDataLength: currentPageData.length
                });
                
                const tipoColors = {
                  media: { fill: '#EF4444', stroke: '#DC2626', bg: '#FEE2E2' },
                  tendencia: { fill: '#8B5CF6', stroke: '#7C3AED', bg: '#F3E8FF' }
                };
                
                const colors = tipoColors[cp.tipo || 'media'];
                
                return (
                  <g key={cp.index}>
                    {/* Línea vertical indicadora */}
                    <line 
                      x1={x} 
                      y1="40" 
                      x2={x} 
                      y2="350" 
                      stroke={colors.fill} 
                      strokeWidth="3" 
                      strokeDasharray="6,4"
                      opacity="0.8"
                    />
                    
                    {/* Círculo exterior */}
                    <circle 
                      cx={x} 
                      cy={y} 
                      r="14" 
                      fill={colors.bg} 
                      stroke={colors.stroke}
                      strokeWidth="3"
                      filter="url(#shadow)"
                    />
                    
                    {/* Círculo interior */}
                    <circle 
                      cx={x} 
                      cy={y} 
                      r="10" 
                      fill={colors.fill} 
                      stroke="#FFFFFF"
                      strokeWidth="2"
                    />
                    
                    {/* Texto CP */}
                    <text 
                      x={x} 
                      y={y + 2} 
                      textAnchor="middle" 
                      className="text-xs fill-white font-bold"
                      fontFamily="system-ui"
                    >
                      CP
                    </text>
                    
                    {/* Etiqueta del tipo */}
                    {cp.tipo && (
                      <g>
                        <rect
                          x={x - 25}
                          y={y - 40}
                          width="50"
                          height="18"
                          fill={colors.fill}
                          rx="9"
                          filter="url(#shadow)"
                        />
                        <text 
                          x={x} 
                          y={y - 28} 
                          textAnchor="middle" 
                          className="text-xs fill-white font-medium"
                          fontFamily="system-ui"
                        >
                          {cp.tipo.charAt(0).toUpperCase() + cp.tipo.slice(1)}
                        </text>
                      </g>
                    )}
                    
                    {/* Etiqueta del índice */}
                    <g>
                      <rect
                        x={x - 15}
                        y={y + 20}
                        width="30"
                        height="16"
                        fill="#374151"
                        rx="8"
                        filter="url(#shadow)"
                      />
                      <text 
                        x={x} 
                        y={y + 31} 
                        textAnchor="middle" 
                        className="text-xs fill-white font-medium"
                        fontFamily="system-ui"
                      >
                        {cp.index}
                      </text>
                    </g>
                  </g>
                );
              })}
              
              {/* Indicador de hover */}
              {hoverPosition && !sinChangePoint && (
                <g>
                  {/* Línea vertical que sigue el mouse */}
                  <line 
                    x1={hoverPosition.mouseX || hoverPosition.x} 
                    y1="40" 
                    x2={hoverPosition.mouseX || hoverPosition.x} 
                    y2="350" 
                    stroke="#10B981" 
                    strokeWidth="1" 
                    strokeDasharray="3,3"
                    opacity="0.6"
                  />
                  {/* Línea vertical del punto más cercano */}
                  <line 
                    x1={hoverPosition.x} 
                    y1="40" 
                    x2={hoverPosition.x} 
                    y2="350" 
                    stroke="#059669" 
                    strokeWidth="2" 
                    strokeDasharray="5,2"
                    opacity="0.8"
                  />
                  {/* Etiqueta del índice */}
                  <g>
                    <rect
                      x={hoverPosition.x - 20}
                      y="15"
                      width="40"
                      height="18"
                      fill="#059669"
                      rx="9"
                      filter="url(#shadow)"
                    />
                    <text 
                      x={hoverPosition.x} 
                      y="27" 
                      textAnchor="middle" 
                      className="text-xs fill-white font-medium"
                      fontFamily="system-ui"
                    >
                      #{hoverPosition.index}
                    </text>
                  </g>
                </g>
              )}
              
              {/* Indicador de área clicable */}
              <rect 
                x="60" 
                y="40" 
                width="680" 
                height="310" 
                fill="transparent" 
                className="cursor-crosshair"
              />
            </svg>
            
            {/* Instrucciones y estado */}
            <div className="absolute top-2 right-2 bg-white bg-opacity-95 p-3 rounded-lg text-xs text-gray-700 border shadow-sm">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Haga clic en la gráfica para marcar change points</span>
                </div>
                {hoverPosition && (
                  <div className="flex items-center space-x-2 text-green-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span>Punto más cercano: #{hoverPosition.index}</span>
                  </div>
                )}
                {changePoints.length > 0 && (
                  <div className="flex items-center space-x-2 text-orange-600">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span>{changePoints.length} CP(s) marcados</span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Indicador de modo activo */}
            {!sinChangePoint && (
              <div className="absolute bottom-2 left-2 bg-blue-50 bg-opacity-95 p-2 rounded text-xs text-blue-700 border border-blue-200">
                <div className="flex items-center space-x-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Modo de marcado activo</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Botones de acción */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              {sinChangePoint ? 
                "Ha indicado que no hay change points en esta serie" :
                `Total de change points marcados: ${changePoints.length}`
              }
              {existingEvaluation && (
                <div className="mt-1">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    evaluationStatus === 'completed' ? 'bg-green-100 text-green-800' :
                    evaluationStatus === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {evaluationStatus === 'completed' ? '✅ Evaluación Completada' :
                     evaluationStatus === 'draft' ? '📝 Borrador' :
                     '🆕 Nueva Evaluación'}
                  </span>
                </div>
              )}
            </div>
            
            <div className="flex space-x-4">
              <button
                onClick={() => {
                  setChangePoints([]);
                  setSinChangePoint(false);
                }}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
              >
                Limpiar Todo
              </button>
              
              {/* Botón para guardar como borrador */}
              {evaluationStatus !== 'completed' && (
                <button
                  onClick={() => handleSaveEvaluation('draft')}
                  className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                  disabled={!sinChangePoint && changePoints.length === 0}
                  title="Guardar progreso sin finalizar"
                >
                  💾 Guardar Borrador
                </button>
              )}
              
              {/* Botón para finalizar evaluación */}
              <button
                onClick={() => handleSaveEvaluation('completed')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                disabled={!sinChangePoint && changePoints.length === 0}
                title={!sinChangePoint && changePoints.length === 0 ? 'Debe marcar al menos un change point o indicar que no hay ninguno' : 'Finalizar evaluación'}
              >
                {existingEvaluation && evaluationStatus === 'completed' ? 
                  '🔄 Actualizar Evaluación' : 
                  '✅ Terminar Evaluación'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Panel lateral para seleccionar tipo de change point */}
      {editingChangePoint !== null && (
        <div className="fixed right-0 top-16 h-[calc(100vh-4rem)] w-80 bg-white shadow-xl transform transition-transform z-50 border-l border-gray-200 overflow-hidden">
          <div className="flex flex-col h-full">
            {/* Header del panel */}
            <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-800">
                  Tipo de Change Point
                </h3>
                <button
                  onClick={() => setEditingChangePoint(null)}
                  className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <p className="text-xs text-gray-600 mt-1">
                Posición: <span className="font-medium text-blue-600">{editingChangePoint}</span>
              </p>
            </div>
            
            {/* Contenido del panel */}
            <div className="flex-1 overflow-y-auto p-4">
              <p className="text-gray-700 mb-4 text-sm leading-relaxed">
                Seleccione el tipo que mejor describe el cambio observado:
              </p>
              
              <div className="space-y-3">
                <button
                  onClick={() => addChangePointWithType('media')}
                  className="group w-full text-left p-3 rounded-lg border-2 border-blue-200 hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 hover:shadow-sm"
                >
                  <div className="flex items-start space-x-2">
                    <div className="w-2.5 h-2.5 bg-blue-500 rounded-full mt-1 group-hover:scale-110 transition-transform"></div>
                    <div>
                      <div className="font-semibold text-blue-800 text-sm mb-0.5">Change Point en Media</div>
                      <div className="text-xs text-blue-600 leading-relaxed">
                        Cambio abrupto en el nivel promedio
                      </div>
                    </div>
                  </div>
                </button>
                
                <button
                  onClick={() => addChangePointWithType('tendencia')}
                  className="group w-full text-left p-3 rounded-lg border-2 border-purple-200 hover:border-purple-400 hover:bg-purple-50 transition-all duration-200 hover:shadow-sm"
                >
                  <div className="flex items-start space-x-2">
                    <div className="w-2.5 h-2.5 bg-purple-500 rounded-full mt-1 group-hover:scale-110 transition-transform"></div>
                    <div>
                      <div className="font-semibold text-purple-800 text-sm mb-0.5">Change Point en Tendencia</div>
                      <div className="text-xs text-purple-600 leading-relaxed">
                        Cambio en la dirección o pendiente
                      </div>
                    </div>
                  </div>
                </button>
              </div>
              
              {/* Información adicional */}
              <div className="mt-6 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-start space-x-2">
                  <svg className="w-4 h-4 text-blue-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <h4 className="font-medium text-gray-800 text-xs mb-1">Consejo</h4>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      Observe el comportamiento antes y después del punto marcado.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Footer del panel */}
            <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => setEditingChangePoint(null)}
                className="w-full px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-lg transition-colors text-xs font-medium"
              >
                Cancelar Selección
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ManualEvaluationPageWrapper() {
  return (
    <Suspense fallback={<div>Cargando evaluación manual...</div>}>
      <ManualEvaluationPage />
    </Suspense>
  );
}

export default ManualEvaluationPageWrapper;
