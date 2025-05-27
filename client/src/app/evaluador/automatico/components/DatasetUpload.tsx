"use client";

import { useState, useRef } from "react";

interface Dataset {
  name: string;
  data: {x: number, y: number, date?: string}[];
  originalFile?: File;
}

interface DatasetUploadProps {
  onUpload: (dataset: Dataset) => void;
}

export default function DatasetUpload({ onUpload }: DatasetUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedDataset, setSelectedDataset] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Datasets de ejemplo
  const exampleDatasets = [
    {
      id: 'temperature',
      name: 'Datos de Temperatura Global (1880-2020)',
      description: 'Serie temporal con cambios climáticos evidentes',
      points: 1680
    },
    {
      id: 'stock_market',
      name: 'Índice Bursátil S&P 500 (2020-2023)',
      description: 'Datos financieros con volatilidad y tendencias',
      points: 1095
    },
    {
      id: 'energy_consumption',
      name: 'Consumo Energético Industrial',
      description: 'Patrones de consumo con cambios estacionales',
      points: 2190
    },
    {
      id: 'network_traffic',
      name: 'Tráfico de Red Corporativa',
      description: 'Datos de red con anomalías y patrones',
      points: 8760
    }
  ];

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = async (file: File) => {
    setUploading(true);
    
    try {
      const text = await file.text();
      const data = parseFileData(text);
      
      const dataset: Dataset = {
        name: file.name,
        data,
        originalFile: file
      };
      
      onUpload(dataset);
    } catch (error) {
      console.error('Error processing file:', error);
      alert('Error al procesar el archivo. Verifique que sea un CSV válido.');
    } finally {
      setUploading(false);
    }
  };

  const parseFileData = (text: string): {x: number, y: number, date?: string}[] => {
    const lines = text.trim().split('\n');
    const data: {x: number, y: number, date?: string}[] = [];
    
    // Detectar si tiene header
    const hasHeader = isNaN(Number(lines[0].split(',')[0]));
    const startIndex = hasHeader ? 1 : 0;
    
    for (let i = startIndex; i < lines.length; i++) {
      const values = lines[i].split(',');
      
      if (values.length >= 2) {
        const x = Number(values[0]);
        const y = Number(values[1]);
        
        if (!isNaN(x) && !isNaN(y)) {
          data.push({
            x: data.length, // Usar índice secuencial
            y,
            date: values[2] || undefined
          });
        }
      }
    }
    
    return data;
  };

  const handleExampleDataset = (datasetId: string) => {
    setUploading(true);
    
    // Simular carga de datos de ejemplo
    setTimeout(() => {
      const exampleData = generateExampleData(datasetId);
      const selectedExample = exampleDatasets.find(ds => ds.id === datasetId);
      
      const dataset: Dataset = {
        name: selectedExample?.name || 'Dataset de Ejemplo',
        data: exampleData
      };
      
      setUploading(false);
      onUpload(dataset);
    }, 1000);
  };

  const generateExampleData = (datasetId: string): {x: number, y: number, date?: string}[] => {
    const lengths = {
      'temperature': 1680,
      'stock_market': 1095,
      'energy_consumption': 2190,
      'network_traffic': 8760
    };
    
    const length = lengths[datasetId as keyof typeof lengths] || 1000;
    const data: {x: number, y: number, date?: string}[] = [];
    
    let baseValue = 50;
    let trend = 0;
    let volatility = 1;
    
    for (let i = 0; i < length; i++) {
      // Simular diferentes tipos de change points
      if (datasetId === 'temperature') {
        // Cambios graduales por décadas
        if (i % 400 === 0 && i > 0) {
          baseValue += (Math.random() - 0.5) * 5;
        }
        trend = Math.sin(i / 100) * 0.1;
      } else if (datasetId === 'stock_market') {
        // Volatilidad alta con crisis ocasionales
        if (i % 200 === 0 && i > 0) {
          volatility = Math.random() * 3 + 0.5;
        }
        if (i % 300 === 0 && i > 0) {
          baseValue += (Math.random() - 0.7) * 20; // Más probabilidad de caídas
        }
      } else if (datasetId === 'energy_consumption') {
        // Patrones estacionales con cambios
        const seasonal = Math.sin(i / 365 * 2 * Math.PI) * 10;
        baseValue = 50 + seasonal;
        if (i % 730 === 0 && i > 0) {
          baseValue += (Math.random() - 0.5) * 8;
        }
      }
      
      const noise = (Math.random() - 0.5) * 2 * volatility;
      const value = Math.max(0, baseValue + trend + noise);
      
      data.push({
        x: i,
        y: value,
        date: new Date(2020, 0, 1 + i).toISOString().split('T')[0]
      });
      
      baseValue += trend;
    }
    
    return data;
  };

  return (
    <div className="space-y-8">
      {/* Información introductoria */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-blue-800 mb-3">
          Carga de Dataset para Análisis Automático
        </h3>
        <p className="text-blue-700 mb-4">
          Cargue su serie temporal para que nuestros algoritmos detecten automáticamente los change points. 
          Puede usar sus propios datos o seleccionar uno de nuestros datasets de ejemplo.
        </p>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="font-semibold text-blue-800 mb-2">Formatos Soportados:</h4>
            <ul className="text-blue-700 space-y-1">
              <li>• CSV (valores separados por comas)</li>
              <li>• TSV (valores separados por tabulaciones)</li>
              <li>• Archivos de texto con valores numéricos</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-blue-800 mb-2">Estructura Esperada:</h4>
            <ul className="text-blue-700 space-y-1">
              <li>• Primera columna: índice o tiempo</li>
              <li>• Segunda columna: valor de la serie</li>
              <li>• Tercera columna (opcional): fecha</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Upload de archivo */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Cargar Archivo Propio
          </h3>
          
          <div
            className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive 
                ? 'border-blue-400 bg-blue-50' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.txt,.tsv"
              onChange={handleFileInput}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            
            {uploading ? (
              <div className="space-y-4">
                <div className="w-12 h-12 mx-auto border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gray-600">Procesando archivo...</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="w-12 h-12 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <div>
                  <p className="text-gray-600 mb-2">
                    Arrastra tu archivo aquí o 
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="text-blue-600 hover:text-blue-700 font-medium ml-1"
                    >
                      haz clic para seleccionar
                    </button>
                  </p>
                  <p className="text-xs text-gray-500">
                    CSV, TSV o TXT hasta 10MB
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Datasets de ejemplo */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Datasets de Ejemplo
          </h3>
          
          <div className="space-y-3">
            {exampleDatasets.map((dataset) => (
              <div 
                key={dataset.id}
                className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:bg-blue-50 transition-colors cursor-pointer"
                onClick={() => !uploading && handleExampleDataset(dataset.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-800 mb-1">
                      {dataset.name}
                    </h4>
                    <p className="text-sm text-gray-600 mb-2">
                      {dataset.description}
                    </p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span>{dataset.points.toLocaleString()} puntos</span>
                      <span>Serie temporal</span>
                    </div>
                  </div>
                  
                  <div className="ml-4">
                    {uploading && selectedDataset === dataset.id ? (
                      <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
