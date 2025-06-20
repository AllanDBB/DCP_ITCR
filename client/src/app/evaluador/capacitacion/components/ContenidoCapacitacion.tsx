"use client";

import { useState } from "react";

interface ContenidoCapacitacionProps {
  onCompletado: () => void;
}

interface EjemploSerie {
  id: number;
  nombre: string;
  tipo: 'media' | 'tendencia' | 'varianza' | 'periodicidad' | 'ninguno';
  descripcion: string;
  explicacion: string;
  datos: {x: number, y: number}[];
  changePoints?: number[];
  outliers?: number[];
}

// Datos basados en las figuras del paper (páginas 34-35)
const ejemplosSeries: EjemploSerie[] = [
  // Change Points en Media
  {
    id: 47,
    nombre: "Serie 47 - Change Point en Media",
    tipo: 'media',
    descripcion: "Esta serie presenta un cambio abrupto en el nivel promedio.",
    explicacion: "Observe cómo la serie mantiene un nivel constante hasta aproximadamente el punto 30, donde ocurre un cambio súbito hacia un nivel superior que se mantiene durante el resto de la serie. Este es un ejemplo clásico de change point en la media.",
    datos: Array.from({length: 100}, (_, i) => ({
      x: i,
      y: i < 30 ? 10 + Math.random() * 1.5 : 17 + Math.random() * 1.5
    })),
    changePoints: [30]
  },
  {
    id: 48,
    nombre: "Serie 48 - Change Point en Media",
    tipo: 'media',
    descripcion: "Cambio descendente en el nivel promedio de la serie.",
    explicacion: "En este caso, la serie comienza en un nivel alto y experimenta una disminución abrupta alrededor del punto 50, manteniéndose en este nuevo nivel inferior. Note que el cambio es sostenido, no temporal.",
    datos: Array.from({length: 100}, (_, i) => ({
      x: i,
      y: i < 50 ? 20 + Math.random() * 2 : 12 + Math.random() * 2
    })),
    changePoints: [50]
  },
  {
    id: 51,
    nombre: "Serie 51 - Change Point en Media",
    tipo: 'media',
    descripcion: "Serie con múltiples cambios en el nivel promedio.",
    explicacion: "Esta serie muestra dos change points en la media: uno alrededor del punto 25 (aumento) y otro alrededor del punto 70 (disminución). Cada segmento mantiene un nivel promedio diferente.",
    datos: Array.from({length: 100}, (_, i) => ({
      x: i,
      y: i < 25 ? 8 + Math.random() * 1.5 : 
          i < 70 ? 15 + Math.random() * 1.5 : 
          6 + Math.random() * 1.5
    })),
    changePoints: [25, 70]
  },

  // Change Point en Tendencia
  {
    id: 52,
    nombre: "Serie 52 - Change Point en Tendencia",
    tipo: 'tendencia',
    descripcion: "Cambio en la dirección o pendiente de la serie temporal.",
    explicacion: "La serie inicia con una tendencia ascendente hasta aproximadamente el punto 40, donde cambia a una tendencia descendente. Note que no es solo un cambio de nivel, sino un cambio en la dirección del movimiento de la serie.",
    datos: Array.from({length: 100}, (_, i) => ({
      x: i,
      y: i < 40 ? 10 + i * 0.15 + Math.random() * 2 : 
          16 - (i - 40) * 0.1 + Math.random() * 2
    })),
    changePoints: [40]
  },


  // Series sin Change Point
  {
    id: 53,
    nombre: "Serie 53 - Sin Change Point",
    tipo: 'ninguno',
    descripcion: "Serie temporal que no presenta change points.",
    explicacion: "Esta serie mantiene un comportamiento estable a lo largo del tiempo. Aunque pueden existir fluctuaciones normales y ruido, no hay cambios abruptos sostenidos en ninguna de las características principales (media, tendencia, varianza o periodicidad). Los puntos que parecen atípicos son simplemente outliers, no change points.",
    datos: Array.from({length: 100}, (_, i) => ({
      x: i,
      y: 15 + Math.sin(i / 15) * 2 + Math.random() * 2
    })),
    outliers: [25, 75] // Algunos outliers para mostrar la diferencia
  },
  {
    id: 999,
    nombre: "Serie Extra - Sin Change Point con Outliers",
    tipo: 'ninguno',
    descripcion: "Serie estable con algunos valores atípicos (outliers).",
    explicacion: "Es importante distinguir entre outliers y change points. Los outliers son valores anómalos puntuales que no reflejan un cambio sostenido en el comportamiento de la serie. En esta serie, los puntos extremos en las posiciones 20, 45 y 80 son outliers, no change points, ya que la serie retorna rápidamente a su comportamiento normal.",
    datos: Array.from({length: 100}, (_, i) => {
      let y = 12 + Math.random() * 3;
      // Agregar outliers específicos
      if (i === 20) y = 25;
      if (i === 45) y = 2;
      if (i === 80) y = 22;
      return { x: i, y };
    }),
    outliers: [20, 45, 80]
  }
];

export default function ContenidoCapacitacion({ onCompletado }: ContenidoCapacitacionProps) {
  const [seccionActual, setSeccionActual] = useState<'media' | 'tendencia' | 'varianza' | 'periodicidad' | 'ninguno'>('media');
  const [completadas, setCompletadas] = useState<Set<string>>(new Set());
  
  // Estados para el control de escala
  const [escalaY, setEscalaY] = useState(1);
  const [offsetY, setOffsetY] = useState(0);

  const secciones = [
    { id: 'media', nombre: 'Change Points en Media', icono: '📊' },
    { id: 'tendencia', nombre: 'Change Points en Tendencia', icono: '📈' },
    { id: 'varianza', nombre: 'Change Points en Varianza', icono: '📉' },
    { id: 'periodicidad', nombre: 'Change Points en Periodicidad', icono: '🔄' },
    { id: 'ninguno', nombre: 'Series sin Change Points', icono: '➖' }
  ];

  const ejemplosSeccionActual = ejemplosSeries.filter(serie => serie.tipo === seccionActual);

  const marcarCompletada = (seccion: string) => {
    const nuevasCompletadas = new Set(completadas);
    nuevasCompletadas.add(seccion);
    setCompletadas(nuevasCompletadas);
  };

  const todasCompletadas = secciones.length === completadas.size;
  const renderGrafica = (serie: EjemploSerie) => {
    const maxY = Math.max(...serie.datos.map(d => d.y));
    const minY = Math.min(...serie.datos.map(d => d.y));
    const rangoY = maxY - minY;
    const centroY = (maxY + minY) / 2;

    return (
      <svg width="100%" height="300" viewBox="0 0 800 300" className="border rounded bg-white">
        {/* Ejes */}
        <line x1="60" y1="270" x2="740" y2="270" stroke="#374151" strokeWidth="2"/>
        <line x1="60" y1="30" x2="60" y2="270" stroke="#374151" strokeWidth="2"/>
        
        {/* Líneas de cuadrícula */}
        <line x1="60" y1="90" x2="740" y2="90" stroke="#e5e7eb" strokeDasharray="3,3" />
        <line x1="60" y1="150" x2="740" y2="150" stroke="#e5e7eb" strokeDasharray="3,3" />
        <line x1="60" y1="210" x2="740" y2="210" stroke="#e5e7eb" strokeDasharray="3,3" />
        
        {/* Etiquetas de ejes */}
        <text x="400" y="295" textAnchor="middle" className="text-sm fill-gray-600">Tiempo</text>
        <text x="25" y="150" textAnchor="middle" className="text-sm fill-gray-600" transform="rotate(-90 25 150)">Valor</text>
        
        {/* Etiquetas del eje Y con escala aplicada */}
        <text x="50" y="275" textAnchor="end" className="text-xs fill-gray-500">
          {((minY - centroY) * escalaY + centroY + offsetY).toFixed(1)}
        </text>
        <text x="50" y="215" textAnchor="end" className="text-xs fill-gray-500">
          {((minY + rangoY * 0.25 - centroY) * escalaY + centroY + offsetY).toFixed(1)}
        </text>
        <text x="50" y="155" textAnchor="end" className="text-xs fill-gray-500">
          {((minY + rangoY * 0.5 - centroY) * escalaY + centroY + offsetY).toFixed(1)}
        </text>
        <text x="50" y="95" textAnchor="end" className="text-xs fill-gray-500">
          {((minY + rangoY * 0.75 - centroY) * escalaY + centroY + offsetY).toFixed(1)}
        </text>
        <text x="50" y="35" textAnchor="end" className="text-xs fill-gray-500">
          {((maxY - centroY) * escalaY + centroY + offsetY).toFixed(1)}
        </text>
        
        {/* Línea de datos con escala aplicada */}
        <polyline
          fill="none"
          stroke="#3B82F6"
          strokeWidth="2"
          points={serie.datos.map(punto => {
            const scaledY = (punto.y - centroY) * escalaY + centroY + offsetY;
            const y = 270 - ((scaledY - minY) / rangoY) * 240;
            return `${60 + (punto.x / 100) * 680},${Math.max(30, Math.min(270, y))}`;
          }).join(' ')}
        />
        
        {/* Puntos de datos con escala aplicada */}
        {serie.datos.map((punto, index) => {
          const scaledY = (punto.y - centroY) * escalaY + centroY + offsetY;
          const y = Math.max(30, Math.min(270, 270 - ((scaledY - minY) / rangoY) * 240));
          return (
            <circle
              key={index}
              cx={60 + (punto.x / 100) * 680}
              cy={y}
              r="2"
              fill="#3B82F6"
            />
          );
        })}
          {/* Marcar change points con escala aplicada */}
        {serie.changePoints?.map((cp, cpIndex) => {
          const scaledY = (serie.datos[cp].y - centroY) * escalaY + centroY + offsetY;
          // const y = Math.max(30, Math.min(270, 270 - ((scaledY - minY) / rangoY) * 240));
          return (
            <g key={cpIndex}>
              <line
                x1={60 + (cp / 100) * 680}
                y1={30}
                x2={60 + (cp / 100) * 680}
                y2={270}
                stroke="#EF4444"
                strokeWidth="2"
                strokeDasharray="5,5"
              />
              <text
                x={60 + (cp / 100) * 680}
                y={20}
                textAnchor="middle"
                className="text-sm fill-red-600 font-bold"
              >
                CP
              </text>
            </g>
          );
        })}
          {/* Marcar outliers con escala aplicada */}
        {serie.outliers?.map((outlier, index) => {
          const scaledY = (serie.datos[outlier].y - centroY) * escalaY + centroY + offsetY;
          const y = Math.max(30, Math.min(270, 270 - ((scaledY - minY) / rangoY) * 240));
          return (
            <circle
              key={index}
              cx={60 + (outlier / 100) * 680}
              cy={y}
              r="8"
              fill="none"
              stroke="#F59E0B"
              strokeWidth="2"
            />
          );
        })}
      </svg>
    );
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg">
        {/* Header */}
        <div className="border-b border-gray-200 p-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-4 text-center">
            Contenido de Capacitación
          </h2>
          <p className="text-lg text-gray-600 text-center max-w-4xl mx-auto">
            Aprenda a identificar diferentes tipos de change points mediante ejemplos detallados. 
            Cada sección incluye series de ejemplo con explicaciones específicas.
          </p>
        </div>

        <div className="flex">
          {/* Sidebar de navegación */}
          <div className="w-80 border-r border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Tipos de Change Points</h3>
            <div className="space-y-2">
              {secciones.map((seccion) => (                <button
                  key={seccion.id}
                  onClick={() => setSeccionActual(seccion.id as 'media' | 'tendencia' | 'varianza' | 'periodicidad' | 'ninguno')}
                  className={`w-full text-left p-3 rounded-lg transition-colors duration-200 flex items-center space-x-3 ${
                    seccionActual === seccion.id 
                      ? 'bg-blue-100 text-blue-800 border border-blue-300' 
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <span className="text-xl">{seccion.icono}</span>
                  <div className="flex-1">
                    <div className="font-medium">{seccion.nombre}</div>
                    {completadas.has(seccion.id) && (
                      <div className="text-green-600 text-sm">✓ Completada</div>
                    )}
                  </div>
                </button>
              ))}
            </div>

            {/* Progress */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="text-sm text-gray-600 mb-2">
                Progreso: {completadas.size} / {secciones.length}
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(completadas.size / secciones.length) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Contenido principal */}
          <div className="flex-1 p-6">
            <div className="space-y-8">
              {/* Título de sección */}
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  {secciones.find(s => s.id === seccionActual)?.nombre}
                </h3>
                {seccionActual === 'media' && (
                  <p className="text-gray-600">
                    Los change points en la media representan cambios abruptos en el nivel promedio de la serie.
                  </p>
                )}
                {seccionActual === 'tendencia' && (
                  <p className="text-gray-600">
                    Los change points en la tendencia indican cambios en la dirección o pendiente de la serie.
                  </p>
                )}
                {seccionActual === 'varianza' && (
                  <p className="text-gray-600">
                    Los change points en la varianza señalan cambios en la dispersión o volatilidad de los datos.
                  </p>
                )}
                {seccionActual === 'periodicidad' && (
                  <p className="text-gray-600">
                    Los change points en periodicidad muestran cambios en los patrones repetitivos de la serie.
                  </p>
                )}
                {seccionActual === 'ninguno' && (
                  <p className="text-gray-600">
                    Estas series no presentan change points. Es importante distinguir entre outliers y change points.
                  </p>
                )}
              </div>              {/* Ejemplos de la sección */}
              {ejemplosSeccionActual.map((serie) => (
                <div key={serie.id} className="border rounded-lg p-6 bg-gray-50"><h4 className="text-xl font-semibold text-gray-800 mb-2">
                    {serie.nombre}
                  </h4>
                  <p className="text-gray-600 mb-4">{serie.descripcion}</p>
                  
                  {/* Controles de escala mejorados */}
                  <div className="flex items-center justify-end space-x-6 mb-4">
                    <div className="flex items-center">
                      <span className="text-sm text-gray-600 mr-3">Escala Y:</span>
                      <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
                        <button
                          onClick={() => setEscalaY(Math.max(0.2, escalaY - 0.2))}
                          className="w-7 h-7 bg-white hover:bg-gray-50 rounded flex items-center justify-center text-sm font-bold transition-colors shadow-sm"
                          title="Reducir escala (zoom out)"
                        >
                          −
                        </button>
                        <span className="text-sm font-semibold w-14 text-center bg-white rounded px-2 py-1">
                          {escalaY.toFixed(1)}x
                        </span>
                        <button
                          onClick={() => setEscalaY(Math.min(5, escalaY + 0.2))}
                          className="w-7 h-7 bg-white hover:bg-gray-50 rounded flex items-center justify-center text-sm font-bold transition-colors shadow-sm"
                          title="Aumentar escala (zoom in)"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <span className="text-sm text-gray-600 mr-3">Posición Y:</span>
                      <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
                        <button
                          onClick={() => setOffsetY(offsetY - 5)}
                          className="w-7 h-7 bg-white hover:bg-gray-50 rounded flex items-center justify-center text-xs font-bold transition-colors shadow-sm"
                          title="Mover hacia abajo"
                        >
                          ↓
                        </button>
                        <span className="text-sm font-semibold w-12 text-center bg-white rounded px-2 py-1">
                          {offsetY > 0 ? '+' : ''}{offsetY}
                        </span>
                        <button
                          onClick={() => setOffsetY(offsetY + 5)}
                          className="w-7 h-7 bg-white hover:bg-gray-50 rounded flex items-center justify-center text-xs font-bold transition-colors shadow-sm"
                          title="Mover hacia arriba"
                        >
                          ↑
                        </button>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => {
                        setEscalaY(1);
                        setOffsetY(0);
                      }}
                      className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
                      title="Restablecer escala y posición"
                    >
                      ⟲ Reset
                    </button>
                  </div>
                  
                  {/* Gráfica */}
                  <div className="mb-4">
                    {renderGrafica(serie)}
                  </div>
                  
                  {/* Leyenda */}
                  <div className="flex flex-wrap gap-4 mb-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-0.5 bg-blue-500"></div>
                      <span>Serie temporal</span>
                    </div>
                    {serie.changePoints && serie.changePoints.length > 0 && (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-0.5 bg-red-500 border-dashed"></div>
                        <span className="text-red-600">Change Points</span>
                      </div>
                    )}
                    {serie.outliers && serie.outliers.length > 0 && (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-amber-500 rounded-full"></div>
                        <span className="text-amber-600">Outliers</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Explicación */}
                  <div className="bg-white rounded-lg p-4 border-l-4 border-blue-500">
                    <h5 className="font-medium text-gray-800 mb-2">Explicación:</h5>
                    <p className="text-gray-700">{serie.explicacion}</p>
                  </div>
                </div>
              ))}

              {/* Botón para marcar sección como completada */}
              {!completadas.has(seccionActual) && (
                <div className="text-center">
                  <button
                    onClick={() => marcarCompletada(seccionActual)}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
                  >
                    Marcar como Completada
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer con botón para finalizar */}
        {todasCompletadas && (
          <div className="border-t border-gray-200 p-6 text-center">
            <div className="bg-green-50 rounded-lg p-6 mb-4">
              <h3 className="text-xl font-bold text-green-800 mb-2">
                ¡Capacitación Completada!
              </h3>
              <p className="text-green-700">
                Ha completado exitosamente toda la capacitación. 
                Ahora está preparado para realizar evaluaciones manuales de change points.
              </p>
            </div>
            
            <button
              onClick={onCompletado}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 text-lg"
            >
              Ir a Evaluación Manual
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
