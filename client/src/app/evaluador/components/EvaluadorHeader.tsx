import Link from "next/link";

export default function EvaluadorHeader() {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-sky-50 border-b border-blue-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="mb-6 md:mb-0">
            <Link href="/" className="text-blue-500 hover:text-blue-600 inline-flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Volver al inicio
            </Link>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-600 mt-2">Plataforma de Evaluación</h1>
            <p className="text-gray-600 mt-1">Seleccione el tipo de evaluación que desea realizar</p>
          </div>
          
          <div className="flex items-center space-x-2">
            <Link href="/docs" className="text-blue-500 hover:text-blue-600">
              <span className="sr-only">Documentación</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </Link>
            <Link href="/profile" className="flex items-center text-blue-500 hover:text-blue-600">
              <span className="sr-only">Perfil</span>
              <div className="h-8 w-8 rounded-full bg-blue-200 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}