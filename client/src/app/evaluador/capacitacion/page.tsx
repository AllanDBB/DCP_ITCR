"use client";

import { useState } from "react";
import CapacitacionHeader from "./components/CapacitacionHeader";
import IntroduccionCapacitacion from "./components/IntroduccionCapacitacion";
import EjercicioPreliminar from "./components/EjercicioPreliminar";
import ContenidoCapacitacion from "./components/ContenidoCapacitacion";

export default function CapacitacionPage() {  const [currentSection, setCurrentSection] = useState<'introduccion' | 'ejercicio' | 'contenido'>('introduccion');
  const [ejercicioCompletado, setEjercicioCompletado] = useState(false);

  const handleContinuar = () => {
    if (currentSection === 'introduccion') {
      setCurrentSection('ejercicio');
    } else if (currentSection === 'ejercicio' && ejercicioCompletado) {
      setCurrentSection('contenido');
    }
  };

  const handleEjercicioCompletado = () => {
    setEjercicioCompletado(true);
  };  const handleCapacitacionCompletada = () => {
    // Redirigir al evaluador manual después de completar la capacitación
    window.location.href = '/evaluador/manual';
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <CapacitacionHeader />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            <div className={`flex items-center ${currentSection === 'introduccion' ? 'text-blue-600' : 'text-green-600'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium text-white ${
                currentSection === 'introduccion' ? 'bg-blue-600' : 'bg-green-600'
              }`}>
                1
              </div>
              <span className="ml-2 font-medium">Introducción</span>
            </div>
            
            <div className={`w-16 h-1 rounded ${currentSection !== 'introduccion' ? 'bg-green-600' : 'bg-gray-300'}`}></div>
            
            <div className={`flex items-center ${
              currentSection === 'ejercicio' ? 'text-blue-600' : 
              currentSection === 'contenido' ? 'text-green-600' : 'text-gray-400'
            }`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium text-white ${
                currentSection === 'ejercicio' ? 'bg-blue-600' : 
                currentSection === 'contenido' ? 'bg-green-600' : 'bg-gray-400'
              }`}>
                2
              </div>
              <span className="ml-2 font-medium">Ejercicio Preliminar</span>
            </div>
            
            <div className={`w-16 h-1 rounded ${currentSection === 'contenido' ? 'bg-green-600' : 'bg-gray-300'}`}></div>
            
            <div className={`flex items-center ${currentSection === 'contenido' ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium text-white ${
                currentSection === 'contenido' ? 'bg-blue-600' : 'bg-gray-400'
              }`}>
                3
              </div>
              <span className="ml-2 font-medium">Contenido de Capacitación</span>
            </div>
          </div>
        </div>

        {/* Content sections */}
        {currentSection === 'introduccion' && (
          <IntroduccionCapacitacion onContinuar={handleContinuar} />
        )}
        
        {currentSection === 'ejercicio' && (
          <EjercicioPreliminar 
            onCompletado={handleEjercicioCompletado}
            onContinuar={handleContinuar}
            completado={ejercicioCompletado}
          />
        )}
        
        {currentSection === 'contenido' && (
          <ContenidoCapacitacion 
            onCompletado={handleCapacitacionCompletada}
          />
        )}
      </div>
    </div>
  );
}
