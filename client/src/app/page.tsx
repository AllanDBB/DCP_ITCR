import Link from "next/link";
import Footer from "@/components/footer";
import TimeSeriesGraph from "@/app/components/timeSeriesGraph";
import FeatureCard from "@/app/components/card";
import StepCard from "@/app/components/stepCard";
import CTASection from "@/app/components/ctaSection";
import SectionHeader from "@/app/components/header";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 pt-16">      {/* Hero Section */}
      <section className="relative px-4 sm:px-6 md:px-8 py-20 bg-gradient-to-br from-blue-50 via-white to-sky-50 border-t border-gray-100 overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-32 w-80 h-80 rounded-full bg-gradient-to-br from-blue-100/50 to-sky-100/30 blur-3xl"></div>
          <div className="absolute -bottom-40 -left-32 w-80 h-80 rounded-full bg-gradient-to-tr from-purple-100/50 to-blue-100/30 blur-3xl"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-50 to-sky-50 border border-blue-100 text-blue-700 text-sm font-medium">
                <span className="w-2 h-2 bg-blue-400 rounded-full mr-2 animate-pulse"></span>
                Proyecto de Investigación - ITCR
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-800 leading-tight">
                Detección de{" "}
                <span className="bg-gradient-to-r from-blue-500 to-sky-500 bg-clip-text text-transparent">
                  Change Points
                </span>
                <br />
                en series temporales
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed max-w-2xl">
                Una herramienta avanzada que utiliza inteligencia artificial para identificar automáticamente puntos de cambio en datos secuenciales, facilitando el descubrimiento de patrones y anomalías.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link href="/sobre-proyecto" className="group inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-blue-500 to-sky-500 text-white px-8 py-4 text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105">
                  Conocer más
                  <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
                <Link href="/equipo" className="inline-flex items-center justify-center rounded-xl bg-white text-gray-700 border border-gray-200 px-8 py-4 text-sm font-semibold shadow-md hover:shadow-lg hover:bg-gray-50 transition-all duration-200">
                  Nuestro equipo
                </Link>
              </div>
            </div>
            
            <div className="relative">
              <div className="relative h-[300px] md:h-[450px] rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-white via-blue-50 to-sky-100 border border-white/20 backdrop-blur-sm">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-sky-500/10"></div>
                <div className="relative h-full flex flex-col items-center justify-center p-8">
                  <div className="text-center space-y-6">
                    <div className="text-7xl font-bold bg-gradient-to-r from-blue-500 to-sky-500 bg-clip-text text-transparent">
                      DCP
                    </div>
                    <div className="text-lg text-gray-600 max-w-xs mx-auto font-medium">
                      Visualización y análisis avanzado de puntos de cambio
                    </div>
                    
                    {/* Animated graph representation */}
                    <div className="mt-8 flex items-end justify-center space-x-2">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item, index) => {
                        const heights = ['h-4', 'h-6', 'h-5', 'h-7', 'h-12', 'h-14', 'h-16', 'h-13', 'h-11', 'h-9'];
                        const delays = ['delay-0', 'delay-75', 'delay-150', 'delay-225', 'delay-300', 'delay-375', 'delay-450', 'delay-525', 'delay-600', 'delay-675'];
                        return (
                          <div 
                            key={item} 
                            className={`w-3 ${heights[index]} rounded-full bg-gradient-to-t from-blue-400 to-sky-400 opacity-80 animate-pulse ${delays[index]}`}
                          />
                        );
                      })}
                    </div>
                    
                    {/* Change point indicator */}
                    <div className="flex items-center justify-center space-x-2 text-sm text-blue-600 font-medium">
                      <div className="w-2 h-2 bg-red-400 rounded-full animate-ping"></div>
                      <span>Change Point detectado</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-blue-400 to-sky-400 rounded-2xl opacity-20 animate-float"></div>
              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-br from-purple-400 to-blue-400 rounded-2xl opacity-20 animate-float" style={{animationDelay: '1s'}}></div>
            </div>
          </div>
        </div>
      </section>      {/* Features Section */}
      <section className="relative bg-gradient-to-b from-gray-50 to-white px-4 sm:px-6 md:px-8 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Características Principales
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Nuestra plataforma ofrece un conjunto completo de herramientas para la detección eficiente de Change Points
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-sky-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-200">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Análisis Avanzado</h3>
                <p className="text-gray-600 leading-relaxed">
                  Algoritmos estadísticos de última generación para detectar cambios significativos en series de datos temporales con alta precisión.
                </p>
              </div>
            </div>

            <div className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
              <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-200">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Gestión de Datos</h3>
                <p className="text-gray-600 leading-relaxed">
                  Herramientas intuitivas para importar, normalizar y limpiar conjuntos de datos antes del análisis de Change Points.
                </p>
              </div>
            </div>

            <div className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-violet-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-200">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Visualizaciones Interactivas</h3>
                <p className="text-gray-600 leading-relaxed">
                  Gráficos dinámicos y dashboards interactivos que permiten explorar y comprender los Change Points detectados.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
        {/* How it works */}
      <section className="relative bg-gradient-to-br from-blue-50 via-sky-50 to-blue-100 px-4 sm:px-6 md:px-8 py-20 overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-32 h-32 bg-blue-200/30 rounded-full blur-2xl"></div>
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-sky-200/30 rounded-full blur-2xl"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              ¿Cómo funciona?
            </h2>            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Nuestro enfoque para la detección de Change Points utiliza algoritmos avanzados y técnicas de inteligencia artificial
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            <div className="relative group">
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/50 backdrop-blur-sm">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-sky-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-200">
                    <span className="text-2xl font-bold text-white">1</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Carga de datos</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Sube tus series temporales en múltiples formatos compatibles (CSV, Excel, JSON)
                  </p>
                </div>
              </div>
              {/* Connector line */}
              <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-blue-300 to-sky-300 transform -translate-y-1/2 z-10"></div>
            </div>
            
            <div className="relative group">
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/50 backdrop-blur-sm">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-200">
                    <span className="text-2xl font-bold text-white">2</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Preprocesamiento</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Limpieza y normalización automática para análisis óptimo de los datos
                  </p>
                </div>
              </div>
              <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-green-300 to-emerald-300 transform -translate-y-1/2 z-10"></div>
            </div>
            
            <div className="relative group">
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/50 backdrop-blur-sm">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-violet-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-200">
                    <span className="text-2xl font-bold text-white">3</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Detección</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Aplicación de algoritmos avanzados para identificar puntos de cambio
                  </p>
                </div>
              </div>
              <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-purple-300 to-violet-300 transform -translate-y-1/2 z-10"></div>
            </div>
            
            <div className="relative group">
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/50 backdrop-blur-sm">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-200">
                    <span className="text-2xl font-bold text-white">4</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Visualización</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Informes interactivos con los resultados del análisis detallado
                  </p>
                </div>
              </div>
            </div>
          </div>
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
      <section className="relative bg-gradient-to-br from-slate-50 via-blue-50 to-sky-50 px-4 sm:px-6 md:px-8 py-20 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-10 right-20 w-72 h-72 bg-gradient-to-br from-blue-100/40 to-sky-100/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 left-20 w-72 h-72 bg-gradient-to-tr from-purple-100/40 to-blue-100/20 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div>
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-sky-100 border border-blue-200 text-blue-700 text-sm font-medium mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Herramienta Principal
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6 leading-tight">
                  Evaluador de{" "}
                  <span className="bg-gradient-to-r from-blue-500 to-sky-500 bg-clip-text text-transparent">
                    Change Points
                  </span>
                </h2>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Nuestra herramienta especializada utiliza algoritmos de inteligencia artificial para detectar automáticamente puntos de cambio en tus series temporales. Obtén resultados precisos en segundos.
                </p>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-start group">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-sky-500 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-200">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Detección Avanzada</h3>
                    <p className="text-gray-600">
                      Múltiples algoritmos trabajando en conjunto: CUSUM, PELT, Binary Segmentation y más
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start group">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-200">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Informes Detallados</h3>
                    <p className="text-gray-600">
                      Métricas estadísticas completas, intervalos de confianza y análisis de significancia
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start group">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-purple-500 to-violet-500 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-200">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Exportación Versátil</h3>
                    <p className="text-gray-600">
                      Resultados disponibles en CSV, JSON, PDF y visualizaciones interactivas
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="pt-4">
                <Link href="/evaluador" className="group inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-blue-500 to-sky-500 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105">
                  Ir al Evaluador
                  <svg xmlns="http://www.w3.org/2000/svg" className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-white rounded-3xl shadow-2xl border border-white/20 backdrop-blur-sm p-8 hover:shadow-3xl transition-shadow duration-300">
                {/* Mockup de interfaz mejorado */}
                <div className="space-y-6">
                  <div className="pb-6 border-b border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-800">Subir datos</h3>
                      <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                    </div>
                    <div className="relative h-20 rounded-xl border-2 border-dashed border-blue-200 bg-gradient-to-br from-blue-50 to-sky-50 flex items-center justify-center group hover:border-blue-300 transition-colors">
                      <div className="text-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-400 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <span className="text-sm text-gray-500 font-medium">CSV, XLSX, JSON...</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pb-6 border-b border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Configurar algoritmo</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="h-12 rounded-xl bg-gradient-to-r from-blue-50 to-blue-100 flex items-center px-4 border border-blue-200">
                        <span className="text-sm font-medium text-blue-700">PELT</span>
                      </div>
                      <div className="h-12 rounded-xl bg-gradient-to-r from-green-50 to-green-100 flex items-center px-4 border border-green-200">
                        <span className="text-sm font-medium text-green-700">Umbral: 0.05</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Resultados</h3>
                    <div className="h-32 rounded-xl bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center border border-gray-200">
                      <div className="text-center">
                        <div className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-sky-500 bg-clip-text text-transparent">
                          3 change points
                        </div>
                        <div className="text-sm text-gray-500 mt-2">Precisión estimada: 94%</div>
                        <div className="flex items-center justify-center mt-3 space-x-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <svg key={star} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating elements */}
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-blue-400/20 to-sky-400/20 rounded-2xl backdrop-blur-sm animate-float"></div>
              <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-gradient-to-br from-purple-400/20 to-violet-400/20 rounded-2xl backdrop-blur-sm animate-float" style={{animationDelay: '1.5s'}}></div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <CTASection
        title="¿Listo para descubrir los Change Points en tus datos?"
        description="Comienza a utilizar nuestra plataforma hoy mismo y descubre patrones ocultos en tus series temporales"
        buttonText="Comenzar ahora"
        buttonLink="/iniciar-sesion"
      />
      
      {/* Footer */}
      <Footer />
    </div>
  );
}