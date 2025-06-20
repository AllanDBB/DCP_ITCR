"use client";

import { useState } from "react";

interface ChangePoint {
  index: number;
  confidence: number;
  type: 'media' | 'tendencia' | 'varianza' | 'periodicidad';
  value: number;
}

interface Dataset {
  name: string;
  data: {x: number, y: number, date?: string}[];
  originalFile?: File;
}

interface ResultsVisualizationProps {
  dataset: Dataset | null;
  results: {
    algorithm: string;
    changePoints: ChangePoint[];
    executionTime: number;
    confidence: number;
  }[];
  isProcessing: boolean;
  processingProgress: number;
  onRestart: () => void;
  onBack: () => void;
}

export default function ResultsVisualization({
  dataset,
  results,
  isProcessing,
  processingProgress,
  onRestart,
  onBack
}: ResultsVisualizationProps) {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<string>('all');
  const [showConfidenceThreshold, setShowConfidenceThreshold] = useState(0.5);
  const [exportFormat, setExportFormat] = useState('csv');
  const [escalaY, setEscalaY] = useState(1);
  const [offsetY, setOffsetY] = useState(0);

  if (!dataset) return null;

  // Función para obtener change points filtrados
  const getFilteredChangePoints = () => {
    if (selectedAlgorithm === 'all') {
      // Combinar todos los change points
      const allChangePoints: (ChangePoint & { algorithm: string })[] = [];
      results.forEach(result => {
        result.changePoints.forEach(cp => {
          if (cp.confidence >= showConfidenceThreshold) {
            allChangePoints.push({ ...cp, algorithm: result.algorithm });
          }
        });
      });
      return allChangePoints;
    } else {
      const result = results.find(r => r.algorithm === selectedAlgorithm);
      return result ? result.changePoints.filter(cp => cp.confidence >= showConfidenceThreshold).map(cp => ({ ...cp, algorithm: selectedAlgorithm })) : [];
    }
  };

  const filteredChangePoints = getFilteredChangePoints();

  // Función para exportar resultados
  const handleExport = () => {
    if (exportFormat === 'csv') {
      exportToCSV();
    } else if (exportFormat === 'json') {
      exportToJSON();
    } else if (exportFormat === 'txt') {
      exportToTXT();
    }
  };

  const exportToCSV = () => {
    let csvContent = "algorithm,index,confidence,type,value\n";
    
    results.forEach(result => {
      result.changePoints.forEach(cp => {
        csvContent += `${result.algorithm},${cp.index},${cp.confidence.toFixed(3)},${cp.type},${cp.value.toFixed(3)}\n`;
      });
    });

    downloadFile(csvContent, `changepoints_${dataset.name}.csv`, 'text/csv');
  };

  const exportToJSON = () => {
    const exportData = {
      dataset: dataset.name,
      timestamp: new Date().toISOString(),
      results: results.map(result => ({
        algorithm: result.algorithm,
        executionTime: result.executionTime,
        confidence: result.confidence,
        changePoints: result.changePoints
      }))
    };

    downloadFile(JSON.stringify(exportData, null, 2), `changepoints_${dataset.name}.json`, 'application/json');
  };

  const exportToTXT = () => {
    let txtContent = `Change Points Analysis Report\n`;
    txtContent += `Dataset: ${dataset.name}\n`;
    txtContent += `Generated: ${new Date().toLocaleString()}\n`;
    txtContent += `Total algorithms: ${results.length}\n\n`;

    results.forEach(result => {
      txtContent += `Algorithm: ${result.algorithm}\n`;
      txtContent += `Execution time: ${result.executionTime.toFixed(2)}ms\n`;
      txtContent += `Average confidence: ${result.confidence.toFixed(3)}\n`;
      txtContent += `Change points found: ${result.changePoints.length}\n\n`;
      
      if (result.changePoints.length > 0) {
        txtContent += `Index\tConfidence\tType\t\tValue\n`;
        result.changePoints.forEach(cp => {
          txtContent += `${cp.index}\t${cp.confidence.toFixed(3)}\t\t${cp.type}\t\t${cp.value.toFixed(3)}\n`;
        });
      }
      txtContent += "\n" + "=".repeat(50) + "\n\n";
    });

    downloadFile(txtContent, `changepoints_${dataset.name}.txt`, 'text/plain');
  };

  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const getAlgorithmColor = (algorithm: string) => {
    const colors = {
      'CUSUM': '#3B82F6',
      'PELT': '#8B5CF6',
      'Binary Segmentation': '#F59E0B',
      'Kernel Change Detection': '#EF4444'
    };
    return colors[algorithm as keyof typeof colors] || '#6B7280';
  };

  const getTypeColor = (type: string) => {
    const colors = {
      'media': '#3B82F6',
      'tendencia': '#8B5CF6',
      'varianza': '#F59E0B',
      'periodicidad': '#EF4444'
    };
    return colors[type as keyof typeof colors] || '#6B7280';
  };

  if (isProcessing) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="text-center space-y-6">
          <div className="w-20 h-20 mx-auto border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Ejecutando Análisis de Change Points
            </h3>
            <p className="text-gray-600 mb-4">
              Procesando su dataset con los algoritmos seleccionados...
            </p>
          </div>

          <div className="max-w-md mx-auto">
            <div className="bg-gray-200 rounded-full h-3 mb-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${processingProgress}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600">
              {processingProgress.toFixed(0)}% completado
            </p>
          </div>

          <div className="text-xs text-gray-500 space-y-1">
            <p>• Aplicando algoritmos de detección</p>
            <p>• Calculando niveles de confianza</p>
            <p>• Generando visualizaciones</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Resumen de resultados */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Resultados del Análisis
            </h3>
            <p className="text-gray-600">
              Dataset: <span className="font-medium">{dataset.name}</span> • 
              {dataset.data.length.toLocaleString()} puntos de datos
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={onBack}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
            >
              ← Atrás
            </button>
            <button
              onClick={onRestart}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
            >
              Nuevo Análisis
            </button>
          </div>
        </div>

        {/* Métricas por algoritmo */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {results.map((result) => (
            <div key={result.algorithm} className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-800 mb-2 text-sm">
                {result.algorithm}
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Change Points:</span>
                  <span className="font-medium">{result.changePoints.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Confianza Prom:</span>
                  <span className="font-medium">{(result.confidence * 100).toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tiempo:</span>
                  <span className="font-medium">{result.executionTime.toFixed(0)}ms</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Controles de visualización */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h4 className="font-semibold text-gray-800 mb-4">Controles de Visualización</h4>
        
        <div className="grid md:grid-cols-4 gap-4 mb-4">
          {/* Selector de algoritmo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Algoritmo a mostrar
            </label>
            <select
              value={selectedAlgorithm}
              onChange={(e) => setSelectedAlgorithm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Todos los algoritmos</option>
              {results.map((result) => (
                <option key={result.algorithm} value={result.algorithm}>
                  {result.algorithm}
                </option>
              ))}
            </select>
          </div>

          {/* Umbral de confianza */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Umbral de confianza: {(showConfidenceThreshold * 100).toFixed(0)}%
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={showConfidenceThreshold}
              onChange={(e) => setShowConfidenceThreshold(Number(e.target.value))}
              className="w-full"
            />
          </div>          {/* Controles de escala */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Escala Y: {escalaY.toFixed(1)}x
            </label>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setEscalaY(prev => Math.max(0.2, prev - 0.2))}
                className="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded text-sm"
              >
                −
              </button>
              <button
                onClick={() => setEscalaY(1)}
                className="px-3 py-1 bg-blue-100 hover:bg-blue-200 rounded text-sm"
              >
                Reset
              </button>
              <button
                onClick={() => setEscalaY(prev => Math.min(5, prev + 0.2))}
                className="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded text-sm"
              >
                +
              </button>
            </div>
          </div>

          {/* Controles de desplazamiento vertical */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Desplazamiento Y: {offsetY}px
            </label>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setOffsetY(prev => prev - 10)}
                className="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded text-sm"
              >
                ↓
              </button>
              <button
                onClick={() => setOffsetY(0)}
                className="px-3 py-1 bg-blue-100 hover:bg-blue-200 rounded text-sm"
              >
                Reset
              </button>
              <button
                onClick={() => setOffsetY(prev => prev + 10)}
                className="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded text-sm"
              >
                ↑
              </button>
            </div>
          </div>

          {/* Formato de exportación */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Formato de exportación
            </label>
            <div className="flex items-center space-x-2">
              <select
                value={exportFormat}
                onChange={(e) => setExportFormat(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="csv">CSV</option>
                <option value="json">JSON</option>
                <option value="txt">TXT</option>
              </select>
              <button
                onClick={handleExport}
                className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium"
              >
                📥
              </button>
            </div>
          </div>
        </div>

        <div className="text-sm text-gray-600">
          Mostrando {filteredChangePoints.length} change point{filteredChangePoints.length !== 1 ? 's' : ''} 
          con confianza ≥ {(showConfidenceThreshold * 100).toFixed(0)}%
        </div>
      </div>

      {/* Visualización principal */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h4 className="font-semibold text-gray-800 mb-4">Visualización de Change Points</h4>
        
        <div className="mb-4">
          <svg 
            width="100%" 
            height="400" 
            viewBox="0 0 800 400" 
            className="border rounded bg-gray-50"
          >
            {/* Ejes */}
            <line x1="60" y1="350" x2="740" y2="350" stroke="#374151" strokeWidth={2}/>
            <line x1="60" y1="50" x2="60" y2="350" stroke="#374151" strokeWidth={2}/>
            
            {/* Líneas de cuadrícula */}
            <line x1="60" y1="110" x2="740" y2="110" stroke="#e5e7eb" strokeDasharray="3,3" />
            <line x1="60" y1="170" x2="740" y2="170" stroke="#e5e7eb" strokeDasharray="3,3" />
            <line x1="60" y1="230" x2="740" y2="230" stroke="#e5e7eb" strokeDasharray="3,3" />
            <line x1="60" y1="290" x2="740" y2="290" stroke="#e5e7eb" strokeDasharray="3,3" />
            
            {/* Etiquetas */}
            <text x="400" y="375" textAnchor="middle" className="text-xs fill-gray-600">Tiempo</text>
            <text x="35" y="200" textAnchor="middle" className="text-xs fill-gray-600" transform="rotate(-90 35 200)">Valor</text>
            
            {/* Datos de la serie */}
            {dataset.data.length > 1 && (
              <polyline 
                points={dataset.data.map((point, index) => {
                  const x = 60 + (index / (dataset.data.length - 1)) * 680;
                  const baseValue = point.y;
                  const scaledValue = (baseValue - 50) * escalaY + 50 + offsetY;
                  const y = 350 - (scaledValue / 100) * 300;
                  return `${x},${Math.max(50, Math.min(350, y))}`;
                }).join(' ')} 
                fill="none" 
                stroke="#3B82F6" 
                strokeWidth={2}
                opacity={0.7}
              />
            )}
            
            {/* Change points */}
            {filteredChangePoints.map((cp, index) => {
              const x = 60 + (cp.index / Math.max(1, dataset.data.length - 1)) * 680;
              const baseValue = cp.value;
              const scaledValue = (baseValue - 50) * escalaY + 50 + offsetY;
              const y = Math.max(50, Math.min(350, 350 - (scaledValue / 100) * 300));
              const color = selectedAlgorithm === 'all' ? getAlgorithmColor(cp.algorithm) : getTypeColor(cp.type);
              
              return (
                <g key={`${cp.algorithm}-${cp.index}-${index}`}>
                  <line
                    x1={x}
                    y1={50}
                    x2={x}
                    y2={350}
                    stroke={color}
                    strokeWidth={2}
                    strokeDasharray="5,5"
                    opacity={0.6}
                  />
                  <circle 
                    cx={x} 
                    cy={y} 
                    r={6 + cp.confidence * 4}
                    fill={color}
                    stroke="white"
                    strokeWidth={2}
                    opacity={0.8}
                  />
                  <text 
                    x={x} 
                    y={y - 15} 
                    textAnchor="middle" 
                    className="text-xs font-bold"
                    fill={color}
                  >
                    {cp.index}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Leyenda */}
        <div className="mt-4 flex flex-wrap gap-4">
          {selectedAlgorithm === 'all' ? (
            results.map((result) => (
              <div key={result.algorithm} className="flex items-center space-x-2">
                <div 
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: getAlgorithmColor(result.algorithm) }}
                ></div>
                <span className="text-sm text-gray-700">{result.algorithm}</span>
              </div>
            ))
          ) : (
            ['media', 'tendencia', 'varianza', 'periodicidad'].map((type) => (
              <div key={type} className="flex items-center space-x-2">
                <div 
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: getTypeColor(type) }}
                ></div>
                <span className="text-sm text-gray-700 capitalize">{type}</span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Tabla de resultados detallada */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h4 className="font-semibold text-gray-800 mb-4">Resultados Detallados</h4>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Algoritmo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Índice
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Confianza
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Valor
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredChangePoints.map((cp, index) => (
                <tr key={`${cp.algorithm}-${cp.index}-${index}`} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span 
                      className="px-2 py-1 text-xs font-medium rounded-full text-white"
                      style={{ backgroundColor: getAlgorithmColor(cp.algorithm) }}
                    >
                      {cp.algorithm}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {cp.index}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span 
                      className="px-2 py-1 text-xs font-medium rounded-full text-white capitalize"
                      style={{ backgroundColor: getTypeColor(cp.type) }}
                    >
                      {cp.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center">
                      <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${cp.confidence * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-xs font-medium">
                        {(cp.confidence * 100).toFixed(1)}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {cp.value.toFixed(3)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredChangePoints.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No hay change points que cumplan con los criterios de filtrado actuales.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
