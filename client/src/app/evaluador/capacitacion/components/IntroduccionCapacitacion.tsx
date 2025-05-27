interface IntroduccionCapacitacionProps {
  onContinuar: () => void;
}

export default function IntroduccionCapacitacion({ onContinuar }: IntroduccionCapacitacionProps) {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Bienvenido a la Capacitación
        </h2>
        
        <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
          <p>
            En esta capacitación aprenderá a identificar change points (puntos de cambio) en series temporales. 
            Un change point es un momento en el tiempo donde ocurre un cambio abrupto en el comportamiento 
            de una serie temporal.
          </p>
          
          <div className="bg-blue-50 rounded-lg p-6 border-l-4 border-blue-500">
            <h3 className="text-xl font-semibold text-blue-800 mb-3">
              Tipos de Change Points que aprenderá a identificar:
            </h3>
            <ul className="space-y-2 text-blue-700">
              <li className="flex items-start">
                <span className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></span>
                <span><strong>Change Points en la Media:</strong> Cambios en el nivel promedio de la serie</span>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></span>
                <span><strong>Change Points en la Tendencia:</strong> Cambios en la dirección o pendiente de la serie</span>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></span>
                <span><strong>Change Points en la Varianza:</strong> Cambios en la dispersión de los datos</span>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></span>
                <span><strong>Change Points en la Periodicidad:</strong> Cambios en patrones repetitivos</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-amber-50 rounded-lg p-6 border-l-4 border-amber-500">
            <h3 className="text-xl font-semibold text-amber-800 mb-3">
              Importante recordar:
            </h3>
            <ul className="space-y-2 text-amber-700">
              <li className="flex items-start">
                <span className="flex-shrink-0 w-2 h-2 bg-amber-500 rounded-full mt-2 mr-3"></span>
                <span>Los outliers (valores atípicos) NO son change points</span>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 w-2 h-2 bg-amber-500 rounded-full mt-2 mr-3"></span>
                <span>No todas las series temporales tienen change points</span>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 w-2 h-2 bg-amber-500 rounded-full mt-2 mr-3"></span>
                <span>Un change point debe representar un cambio sostenido en el comportamiento</span>
              </li>
            </ul>
          </div>
          
          <p>
            La capacitación consta de tres partes:
          </p>
          
          <ol className="space-y-3 text-gray-700">
            <li className="flex items-start">
              <span className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-1">1</span>
              <span><strong>Ejercicio Preliminar:</strong> Practique identificando change points en series conocidas</span>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-1">2</span>
              <span><strong>Contenido Educativo:</strong> Aprenda mediante ejemplos detallados de cada tipo de change point</span>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-1">3</span>
              <span><strong>Evaluación Práctica:</strong> Aplique sus conocimientos en la evaluación manual</span>
            </li>
          </ol>
        </div>
        
        <div className="mt-8 text-center">
          <button
            onClick={onContinuar}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 text-lg"
          >
            Comenzar Capacitación
          </button>
        </div>
      </div>
    </div>
  );
}
