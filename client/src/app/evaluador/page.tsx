"use client";

import EvaluadorHeader from "./components/EvaluadorHeader";
import EvaluationOptionCard from "./components/EvaluationOptionCard";
import AdditionalInfo from "./components/AdditionalInfo";

export default function EvaluadorPage() {
  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* Header */}
      <EvaluadorHeader />
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold text-gray-700">Métodos de Evaluación de Change Points</h2>
          <p className="mt-2 text-gray-600">
            Comience con la capacitación para aprender a identificar change points, luego elija entre evaluación manual o automática.
          </p>
        </div>

        {/* Capacitación Card - Destacada */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-2">Capacitación para Evaluadores</h3>
                <p className="text-green-100 mb-4">
                  Aprenda a identificar diferentes tipos de change points con ejemplos prácticos y ejercicios interactivos.
                </p>
                <ul className="text-green-100 text-sm space-y-1 mb-4">
                  <li>• Ejercicios preliminares guiados</li>
                  <li>• Ejemplos de cada tipo de change point</li>
                  <li>• Diferenciación entre outliers y change points</li>
                </ul>
                <a
                  href="/evaluador/capacitacion"
                  className="inline-flex items-center bg-white text-green-600 font-semibold py-2 px-6 rounded-lg hover:bg-green-50 transition-colors duration-200"
                >
                  Comenzar Capacitación
                  <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Evaluador Manual Card */}
          <EvaluationOptionCard
            title="Evaluación Manual"
            description="Ayude a entrenar nuestros algoritmos marcando manualmente los puntos de cambio en datasets seleccionados por nuestro equipo."
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            }
            features={[
              "Interfaz intuitiva para marcar puntos de cambio",
              "Contribuya a mejorar los modelos de IA",
              "Navegación y visualización por páginas"
            ]}
            linkText="Comenzar evaluación manual"
            href="/evaluador/manual"
            colorTheme="blue"
          />
            {/* Evaluador Automático Card */}
          <EvaluationOptionCard
            title="Evaluador Automático"
            description="Utilice nuestros algoritmos avanzados para detectar automáticamente change points en sus propios datasets."
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            }
            features={[
              "Múltiples algoritmos de detección disponibles",
              "Configuración avanzada de parámetros",
              "Exportación de resultados en múltiples formatos"
            ]}
            linkText="Usar evaluador automático"
            href="/evaluador/automatico"
            colorTheme="indigo"
          />
        </div>
        
        {/* Additional Information */}
        <AdditionalInfo />
      </div>
    </div>
  );
}