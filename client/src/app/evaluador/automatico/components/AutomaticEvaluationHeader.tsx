export default function AutomaticEvaluationHeader() {
  return (
    <div className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Evaluador Automático de Change Points
              </h1>
              <p className="mt-2 text-gray-600">
                Utilice algoritmos avanzados para detectar automáticamente change points en sus series temporales
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <a
                href="/evaluador"
                className="text-gray-500 hover:text-gray-700 font-medium"
              >
                ← Volver al evaluador
              </a>
              
              <div className="h-6 w-px bg-gray-300"></div>
              
              <a
                href="/evaluador/manual"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Evaluador Manual
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
