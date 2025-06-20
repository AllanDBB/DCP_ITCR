"use client";

import { useState } from 'react';

export default function EvaluadorPage() {
  const [showContributeSection, setShowContributeSection] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-sky-50 border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-6 md:mb-0">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-600 mb-2">Evaluador de Change Points</h1>
              <p className="text-gray-600">Sistema colaborativo de etiquetado para entrenamiento de algoritmos</p>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">
              Contribuye al Desarrollo de IA
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed">
              Ayúdanos a crear un dataset de alta calidad para entrenar algoritmos de detección de change points. 
              Tu contribución es fundamental para mejorar la precisión de estos modelos.
            </p>
            <div className="bg-blue-50 rounded-xl p-8 max-w-3xl mx-auto border border-blue-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">¿Cómo funciona?</h3>
              <p className="text-gray-600">
                Primero recibirás capacitación sobre cómo identificar change points correctamente, 
                y luego etiquetarás series temporales para ayudar a entrenar nuestros algoritmos.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
          {/* Flow Steps */}
          <div className="mb-12">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Proceso de Etiquetado</h2>
              <p className="text-gray-600">Sigue estos pasos para contribuir al dataset</p>
            </div>
            
            <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-8">
              {/* Step 1: Capacitación */}
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white text-xl font-bold mb-4">
                  1
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Capacitación</h3>
                <p className="text-gray-600 text-center max-w-48">
                  Aprende a identificar change points con ejemplos y ejercicios
                </p>
              </div>
              
              {/* Arrow */}
              <div className="hidden md:block">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
              
              {/* Step 2: Etiquetado */}
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white text-xl font-bold mb-4">
                  2
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Etiquetado</h3>
                <p className="text-gray-600 text-center max-w-48">
                  Marca change points en series temporales reales
                </p>
              </div>
              
              {/* Arrow */}
              <div className="hidden md:block">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
              
              {/* Step 3: Contribución */}
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center text-white text-xl font-bold mb-4">
                  3
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Contribución</h3>
                <p className="text-gray-600 text-center max-w-48">
                  Tus etiquetas mejoran los algoritmos de IA
                </p>
              </div>
            </div>
          </div>

          {/* Action Cards */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            
            {/* Capacitación Card */}
            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200 hover:shadow-xl transition-shadow duration-200">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-xl font-semibold text-gray-800">Capacitación</h3>
                  <p className="text-sm text-green-600">Aprende los fundamentos</p>
                </div>
              </div>
              
              <p className="text-gray-600 mb-6">
                Antes de comenzar a etiquetar, es importante que entiendas qué son los change points y cómo identificarlos correctamente en series temporales.
              </p>
              
              <a 
                href="/evaluador/capacitacion" 
                className="inline-flex items-center px-6 py-3 bg-green-500 text-white font-medium rounded-lg hover:bg-green-600 transition-colors duration-200"
              >
                Comenzar Capacitación
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>

            {/* Evaluación Manual Card */}
            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200 hover:shadow-xl transition-shadow duration-200">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-xl font-semibold text-gray-800">Evaluación Manual</h3>
                  <p className="text-sm text-blue-600">Etiqueta series temporales</p>
                </div>
              </div>
              
              <p className="text-gray-600 mb-6">
                Una vez completada la capacitación, podrás comenzar a etiquetar series temporales reales para contribuir al dataset de entrenamiento.
              </p>
              
              <a 
                href="/evaluador/manual" 
                className="inline-flex items-center px-6 py-3 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors duration-200"
              >
                Comenzar Etiquetado
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          </div>

          {/* Contribute Section Toggle */}
          <div className="text-center mb-8">
            <button
              onClick={() => setShowContributeSection(!showContributeSection)}
              className="inline-flex items-center px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors duration-200"
            >
              {showContributeSection ? 'Ocultar' : 'Ver'} información sobre contribuciones
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className={`w-4 h-4 ml-2 transform transition-transform duration-200 ${showContributeSection ? 'rotate-180' : ''}`} 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>

          {/* Contribution Info (Collapsible) */}
          {showContributeSection && (
            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Cómo Contribuir Efectivamente</h3>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">Consejos para el Etiquetado:</h4>
                  <ul className="text-gray-600 space-y-2">
                    <li>• Observa cambios en tendencia, varianza o nivel</li>
                    <li>• Marca el punto exacto donde ocurre el cambio</li>
                    <li>• Considera el contexto de toda la serie</li>
                    <li>• Sé consistente en tus criterios</li>
                    <li>• Usa "Sin change point" si no detectas cambios</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">Impacto de tu Trabajo:</h4>
                  <ul className="text-gray-600 space-y-2">
                    <li>• Mejoras algoritmos de detección automática</li>
                    <li>• Contribuyes a la investigación científica</li>
                    <li>• Ayudas a aplicaciones en medicina, economía y clima</li>
                    <li>• Participas en el avance de la inteligencia artificial</li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-blue-800 text-sm">
                  <strong>Importante:</strong> Tu trabajo ayudará a entrenar algoritmos de inteligencia artificial 
                  para detectar change points automáticamente. La precisión de estos modelos depende de la 
                  calidad de las etiquetas que proporciones.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
