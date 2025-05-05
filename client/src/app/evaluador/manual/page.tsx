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
}

export default function ManualEvaluationPage() {
  // Estado para los datasets disponibles
  const [datasets, setDatasets] = useState<Dataset[]>([
    { id: 1, name: "Temperatura global (1950-2020)", points: 840, status: "pendiente" },
    { id: 2, name: "Mercado financiero 2021", points: 365, status: "completado" },
    { id: 3, name: "Consumo energético", points: 720, status: "en_progreso" },
    { id: 4, name: "Tráfico web diario", points: 450, status: "pendiente" },
    { id: 5, name: "Señales biomédicas paciente A", points: 1200, status: "pendiente" },
  ]);
  
  // Dataset actual seleccionado
  const [currentDataset, setCurrentDataset] = useState<Dataset | null>(null);
  
  // Estado para los change points marcados manualmente
  const [changePoints, setChangePoints] = useState<ChangePoint[]>([]);
  
  // Estado para la paginación de la gráfica
  const [currentPage, setCurrentPage] = useState(1);
  const [pointsPerPage, setPointsPerPage] = useState(100);
  const [totalPages, setTotalPages] = useState(1);
  
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
  };

  // Manejar el evento de clic en la gráfica para marcar un CP
  const handleGraphClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!graphRef.current || !currentDataset) return;
    
    const rect = graphRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const width = rect.width;
    
    // Calcular el índice en el dataset completo
    const startIndex = (currentPage - 1) * pointsPerPage;
    const clickedIndex = Math.floor((x / width) * pointsPerPage) + startIndex;
    
    if (clickedIndex >= 0 && clickedIndex < currentDataset.points) {
      // Verificar si ya existe un change point en un rango cercano (evitar duplicados)
      const nearby = changePoints.find(cp => 
        Math.abs(cp.index - clickedIndex) < 5
      );
      
      if (nearby) {
        // Eliminar el change point existente si se hace clic cerca
        setChangePoints(changePoints.filter(cp => cp.index !== nearby.index));
      } else {
        // Añadir nuevo change point
        const newCP = {
          index: clickedIndex,
          date: graphData[clickedIndex]?.date,
          value: graphData[clickedIndex]?.value
        };
        
        setChangePoints([...changePoints, newCP]);
      }
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

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <ManualEvaluationHeader />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!currentDataset ? (
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-xl font-medium text-gray-700 mb-6">Seleccione un dataset para evaluar</h2>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dataset</th>
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
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => setCurrentDataset(dataset)}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          Evaluar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-xl font-medium text-gray-700">{currentDataset.name}</h2>
                  <p className="text-sm text-gray-500">
                    Marque los puntos donde detecte cambios significativos en la serie temporal
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
                
                <div className="ml-auto">
                  <GraphPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                </div>
              </div>
              
              {/* Área del gráfico */}
              <div 
                ref={graphRef}
                onClick={handleGraphClick}
                className="h-64 bg-blue-50 rounded-lg border border-blue-100 p-6 relative cursor-crosshair"
              >
                {/* Ejes */}
                <div className="absolute bottom-6 left-16 right-6 h-px bg-gray-300"></div>
                <div className="absolute bottom-6 top-6 left-16 w-px bg-gray-300"></div>
                
                {/* Etiquetas de eje Y */}
                <div className="absolute bottom-4 left-2 text-xs text-gray-500">0</div>
                <div className="absolute bottom-[50%] left-2 text-xs text-gray-500">50</div>
                <div className="absolute top-4 left-2 text-xs text-gray-500">100</div>
                
                {/* Línea de datos */}
                <svg 
                  className="absolute bottom-6 left-16 right-6 top-6"
                  viewBox="0 0 1000 500" 
                  preserveAspectRatio="none"
                >
                  {/* Líneas de cuadrícula */}
                  <line x1="0" y1="125" x2="1000" y2="125" stroke="#e5e7eb" strokeDasharray="5,5" />
                  <line x1="0" y1="250" x2="1000" y2="250" stroke="#e5e7eb" strokeDasharray="5,5" />
                  <line x1="0" y1="375" x2="1000" y2="375" stroke="#e5e7eb" strokeDasharray="5,5" />
                  
                  {/* Línea de datos principal */}
                  {getCurrentPageData().length > 1 && (
                    <polyline 
                      points={getCurrentPageData().map((point, index) => 
                        `${(index / (getCurrentPageData().length - 1)) * 1000},${500 - point.value * 5}`
                      ).join(' ')} 
                      fill="none" 
                      stroke="#60a5fa" 
                      strokeWidth="2"
                    />
                  )}
                  
                  {/* Change points marcados */}
                  {getCurrentPageChangePoints().map((cp) => (
                    <g key={cp.index}>
                      <circle 
                        cx={(cp.relativeIndex / Math.max(1, pointsPerPage - 1)) * 1000} 
                        cy={500 - cp.value * 5} 
                        r="6" 
                        fill="#f87171" 
                      />
                      <text 
                        x={(cp.relativeIndex / Math.max(1, pointsPerPage - 1)) * 1000} 
                        y={500 - cp.value * 5 - 10} 
                        textAnchor="middle" 
                        fill="#ef4444" 
                        fontSize="10"
                      >
                        CP
                      </text>
                    </g>
                  ))}
                </svg>
                
                {/* Etiquetas de datos */}
                <div className="absolute bottom-0 left-16 text-xs text-gray-500">
                  {getCurrentPageData()[0]?.date}
                </div>
                <div className="absolute bottom-0 right-6 text-xs text-gray-500">
                  {getCurrentPageData()[getCurrentPageData().length - 1]?.date}
                </div>
                
                {/* Instrucciones */}
                <div className="absolute top-2 right-2 bg-white bg-opacity-75 p-1 rounded text-xs text-gray-500">
                  Haga clic para marcar/desmarcar change points
                </div>
              </div>
            </div>
            
            {/* Tabla de change points */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-lg font-medium text-gray-700 mb-4">Change Points Marcados</h3>
              
              {changePoints.length === 0 ? (
                <p className="text-sm text-gray-500 italic">No se han marcado change points todavía.</p>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Posición</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {changePoints.map((cp, idx) => (
                          <tr key={cp.index}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">CP{idx + 1}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cp.date}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cp.index}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cp.value.toFixed(2)}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <button
                                onClick={() => setChangePoints(changePoints.filter(point => point.index !== cp.index))}
                                className="text-red-500 hover:text-red-700"
                              >
                                Eliminar
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={() => {
                        // Aquí iría la lógica para guardar los resultados
                        alert(`Guardados ${changePoints.length} change points para el dataset "${currentDataset.name}"`);
                        
                        // Actualizar el estado del dataset
                        const updatedDatasets = datasets.map(ds => 
                          ds.id === currentDataset.id 
                            ? {...ds, status: "completado" as "pendiente" | "en_progreso" | "completado"} 
                            : ds
                        );
                        setDatasets(updatedDatasets);
                        setCurrentDataset(null);
                      }}
                      className="bg-blue-400 text-white hover:bg-blue-500 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                      Guardar resultados
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}