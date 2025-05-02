import Link from "next/link";
import Image from "next/image";
import Footer from "@/components/footer";

const TeamMember = ({
  name,
  role,
  institution,
  bio,
  imageSrc,
  links
}: {
  name: string;
  role: string;
  institution: string;
  bio: string;
  imageSrc: string;
  links: { type: "github" | "linkedin" | "twitter" | "email" | "website"; url: string }[];
}) => {
  const socialIcons = {
    github: (
      <svg className="h-5 w-5 text-gray-600 hover:text-gray-800" fill="currentColor" viewBox="0 0 24 24">
        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
      </svg>
    ),
    linkedin: (
      <svg className="h-5 w-5 text-gray-600 hover:text-gray-800" fill="currentColor" viewBox="0 0 24 24">
        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
      </svg>
    ),
    twitter: (
      <svg className="h-5 w-5 text-gray-600 hover:text-gray-800" fill="currentColor" viewBox="0 0 24 24">
        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 9.99 9.99 0 01-3.127 1.195 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
      </svg>
    ),
    email: (
      <svg className="h-5 w-5 text-gray-600 hover:text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    website: (
      <svg className="h-5 w-5 text-gray-600 hover:text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
      </svg>
    )
  };

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
      <div className="h-56 bg-gradient-to-r from-blue-50 to-sky-50 relative">
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
          <div className="h-32 w-32 rounded-full border-4 border-white overflow-hidden bg-gray-100">
            <Image 
              src={imageSrc}
              alt={`Foto de ${name}`}
              width={128}
              height={128}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>
      
      <div className="pt-20 pb-8 px-6 text-center">
        <h3 className="text-xl font-semibold text-gray-700">{name}</h3>
        <p className="text-blue-500 text-sm font-medium mt-0.5">{role}</p>
        <p className="text-gray-500 text-sm mt-0.5">{institution}</p>
        
        <p className="mt-4 text-gray-600 text-sm">{bio}</p>
        
        <div className="mt-6 flex items-center justify-center space-x-3">
          {links.map((link, index) => (
            <a 
              key={index} 
              href={link.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label={`${link.type} de ${name}`}
            >
              {socialIcons[link.type]}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default function TeamPage() {
  const teamMembers = [
    {
      name: "Dr. Martin Solís Salazar",
      role: "Investigador Principal",
      institution: "Instituto Tecnológico de Costa Rica",
      bio: "Doctor en Gestión Pública y especialista en ciencia de datos con más de 15 años de experiencia. Profesor asociado en el TEC y líder de proyectos en análisis de datos, machine learning y ciencias sociales aplicadas.",
      imageSrc: "/team/carlos-rojas.jpg", 
      links: [
        { type: "email" as const, url: "mailto:marsolis@itcr.ac.cr" }
      ]
    },
    {
      name: "Allan Bolaños Barrientos",
      role: "Asistente de Investigación",
      institution: "Instituto Tecnológico de Costa Rica",
      bio: "Estudiante de Ingeniería en Computación, con tres años de expencia en desarrollo.",
      imageSrc: "/team/laura-mendoza.jpg", // Usar imagen real o placeholder
      links: [
        { type: "linkedin" as const, url: "https://linkedin.com/in/allandbb" },
        { type: "github" as const, url: "https://github.com/allandbb" },
        { type: "email" as const, url: "mailto:adbyb.es@gmail.com" }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* Header */}
      <section className="bg-gradient-to-b from-blue-50 to-white border-t border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Link href="/" className="inline-flex items-center text-blue-500 hover:text-blue-600 mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Volver al inicio
          </Link>
          
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-600 mb-4">
              Nuestro Equipo
            </h1>
            <p className="text-lg text-gray-600">
              Conozca a los investigadores y desarrolladores detrás del proyecto DCP-ITCR, dedicados a avanzar en el campo de la detección de Change Points.
            </p>
          </div>
        </div>
      </section>
      
      {/* Team Section */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-600 mb-8 text-center">Equipo Principal</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {teamMembers.map((member, index) => (
              <TeamMember 
                key={index}
                name={member.name}
                role={member.role}
                institution={member.institution}
                bio={member.bio}
                imageSrc={member.imageSrc}
                links={member.links}
              />
            ))}
          </div>
        </div>
      </section>
      
      {/* Research Areas */}
      <section className="py-12 bg-blue-50 border-t border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-600 mb-8 text-center">Áreas de Investigación</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="font-semibold text-lg text-gray-700">Algoritmos Estadísticos</h3>
              <p className="mt-2 text-gray-600 text-sm">
                Desarrollo y optimización de algoritmos estadísticos para la detección de change points, con énfasis en métodos paramétricos y no paramétricos.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="h-12 w-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                </svg>
              </div>
              <h3 className="font-semibold text-lg text-gray-700">Machine Learning</h3>
              <p className="mt-2 text-gray-600 text-sm">
                Aplicación de técnicas avanzadas de aprendizaje automático y deep learning para mejorar la precisión en la detección de cambios en series temporales complejas.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                </svg>
              </div>
              <h3 className="font-semibold text-lg text-gray-700">Visualización de Datos</h3>
              <p className="mt-2 text-gray-600 text-sm">
                Investigación en métodos efectivos para la visualización y exploración interactiva de series temporales y los change points detectados.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Join Us */}
      <section className="py-12 md:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-gray-600 mb-4">¿Interesado en Colaborar?</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-3xl mx-auto">
            Estamos buscando investigadores, estudiantes y profesionales apasionados por el análisis de datos y machine learning para unirse a nuestro equipo.
          </p>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="p-4">
              <div className="h-12 w-12 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-700 mb-1">Voluntariado</h3>
              <p className="text-sm text-gray-600">
                Para estudiantes interesados en obtener experiencia.
              </p>
            </div>
            
            <div className="p-4">
              <div className="h-12 w-12 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-700 mb-1">Tesis</h3>
              <p className="text-sm text-gray-600">
                Propuestas para desarrollar trabajos de investigación en temas relacionados.
              </p>
            </div>
            
            <div className="p-4">
              <div className="h-12 w-12 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-700 mb-1">Investigación</h3>
              <p className="text-sm text-gray-600">
                Colaboraciones académicas para desarrollar publicaciones conjuntas.
              </p>
            </div>
          </div>
          
          <div className="mt-8">
            <Link href="mailto:marsolis@itcr.ac.cr" className="inline-flex items-center justify-center rounded-lg bg-blue-400 hover:bg-blue-500 text-white transition-colors px-5 py-3 text-sm font-medium">
              Contáctanos para colaborar
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <Footer />
    </div>
  );
}