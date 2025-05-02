import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-50 px-4 sm:px-6 md:px-8 py-12 border-t border-gray-200">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <Link href="/" className="flex items-center">
              <div className="h-8 w-8 bg-blue-400 rounded-md flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="ml-2 text-lg font-bold text-gray-600">Change Point</span>
            </Link>
            <p className="mt-2 text-sm text-gray-600">
              © {new Date().getFullYear()} Instituto Tecnológico de Costa Rica
            </p>
          </div>
          <div className="flex gap-4">
            <Link href="/sobre-proyecto" className="text-sm text-gray-600 hover:text-blue-400">Sobre el proyecto</Link>
            <Link href="/equipo" className="text-sm text-gray-600 hover:text-blue-400">Equipo</Link>
            <Link href="/contacto" className="text-sm text-gray-600 hover:text-blue-400">Contacto</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}