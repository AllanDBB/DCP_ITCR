"use client";

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Button from '@/components/primaryButton';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
}

const NavLink = ({ href, children }: NavLinkProps) => {
  const pathname = usePathname();
  const isActive = pathname === href;
  
  return (
    <Link
      href={href}
      className={`px-3 py-1 text-sm font-medium transition-colors duration-200 ${
        isActive 
          ? 'text-blue-600' 
          : 'text-gray-600 hover:text-blue-600'
      }`}
    >
      {children}
    </Link>
  );
};

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  
  const { user, isAuthenticated, logout } = useAuth();
  
  // Debug logs
  console.log('Navbar - user:', user);
  console.log('Navbar - isAuthenticated:', isAuthenticated);
  
  const handleLogout = async () => {
    try {
      await logout();
      setIsUserMenuOpen(false);
      setIsOpen(false);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <div className="w-full fixed top-0 z-10 px-4 sm:px-6 py-3">
      <nav className="max-w-6xl mx-auto bg-white rounded-full shadow-sm border border-gray-100 px-5 backdrop-blur-sm bg-white/95">
        <div className="flex items-center justify-between h-10">
          {/* Left section: Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <div className="h-6 w-6 bg-blue-400 rounded-md flex items-center justify-center transition-transform hover:scale-105">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3.5 w-3.5 text-white"
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
              <span className="ml-1.5 text-sm font-bold text-gray-800">DCP-ITCR</span>
            </Link>
          </div>
            {/* Middle section: Navigation */}
          <div className="hidden md:flex md:space-x-3 mx-4">
            <NavLink href="/">Inicio</NavLink>
            <NavLink href="/sobre-proyecto">Sobre proyecto</NavLink>
            <NavLink href="/equipo">Equipo</NavLink>
            <NavLink href="/evaluador">Evaluador</NavLink>
            <NavLink href="/herramientas">Herramientas</NavLink>
          </div>
            {/* Right section: Auth Button or User Menu */}
          <div className="hidden md:block">
            {!isAuthenticated ? (
              <div className="flex items-center space-x-2">
                <Button 
                  href="/iniciar-sesion"
                  variant="outline"
                  size="sm"
                >
                  Iniciar sesión
                </Button>
                <Button 
                  href="/registro"
                  variant="secondary"
                  size="sm"
                >
                  Registrarse
                </Button>
              </div>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 text-sm rounded-full focus:outline-none"
                  aria-expanded={isUserMenuOpen ? 'true' : 'false'}
                >
                  <span className="text-gray-700 text-sm font-medium hidden lg:block">{user?.username}</span>
                  <div className="h-7 w-7 rounded-full bg-blue-100 border border-gray-200 overflow-hidden flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                </button>
                
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 border border-gray-100 z-10">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-700 truncate">{user?.username}</p>
                      <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                    </div>
                    {/* TEMPORALMENTE DESHABILITADO - Mi perfil
                    <Link
                      href="/perfil"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      Mi perfil
                    </Link>
                    */}
                    {(user?.role === 'admin' || user?.role === 'superadmin') && (
                      <Link
                        href="/admin"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        Panel de Administración
                      </Link>
                    )}
                    <button
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      onClick={handleLogout}
                    >
                      Cerrar sesión
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-1 rounded-full text-gray-500 hover:text-gray-600 hover:bg-gray-100 transition-colors duration-200"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {!isOpen ? (
                <svg
                  className="block h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg
                  className="block h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu - Floating menu for mobile */}
      {isOpen && (
        <div className="md:hidden mt-2 absolute left-0 right-0 px-4">
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 px-3 py-2 space-y-0.5 animate-fadeIn">
            <Link
              href="/"
              className="block px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors duration-200"
              onClick={() => setIsOpen(false)}
            >
              Inicio
            </Link>
            <Link
              href="/sobre-proyecto"
              className="block px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors duration-200"
              onClick={() => setIsOpen(false)}
            >
              Sobre proyecto
            </Link>            <Link
              href="/equipo"
              className="block px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors duration-200"
              onClick={() => setIsOpen(false)}
            >
              Equipo
            </Link>
            <Link
              href="/evaluador"
              className="block px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors duration-200"
              onClick={() => setIsOpen(false)}
            >
              Evaluador
            </Link>
            <Link
              href="/herramientas"
              className="block px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors duration-200"
              onClick={() => setIsOpen(false)}
            >
              Herramientas            </Link>
            
            {isAuthenticated && (
              <>
                {/* TEMPORALMENTE DESHABILITADO - Mi perfil
                <Link
                  href="/perfil"
                  className="block px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors duration-200"
                  onClick={() => setIsOpen(false)}
                >
                  Mi perfil
                </Link>
                */}
                {(user?.role === 'admin' || user?.role === 'superadmin') && (
                  <Link
                    href="/admin"
                    className="block px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors duration-200"
                    onClick={() => setIsOpen(false)}
                  >
                    Panel de Administración
                  </Link>
                )}
                <div className="pt-1.5 pb-1">
                  <Button 
                    variant="primary"
                    size="sm"
                    className="w-full"
                    onClick={handleLogout}
                  >
                    Cerrar sesión
                  </Button>
                </div>
              </>
            )}
            
            {!isAuthenticated && (
              <>
                <div className="pt-1.5">
                  <Button 
                    href="/iniciar-sesion"
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => setIsOpen(false)}
                  >
                    Iniciar sesión
                  </Button>
                </div>
                <div className="pt-1.5 pb-1">
                  <Button 
                    href="/registro"
                    variant="secondary"
                    size="sm"
                    className="w-full"
                    onClick={() => setIsOpen(false)}
                  >
                    Registrarse
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;