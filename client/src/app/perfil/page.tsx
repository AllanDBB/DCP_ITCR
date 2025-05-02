"use client";

import { useState, useRef, ChangeEvent } from "react";
import Link from "next/link";
import Image from "next/image";

export default function ProfilePage() {
  // Estados para los datos del usuario
  const [name, setName] = useState("Allan Bolaños Barrientos");
  const [email, setEmail] = useState("a.bolanos.2@estudiantec.cr");
  const [university, setUniversity] = useState("Instituto Tecnológico de Costa Rica");
  
  // Estados para manejar las actualizaciones de campos
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [isEditingUniversity, setIsEditingUniversity] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  
  // Estados para la actualización de contraseña
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // Estados para manejar errores y carga
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  
  // Estado para la foto de perfil
  const [profileImage, setProfileImage] = useState("/default-avatar.png");
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  
  // Referencia al input de archivo para la foto de perfil
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Manejar el clic en el botón de cambio de foto
  const handleImageClick = () => {
    fileInputRef.current?.click();
  };
  
  // Manejar el cambio de archivo para la foto de perfil
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (file) {
      setIsUploadingImage(true);
      
      // Crear una URL para la vista previa de la imagen
      const reader = new FileReader();
      reader.onload = () => {
        setProfileImage(reader.result as string);
        setIsUploadingImage(false);
        
        // Mostrar mensaje de éxito
        setSuccess("Foto de perfil actualizada correctamente");
        setTimeout(() => setSuccess(""), 3000);
      };
      reader.readAsDataURL(file);
      
      // Aquí iría la lógica real para cargar la imagen a un servidor
    }
  };
  
  // Manejar la actualización del nombre
  const handleUpdateName = async () => {
    if (!name.trim()) {
      setError("El nombre no puede estar vacío");
      return;
    }
    
    setLoading(true);
    setError("");
    
    try {
      // Aquí iría la lógica real de actualización
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setSuccess("Nombre actualizado correctamente");
      setTimeout(() => setSuccess(""), 3000);
      setIsEditingName(false);
    } catch (err) {
      setError("Error al actualizar el nombre");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  // Manejar la actualización del correo
  const handleUpdateEmail = async () => {
    if (!email.trim() || !email.includes('@')) {
      setError("Por favor ingrese un correo electrónico válido");
      return;
    }
    
    setLoading(true);
    setError("");
    
    try {
      // Aquí iría la lógica real de actualización
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setSuccess("Correo actualizado correctamente");
      setTimeout(() => setSuccess(""), 3000);
      setIsEditingEmail(false);
    } catch (err) {
      setError("Error al actualizar el correo");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  // Manejar la actualización de la universidad
  const handleUpdateUniversity = async () => {
    setLoading(true);
    setError("");
    
    try {
      // Aquí iría la lógica real de actualización
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setSuccess("Institución actualizada correctamente");
      setTimeout(() => setSuccess(""), 3000);
      setIsEditingUniversity(false);
    } catch (err) {
      setError("Error al actualizar la institución");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  // Manejar la actualización de la contraseña
  const handleUpdatePassword = async () => {
    if (!currentPassword) {
      setError("Por favor ingrese su contraseña actual");
      return;
    }
    
    if (newPassword.length < 6) {
      setError("La nueva contraseña debe tener al menos 6 caracteres");
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }
    
    setLoading(true);
    setError("");
    
    try {
      // Aquí iría la lógica real de actualización
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Limpiar campos
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      
      setSuccess("Contraseña actualizada correctamente");
      setTimeout(() => setSuccess(""), 3000);
      setIsChangingPassword(false);
    } catch (err) {
      setError("Error al actualizar la contraseña");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  // Componente para mensajes de estado
  const StatusMessage = ({ message, type }: { message: string; type: "error" | "success" }) => {
    if (!message) return null;
    
    const bgColor = type === "error" ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700";
    
    return (
      <div className={`p-3 rounded-md text-sm mt-4 ${bgColor}`}>
        {message}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* Header */}
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
              <h1 className="text-2xl md:text-3xl font-bold text-gray-600 mt-2">Mi Perfil</h1>
              <p className="text-gray-600 mt-1">Gestione su información personal y preferencias</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Panel izquierdo */}
          <div className="md:col-span-1">
            <div className="bg-white shadow rounded-lg p-6">
              {/* Foto de perfil */}
              <div className="flex flex-col items-center">
                <div className="relative group">
                  <div 
                    className="h-32 w-32 rounded-full overflow-hidden bg-gray-100 ring-4 ring-white mb-4 cursor-pointer"
                    onClick={handleImageClick}
                  >
                    {profileImage ? (
                      <Image 
                        src={profileImage} 
                        alt="Foto de perfil" 
                        width={128}
                        height={128}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center bg-blue-100 text-blue-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                    )}
                    
                    {/* Overlay para cambiar foto */}
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                      <div className="text-white text-xs font-medium text-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Cambiar foto
                      </div>
                    </div>
                  </div>
                  
                  {/* Input para subir archivo (oculto) */}
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </div>
                
                <h2 className="text-lg font-semibold text-gray-700">{name}</h2>
                <p className="text-sm text-gray-500">{email}</p>
                <p className="text-sm text-gray-500 mt-1">{university}</p>
              </div>
              
              {/* Menú navegación */}
              <div className="mt-8 space-y-1">
                <Link href="/evaluador" className="block px-4 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-100 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                  </svg>
                  Panel de Evaluación
                </Link>
                <Link href="/evaluador/manual" className="block px-4 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-100 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  Mis Evaluaciones
                </Link>
                <Link href="/sobre-proyecto" className="block px-4 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-100 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Sobre el Proyecto
                </Link>
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <button className="block w-full px-4 py-2 text-sm text-red-600 rounded-md hover:bg-red-50 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Cerrar sesión
                </button>
              </div>
            </div>
          </div>
          
          {/* Panel derecho */}
          <div className="md:col-span-3 space-y-6">
            {/* Sección de información personal */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-5 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-700">Información Personal</h3>
                <p className="text-sm text-gray-500 mt-1">Actualice su información personal y de contacto</p>
              </div>
              
              <div className="px-6 py-5 space-y-6">
                {/* Mostrar mensajes de éxito o error */}
                {(error || success) && <StatusMessage message={error || success} type={error ? "error" : "success"} />}
                
                {/* Nombre completo */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Nombre completo
                  </label>
                  
                  {isEditingName ? (
                    <div className="mt-2 flex items-center">
                      <input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="flex-1 min-w-0 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                      <div className="ml-3 flex-shrink-0 flex">
                        <button
                          type="button"
                          onClick={handleUpdateName}
                          disabled={loading}
                          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-400 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          {loading ? 'Guardando...' : 'Guardar'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsEditingName(false)}
                          className="ml-2 inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-2 flex justify-between items-center">
                      <div className="text-sm text-gray-800">{name}</div>
                      <button
                        type="button"
                        onClick={() => setIsEditingName(true)}
                        className="inline-flex items-center text-sm text-blue-500 hover:text-blue-600"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Editar
                      </button>
                    </div>
                  )}
                </div>
                
                {/* Correo electrónico */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Correo electrónico
                  </label>
                  
                  {isEditingEmail ? (
                    <div className="mt-2 flex items-center">
                      <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="flex-1 min-w-0 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                      <div className="ml-3 flex-shrink-0 flex">
                        <button
                          type="button"
                          onClick={handleUpdateEmail}
                          disabled={loading}
                          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-400 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          {loading ? 'Guardando...' : 'Guardar'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsEditingEmail(false)}
                          className="ml-2 inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-2 flex justify-between items-center">
                      <div className="text-sm text-gray-800">{email}</div>
                      <button
                        type="button"
                        onClick={() => setIsEditingEmail(true)}
                        className="inline-flex items-center text-sm text-blue-500 hover:text-blue-600"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Editar
                      </button>
                    </div>
                  )}
                </div>
                
                {/* Universidad/Institución */}
                <div>
                  <label htmlFor="university" className="block text-sm font-medium text-gray-700">
                    Universidad o Institución
                  </label>
                  
                  {isEditingUniversity ? (
                    <div className="mt-2 flex items-center">
                      <input
                        id="university"
                        type="text"
                        value={university}
                        onChange={(e) => setUniversity(e.target.value)}
                        className="flex-1 min-w-0 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                      <div className="ml-3 flex-shrink-0 flex">
                        <button
                          type="button"
                          onClick={handleUpdateUniversity}
                          disabled={loading}
                          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-400 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          {loading ? 'Guardando...' : 'Guardar'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsEditingUniversity(false)}
                          className="ml-2 inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-2 flex justify-between items-center">
                      <div className="text-sm text-gray-800">{university || "No especificada"}</div>
                      <button
                        type="button"
                        onClick={() => setIsEditingUniversity(true)}
                        className="inline-flex items-center text-sm text-blue-500 hover:text-blue-600"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Editar
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Sección de seguridad */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-5 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-700">Seguridad</h3>
                <p className="text-sm text-gray-500 mt-1">Actualice su contraseña para mantener su cuenta segura</p>
              </div>
              
              <div className="px-6 py-5">
                {isChangingPassword ? (
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="current-password" className="block text-sm font-medium text-gray-700">
                        Contraseña actual
                      </label>
                      <div className="mt-1">
                        <input
                          id="current-password"
                          type="password"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="new-password" className="block text-sm font-medium text-gray-700">
                        Nueva contraseña
                      </label>
                      <div className="mt-1">
                        <input
                          id="new-password"
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                      </div>
                      <p className="mt-1 text-xs text-gray-500">Mínimo 6 caracteres</p>
                    </div>
                    
                    <div>
                      <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
                        Confirmar nueva contraseña
                      </label>
                      <div className="mt-1">
                        <input
                          id="confirm-password"
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                      </div>
                    </div>
                    
                    {error && <StatusMessage message={error} type="error" />}
                    {success && <StatusMessage message={success} type="success" />}
                    
                    <div className="flex justify-end space-x-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setIsChangingPassword(false)}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Cancelar
                      </button>
                      <button
                        type="button"
                        onClick={handleUpdatePassword}
                        disabled={loading}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-400 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        {loading ? 'Actualizando...' : 'Actualizar contraseña'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-gray-700">Contraseña</div>
                      <div className="text-sm text-gray-500">••••••••</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsChangingPassword(true)}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Cambiar contraseña
                    </button>
                  </div>
                )}
              </div>
            </div>
            
            {/* Sección de preferencias */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-5 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-700">Preferencias</h3>
                <p className="text-sm text-gray-500 mt-1">Configure sus preferencias de notificación</p>
              </div>
              
              <div className="px-6 py-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-gray-700">Actualizaciones del proyecto</div>
                    <div className="text-sm text-gray-500">Reciba notificaciones sobre nuevas características</div>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="updates"
                      name="updates"
                      type="checkbox"
                      defaultChecked={true}
                      className="h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-gray-700">Nuevos datasets</div>
                    <div className="text-sm text-gray-500">Notificaciones cuando se añadan nuevos datasets para evaluar</div>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="datasets"
                      name="datasets"
                      type="checkbox"
                      defaultChecked={true}
                      className="h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-gray-700">Correos de resumen</div>
                    <div className="text-sm text-gray-500">Resumen semanal de su actividad en la plataforma</div>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="summary"
                      name="summary"
                      type="checkbox"
                      defaultChecked={false}
                      className="h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </div>
                </div>
              </div>
              
              <div className="px-6 py-4 bg-gray-50 text-right border-t border-gray-200 rounded-b-lg">
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-400 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Guardar preferencias
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}