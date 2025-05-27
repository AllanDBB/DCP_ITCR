"use client";

import { useState } from "react";

interface EjercicioPreliminarProps {
  onCompletado: () => void;
  onContinuar: () => void;
  completado: boolean;
}

interface EjercicioSerie {
  id: number;
  nombre: string;
  datos: {x: number, y: number}[];
  changePointCorrecto?: number; // null si no hay change point
  tipoChangePoint?: 'media' | 'tendencia' | 'varianza' | 'periodicidad' | 'ninguno';
  descripcion: string;
}

// Datos simulados basados en el paper (sección D.2)
const seriesEjercicio: EjercicioSerie[] = [
  {
    id: 1,
    nombre: "Serie 1 - Change Point en Media",
    changePointCorrecto: 50,
    tipoChangePoint: 'media',
    descripcion: "Esta serie presenta un cambio abrupto en el nivel promedio alrededor del punto 50.",
    datos: Array.from({length: 100}, (_, i) => ({
      x: i,
      y: i < 50 ? 10 + Math.random() * 2 : 15 + Math.random() * 2
    }))
  },
  {
    id: 2,
    nombre: "Serie 2 - Change Point en Media",
    changePointCorrecto: 30,
    tipoChangePoint: 'media',
    descripcion: "Observe el cambio de nivel que ocurre alrededor del punto 30.",
    datos: Array.from({length: 100}, (_, i) => ({
      x: i,
      y: i < 30 ? 20 + Math.random() * 3 : 12 + Math.random() * 3
    }))
  },
  {
    id: 3,
    nombre: "Serie 3 - Change Point en Media",
    changePointCorrecto: 70,
    tipoChangePoint: 'media',
    descripcion: "El cambio en el nivel promedio es visible alrededor del punto 70.",
    datos: Array.from({length: 100}, (_, i) => ({
      x: i,
      y: i < 70 ? 8 + Math.random() * 2 : 18 + Math.random() * 2
    }))
  },
  {
    id: 4,
    nombre: "Serie 4 - Change Point en Media",
    changePointCorrecto: 40,
    tipoChangePoint: 'media',
    descripcion: "Note el cambio sostenido en el nivel promedio cerca del punto 40.",
    datos: Array.from({length: 100}, (_, i) => ({
      x: i,
      y: i < 40 ? 25 + Math.random() * 3 : 15 + Math.random() * 3
    }))
  },
  {
    id: 5,
    nombre: "Serie 5 - Sin Change Point",
    changePointCorrecto: undefined,
    tipoChangePoint: 'ninguno',
    descripcion: "Esta serie no presenta ningún change point, mantiene un comportamiento estable.",
    datos: Array.from({length: 100}, (_, i) => ({
      x: i,
      y: 15 + Math.sin(i / 10) * 2 + Math.random() * 1
    }))
  }
];

export default function EjercicioPreliminar({ onCompletado, onContinuar, completado }: EjercicioPreliminarProps) {
  const [serieActual, setSerieActual] = useState(0);
  const [puntoSeleccionado, setPuntoSeleccionado] = useState<number | null>(null);
  const [sinChangePoint, setSinChangePoint] = useState(false);
  const [intentos, setIntentos] = useState(0);
  const [mostrarRespuesta, setMostrarRespuesta] = useState(false);
  const [seriesCompletadas, setSeriesCompletadas] = useState<boolean[]>(new Array(5).fill(false));  const [respuestaCorrecta, setRespuestaCorrecta] = useState(false);

  const serie = seriesEjercicio[serieActual];

  const handlePuntoClick = (index: number) => {
    if (!mostrarRespuesta && !respuestaCorrecta) {
      setPuntoSeleccionado(index);
      setSinChangePoint(false);
    }
  };

  const handleSinChangePoint = () => {
    if (!mostrarRespuesta && !respuestaCorrecta) {
      setSinChangePoint(true);
      setPuntoSeleccionado(null);
    }
  };

  const verificarRespuesta = () => {
    const esCorrecta = sinChangePoint 
      ? serie.changePointCorrecto === undefined
      : puntoSeleccionado !== null && serie.changePointCorrecto !== undefined &&
        Math.abs(puntoSeleccionado - serie.changePointCorrecto) <= 5;

    if (esCorrecta) {
      setRespuestaCorrecta(true);
      const nuevasCompletadas = [...seriesCompletadas];
      nuevasCompletadas[serieActual] = true;
      setSeriesCompletadas(nuevasCompletadas);
      
      setTimeout(() => {
        if (serieActual < seriesEjercicio.length - 1) {
          siguienteSerie();
        } else {
          onCompletado();
        }
      }, 2000);
    } else {
      setIntentos(prev => prev + 1);
      if (intentos >= 2) {
        setMostrarRespuesta(true);
      }
    }
  };

  const siguienteSerie = () => {
    setSerieActual(prev => prev + 1);
    setPuntoSeleccionado(null);
    setSinChangePoint(false);
    setIntentos(0);
    setMostrarRespuesta(false);
    setRespuestaCorrecta(false);
  };

  const continuarDespuesRespuesta = () => {
    if (serieActual < seriesEjercicio.length - 1) {
      siguienteSerie();
    } else {
      onCompletado();
    }
  };

  const todoCompletado = seriesCompletadas.every(completada => completada);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Ejercicio Preliminar
          </h2>
          <p className="text-lg text-gray-600 max-w-4xl mx-auto">
            Antes de dar inicio con la identificación de change points, haremos un ejercicio para poner en práctica 
            los conocimientos descritos en la introducción. En el ejercicio le mostraremos cinco series de tiempo, 
            en cuatro de ellas hay un change point en la media y en otra no hay change point. Su tarea consiste en 
            identificar dónde está el change point.
          </p>
        </div>

        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">
              Serie {serieActual + 1} de {seriesEjercicio.length}
            </span>
            <span className="text-sm text-gray-500">
              {seriesCompletadas.filter(Boolean).length} completadas
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((serieActual + (respuestaCorrecta ? 1 : 0)) / seriesEjercicio.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {!todoCompletado && (
          <div className="space-y-6">
            {/* Instrucciones */}
            <div className="bg-blue-50 rounded-lg p-6 border-l-4 border-blue-500">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">
                Instrucciones:
              </h3>
              <p className="text-blue-700">
                Por favor, marque el punto en la serie temporal donde ocurre un cambio abrupto en el comportamiento 
                de la serie. Si considera que no hay change point, marque la casilla correspondiente. 
                Tiene tres intentos para encontrar la respuesta correcta.
              </p>
            </div>            {/* Serie actual */}
            <div className="border rounded-lg p-6">              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-800">
                  {serie.nombre}
                </h3>
                <p className="text-sm text-gray-600">
                  Serie {serieActual + 1} de {seriesEjercicio.length}
                </p>
              </div>{/* Gráfica mejorada */}
              <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4 relative">
                <svg width="100%" height="350" viewBox="0 0 800 350" className="border rounded bg-gradient-to-b from-gray-50 to-white">
                  {/* Definir gradientes y filtros */}
                  <defs>
                    <linearGradient id="exerciseLineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.8"/>
                      <stop offset="100%" stopColor="#1E40AF" stopOpacity="1"/>
                    </linearGradient>
                    <linearGradient id="exerciseAreaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.1"/>
                      <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.02"/>
                    </linearGradient>
                    <filter id="exerciseShadow" x="-50%" y="-50%" width="200%" height="200%">
                      <feDropShadow dx="0" dy="1" stdDeviation="1" floodOpacity="0.3"/>
                    </filter>
                  </defs>
                  
                  {/* Área de fondo de la gráfica */}
                  <rect x="50" y="50" width="700" height="250" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1" rx="4"/>
                  
                  {/* Líneas de cuadrícula mejoradas */}
                  <g stroke="#E5E7EB" strokeWidth="1" opacity="0.6">
                    <line x1="50" y1="100" x2="750" y2="100" strokeDasharray="2,4" />
                    <line x1="50" y1="150" x2="750" y2="150" strokeDasharray="2,4" />
                    <line x1="50" y1="200" x2="750" y2="200" strokeDasharray="2,4" />
                    <line x1="50" y1="250" x2="750" y2="250" strokeDasharray="2,4" />
                    
                    {/* Líneas verticales */}
                    <line x1="225" y1="50" x2="225" y2="320" strokeDasharray="2,4" />
                    <line x1="400" y1="50" x2="400" y2="320" strokeDasharray="2,4" />
                    <line x1="575" y1="50" x2="575" y2="320" strokeDasharray="2,4" />
                  </g>
                  
                  {/* Ejes principales */}
                  <line x1="50" y1="320" x2="750" y2="320" stroke="#374151" strokeWidth="2"/>
                  <line x1="50" y1="50" x2="50" y2="320" stroke="#374151" strokeWidth="2"/>
                    {/* Etiquetas del eje Y */}
                  <g className="text-xs fill-gray-600" fontFamily="system-ui">
                    <text x="40" y="325" textAnchor="end">5</text>
                    <text x="40" y="275" textAnchor="end">10</text>
                    <text x="40" y="225" textAnchor="end">15</text>
                    <text x="40" y="175" textAnchor="end">20</text>
                    <text x="40" y="125" textAnchor="end">25</text>
                    <text x="40" y="75" textAnchor="end">30</text>
                  </g>
                  
                  {/* Etiquetas del eje X */}
                  <g className="text-xs fill-gray-600" fontFamily="system-ui">
                    <text x="50" y="340" textAnchor="middle">0</text>
                    <text x="225" y="340" textAnchor="middle">25</text>
                    <text x="400" y="340" textAnchor="middle">50</text>
                    <text x="575" y="340" textAnchor="middle">75</text>
                    <text x="750" y="340" textAnchor="middle">100</text>
                  </g>
                  
                  {/* Etiquetas de ejes */}
                  <text x="400" y="320" textAnchor="middle" className="text-sm fill-gray-700 font-medium" dy="25">Tiempo (índice)</text>
                  <text x="25" y="185" textAnchor="middle" className="text-sm fill-gray-700 font-medium" transform="rotate(-90 25 185)">Valor</text>
                    {/* Área de relleno */}
                  <polygon
                    points={`50,320 ${serie.datos.map(punto => {
                      const y = 320 - ((punto.y - 5) / 25) * 270;
                      return `${50 + (punto.x / 100) * 700},${y}`;
                    }).join(' ')} 750,320`}
                    fill="url(#exerciseAreaGradient)"
                  />
                  
                  {/* Línea principal de datos */}
                  <polyline
                    fill="none"
                    stroke="url(#exerciseLineGradient)"
                    strokeWidth="2.5"
                    filter="url(#exerciseShadow)"
                    points={serie.datos.map(punto => {
                      const y = 320 - ((punto.y - 5) / 25) * 270;
                      return `${50 + (punto.x / 100) * 700},${y}`;
                    }).join(' ')}
                  />                  {/* Puntos clicables mejorados */}
                  {serie.datos.map((punto, index) => {
                    const y = 320 - ((punto.y - 5) / 25) * 270;
                    const x = 50 + (punto.x / 100) * 700;
                    const isSelected = puntoSeleccionado === index;
                    
                    return (
                      <g key={index}>
                        {/* Área de clic más grande e invisible */}
                        <circle
                          cx={x}
                          cy={y}
                          r="10"
                          fill="transparent"
                          className="cursor-pointer"
                          onClick={() => handlePuntoClick(index)}
                        />
                        {/* Círculo visual exterior */}
                        <circle
                          cx={x}
                          cy={y}
                          r={isSelected ? "6" : "4"}
                          fill="#FFFFFF"
                          stroke={isSelected ? "#EF4444" : "#3B82F6"}
                          strokeWidth="2"
                          filter="url(#exerciseShadow)"
                          className="pointer-events-none"
                        />
                        {/* Círculo visual interior */}
                        <circle
                          cx={x}
                          cy={y}
                          r={isSelected ? "3" : "2"}
                          fill={isSelected ? "#EF4444" : "#3B82F6"}
                          className="pointer-events-none"
                        />
                      </g>
                    );
                  })}
                  
                  {/* Mostrar respuesta correcta con mejor visualización */}
                  {mostrarRespuesta && serie.changePointCorrecto !== undefined && (
                    <g>
                      {/* Línea vertical indicadora */}
                      <line 
                        x1={50 + (serie.changePointCorrecto / 100) * 700}
                        y1="50" 
                        x2={50 + (serie.changePointCorrecto / 100) * 700}
                        y2="320" 
                        stroke="#10B981" 
                        strokeWidth="2" 
                        strokeDasharray="5,3"
                        opacity="0.8"
                      />
                        {/* Círculo de respuesta correcta */}
                      <circle
                        cx={50 + (serie.changePointCorrecto / 100) * 700}
                        cy={320 - ((serie.datos[serie.changePointCorrecto].y - 5) / 25) * 270}
                        r="12"
                        fill="#DCFCE7"
                        stroke="#10B981"
                        strokeWidth="3"
                        filter="url(#exerciseShadow)"
                      />
                      
                      <circle
                        cx={50 + (serie.changePointCorrecto / 100) * 700}
                        cy={320 - ((serie.datos[serie.changePointCorrecto].y - 5) / 25) * 270}
                        r="8"
                        fill="#10B981"
                        stroke="#FFFFFF"
                        strokeWidth="2"
                      />
                      
                      <text 
                        x={50 + (serie.changePointCorrecto / 100) * 700}
                        y={320 - ((serie.datos[serie.changePointCorrecto].y - 5) / 25) * 270 + 2}
                        textAnchor="middle" 
                        className="text-xs fill-white font-bold"
                        fontFamily="system-ui"
                      >
                        ✓
                      </text>
                    </g>                  )}
                </svg>
                
                {/* Instrucciones en la gráfica */}
                <div className="absolute top-2 right-2 bg-white bg-opacity-95 p-3 rounded-lg text-xs text-gray-700 border shadow-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Haga clic en un punto para marcarlo</span>
                  </div>
                </div>
              </div>

              {/* Controles */}
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={sinChangePoint}
                      onChange={handleSinChangePoint}
                      disabled={mostrarRespuesta || respuestaCorrecta}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span className="text-gray-700">No hay change point en esta serie</span>
                  </label>
                </div>

                {puntoSeleccionado !== null && !sinChangePoint && (
                  <p className="text-sm text-gray-600">
                    Punto seleccionado: {puntoSeleccionado}
                  </p>
                )}

                {intentos > 0 && !respuestaCorrecta && !mostrarRespuesta && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-red-700">
                      Respuesta incorrecta. Intentos restantes: {3 - intentos}
                    </p>
                  </div>
                )}

                {mostrarRespuesta && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-green-800 font-medium mb-2">Respuesta correcta:</p>
                    <p className="text-green-700">
                      {serie.changePointCorrecto !== undefined 
                        ? `El change point está en el punto ${serie.changePointCorrecto}. ${serie.descripcion}`
                        : `Esta serie no tiene change point. ${serie.descripcion}`
                      }
                    </p>
                  </div>
                )}

                {respuestaCorrecta && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-green-800 font-medium">
                      ¡Correcto! {serie.descripcion}
                    </p>
                  </div>
                )}

                {/* Botones */}
                <div className="flex justify-between">
                  <div>
                    {(puntoSeleccionado !== null || sinChangePoint) && !respuestaCorrecta && !mostrarRespuesta && (
                      <button
                        onClick={verificarRespuesta}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
                      >
                        Verificar Respuesta
                      </button>
                    )}
                  </div>

                  <div>
                    {mostrarRespuesta && (
                      <button
                        onClick={continuarDespuesRespuesta}
                        className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
                      >
                        {serieActual < seriesEjercicio.length - 1 ? 'Siguiente Serie' : 'Finalizar Ejercicio'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {todoCompletado && completado && (
          <div className="text-center space-y-6">
            <div className="bg-green-50 rounded-lg p-8 border border-green-200">
              <div className="text-green-600 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-green-800 mb-2">
                ¡Ejercicio Completado!
              </h3>
              <p className="text-green-700">
                Ha completado exitosamente el ejercicio preliminar. 
                Ahora está listo para continuar con el contenido de capacitación.
              </p>
            </div>
            
            <button
              onClick={onContinuar}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 text-lg"
            >
              Continuar con la Capacitación
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
