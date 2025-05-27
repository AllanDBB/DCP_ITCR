"use client";

import { useState } from "react";
import AutomaticEvaluationHeader from "./components/AutomaticEvaluationHeader";
import DatasetUpload from "./components/DatasetUpload";
import AlgorithmSelection from "./components/AlgorithmSelection";
import ParameterConfiguration from "./components/ParameterConfiguration";
import ResultsVisualization from "./components/ResultsVisualization";

interface ChangePoint {
  index: number;
  confidence: number;
  type: 'media' | 'tendencia' | 'varianza' | 'periodicidad';
  value: number;
}

interface AlgorithmConfig {
  name: string;
  enabled: boolean;
  parameters: Record<string, number | string | boolean>;
}

interface Dataset {
  name: string;
  data: {x: number, y: number, date?: string}[];
  originalFile?: File;
}

export default function AutomaticEvaluationPage() {
  // Estados principales
  const [currentStep, setCurrentStep] = useState<'upload' | 'algorithm' | 'parameters' | 'results'>('upload');
  const [dataset, setDataset] = useState<Dataset | null>(null);
  const [algorithms, setAlgorithms] = useState<AlgorithmConfig[]>([
    {
      name: 'CUSUM',
      enabled: true,
      parameters: {
        threshold: 5,
        drift: 1,
        direction: 'both'
      }
    },
    {
      name: 'PELT',
      enabled: false,
      parameters: {
        penalty: 'BIC',
        minSize: 2,
        jumpPenalty: 10
      }
    },
    {
      name: 'Binary Segmentation',
      enabled: false,
      parameters: {
        maxChangepoints: 10,
        penalty: 'AIC',
        minSegmentLength: 5
      }
    },
    {
      name: 'Kernel Change Detection',
      enabled: false,
      parameters: {
        kernelSize: 50,
        threshold: 0.5,
        method: 'gaussian'
      }
    }
  ]);
  
  const [results, setResults] = useState<{
    algorithm: string;
    changePoints: ChangePoint[];
    executionTime: number;
    confidence: number;
  }[]>([]);
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);

  // Manejar carga de dataset
  const handleDatasetUpload = (uploadedDataset: Dataset) => {
    setDataset(uploadedDataset);
    setCurrentStep('algorithm');
  };

  // Manejar selección de algoritmos
  const handleAlgorithmChange = (updatedAlgorithms: AlgorithmConfig[]) => {
    setAlgorithms(updatedAlgorithms);
  };

  // Ejecutar análisis
  const handleRunAnalysis = async () => {
    if (!dataset) return;
    
    setIsProcessing(true);
    setProcessingProgress(0);
    setCurrentStep('results');
    
    const enabledAlgorithms = algorithms.filter(alg => alg.enabled);
    const newResults: typeof results = [];
    
    // Simular procesamiento de cada algoritmo
    for (let i = 0; i < enabledAlgorithms.length; i++) {
      const algorithm = enabledAlgorithms[i];
      
      // Simular tiempo de procesamiento
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generar resultados simulados
      const mockResults = generateMockResults(algorithm, dataset);
      newResults.push(mockResults);
      
      setProcessingProgress(((i + 1) / enabledAlgorithms.length) * 100);
    }
    
    setResults(newResults);
    setIsProcessing(false);
  };

  // Generar resultados simulados
  const generateMockResults = (algorithm: AlgorithmConfig, dataset: Dataset) => {
    const numChangePoints = Math.floor(Math.random() * 5) + 1;
    const changePoints: ChangePoint[] = [];
    
    for (let i = 0; i < numChangePoints; i++) {
      const randomIndex = Math.floor(Math.random() * dataset.data.length);
      const types: ChangePoint['type'][] = ['media', 'tendencia', 'varianza', 'periodicidad'];
      
      changePoints.push({
        index: randomIndex,
        confidence: 0.6 + Math.random() * 0.4,
        type: types[Math.floor(Math.random() * types.length)],
        value: dataset.data[randomIndex]?.y || 0
      });
    }
    
    // Ordenar por índice
    changePoints.sort((a, b) => a.index - b.index);
    
    return {
      algorithm: algorithm.name,
      changePoints,
      executionTime: 500 + Math.random() * 2000,
      confidence: changePoints.reduce((acc, cp) => acc + cp.confidence, 0) / changePoints.length
    };
  };

  // Volver al paso anterior
  const handleBackStep = () => {
    if (currentStep === 'algorithm') {
      setCurrentStep('upload');
    } else if (currentStep === 'parameters') {
      setCurrentStep('algorithm');
    } else if (currentStep === 'results') {
      setCurrentStep('parameters');
    }
  };

  // Reiniciar análisis
  const handleRestart = () => {
    setDataset(null);
    setResults([]);
    setCurrentStep('upload');
    setIsProcessing(false);
    setProcessingProgress(0);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <AutomaticEvaluationHeader />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            {/* Step 1: Upload */}
            <div className={`flex items-center ${
              currentStep === 'upload' ? 'text-blue-600' : 
              ['algorithm', 'parameters', 'results'].includes(currentStep) ? 'text-green-600' : 'text-gray-400'
            }`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium text-white ${
                currentStep === 'upload' ? 'bg-blue-600' : 
                ['algorithm', 'parameters', 'results'].includes(currentStep) ? 'bg-green-600' : 'bg-gray-400'
              }`}>
                1
              </div>
              <span className="ml-2 font-medium">Cargar Dataset</span>
            </div>
            
            <div className={`w-16 h-1 rounded ${
              ['algorithm', 'parameters', 'results'].includes(currentStep) ? 'bg-green-600' : 'bg-gray-300'
            }`}></div>
            
            {/* Step 2: Algorithm */}
            <div className={`flex items-center ${
              currentStep === 'algorithm' ? 'text-blue-600' : 
              ['parameters', 'results'].includes(currentStep) ? 'text-green-600' : 'text-gray-400'
            }`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium text-white ${
                currentStep === 'algorithm' ? 'bg-blue-600' : 
                ['parameters', 'results'].includes(currentStep) ? 'bg-green-600' : 'bg-gray-400'
              }`}>
                2
              </div>
              <span className="ml-2 font-medium">Algoritmos</span>
            </div>
            
            <div className={`w-16 h-1 rounded ${
              ['parameters', 'results'].includes(currentStep) ? 'bg-green-600' : 'bg-gray-300'
            }`}></div>
            
            {/* Step 3: Parameters */}
            <div className={`flex items-center ${
              currentStep === 'parameters' ? 'text-blue-600' : 
              currentStep === 'results' ? 'text-green-600' : 'text-gray-400'
            }`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium text-white ${
                currentStep === 'parameters' ? 'bg-blue-600' : 
                currentStep === 'results' ? 'bg-green-600' : 'bg-gray-400'
              }`}>
                3
              </div>
              <span className="ml-2 font-medium">Parámetros</span>
            </div>
            
            <div className={`w-16 h-1 rounded ${
              currentStep === 'results' ? 'bg-green-600' : 'bg-gray-300'
            }`}></div>
            
            {/* Step 4: Results */}
            <div className={`flex items-center ${
              currentStep === 'results' ? 'text-blue-600' : 'text-gray-400'
            }`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium text-white ${
                currentStep === 'results' ? 'bg-blue-600' : 'bg-gray-400'
              }`}>
                4
              </div>
              <span className="ml-2 font-medium">Resultados</span>
            </div>
          </div>
        </div>

        {/* Content Sections */}
        {currentStep === 'upload' && (
          <DatasetUpload onUpload={handleDatasetUpload} />
        )}
        
        {currentStep === 'algorithm' && dataset && (
          <AlgorithmSelection 
            algorithms={algorithms}
            onChange={handleAlgorithmChange}
            onNext={() => setCurrentStep('parameters')}
            onBack={handleBackStep}
          />
        )}
        
        {currentStep === 'parameters' && (
          <ParameterConfiguration 
            algorithms={algorithms.filter(alg => alg.enabled)}
            onChange={handleAlgorithmChange}
            onRunAnalysis={handleRunAnalysis}
            onBack={handleBackStep}
          />
        )}
        
        {currentStep === 'results' && (
          <ResultsVisualization 
            dataset={dataset}
            results={results}
            isProcessing={isProcessing}
            processingProgress={processingProgress}
            onRestart={handleRestart}
            onBack={handleBackStep}
          />
        )}
      </div>
    </div>
  );
}
