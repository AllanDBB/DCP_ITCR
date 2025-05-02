import Link from 'next/link';
import { ReactNode } from 'react';

interface ButtonProps {
  href?: string;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
  children: ReactNode;
}

const Button = ({
  href,
  variant = 'outline',
  size = 'md',
  className = '',
  onClick,
  children,
}: ButtonProps) => {
  // Estilos base
  const baseStyles = "rounded-full font-medium transition-all duration-200 inline-flex items-center justify-center";
  
  // Variantes
  const variantStyles = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 border border-blue-600",
    secondary: "bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-100",
    outline: "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 hover:border-gray-300 shadow-sm",
  };
  
  // Tamaños
  const sizeStyles = {
    sm: "text-xs px-3 py-1.5",
    md: "text-sm px-4 py-2",
    lg: "text-sm px-5 py-2.5",
  };
  
  // Combinación de estilos
  const buttonStyles = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;
  
  // Renderizar como Link o como botón según si tiene href
  if (href) {
    return (
      <Link href={href} className={buttonStyles} onClick={onClick}>
        {children}
      </Link>
    );
  }
  
  return (
    <button className={buttonStyles} onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;