"use client";

import Link from "next/link";
import { useState } from "react";

interface EvaluationOptionCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  features: string[];
  linkText: string;
  href: string;
  colorTheme: "blue" | "indigo"; // Tema de color para la tarjeta
}

export default function EvaluationOptionCard({
  title,
  description,
  icon,
  features,
  linkText,
  href,
  colorTheme = "blue"
}: EvaluationOptionCardProps) {
  const [hover, setHover] = useState(false);
  
  const gradientClass = 
    colorTheme === "blue" 
      ? "from-blue-100 to-sky-100" 
      : "from-indigo-100 to-purple-100";
  
  const textColor = 
    colorTheme === "blue" 
      ? "text-blue-500" 
      : "text-indigo-500";
  
  const bgColor = 
    colorTheme === "blue" 
      ? "bg-blue-100" 
      : "bg-indigo-100";
  
  return (
    <Link 
      href={href} 
      className="block"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div className={`bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden h-full transition-all duration-300 ${hover ? 'shadow-md border-blue-200 transform -translate-y-1' : ''}`}>
        <div className={`h-48 bg-gradient-to-r ${gradientClass} flex items-center justify-center`}>
          <div className="relative w-32 h-32">
            {icon}
          </div>
        </div>
        <div className="p-6">
          <h3 className="text-xl font-semibold text-gray-700 mb-2">{title}</h3>
          <p className="text-gray-600 mb-4">
            {description}
          </p>
          <div className="space-y-3">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start">
                <div className={`flex-shrink-0 h-5 w-5 rounded-full ${bgColor} flex items-center justify-center mt-0.5`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className={`h-3 w-3 ${textColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="ml-2.5 text-sm text-gray-600">
                  {feature}
                </p>
              </div>
            ))}
          </div>
          <div className={`mt-6 ${textColor} font-medium flex items-center transition-all ${hover ? 'translate-x-2' : ''}`}>
            {linkText}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
}