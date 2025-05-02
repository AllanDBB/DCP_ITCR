"use client";

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Button from '@/components/primaryButton';

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

  return (
    <div className="w-full fixed top-0 z-10 px-4 sm:px-6 py-3">
      <nav className="max-w-6xl mx-auto bg-white rounded-full shadow-sm border border-gray-100 px-5 backdrop-blur-sm bg-white/95">
        <div className="flex items-center justify-between h-10">
          {/* Left section: Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <div className="h-6 w-6 bg-blue-600 rounded-md flex items-center justify-center transition-transform hover:scale-105">
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
              <span className="ml-1.5 text-sm font-bold text-gray-800">Logo</span>
            </Link>
          </div>
          
          {/* Middle section: Navigation */}
          <div className="hidden md:flex md:space-x-3 mx-4">
            <NavLink href="/">Inicio</NavLink>
            <NavLink href="/sobre-proyecto">Sobre proyecto</NavLink>
            <NavLink href="/equipo">Equipo</NavLink>
          </div>
          
          {/* Right section: Button */}
          <div className="hidden md:block">
            <Button 
              href="/signin"
              variant="outline"
              size="sm"
              className=""
            >
              Iniciar sesión
            </Button>
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
            </Link>
            <Link
              href="/equipo"
              className="block px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors duration-200"
              onClick={() => setIsOpen(false)}
            >
              Equipo
            </Link>
            <div className="pt-1.5 pb-1">
              <Button 
                href="/signin"
                variant="secondary"
                size="sm"
                className="w-full"
                onClick={() => setIsOpen(false)}
              >
                Iniciar sesión
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
