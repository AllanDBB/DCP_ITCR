import Link from "next/link";
import Footer from "@/components/footer";
import TimeSeriesGraph from "@/app/components/timeSeriesGraph";
import FeatureCard from "@/app/components/card";
import StepCard from "@/app/components/stepCard";
import CTASection from "@/app/components/ctaSection";
import SectionHeader from "@/app/components/header";

export default function Home() {
  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="px-4 sm:px-6 md:px-8 py-16 bg-white border-t border-gray-100">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-block px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-medium">
              Proyecto de Investigación
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-gray-600">
              Detección de <span className="text-blue-500">Change Points</span> en series temporales
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed">
              Una herramienta avanzada para el análisis e identificación automática de puntos de cambio en datos secuenciales, facilitando el descubrimiento de patrones y anomalías.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Link href="/sobre-proyecto" className="rounded-lg bg-blue-400 text-white px-5 py-2.5 text-sm font-medium shadow-sm hover:bg-blue-500 transition-colors">
                Conocer más
              </Link>
              <Link href="/equipo" className="rounded-lg bg-white text-gray-700 border border-gray-200 px-5 py-2.5 text-sm font-medium shadow-sm hover:bg-gray-50 transition-colors">
                Nuestro equipo
              </Link>
            </div>
          </div>
          <div className="h-[300px] md:h-[400px] rounded-2xl overflow-hidden shadow-xl bg-gradient-to-br from-blue-50 via-blue-100 to-sky-100 flex items-center justify-center p-8">
            <div className="text-center">
              <div className="text-6xl font-bold text-blue-400 mb-4">DCP-ITCR</div>
              <div className="text-sm text-gray-600 max-w-xs mx-auto">
                Visualización y análisis avanzado de puntos de cambio en series de datos temporales
              </div>
              {/* Representación gráfica simplificada */}
              <div className="mt-6 flex items-center justify-center space-x-1">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item, index) => {
                  // El punto 5 es más alto para representar un change point
                  const height = index === 4 ? 'h-16' : 
                                  index < 4 ? 'h-6' : 'h-10';
                  return (
                    <div 
                      key={item} 
                      className={`w-3 ${height} rounded-full bg-blue-400 opacity-${index * 10}`}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-blue-50 px-4 sm:px-6 md:px-8 py-16 md:py-24">
        <div className="max-w-7xl mx-auto">
          <SectionHeader 
            title="Características Principales"
            description="Nuestra plataforma ofrece un conjunto de herramientas para la detección eficiente de Change Points"
          />
          
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              title="Análisis Avanzado"
              description="Algoritmos estadísticos de última generación para detectar cambios significativos en series de datos temporales."
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                </svg>
              }
            />
            
            <FeatureCard
              title="Gestión de Datos"
              description="Herramientas para importar, normalizar y limpiar conjuntos de datos antes del análisis de Change Points."
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                </svg>
              }
            />
            
            <FeatureCard
              title="Visualizaciones Interactivas"
              description="Gráficos dinámicos que permiten explorar y comprender los Change Points detectados en los datos."
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              }
            />
          </div>
        </div>
      </section>
      
      {/* How it works */}
      <section className="bg-blue-100 px-4 sm:px-6 md:px-8 py-16 text-center border-t border-blue-200">
        <SectionHeader 
          title="¿Cómo funciona?"
          description="Nuestro enfoque para la detección de Change Points utiliza metodología basada en evidencia"
        />
        
        <div className="grid md:grid-cols-4 gap-8">
          <StepCard 
            number={1}
            title="Carga de datos"
            description="Sube tus series temporales en múltiples formatos compatibles"
          />
          
          <StepCard 
            number={2}
            title="Preprocesamiento"
            description="Limpieza y normalización automática para análisis óptimo"
          />
          
          <StepCard 
            number={3}
            title="Detección"
            description="Aplicación de algoritmos para identificar puntos de cambio"
          />
          
          <StepCard 
            number={4}
            title="Visualización"
            description="Informes interactivos con los resultados del análisis"
          />
        </div>
      </section>

      {/* Gráfica de ejemplo mejorada */}
      <section className="px-4 sm:px-6 md:px-8 py-16 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto">
          <SectionHeader 
            title="Visualización de Change Points"
            description="Ejemplo de cómo se detectan puntos de cambio en una serie temporal"
          />
          
          <TimeSeriesGraph />
          
          <div className="mt-4 text-center text-sm text-gray-500">
            Serie temporal con cinco Change Points detectados que indican cambios significativos en el patrón de los datos
          </div>
        </div>
      </section>
      
      {/* NUEVA SECCIÓN: Evaluador de Change Points */}
      <section className="bg-gradient-to-r from-blue-50 to-sky-50 px-4 sm:px-6 md:px-8 py-16 border-t border-blue-100">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-600 mb-4">Evaluador de Change Points</h2>
              <p className="text-gray-600 mb-6">
                Nuestra herramienta especializada para detectar automáticamente puntos de cambio en tus series temporales. Sube tus datos y obtén resultados precisos en segundos.
              </p>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center mt-0.5">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="ml-2.5 text-sm text-gray-600">
                    Detección avanzada usando múltiples algoritmos
                  </p>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center mt-0.5">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="ml-2.5 text-sm text-gray-600">
                    Informes detallados con métricas estadísticas
                  </p>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center mt-0.5">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="ml-2.5 text-sm text-gray-600">
                    Exportación de resultados en múltiples formatos
                  </p>
                </div>
              </div>
              <div className="mt-8">
                <Link href="/evaluador" className="inline-flex items-center rounded-lg bg-blue-400 text-white px-5 py-2.5 text-sm font-medium shadow-sm hover:bg-blue-500 transition-colors">
                  Ir al Evaluador
                  <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-blue-100 p-6">
              {/* Mockup de interfaz de evaluador */}
              <div className="space-y-4">
                <div className="pb-4 border-b border-gray-100">
                  <h3 className="text-base font-medium text-gray-600 mb-2">Subir datos</h3>
                  <div className="h-16 rounded-lg border-2 border-dashed border-gray-200 bg-gray-50 flex items-center justify-center">
                    <span className="text-sm text-gray-400">Arrastra y suelta archivo CSV, XLSX...</span>
                  </div>
                </div>
                <div className="pb-4 border-b border-gray-100">
                  <h3 className="text-base font-medium text-gray-600 mb-2">Configurar algoritmo</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="h-8 rounded bg-gray-50 flex items-center px-3">
                      <span className="text-xs text-gray-400">PELT</span>
                    </div>
                    <div className="h-8 rounded bg-gray-50 flex items-center px-3">
                      <span className="text-xs text-gray-400">Umbral: 0.05</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-base font-medium text-gray-600 mb-2">Resultados</h3>
                  <div className="h-24 rounded bg-gray-50 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-sm font-medium text-blue-500">3 change points detectados</div>
                      <div className="text-xs text-gray-400 mt-1">Precisión estimada: 94%</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <CTASection
        title="¿Listo para descubrir los Change Points en tus datos?"
        description="Comienza a utilizar nuestra plataforma hoy mismo y descubre patrones ocultos en tus series temporales"
        buttonText="Comenzar ahora"
        buttonLink="/signin"
      />
      
      {/* Footer */}
      <Footer />
    </div>
  );
}