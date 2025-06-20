"use client";

import { useState } from "react";

interface AlgorithmConfig {
  name: string;
  enabled: boolean;
  parameters: Record<string, number | string | boolean>;
}

interface NumberParameterDef {
  type: 'number';
  label: string;
  description: string;
  min: number;
  max: number;
  step: number;
  default: number;
}

interface SelectParameterDef {
  type: 'select';
  label: string;
  description: string;
  options: { value: string; label: string }[];
  default: string;
}

type ParameterDef = NumberParameterDef | SelectParameterDef;

interface ParameterConfigurationProps {
  algorithms: AlgorithmConfig[];
  onChange: (algorithms: AlgorithmConfig[]) => void;
  onRunAnalysis: () => void;
  onBack: () => void;
}

// Definiciones de parámetros para cada algoritmo
const parameterDefinitions = {
  'CUSUM': {
    threshold: {
      type: 'number' as const,
      label: 'Umbral de Detección',
      description: 'Sensibilidad del algoritmo. Valores más bajos detectan cambios más pequeños',
      min: 1,
      max: 20,
      step: 0.5,
      default: 5
    },
    drift: {
      type: 'number' as const,
      label: 'Deriva Permitida',
      description: 'Compensación por deriva natural en los datos',
      min: 0,
      max: 5,
      step: 0.1,
      default: 1
    },
    direction: {
      type: 'select' as const,
      label: 'Dirección de Cambio',
      description: 'Tipo de cambio a detectar',
      options: [
        { value: 'both', label: 'Ambas direcciones' },
        { value: 'positive', label: 'Solo aumentos' },
        { value: 'negative', label: 'Solo disminuciones' }
      ],
      default: 'both'
    }
  },  'PELT': {
    penalty: {
      type: 'select' as const,
      label: 'Criterio de Penalización',
      description: 'Método para balancear ajuste vs complejidad',
      options: [
        { value: 'BIC', label: 'BIC (Bayesian Information Criterion)' },
        { value: 'AIC', label: 'AIC (Akaike Information Criterion)' },
        { value: 'MBIC', label: 'MBIC (Modified BIC)' }
      ],
      default: 'BIC'
    },
    minSize: {
      type: 'number' as const,
      label: 'Tamaño Mínimo de Segmento',
      description: 'Número mínimo de puntos entre change points',
      min: 2,
      max: 50,
      step: 1,
      default: 2
    },
    jumpPenalty: {
      type: 'number' as const,
      label: 'Penalización por Salto',
      description: 'Penalización adicional por cada change point detectado',
      min: 1,
      max: 50,
      step: 1,
      default: 10
    }
  },  'Binary Segmentation': {
    maxChangepoints: {
      type: 'number' as const,
      label: 'Máximo Change Points',
      description: 'Límite superior de change points a detectar',
      min: 1,
      max: 50,
      step: 1,
      default: 10
    },
    penalty: {
      type: 'select' as const,
      label: 'Criterio de Penalización',
      description: 'Método para evaluar la calidad de la segmentación',
      options: [
        { value: 'AIC', label: 'AIC (Akaike Information Criterion)' },
        { value: 'BIC', label: 'BIC (Bayesian Information Criterion)' },
        { value: 'SIC', label: 'SIC (Schwarz Information Criterion)' }
      ],
      default: 'AIC'
    },
    minSegmentLength: {
      type: 'number' as const,
      label: 'Longitud Mínima de Segmento',
      description: 'Mínimo número de observaciones por segmento',
      min: 2,
      max: 100,
      step: 1,
      default: 5
    }
  },
  'Kernel Change Detection': {
    kernelSize: {
      type: 'number' as const,
      label: 'Tamaño de Ventana',
      description: 'Tamaño de la ventana deslizante para comparación',
      min: 10,
      max: 200,
      step: 5,
      default: 50
    },
    threshold: {
      type: 'number' as const,
      label: 'Umbral de Significancia',
      description: 'Nivel de confianza para detectar cambios',
      min: 0.1,
      max: 0.99,
      step: 0.05,
      default: 0.5
    },
    method: {
      type: 'select' as const,
      label: 'Tipo de Kernel',
      description: 'Función kernel para comparar distribuciones',
      options: [
        { value: 'gaussian', label: 'Gaussiano (RBF)' },
        { value: 'linear', label: 'Lineal' },
        { value: 'polynomial', label: 'Polinomial' }
      ],
      default: 'gaussian'
    }
  }
};

export default function ParameterConfiguration({ 
  algorithms, 
  onChange, 
  onRunAnalysis, 
  onBack 
}: ParameterConfigurationProps) {
  const [expandedAlgorithm, setExpandedAlgorithm] = useState<string>(algorithms[0]?.name || '');

  const handleParameterChange = (algorithmName: string, paramName: string, value: number | string | boolean) => {
    const updatedAlgorithms = algorithms.map(alg => 
      alg.name === algorithmName 
        ? { 
            ...alg, 
            parameters: { ...alg.parameters, [paramName]: value }
          }
        : alg
    );
    onChange(updatedAlgorithms);
  };

  const resetToDefaults = (algorithmName: string) => {
    const params = parameterDefinitions[algorithmName as keyof typeof parameterDefinitions];
    const defaultParams: Record<string, number | string | boolean> = {};
    
    Object.entries(params).forEach(([key, def]) => {
      defaultParams[key] = def.default;
    });

    const updatedAlgorithms = algorithms.map(alg => 
      alg.name === algorithmName 
        ? { ...alg, parameters: defaultParams }
        : alg
    );
    onChange(updatedAlgorithms);
  };  const renderParameterInput = (
    algorithmName: string, 
    paramName: string, 
    paramDef: ParameterDef, 
    currentValue: number | string | boolean
  ) => {
    const id = `${algorithmName}-${paramName}`;
    
    if (paramDef.type === 'number') {
      const numValue = typeof currentValue === 'number' ? currentValue : paramDef.default;
      return (
        <input
          id={id}
          type="number"
          min={paramDef.min}
          max={paramDef.max}
          step={paramDef.step}
          value={numValue}
          onChange={(e) => handleParameterChange(algorithmName, paramName, Number(e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      );
    } else if (paramDef.type === 'select') {
      const strValue = typeof currentValue === 'string' ? currentValue : paramDef.default;
      return (
        <select
          id={id}
          value={strValue}
          onChange={(e) => handleParameterChange(algorithmName, paramName, e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {paramDef.options?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      );
    }
    
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Información introductoria */}
      <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-purple-800 mb-3">
          Configuración de Parámetros
        </h3>
        <p className="text-purple-700 mb-4">
          Ajuste los parámetros de cada algoritmo según las características de su dataset. 
          Los valores por defecto están optimizados para la mayoría de casos de uso.
        </p>
        <div className="bg-purple-100 rounded-lg p-4">
          <p className="text-purple-800 text-sm">
            <strong>Consejo:</strong> Si no está seguro de qué valores usar, comience con los parámetros 
            por defecto y ajuste según los resultados obtenidos.
          </p>
        </div>
      </div>

      {/* Configuración por algoritmo */}
      <div className="space-y-4">
        {algorithms.map((algorithm) => {
          const params = parameterDefinitions[algorithm.name as keyof typeof parameterDefinitions];
          const isExpanded = expandedAlgorithm === algorithm.name;
          
          return (
            <div key={algorithm.name} className="bg-white rounded-xl border border-gray-200 shadow-sm">
              <div 
                className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => setExpandedAlgorithm(isExpanded ? '' : algorithm.name)}
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-semibold text-gray-800">
                    {algorithm.name}
                  </h4>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        resetToDefaults(algorithm.name);
                      }}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Restaurar por defecto
                    </button>
                    <svg 
                      className={`w-5 h-5 text-gray-500 transition-transform ${
                        isExpanded ? 'rotate-180' : ''
                      }`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {isExpanded && (
                <div className="border-t border-gray-200 p-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    {Object.entries(params).map(([paramName, paramDef]) => (
                      <div key={paramName} className="space-y-2">
                        <label 
                          htmlFor={`${algorithm.name}-${paramName}`}
                          className="block text-sm font-medium text-gray-700"
                        >
                          {paramDef.label}
                        </label>
                        
                        {renderParameterInput(
                          algorithm.name, 
                          paramName, 
                          paramDef, 
                          algorithm.parameters[paramName]
                        )}
                          <p className="text-xs text-gray-500">
                          {paramDef.description}
                        </p>
                        
                        {paramDef.type === 'number' && (
                          <p className="text-xs text-gray-400">
                            Rango: {paramDef.min} - {paramDef.max}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Resumen y acciones */}
      <div className="bg-gray-50 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">
              Listo para Ejecutar Análisis
            </h4>
            <p className="text-gray-600 mb-2">
              Se ejecutarán {algorithms.length} algoritmo{algorithms.length > 1 ? 's' : ''} 
              con la configuración especificada.
            </p>
            <div className="flex flex-wrap gap-2">
              {algorithms.map((alg) => (
                <span 
                  key={alg.name}
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                >
                  {alg.name}
                </span>
              ))}
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="px-6 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
            >
              ← Atrás
            </button>
            
            <button
              onClick={onRunAnalysis}
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              🚀 Ejecutar Análisis
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
