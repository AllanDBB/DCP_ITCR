import Link from "next/link";
import ContributionMethod from "./ContributionMethod";

export default function AdditionalInfo() {
  return (
    <div className="mt-16 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-xl font-semibold text-gray-700 mb-4">¿Cómo contribuir al proyecto?</h3>
      <div className="grid md:grid-cols-3 gap-6 mt-6">
        <ContributionMethod
          title="Aprenda"
          description="Consulte nuestra documentación para entender mejor los algoritmos de detección de change points."
          bgColorClass="bg-blue-100"
          iconColorClass="text-blue-500"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          }
        />
        <ContributionMethod
          title="Participe"
          description="Evalúe datasets manualmente para ayudarnos a mejorar los algoritmos de machine learning."
          bgColorClass="bg-indigo-100"
          iconColorClass="text-indigo-500"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
            </svg>
          }
        />
        <ContributionMethod
          title="Comparta"
          description="Comparta sus resultados y experiencias con la comunidad científica para extender la investigación."
          bgColorClass="bg-green-100"
          iconColorClass="text-green-500"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
            </svg>
          }
        />
      </div>
      <div className="mt-8 text-center">
        <Link 
          href="/sobre-proyecto" 
          className="inline-block rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors px-5 py-2.5 text-sm font-medium"
        >
          Conocer más sobre el proyecto
        </Link>
      </div>
    </div>
  );
}