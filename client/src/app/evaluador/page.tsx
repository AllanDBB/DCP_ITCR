"use client";

import { useState } from 'react';
import Link from "next/link";

export default function EvaluadorPage() {
  const [showContributeSection, setShowContributeSection] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-sky-50 border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-6 md:mb-0">
              <Link href="/" className="text-blue-500 hover:text-blue-600 inline-flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Volver al inicio
              </Link>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-600 mt-2">Evaluador</h1>
              <p className="text-gray-600 mt-1">Sistema colaborativo de etiquetado para entrenamiento de algoritmos</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Contribuye al Desarrollo de IA</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Ayúdanos a crear un dataset de alta calidad para entrenar algoritmos de detección de change points. 
            Tu contribución es fundamental para mejorar la precisión de estos modelos.
          </p>
        </div>

        {/* Options Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          
          {/* Capacitación Card */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow duration-200">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-800">Capacitación</h3>
                <p className="text-sm text-green-600">Aprende los fundamentos</p>
              </div>
            </div>
            
            <p className="text-gray-600 mb-6 text-sm">
              Antes de comenzar a etiquetar, es importante que entiendas qué son los change points y cómo identificarlos correctamente en series temporales.
            </p>
            
            <div className="space-y-3 mb-6">
              <div className="flex items-center text-sm text-gray-700">
                <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Conceptos básicos de change points
              </div>
              <div className="flex items-center text-sm text-gray-700">
                <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Ejemplos prácticos interactivos
              </div>
              <div className="flex items-center text-sm text-gray-700">
                <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Ejercicios de práctica guiados
              </div>
              <div className="flex items-center text-sm text-gray-700">
                <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Criterios de calidad para etiquetado
              </div>
            </div>
            
            <Link 
              href="/evaluador/capacitacion" 
              className="inline-flex items-center justify-center w-full px-4 py-2 bg-green-500 text-white font-medium rounded-lg hover:bg-green-600 transition-colors duration-200"
            >
              Comenzar Capacitación
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {/* Evaluación Manual Card */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow duration-200">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-800">Mis Datasets Asignados</h3>
                <p className="text-sm text-blue-600">Ver series asignadas</p>
              </div>
            </div>
            
            <p className="text-gray-600 mb-6 text-sm">
              Accede a las series de tiempo que te han sido asignadas por el administrador para evaluar y etiquetar change points.
            </p>
            
            <div className="space-y-3 mb-6">
              <div className="flex items-center text-sm text-gray-700">
                <svg className="w-4 h-4 text-blue-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Interfaz intuitiva de etiquetado
              </div>
              <div className="flex items-center text-sm text-gray-700">
                <svg className="w-4 h-4 text-blue-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Series temporales reales de diversas fuentes
              </div>
              <div className="flex items-center text-sm text-gray-700">
                <svg className="w-4 h-4 text-blue-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Seguimiento de progreso personal
              </div>
              <div className="flex items-center text-sm text-gray-700">
                <svg className="w-4 h-4 text-blue-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Contribución directa a la investigación
              </div>
            </div>
            
            <Link 
              href="/evaluador/mis-datasets" 
              className="inline-flex items-center justify-center w-full px-4 py-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors duration-200"
            >
              Comenzar Evaluación
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Process Section */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Proceso de Contribución</h3>
            <p className="text-gray-600">Pasos simples para contribuir al avance de la inteligencia artificial</p>
          </div>
          
          <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-8">
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white text-xl font-bold mb-4">
                1
              </div>
              <h4 className="text-lg font-semibold text-gray-800 mb-2">Capacítate</h4>
              <p className="text-gray-600 max-w-48">
                Aprende a identificar change points con ejemplos prácticos
              </p>
            </div>
            
            {/* Arrow */}
            <div className="hidden md:block">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
            
            {/* Step 2 */}
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-xl font-bold mb-4">
                2
              </div>
              <h4 className="text-lg font-semibold text-gray-800 mb-2">Etiqueta</h4>
              <p className="text-gray-600 max-w-48">
                Marca change points en series temporales reales
              </p>
            </div>
            
            {/* Arrow */}
            <div className="hidden md:block">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
            
            {/* Step 3 */}
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl font-bold mb-4">
                3
              </div>
              <h4 className="text-lg font-semibold text-gray-800 mb-2">Contribuye</h4>
              <p className="text-gray-600 max-w-48">
                Tus etiquetas mejoran los algoritmos de IA
              </p>
            </div>
          </div>
        </div>

        {/* Additional Info Section */}
        <div className="text-center mb-8">
          <button
            onClick={() => setShowContributeSection(!showContributeSection)}
            className="inline-flex items-center px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors duration-200"
          >
            {showContributeSection ? 'Ocultar' : 'Ver'} información adicional
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

        {/* Collapsible Info */}
        {showContributeSection && (
          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-800 mb-6">Información Adicional</h3>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-semibold text-gray-800 mb-3">Consejos para el Etiquetado:</h4>
                <ul className="text-gray-600 space-y-2 text-sm">
                  <li>• Observa cambios en tendencia, varianza o nivel</li>
                  <li>• Marca el punto exacto donde ocurre el cambio</li>
                  <li>• Considera el contexto de toda la serie</li>
                  <li>• Sé consistente en tus criterios</li>
                  <li>• Usa "Sin change point" si no detectas cambios</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-800 mb-3">Impacto de tu Trabajo:</h4>
                <ul className="text-gray-600 space-y-2 text-sm">
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
    </div>
  );
}
