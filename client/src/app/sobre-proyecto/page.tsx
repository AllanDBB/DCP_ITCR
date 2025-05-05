import Link from "next/link";
import Footer from "@/components/footer";

export default function SobreProyectoPage() {
  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* Header/Hero Section */}
      <section className="bg-gradient-to-b from-blue-50 to-white border-t border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <Link href="/" className="inline-flex items-center text-blue-500 hover:text-blue-600 mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Volver al inicio
          </Link>
          
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-600 mb-4">
              Sobre el Proyecto <span className="text-blue-500">DCP-ITCR</span>
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed">
              Una iniciativa de investigación dedicada al desarrollo de métodos avanzados para la detección de Change Points en series temporales
            </p>
          </div>
        </div>
      </section>
      
      {/* Proyecto Overview */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-600 mb-6">¿Qué es DCP-ITCR?</h2>
              <p className="text-gray-600 mb-4">
                DCP-ITCR (Detección de Change Points - Instituto Tecnológico de Costa Rica) es una plataforma de investigación y herramienta tecnológica enfocada en la identificación automática de puntos de cambio en series temporales mediante algoritmos avanzados y técnicas de inteligencia artificial.
              </p>
              <p className="text-gray-600 mb-4">
                Los Change Points son momentos en una serie temporal donde las propiedades estadísticas de los datos cambian significativamente. Detectar estos puntos es crucial en múltiples campos como economía, medicina, climatología y monitoreo industrial.
              </p>
              <p className="text-gray-600">
                Nuestro proyecto combina investigación académica rigurosa con desarrollo de software de vanguardia para crear soluciones accesibles y potentes para investigadores, estudiantes y profesionales.
              </p>
            </div>
            <div className="bg-blue-50 p-8 rounded-xl">
              <div className="h-64 rounded-lg bg-white shadow-sm border border-blue-100 p-5 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-blue-500 font-semibold mb-3">Ejemplo de change point en datos de temperatura</div>
                  <div className="relative h-32 w-full">
                    <svg viewBox="0 0 400 100" className="w-full h-full">
                      {/* Eje X */}
                      <line x1="40" y1="80" x2="380" y2="80" stroke="#CBD5E0" strokeWidth="1" />
                      {/* Eje Y */}
                      <line x1="40" y1="20" x2="40" y2="80" stroke="#CBD5E0" strokeWidth="1" />
                      
                      {/* Etiquetas Y */}
                      <text x="30" y="25" fontSize="10" textAnchor="end" fill="#718096">30°C</text>
                      <text x="30" y="50" fontSize="10" textAnchor="end" fill="#718096">20°C</text>
                      <text x="30" y="75" fontSize="10" textAnchor="end" fill="#718096">10°C</text>
                      
                      {/* Etiquetas X */}
                      <text x="40" y="95" fontSize="10" textAnchor="middle" fill="#718096">2000</text>
                      <text x="210" y="95" fontSize="10" textAnchor="middle" fill="#718096">2010</text>
                      <text x="380" y="95" fontSize="10" textAnchor="middle" fill="#718096">2020</text>
                      
                      {/* Datos antes del change point */}
                      <polyline 
                        points="40,60 60,58 80,62 100,59 120,60 140,57 160,61 180,58 200,62" 
                        fill="none" 
                        stroke="#60A5FA" 
                        strokeWidth="2" 
                      />
                      
                      {/* Datos después del change point */}
                      <polyline 
                        points="200,62 220,45 240,42 260,48 280,40 300,45 320,38 340,42 360,35 380,40" 
                        fill="none" 
                        stroke="#60A5FA" 
                        strokeWidth="2" 
                      />
                      
                      {/* Marca change point */}
                      <circle cx="200" cy="62" r="5" fill="#EF4444" />
                      <line x1="200" y1="20" x2="200" y2="80" stroke="#EF4444" strokeWidth="1" strokeDasharray="3,3" />
                    </svg>
                  </div>
                  <div className="text-xs text-gray-500 mt-3">
                    Change point detectado en 2010 indicando un aumento promedio de temperatura
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Objetivos del proyecto */}
      <section className="bg-blue-50 py-16 border-t border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl font-bold text-gray-600 mb-4">Objetivos del Proyecto</h2>
            <p className="text-gray-600">
              Nuestro equipo de investigación ha establecido metas ambiciosas para expandir el conocimiento y las aplicaciones prácticas en el campo de la detección de Change Points.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-blue-100">
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Investigación Avanzada</h3>
              <p className="text-gray-600 text-sm">
                Desarrollar y perfeccionar algoritmos que mejoren la precisión en la detección de Change Points en diversos tipos de series temporales y bajo diferentes condiciones de ruido y señal.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-blue-100">
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Herramientas Accesibles</h3>
              <p className="text-gray-600 text-sm">
                Crear plataformas y herramientas de software que permitan a investigadores y profesionales sin experiencia en programación avanzada aplicar técnicas de detección de Change Points en sus datos.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-blue-100">
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Aplicaciones Prácticas</h3>
              <p className="text-gray-600 text-sm">
                Demostrar la aplicabilidad y utilidad de la detección de Change Points en campos como medicina, economía, ciencias ambientales e ingeniería mediante casos de uso prácticos.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Metodología */}
      <section className="bg-white py-16 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-600 mb-4">Nuestra Metodología</h2>
            <p className="text-gray-600 max-w-3xl">
              El proyecto DCP-ITCR utiliza un enfoque multidisciplinario que combina estadística, aprendizaje automático y ciencias computacionales para abordar el desafío de la detección de Change Points.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-700 mb-3">Algoritmos implementados</h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center mt-0.5">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="ml-2.5 text-sm text-gray-600">
                      <span className="font-medium">PELT (Pruned Exact Linear Time):</span> Algoritmo eficiente para detección óptima de múltiples change points.
                    </p>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center mt-0.5">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="ml-2.5 text-sm text-gray-600">
                      <span className="font-medium">CUSUM (Cumulative Sum):</span> Método clásico para detectar cambios en la media de una serie temporal.
                    </p>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center mt-0.5">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="ml-2.5 text-sm text-gray-600">
                      <span className="font-medium">Binary Segmentation:</span> Aproximación rápida para detectar múltiples change points secuencialmente.
                    </p>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center mt-0.5">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="ml-2.5 text-sm text-gray-600">
                      <span className="font-medium">Modelos basados en Deep Learning:</span> Redes neuronales para la detección automática en series complejas.
                    </p>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-3">Métricas de evaluación</h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center mt-0.5">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="ml-2.5 text-sm text-gray-600">
                      <span className="font-medium">Precisión y exhaustividad:</span> Medidas de la capacidad para detectar change points reales y evitar falsos positivos.
                    </p>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center mt-0.5">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="ml-2.5 text-sm text-gray-600">
                      <span className="font-medium">Error de localización:</span> Evaluación de la precisión en la ubicación temporal de los change points.
                    </p>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center mt-0.5">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="ml-2.5 text-sm text-gray-600">
                      <span className="font-medium">Eficiencia computacional:</span> Análisis del rendimiento y escalabilidad de los algoritmos.
                    </p>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Fases del proyecto</h3>
              <div className="space-y-6">
                <div className="flex">
                  <div className="flex-shrink-0 h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-lg font-medium text-blue-500">1</span>
                  </div>
                  <div className="ml-4 flex-1">
                    <h4 className="text-base font-medium text-gray-700">Investigación e implementación de algoritmos</h4>
                    <p className="mt-1 text-sm text-gray-600">
                      Estudio, adaptación e implementación de algoritmos para la detección de Change Points, con énfasis en su rendimiento y precisión.
                    </p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="flex-shrink-0 h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-lg font-medium text-blue-500">2</span>
                  </div>
                  <div className="ml-4 flex-1">
                    <h4 className="text-base font-medium text-gray-700">Desarrollo de plataforma web</h4>
                    <p className="mt-1 text-sm text-gray-600">
                      Creación de una interfaz web accesible que permite a los usuarios cargar datos, configurar parámetros y visualizar resultados.
                    </p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="flex-shrink-0 h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-lg font-medium text-blue-500">3</span>
                  </div>
                  <div className="ml-4 flex-1">
                    <h4 className="text-base font-medium text-gray-700">Validación con datasets reales</h4>
                    <p className="mt-1 text-sm text-gray-600">
                      Pruebas exhaustivas con conjuntos de datos de diversos campos para validar la efectividad de los algoritmos implementados.
                    </p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="flex-shrink-0 h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-lg font-medium text-blue-500">4</span>
                  </div>
                  <div className="ml-4 flex-1">
                    <h4 className="text-base font-medium text-gray-700">Documentación y divulgación</h4>
                    <p className="mt-1 text-sm text-gray-600">
                      Elaboración de documentación técnica, publicaciones académicas y materiales educativos sobre los métodos y resultados.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Aplicaciones */}
      <section className="bg-gradient-to-b from-blue-50 to-blue-100 py-16 border-t border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl font-bold text-gray-600 mb-4">Campos de Aplicación</h2>
            <p className="text-gray-600">
              La detección de Change Points tiene aplicaciones en numerosas áreas donde identificar cambios en patrones temporales es fundamental.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="font-medium text-lg text-gray-700 mb-2">Medicina</h3>
              <p className="text-sm text-gray-600">
                Detección de anomalías en señales biomédicas como ECG o EEG, identificación de cambios en patrones de sueño o monitoreo de parámetros fisiológicos en tiempo real.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="font-medium text-lg text-gray-700 mb-2">Economía y Finanzas</h3>
              <p className="text-sm text-gray-600">
                Análisis de mercados financieros, detección de cambios en tendencias económicas, identificación de puntos de inflexión en indicadores macroeconómicos o estudios de volatilidad.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="h-12 w-12 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                </svg>
              </div>
              <h3 className="font-medium text-lg text-gray-700 mb-2">Climatología</h3>
              <p className="text-sm text-gray-600">
                Estudio de cambios climáticos, detección de fenómenos meteorológicos anómalos, análisis de series temporales de temperatura, precipitación o niveles de contaminación ambiental.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
                </svg>
              </div>
              <h3 className="font-medium text-lg text-gray-700 mb-2">Ingeniería</h3>
              <p className="text-sm text-gray-600">
                Monitoreo de procesos industriales, detección de fallos en maquinaria, análisis de rendimiento en sistemas complejos o mantenimiento predictivo.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="h-12 w-12 bg-pink-100 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                </svg>
              </div>
              <h3 className="font-medium text-lg text-gray-700 mb-2">Redes Sociales</h3>
              <p className="text-sm text-gray-600">
                Análisis de tendencias en redes sociales, detección de cambios en patrones de comportamiento de usuarios o identificación de eventos virales.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="h-12 w-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="font-medium text-lg text-gray-700 mb-2">Ciberseguridad</h3>
              <p className="text-sm text-gray-600">
                Detección de intrusiones, análisis de tráfico de red anómalo, identificación de cambios en patrones de comportamiento que puedan indicar amenazas.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Colaboración */}
      <section className="bg-white py-16 border-t border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-2xl font-bold text-gray-600 mb-4">Colabora con Nosotros</h2>
            <p className="text-gray-600">
              El proyecto DCP-ITCR está abierto a colaboraciones académicas, industriales y comunitarias. Existen varias maneras de contribuir a nuestro proyecto.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-lg font-medium text-gray-700 mb-3">Para investigadores y académicos</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center mt-0.5">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="ml-2.5 text-sm text-gray-600">
                    Participar en la implementación de nuevos algoritmos
                  </p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center mt-0.5">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="ml-2.5 text-sm text-gray-600">
                    Colaborar en publicaciones científicas conjuntas
                  </p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center mt-0.5">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="ml-2.5 text-sm text-gray-600">
                    Proporcionar datasets para probar nuestros algoritmos
                  </p>
                </li>
              </ul>
              <div className="mt-6">
                <Link 
                  href="mailto:marsolis@itcr.ac.cr" 
                  className="inline-flex items-center text-blue-500 hover:text-blue-600 text-sm"
                >
                  Contactar al equipo de investigación
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </div>
            </div>
            
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-lg font-medium text-gray-700 mb-3">Para estudiantes y comunidad</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center mt-0.5">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="ml-2.5 text-sm text-gray-600">
                    Participar en la evaluación manual de datasets
                  </p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center mt-0.5">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="ml-2.5 text-sm text-gray-600">
                    Unirse al programa de pasantías técnicas o de investigación
                  </p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center mt-0.5">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="ml-2.5 text-sm text-gray-600">
                    Contribuir al código abierto de nuestras herramientas
                  </p>
                </li>
              </ul>
              <div className="mt-6">
                <Link 
                  href="/evaluador" 
                  className="inline-flex items-center text-blue-500 hover:text-blue-600 text-sm"
                >
                  Comenzar a evaluar datasets
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Publicaciones */}
      <section className="bg-gray-50 py-16 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-bold text-gray-600 mb-2">Publicaciones y Recursos</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Nuestro equipo comparte activamente el conocimiento a través de artículos académicos, documentación y recursos educativos.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100">
              <div className="p-6">
                <div className="text-xs text-blue-500 uppercase tracking-wider font-medium mb-1">Artículo Académico</div>
                <h3 className="font-medium text-gray-700 mb-2">Comparative Analysis of Change Point Detection Algorithms for Time Series Data</h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                  Este artículo presenta un análisis comparativo de cinco algoritmos para la detección de change points, evaluando su precisión y rendimiento en diferentes tipos de series temporales.
                </p>
                <div className="flex items-center justify-between">
                  <div className="text-xs text-gray-500">Publicado: Mayo 2024</div>
                  <Link href="#" className="text-xs text-blue-500 hover:text-blue-600">
                    Leer más
                  </Link>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100">
              <div className="p-6">
                <div className="text-xs text-green-500 uppercase tracking-wider font-medium mb-1">Documentación</div>
                <h3 className="font-medium text-gray-700 mb-2">Guía Técnica: Implementación del Algoritmo PELT en Python</h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                  Esta guía detalla la implementación paso a paso del algoritmo PELT (Pruned Exact Linear Time) para la detección de change points, con ejemplos de código en Python y explicaciones.
                </p>
                <div className="flex items-center justify-between">
                  <div className="text-xs text-gray-500">Actualizado: Abril 2024</div>
                  <Link href="#" className="text-xs text-blue-500 hover:text-blue-600">
                    Ver documentación
                  </Link>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100">
              <div className="p-6">
                <div className="text-xs text-purple-500 uppercase tracking-wider font-medium mb-1">Tutorial</div>
                <h3 className="font-medium text-gray-700 mb-2">Detección de Change Points en Series Financieras: Un Tutorial Práctico</h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                  Este tutorial muestra cómo aplicar técnicas de detección de change points a series temporales financieras, con un caso de estudio completo utilizando datos reales del mercado.
                </p>
                <div className="flex items-center justify-between">
                  <div className="text-xs text-gray-500">Publicado: Marzo 2024</div>
                  <Link href="#" className="text-xs text-blue-500 hover:text-blue-600">
                    Ver tutorial
                  </Link>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-10 text-center">
            <Link 
              href="/recursos" 
              className="inline-flex items-center rounded-lg bg-blue-50 text-blue-500 hover:bg-blue-100 px-5 py-2.5 text-sm font-medium transition-colors"
            >
              Ver todos los recursos
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="bg-gradient-to-r from-blue-400 to-sky-400 text-white py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">¿Quieres formar parte de este proyecto innovador?</h2>
          <p className="max-w-2xl mx-auto text-blue-50 mb-8">
            Únete a nuestra comunidad, colabora en la investigación o prueba nuestras herramientas de detección de Change Points.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              href="/registro" 
              className="rounded-lg bg-white text-blue-500 hover:bg-blue-50 px-6 py-3 text-base font-medium shadow-sm transition-colors"
            >
              Crear una cuenta
            </Link>
            <Link 
              href="/evaluador" 
              className="rounded-lg bg-blue-500 text-white hover:bg-blue-600 border border-blue-300 px-6 py-3 text-base font-medium shadow-sm transition-colors"
            >
              Probar el evaluador
            </Link>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <Footer />
    </div>
  );
}