
"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const router = useRouter();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError("Por favor complete todos los campos");
      return;
    }
    
    setLoading(true);
    setError("");
    
    // Aquí iría la lógica real de autenticación
    try {
      // Simular una llamada de autenticación
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Simulamos un inicio de sesión exitoso
      localStorage.setItem("isLoggedIn", "true");
      
      // Redireccionar al evaluador
      router.push("/evaluador");
    } catch (err) {
      setError("Error al iniciar sesión. Verifique sus credenciales.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <Link href="/" className="inline-flex items-center justify-center">
            <div className="h-10 w-10 bg-blue-400 rounded-lg flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="ml-2 text-xl font-bold text-gray-600">DCP-ITCR</span>
          </Link>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-700">
          Iniciar sesión
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          O{' '}
          <Link href="/registro" className="font-medium text-blue-500 hover:text-blue-600">
            crear una cuenta nueva
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm">
                {error}
              </div>
            )}
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Correo electrónico
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Contraseña
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Recordarme
                </label>
              </div>

              <div className="text-sm">
                <Link href="#" className="font-medium text-blue-500 hover:text-blue-600">
                  ¿Olvidó su contraseña?
                </Link>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                  loading 
                    ? 'bg-blue-300 cursor-not-allowed' 
                    : 'bg-blue-400 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                }`}
              >
                {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
              </button>
            </div>
          </form>
          
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  O continuar con
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <div>
                <button
                  className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  <span className="sr-only">Iniciar sesión con Google</span>
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25C22.56 11.47 22.49 10.72 22.36 10H12V14.26H17.92C17.66 15.63 16.88 16.79 15.72 17.57V20.34H19.28C21.36 18.42 22.56 15.6 22.56 12.25Z" fill="#4285F4"/>
                    <path d="M12 23C14.97 23 17.46 22.02 19.28 20.34L15.72 17.57C14.76 18.19 13.52 18.57 12 18.57C9.24 18.57 6.92 16.76 6.1 14.26H2.42V17.13C4.24 20.57 7.89 23 12 23Z" fill="#34A853"/>
                    <path d="M6.1 14.26C5.88 13.57 5.75 12.84 5.75 12.09C5.75 11.34 5.88 10.61 6.1 9.92V7.05H2.42C1.64 8.57 1.2 10.28 1.2 12.09C1.2 13.9 1.64 15.61 2.42 17.13L6.1 14.26Z" fill="#FBBC05"/>
                    <path d="M12 5.62C13.59 5.62 15.03 6.15 16.16 7.22L19.29 4.09C17.45 2.41 14.97 1.4 12 1.4C7.89 1.4 4.24 3.83 2.42 7.27L6.1 10.14C6.92 7.64 9.24 5.62 12 5.62Z" fill="#EA4335"/>
                  </svg>
                </button>
              </div>

              <div>
                <button
                  className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  <span className="sr-only">Iniciar sesión con Microsoft</span>
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11.4 2H2V11.4H11.4V2Z" fill="#F25022"/>
                    <path d="M22 2H12.6V11.4H22V2Z" fill="#7FBA00"/>
                    <path d="M11.4 12.6H2V22H11.4V12.6Z" fill="#00A4EF"/>
                    <path d="M22 12.6H12.6V22H22V12.6Z" fill="#FFB900"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-8 text-center text-xs text-gray-500">
        <p>Al iniciar sesión, usted acepta nuestros <Link href="#" className="text-blue-500 hover:text-blue-600">Términos de Servicio</Link> y <Link href="#" className="text-blue-500 hover:text-blue-600">Política de Privacidad</Link>.</p>
      </div>
    </div>
  );
}