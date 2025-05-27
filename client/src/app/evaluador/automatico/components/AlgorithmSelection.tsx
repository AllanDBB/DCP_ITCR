"use client";

interface AlgorithmConfig {
  name: string;
  enabled: boolean;
  parameters: Record<string, number | string | boolean>;
}

interface AlgorithmSelectionProps {
  algorithms: AlgorithmConfig[];
  onChange: (algorithms: AlgorithmConfig[]) => void;
  onNext: () => void;
  onBack: () => void;
}

// Información detallada de cada algoritmo
const algorithmInfo = {
  'CUSUM': {
    description: 'Cumulative Sum Control Chart - Ideal para detectar cambios graduales en la media',
    strengths: ['Excelente para cambios graduales', 'Baja latencia de detección', 'Robusto ante ruido'],
    weaknesses: ['Sensible a la configuración de parámetros', 'Menos efectivo para cambios abruptos'],
    useCases: ['Monitoreo de procesos industriales', 'Control de calidad', 'Detección de derive'],
    complexity: 'Baja',
    speed: 'Muy rápida'
  },
  'PELT': {
    description: 'Pruned Exact Linear Time - Algoritmo óptimo para múltiples change points',
    strengths: ['Óptimo para múltiples change points', 'Excelente precisión', 'Teoricamente fundamentado'],
    weaknesses: ['Computacionalmente intensivo', 'Requiere selección cuidadosa de penalización'],
    useCases: ['Análisis genómico', 'Señales biomédicas', 'Datos financieros'],
    complexity: 'Alta',
    speed: 'Moderada'
  },
  'Binary Segmentation': {
    description: 'Segmentación binaria recursiva - Método clásico y confiable',
    strengths: ['Conceptualmente simple', 'Buena para cambios grandes', 'Ampliamente probado'],
    weaknesses: ['Puede perder change points pequeños', 'Sensible al orden de detección'],
    useCases: ['Análisis exploratorio', 'Datos con cambios evidentes', 'Aplicaciones en tiempo real'],
    complexity: 'Media',
    speed: 'Rápida'
  },
  'Kernel Change Detection': {
    description: 'Detección basada en kernels - Captura relaciones no lineales complejas',
    strengths: ['Detecta cambios no lineales', 'Flexible y adaptable', 'Maneja dependencias complejas'],
    weaknesses: ['Computacionalmente costoso', 'Requiere tuning de hiperparámetros'],
    useCases: ['Datos no lineales', 'Sistemas complejos', 'Análisis avanzado'],
    complexity: 'Muy alta',
    speed: 'Lenta'
  }
};

export default function AlgorithmSelection({ 
  algorithms, 
  onChange, 
  onNext, 
  onBack 
}: AlgorithmSelectionProps) {
  
  const handleToggleAlgorithm = (algorithmName: string) => {
    const updatedAlgorithms = algorithms.map(alg => 
      alg.name === algorithmName 
        ? { ...alg, enabled: !alg.enabled }
        : alg
    );
    onChange(updatedAlgorithms);
  };

  const enabledCount = algorithms.filter(alg => alg.enabled).length;

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'Baja': return 'text-green-600 bg-green-100';
      case 'Media': return 'text-yellow-600 bg-yellow-100';
      case 'Alta': return 'text-orange-600 bg-orange-100';
      case 'Muy alta': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getSpeedColor = (speed: string) => {
    switch (speed) {
      case 'Muy rápida': return 'text-green-600 bg-green-100';
      case 'Rápida': return 'text-green-600 bg-green-100';
      case 'Moderada': return 'text-yellow-600 bg-yellow-100';
      case 'Lenta': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      {/* Información general */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-blue-800 mb-3">
          Selección de Algoritmos de Detección
        </h3>
        <p className="text-blue-700 mb-4">
          Seleccione uno o más algoritmos para analizar su dataset. Cada algoritmo tiene fortalezas 
          específicas y es adecuado para diferentes tipos de change points y características de datos.
        </p>
        <div className="bg-blue-100 rounded-lg p-4">
          <p className="text-blue-800 text-sm">
            <strong>Recomendación:</strong> Para obtener mejores resultados, seleccione al menos 2-3 algoritmos 
            diferentes y compare sus resultados. Esto le permitirá identificar change points con mayor confianza.
          </p>
        </div>
      </div>

      {/* Algoritmos disponibles */}
      <div className="grid gap-6">
        {algorithms.map((algorithm) => {
          const info = algorithmInfo[algorithm.name as keyof typeof algorithmInfo];
          
          return (
            <div 
              key={algorithm.name}
              className={`bg-white rounded-xl border-2 transition-all duration-200 ${
                algorithm.enabled 
                  ? 'border-blue-500 shadow-lg bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300 shadow-sm'
              }`}
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-4">
                    <div className="mt-1">
                      <input
                        type="checkbox"
                        checked={algorithm.enabled}
                        onChange={() => handleToggleAlgorithm(algorithm.name)}
                        className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                      />
                    </div>
                    
                    <div className="flex-1">
                      <h4 className="text-xl font-semibold text-gray-800 mb-2">
                        {algorithm.name}
                      </h4>
                      <p className="text-gray-600 mb-4">
                        {info.description}
                      </p>
                      
                      {/* Métricas */}
                      <div className="flex items-center space-x-4 mb-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getComplexityColor(info.complexity)}`}>
                          Complejidad: {info.complexity}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getSpeedColor(info.speed)}`}>
                          Velocidad: {info.speed}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Detalles expandidos cuando está seleccionado */}
                {algorithm.enabled && (
                  <div className="mt-4 p-4 bg-white rounded-lg border border-blue-200">
                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <h5 className="font-semibold text-green-800 mb-2 text-sm">
                          ✓ Fortalezas
                        </h5>
                        <ul className="text-sm text-gray-700 space-y-1">
                          {info.strengths.map((strength, index) => (
                            <li key={index} className="flex items-start">
                              <span className="text-green-600 mr-2">•</span>
                              {strength}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h5 className="font-semibold text-orange-800 mb-2 text-sm">
                          ⚠ Limitaciones
                        </h5>
                        <ul className="text-sm text-gray-700 space-y-1">
                          {info.weaknesses.map((weakness, index) => (
                            <li key={index} className="flex items-start">
                              <span className="text-orange-600 mr-2">•</span>
                              {weakness}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h5 className="font-semibold text-blue-800 mb-2 text-sm">
                          📊 Casos de Uso
                        </h5>
                        <ul className="text-sm text-gray-700 space-y-1">
                          {info.useCases.map((useCase, index) => (
                            <li key={index} className="flex items-start">
                              <span className="text-blue-600 mr-2">•</span>
                              {useCase}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Resumen de selección */}
      <div className="bg-gray-50 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">
              Resumen de Selección
            </h4>
            <p className="text-gray-600">
              {enabledCount === 0 
                ? 'No hay algoritmos seleccionados'
                : `${enabledCount} algoritmo${enabledCount > 1 ? 's' : ''} seleccionado${enabledCount > 1 ? 's' : ''}`
              }
            </p>
            {enabledCount > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {algorithms.filter(alg => alg.enabled).map((alg) => (
                  <span 
                    key={alg.name}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                  >
                    {alg.name}
                  </span>
                ))}
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="px-6 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
            >
              ← Atrás
            </button>
            
            <button
              onClick={onNext}
              disabled={enabledCount === 0}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                enabledCount === 0
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              Configurar Parámetros →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
