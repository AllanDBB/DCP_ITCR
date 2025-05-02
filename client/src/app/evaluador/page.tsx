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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold text-gray-700">Métodos de Evaluación de Change Points</h2>
          <p className="mt-2 text-gray-600">
            Elija entre evaluar manualmente datasets para entrenar algoritmos o utilizar nuestro evaluador automático para analizar sus propios datos.
          </p>
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
            href="#"
            colorTheme="indigo"
          />
        </div>
        
        {/* Additional Information */}
        <AdditionalInfo />
      </div>
    </div>
  );
}