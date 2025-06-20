"use client";

import { useState, useRef, useEffect } from "react";
import ManualEvaluationHeader from "./components/ManualEvaluationHeader";
import GraphPagination from "./components/GraphPagination";

// Define an interface for your dataset structure
interface Dataset {
  id: number;
  name: string;
  points: number;
  status: "pendiente" | "en_progreso" | "completado";
}

// Define an interface for change points
interface ChangePoint {
  index: number;
  date?: string;
  value: number;
  relativeIndex?: number;
  tipo?: 'media' | 'tendencia';
}

export default function ManualEvaluationPage() {  // Estado para los datasets disponibles
  const [datasets, setDatasets] = useState<Dataset[]>([
    { id: 1, name: "Serie 1", points: 840, status: "pendiente" },
    { id: 2, name: "Serie 2", points: 365, status: "completado" },
    { id: 3, name: "Serie 3", points: 720, status: "en_progreso" },
    { id: 4, name: "Serie 4", points: 450, status: "pendiente" },
    { id: 5, name: "Serie 5", points: 1200, status: "pendiente" },
  ]);
  
  // Dataset actual seleccionado
  const [currentDataset, setCurrentDataset] = useState<Dataset | null>(null);
    // Estado para los change points marcados manualmente
  const [changePoints, setChangePoints] = useState<ChangePoint[]>([]);
    // Estado para indicar que no hay change points
  const [sinChangePoint, setSinChangePoint] = useState(false);
  
  // Estado para el change point siendo editado
  const [editingChangePoint, setEditingChangePoint] = useState<number | null>(null);
  
  // Estado para la paginación de la gráfica
  const [currentPage, setCurrentPage] = useState(1);
  const [pointsPerPage, setPointsPerPage] = useState(100);
  const [totalPages, setTotalPages] = useState(1);
  
  // Estados para el control de escala
  const [escalaY, setEscalaY] = useState(1);
  const [offsetY, setOffsetY] = useState(0);
  
  // Datos simulados para la gráfica
  const [graphData, setGraphData] = useState<{index: number; value: number; date: string}[]>([]);
  
  const graphRef = useRef<HTMLDivElement>(null);
  
  // Generar datos simulados al cargar un dataset
  useEffect(() => {
    if (currentDataset) {
      generateMockData(currentDataset.points);
      setTotalPages(Math.ceil(currentDataset.points / pointsPerPage));
      setCurrentPage(1);
      setChangePoints([]);
    }
  }, [currentDataset, pointsPerPage]);
  
  // Generar datos simulados
  const generateMockData = (points: number) => {
    const data = [];
    let value = 50 + Math.random() * 20;
    
    for (let i = 0; i < points; i++) {
      // Simular algunos change points para propósitos de demostración
      if (i % 120 === 0 && i > 0) {
        value = Math.max(10, Math.min(90, value + (Math.random() > 0.5 ? 25 : -25)));
      }
      
      // Añadir algo de ruido aleatorio
      value += (Math.random() - 0.5) * 3;
      value = Math.max(0, Math.min(100, value));
      
      data.push({
        index: i,
        value: value,
        date: new Date(2020, 0, 1 + i).toISOString().split('T')[0]
      });
    }
    
    setGraphData(data);
  };  // Manejar el evento de clic en la gráfica para marcar un CP
  const handleGraphClick = (event: React.MouseEvent<SVGSVGElement>) => {
    if (!graphRef.current || !currentDataset || sinChangePoint) return;
    
    const svg = event.currentTarget;
    const rect = svg.getBoundingClientRect();
    const x = event.clientX - rect.left;
    
    // Convertir coordenadas del navegador a coordenadas del SVG
    const svgX = (x / rect.width) * 800; // 800 es el ancho del viewBox
    
    // Verificar que el clic esté en el área de la gráfica (entre x=60 y x=740)
    if (svgX < 60 || svgX > 740) return;
    
    // Calcular el índice basado en la posición dentro del área de la gráfica
    const graphAreaWidth = 680; // 740 - 60
    const relativeX = svgX - 60; // Posición relativa al inicio del área de la gráfica
    const relativeIndex = Math.round((relativeX / graphAreaWidth) * (pointsPerPage - 1));
    
    // Calcular el índice en el dataset completo
    const startIndex = (currentPage - 1) * pointsPerPage;
    const clickedIndex = startIndex + relativeIndex;
    
    // Verificar que el índice esté dentro del rango válido
    if (clickedIndex >= 0 && clickedIndex < currentDataset.points && relativeIndex >= 0 && relativeIndex < getCurrentPageData().length) {
      // Verificar si ya existe un change point en un rango cercano (evitar duplicados)
      const nearby = changePoints.find(cp => 
        Math.abs(cp.index - clickedIndex) < 3
      );

      if (nearby) {
        // Eliminar el change point existente si se hace clic cerca
        setChangePoints(changePoints.filter(cp => cp.index !== nearby.index));
      } else {
        // Mostrar panel para seleccionar tipo de change point
        setEditingChangePoint(clickedIndex);
      }
    }
  };  // Agregar change point con tipo específico
  const addChangePointWithType = (tipo: 'media' | 'tendencia') => {
    if (editingChangePoint === null) return;
    
    // Encontrar el valor correcto del punto
    const pointData = graphData.find(point => point.index === editingChangePoint);
    const value = pointData ? pointData.value : 50; // Valor por defecto si no se encuentra
    const date = pointData ? pointData.date : '';
    
    const newCP = {
      index: editingChangePoint,
      date: date,
      value: value,
      tipo
    };
    
    setChangePoints([...changePoints, newCP]);
    setEditingChangePoint(null);
  };

  // Manejar cambio de estado "sin change point"
  const handleSinChangePointChange = (value: boolean) => {
    setSinChangePoint(value);
    if (value) {
      setChangePoints([]); // Limpiar change points si se marca "sin change point"
    }
  };
  
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

  return (    <div className="min-h-screen bg-gray-50 pt-16">
      <ManualEvaluationHeader />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!currentDataset ? (
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-xl font-medium text-gray-700 mb-6">Series Temporales Disponibles para Etiquetar</h2>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Serie</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Puntos</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {datasets.map((dataset) => (
                    <tr key={dataset.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{dataset.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{dataset.points}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {dataset.status === "completado" && (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Completado
                          </span>
                        )}
                        {dataset.status === "en_progreso" && (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                            En progreso
                          </span>
                        )}
                        {dataset.status === "pendiente" && (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                            Pendiente
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">                        <button
                          onClick={() => setCurrentDataset(dataset)}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          Etiquetar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>        ) : (
          <div className="space-y-6">            {/* Instrucciones principales */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-blue-800 mb-3">
                Instrucciones para el Etiquetado
              </h3>
              <p className="text-blue-700 mb-4">
                Analiza cuidadosamente la serie temporal y marca los puntos donde observes un cambio significativo 
                en el comportamiento. Aplica los conocimientos adquiridos durante la capacitación para identificar 
                change points en la media o tendencia. Si no detectas ningún change point, marca la casilla correspondiente.
              </p>
              <div className="bg-blue-100 rounded-lg p-4">
                <p className="text-blue-800 font-medium text-sm">
                  💡 <strong>Recuerda:</strong> Haz clic directamente en la gráfica donde veas el cambio. 
                  Se te pedirá que especifiques si es un change point en la media o en la tendencia.
                </p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-xl font-medium text-gray-700">{currentDataset.name}</h2>                  <p className="text-sm text-gray-500">
                    Marca los change points que detectes en esta serie temporal
                  </p>
                </div>
                <button
                  onClick={() => setCurrentDataset(null)}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Volver a la lista
                </button>
              </div>
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
                  <div className="flex items-center">
                  <span className="text-sm text-gray-600 mr-2">Change Points marcados:</span>
                  <span className="text-sm font-medium text-blue-600">{changePoints.length}</span>
                </div>
                  {/* Controles de escala mejorados */}
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
                  
                  <div className="flex items-center">
                    <span className="text-sm text-gray-600 mr-3">Posición Y:</span>
                    <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
                      <button
                        onClick={() => setOffsetY(prev => prev - 5)}
                        className="w-7 h-7 bg-white hover:bg-gray-50 rounded flex items-center justify-center text-xs font-bold transition-colors shadow-sm"
                        title="Mover hacia abajo"
                      >
                        ↓
                      </button>
                      <span className="text-sm font-semibold w-12 text-center bg-white rounded px-2 py-1">
                        {offsetY > 0 ? '+' : ''}{offsetY}
                      </span>
                      <button
                        onClick={() => setOffsetY(prev => prev + 5)}
                        className="w-7 h-7 bg-white hover:bg-gray-50 rounded flex items-center justify-center text-xs font-bold transition-colors shadow-sm"
                        title="Mover hacia arriba"
                      >
                        ↑
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
                  </h4>                  <div className="space-y-2">
                    {changePoints.map((cp) => (
                      <div key={cp.index} className="flex items-center justify-between bg-white p-2 rounded border">
                        <div className="flex items-center space-x-3">
                          <span className="text-sm font-medium text-gray-700">
                            Punto {cp.index}
                          </span>                          {cp.tipo && (
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
                          className="text-red-500 hover:text-red-700 text-sm"
                        >
                          Eliminar
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}                {/* Área del gráfico */}
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div 
                  ref={graphRef}
                  className="relative"
                >
                  <svg 
                    width="100%" 
                    height="350" 
                    viewBox="0 0 800 350" 
                    className="border rounded bg-gradient-to-b from-gray-50 to-white cursor-crosshair"
                    onClick={handleGraphClick}
                  >
                    {/* Definir gradientes para mejor visualización */}
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
                    <rect x="60" y="40" width="680" height="260" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1" rx="4"/>
                    
                    {/* Líneas de cuadrícula mejoradas */}
                    <g stroke="#E5E7EB" strokeWidth="1" opacity="0.6">
                      <line x1="60" y1="95" x2="740" y2="95" strokeDasharray="2,4" />
                      <line x1="60" y1="150" x2="740" y2="150" strokeDasharray="2,4" />
                      <line x1="60" y1="205" x2="740" y2="205" strokeDasharray="2,4" />
                      <line x1="60" y1="260" x2="740" y2="260" strokeDasharray="2,4" />
                      
                      {/* Líneas verticales */}
                      <line x1="230" y1="40" x2="230" y2="300" strokeDasharray="2,4" />
                      <line x1="400" y1="40" x2="400" y2="300" strokeDasharray="2,4" />
                      <line x1="570" y1="40" x2="570" y2="300" strokeDasharray="2,4" />
                    </g>
                    
                    {/* Ejes principales */}
                    <line x1="60" y1="300" x2="740" y2="300" stroke="#374151" strokeWidth="2"/>
                    <line x1="60" y1="40" x2="60" y2="300" stroke="#374151" strokeWidth="2"/>
                    
                    {/* Etiquetas del eje Y mejoradas con escala */}
                    <g className="text-xs fill-gray-600" fontFamily="system-ui">
                      <text x="50" y="305" textAnchor="end">{(0 * escalaY + offsetY).toFixed(1)}</text>
                      <text x="50" y="265" textAnchor="end">{(25 * escalaY + offsetY).toFixed(1)}</text>
                      <text x="50" y="210" textAnchor="end">{(50 * escalaY + offsetY).toFixed(1)}</text>
                      <text x="50" y="155" textAnchor="end">{(75 * escalaY + offsetY).toFixed(1)}</text>
                      <text x="50" y="100" textAnchor="end">{(100 * escalaY + offsetY).toFixed(1)}</text>
                      <text x="50" y="45" textAnchor="end">{(125 * escalaY + offsetY).toFixed(1)}</text>
                    </g>
                    
                    {/* Etiquetas del eje X */}
                    <g className="text-xs fill-gray-600" fontFamily="system-ui">
                      <text x="60" y="320" textAnchor="middle">0</text>
                      <text x="230" y="320" textAnchor="middle">{Math.round(pointsPerPage * 0.25)}</text>
                      <text x="400" y="320" textAnchor="middle">{Math.round(pointsPerPage * 0.5)}</text>
                      <text x="570" y="320" textAnchor="middle">{Math.round(pointsPerPage * 0.75)}</text>
                      <text x="740" y="320" textAnchor="middle">{pointsPerPage}</text>
                    </g>
                    
                    {/* Etiquetas de ejes */}
                    <text x="400" y="340" textAnchor="middle" className="text-sm fill-gray-700 font-medium">Tiempo (índice)</text>
                    <text x="25" y="170" textAnchor="middle" className="text-sm fill-gray-700 font-medium" transform="rotate(-90 25 170)">Valor</text>
                      
                    {/* Línea de datos principal con escala mejorada */}
                    {getCurrentPageData().length > 1 && (
                      <>
                        {/* Área de relleno debajo de la línea */}
                        <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.1"/>
                          <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.02"/>
                        </linearGradient>
                        
                        <polygon
                          points={`60,300 ${getCurrentPageData().map((point, index) => {
                            const x = 60 + (index / (getCurrentPageData().length - 1)) * 680;
                            const baseValue = point.value;
                            const scaledValue = (baseValue - 50) * escalaY + 50 + offsetY;
                            const y = 300 - (scaledValue / 100) * 260;
                            return `${x},${Math.max(40, Math.min(300, y))}`;
                          }).join(' ')} 740,300`}
                          fill="url(#areaGradient)"
                        />
                        
                        {/* Línea principal */}
                        <polyline 
                          points={getCurrentPageData().map((point, index) => {
                            const x = 60 + (index / (getCurrentPageData().length - 1)) * 680;
                            const baseValue = point.value;
                            const scaledValue = (baseValue - 50) * escalaY + 50 + offsetY;
                            const y = 300 - (scaledValue / 100) * 260;
                            return `${x},${Math.max(40, Math.min(300, y))}`;
                          }).join(' ')} 
                          fill="none" 
                          stroke="url(#lineGradient)" 
                          strokeWidth="2.5"
                          filter="url(#shadow)"
                        />
                      </>
                    )}
                    
                    {/* Puntos de datos mejorados */}
                    {getCurrentPageData().map((point, index) => {
                      const x = 60 + (index / Math.max(1, getCurrentPageData().length - 1)) * 680;
                      const baseValue = point.value;
                      const scaledValue = (baseValue - 50) * escalaY + 50 + offsetY;
                      const y = Math.max(40, Math.min(300, 300 - (scaledValue / 100) * 260));
                      return (
                        <g key={index}>
                          <circle 
                            cx={x} 
                            cy={y} 
                            r="4" 
                            fill="#FFFFFF"
                            stroke="#3B82F6"
                            strokeWidth="2"
                            className="hover:r-6 transition-all duration-200 cursor-pointer"
                            filter="url(#shadow)"
                          />
                          <circle 
                            cx={x} 
                            cy={y} 
                            r="2" 
                            fill="#3B82F6"
                            className="pointer-events-none"
                          />
                        </g>
                      );
                    })}
                      
                    {/* Change points marcados con visualización mejorada */}
                    {getCurrentPageChangePoints().map((cp) => {
                      const x = 60 + ((cp.relativeIndex || 0) / Math.max(1, pointsPerPage - 1)) * 680;
                      const baseValue = cp.value;
                      const scaledValue = (baseValue - 50) * escalaY + 50 + offsetY;
                      const y = Math.max(40, Math.min(300, 300 - (scaledValue / 100) * 260));
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
                            y2="300" 
                            stroke={colors.fill} 
                            strokeWidth="2" 
                            strokeDasharray="5,3"
                            opacity="0.7"
                          />
                          
                          {/* Círculo exterior */}
                          <circle 
                            cx={x} 
                            cy={y} 
                            r="12" 
                            fill={colors.bg} 
                            stroke={colors.stroke}
                            strokeWidth="2"
                            filter="url(#shadow)"
                          />
                          
                          {/* Círculo interior */}
                          <circle 
                            cx={x} 
                            cy={y} 
                            r="8" 
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
                                y={y - 35}
                                width="50"
                                height="16"
                                fill={colors.fill}
                                rx="8"
                                filter="url(#shadow)"
                              />
                              <text 
                                x={x} 
                                y={y - 26} 
                                textAnchor="middle" 
                                className="text-xs fill-white font-medium"
                                fontFamily="system-ui"
                              >
                                {cp.tipo.charAt(0).toUpperCase() + cp.tipo.slice(1)}
                              </text>
                            </g>
                          )}
                        </g>
                      );
                    })}
                    
                    {/* Indicador de área clicable */}
                    <rect 
                      x="60" 
                      y="40" 
                      width="680" 
                      height="260" 
                      fill="transparent" 
                      className="cursor-crosshair"
                    />
                  </svg>
                  
                  {/* Instrucciones mejoradas */}
                  <div className="absolute top-2 right-2 bg-white bg-opacity-95 p-3 rounded-lg text-xs text-gray-700 border shadow-sm">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>Haga clic en la gráfica para marcar change points</span>
                    </div>
                  </div>
                  
                  {/* Indicador de hover si está en modo de edición */}
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
              <div className="mt-6 flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  {sinChangePoint ? 
                    "Ha indicado que no hay change points en esta serie" :
                    `Total de change points marcados: ${changePoints.length}`
                  }
                </div>
                
                <button
                  onClick={() => {
                    // Aquí iría la lógica para guardar los resultados
                    const mensaje = sinChangePoint ? 
                      `Serie "${currentDataset.name}" marcada como sin change points` :
                      `Guardados ${changePoints.length} change points para "${currentDataset.name}"`;
                    
                    alert(mensaje);
                    
                    // Actualizar el estado del dataset
                    const updatedDatasets = datasets.map(ds => 
                      ds.id === currentDataset.id 
                        ? {...ds, status: "completado" as "pendiente" | "en_progreso" | "completado"} 
                        : ds
                    );
                    setDatasets(updatedDatasets);
                    setCurrentDataset(null);
                    setChangePoints([]);
                    setSinChangePoint(false);
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                  disabled={!sinChangePoint && changePoints.length === 0}
                >
                  Guardar Evaluación
                </button>
              </div>
            </div>
          </div>)}
      </div>      {/* Panel lateral para seleccionar tipo de change point */}
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