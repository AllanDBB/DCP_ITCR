import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Logo y descripción breve */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center">
              <div className="h-8 w-8 bg-blue-400 rounded-lg flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <span className="ml-2 text-lg font-bold text-gray-700">DCP-ITCR</span>
            </Link>
            <p className="mt-3 text-sm text-gray-500">
              Plataforma de investigación para la detección de Change Points en series temporales.
            </p>
            
            <div className="mt-4 flex space-x-4">
              <a 
                href="https://github.com/allandbb" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <span className="sr-only">GitHub</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </a>
          
            </div>
          </div>
          
          {/* Enlaces Rápidos */}
          <div className="md:col-span-1">
            <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider">
              Enlaces rápidos
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/" className="text-sm text-gray-500 hover:text-blue-500 transition-colors">
                  Inicio
                </Link>
              </li>
              <li>
                <Link href="/sobre-proyecto" className="text-sm text-gray-500 hover:text-blue-500 transition-colors">
                  Sobre el proyecto
                </Link>
              </li>
              <li>
                <Link href="/equipo" className="text-sm text-gray-500 hover:text-blue-500 transition-colors">
                  Nuestro equipo
                </Link>
              </li>
              <li>
                <Link href="/evaluador" className="text-sm text-gray-500 hover:text-blue-500 transition-colors">
                  Evaluador
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Recursos */}
          <div className="md:col-span-1">
            <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider">
              Recursos
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <a href="#" className="text-sm text-gray-500 hover:text-blue-500 transition-colors">
                  Documentación técnica
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-500 hover:text-blue-500 transition-colors">
                  Publicaciones
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-500 hover:text-blue-500 transition-colors">
                  Datasets
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-500 hover:text-blue-500 transition-colors">
                  API
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-500 hover:text-blue-500 transition-colors">
                  GitHub
                </a>
              </li>
            </ul>
          </div>
          
          {/* Legal */}
          <div className="md:col-span-1">
            <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider">
              Legal
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="#" className="text-sm text-gray-500 hover:text-blue-500 transition-colors">
                  Términos de servicio
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-gray-500 hover:text-blue-500 transition-colors">
                  Política de privacidad
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-gray-500 hover:text-blue-500 transition-colors">
                  Licencias
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-gray-500 hover:text-blue-500 transition-colors">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Línea divisoria */}
        <div className="border-t border-gray-100 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-400">
              &copy; {new Date().getFullYear()} DCP-ITCR. Todos los derechos reservados.
            </p>
            <div className="mt-4 md:mt-0 flex items-center">
              <p className="text-xs text-gray-400">
                Desarrollado en el Instituto Tecnológico de Costa Rica by Allan B.
              </p>
              <div className="ml-2 flex items-center">
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;