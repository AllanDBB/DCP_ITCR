import Link from "next/link";

export default function ManualEvaluationHeader() {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-sky-50 border-b border-blue-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="mb-4 md:mb-0">
            <Link href="/" className="text-blue-500 hover:text-blue-600 inline-flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Volver al inicio
            </Link>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-600 mt-2">Evaluación Manual de Change Points</h1>
            <p className="text-gray-600 mt-1">Ayuda a entrenar nuestros algoritmos marcando los puntos de cambio que detectes</p>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="text-sm text-gray-600">
              <span className="font-medium">Usuario:</span> Estudiante_123
            </div>
            <Link 
              href="/evaluador" 
              className="text-blue-500 bg-white border border-blue-200 hover:bg-blue-50 px-3 py-1 rounded-md text-sm"
            >
              Volver al evaluador
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}