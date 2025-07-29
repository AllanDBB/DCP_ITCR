"use client";

import { useState, useEffect, useRef, ChangeEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function ProfilePage() {
  const { user, updateProfile, updateProfilePhoto, changePassword, deleteAccount, showToast } = useAuth();
  const router = useRouter();

  // Estados para los datos del usuario
  const [email, setEmail] = useState("");
  const [university, setUniversity] = useState("");
  const [bio, setBio] = useState("");
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState("");
  const [location, setLocation] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  
  // Estados para manejar las actualizaciones de campos
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  
  // Estados para la actualización de contraseña
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // Estados para eliminar cuenta
  const [deletePassword, setDeletePassword] = useState("");
  
  // Estados para manejar errores y carga
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  // Referencia al input de archivo para la foto de perfil
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Cargar datos del usuario al montar el componente
  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || "");
      setLastName(user.lastName || "");
      setEmail(user.email || "");
      setUniversity(user.university || "");
      setBio(user.bio || "");
      setPhone(user.phone || "");
      setWebsite(user.website || "");
      setLocation(user.location || "");
      setPhotoUrl(user.photoUrl || "");
    }
  }, [user]);

  // Redirigir si no está autenticado
  useEffect(() => {
    if (!user) {
      router.push('/iniciar-sesion');
    }
  }, [user, router]);

  // Manejar el clic en el botón de cambio de foto
  const handleImageClick = () => {
    fileInputRef.current?.click();
  };
  
  // Manejar el cambio de archivo para la foto de perfil
  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (file) {
      setLoading(true);
      setError("");
      
      try {
        // Crear una URL para la vista previa de la imagen
        const reader = new FileReader();
        reader.onload = async () => {
          const imageUrl = reader.result as string;
          
          // Aquí normalmente subirías la imagen a un servidor
          // Por ahora usamos la URL local
          await updateProfilePhoto(imageUrl);
          setPhotoUrl(imageUrl);
        };
        reader.readAsDataURL(file);
      } catch (err: any) {
        setError(err.message || "Error al actualizar la foto de perfil");
      } finally {
        setLoading(false);
      }
    }
  };
  
  // Manejar la actualización del perfil
  const handleUpdateProfile = async () => {
    setLoading(true);
    setError("");
    
    try {
      const profileData = {
        firstName,
        lastName,
        university,
        bio,
        phone,
        website,
        location
      };
      
      console.log('=== DEBUG Frontend ===');
      console.log('Datos que se van a enviar:', profileData);
      
      await updateProfile(profileData);
      
      setIsEditingProfile(false);
    } catch (err: any) {
      console.error('Error en handleUpdateProfile:', err);
      setError(err.message || "Error al actualizar el perfil");
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

    // Validación de contraseña (debe incluir mayúscula, minúscula y número)
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;
    if (!passwordRegex.test(newPassword)) {
      setError("La contraseña debe contener al menos una letra minúscula, una mayúscula y un número");
      return;
    }
    
    setLoading(true);
    setError("");
    
    try {
      await changePassword({
        currentPassword,
        newPassword
      });
      
      // Limpiar campos
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setIsChangingPassword(false);
    } catch (err: any) {
      setError(err.message || "Error al actualizar la contraseña");
    } finally {
      setLoading(false);
    }
  };

  // Manejar la eliminación de cuenta
  const handleDeleteAccount = async () => {
    if (!deletePassword) {
      setError("Por favor ingrese su contraseña para confirmar");
      return;
    }
    
    setLoading(true);
    setError("");
    
    try {
      await deleteAccount(deletePassword);
      router.push('/');
    } catch (err: any) {
      setError(err.message || "Error al eliminar la cuenta");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

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
              <p className="text-gray-500 mt-1">Gestiona tu información personal y configuración de cuenta</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Columna izquierda - Información básica */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Información Personal</h2>
              
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-md text-sm mb-4">
                  {error}
                </div>
              )}

              <div className="space-y-6">
                {/* Nombre y Apellido */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre
                    </label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      disabled={!isEditingProfile}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-700"
                      placeholder="Tu nombre"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Apellido
                    </label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      disabled={!isEditingProfile}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-700"
                      placeholder="Tu apellido"
                    />
                  </div>
                </div>

                {/* Email (solo lectura) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Correo electrónico
                  </label>
                  <input
                    type="email"
                    value={email}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 text-gray-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">El correo electrónico no se puede cambiar</p>
                </div>

                {/* Universidad */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Universidad o Institución
                  </label>
                  <input
                    type="text"
                    value={university}
                    onChange={(e) => setUniversity(e.target.value)}
                    disabled={!isEditingProfile}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-700"
                    placeholder="Tu universidad o institución"
                  />
                </div>

                {/* Biografía */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Biografía
                  </label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    disabled={!isEditingProfile}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-700"
                    placeholder="Cuéntanos un poco sobre ti..."
                  />
                </div>

                {/* Teléfono */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    disabled={!isEditingProfile}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-700"
                    placeholder="Tu número de teléfono"
                  />
                </div>

                {/* Sitio web */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sitio web
                  </label>
                  <input
                    type="url"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    disabled={!isEditingProfile}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-700"
                    placeholder="https://tu-sitio-web.com"
                  />
                </div>

                {/* Ubicación */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ubicación
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    disabled={!isEditingProfile}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-700"
                    placeholder="Tu ciudad o país"
                  />
                </div>

                {/* Botones de acción */}
                <div className="flex gap-3 pt-4">
                  {isEditingProfile ? (
                    <>
                      <button
                        onClick={handleUpdateProfile}
                        disabled={loading}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading && <LoadingSpinner size="sm" />}
                        {loading ? 'Guardando...' : 'Guardar cambios'}
                      </button>
                      <button
                        onClick={() => {
                          setIsEditingProfile(false);
                          // Restaurar valores originales
                          if (user) {
                            setFirstName(user.firstName || "");
                            setLastName(user.lastName || "");
                            setUniversity(user.university || "");
                            setBio(user.bio || "");
                            setPhone(user.phone || "");
                            setWebsite(user.website || "");
                            setLocation(user.location || "");
                          }
                        }}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Cancelar
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setIsEditingProfile(true)}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Editar perfil
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Columna derecha - Foto de perfil y configuraciones */}
          <div className="space-y-6">
            {/* Foto de perfil */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Foto de perfil</h3>
              
              <div className="flex flex-col items-center">
                <div className="relative mb-4">
                  <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200">
                    {photoUrl ? (
                      <Image
                        src={photoUrl}
                        alt="Foto de perfil"
                        width={128}
                        height={128}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  
                  <button
                    onClick={handleImageClick}
                    disabled={loading}
                    className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </button>
                </div>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                
                <p className="text-sm text-gray-500 text-center">
                  Haz clic en el ícono de cámara para cambiar tu foto de perfil
                </p>
              </div>
            </div>

            {/* Cambiar contraseña */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Cambiar contraseña</h3>
              
              {isChangingPassword ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Contraseña actual
                    </label>
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Tu contraseña actual"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nueva contraseña
                    </label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Nueva contraseña"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Confirmar nueva contraseña
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Confirma la nueva contraseña"
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={handleUpdatePassword}
                      disabled={loading}
                      className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                      {loading && <LoadingSpinner size="sm" />}
                      {loading ? 'Cambiando...' : 'Cambiar contraseña'}
                    </button>
                    <button
                      onClick={() => {
                        setIsChangingPassword(false);
                        setCurrentPassword("");
                        setNewPassword("");
                        setConfirmPassword("");
                      }}
                      className="px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setIsChangingPassword(true)}
                  className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cambiar contraseña
                </button>
              )}
            </div>

            {/* Eliminar cuenta */}
            <div className="bg-white rounded-lg shadow-sm border border-red-200 p-6">
              <h3 className="text-lg font-semibold text-red-800 mb-4">Zona de peligro</h3>
              
              {isDeletingAccount ? (
                <div className="space-y-4">
                  <p className="text-sm text-red-600">
                    Esta acción no se puede deshacer. Se eliminará permanentemente tu cuenta y todos tus datos.
                  </p>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Contraseña para confirmar
                    </label>
                    <input
                      type="password"
                      value={deletePassword}
                      onChange={(e) => setDeletePassword(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      placeholder="Tu contraseña"
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={handleDeleteAccount}
                      disabled={loading}
                      className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                    >
                      {loading && <LoadingSpinner size="sm" />}
                      {loading ? 'Eliminando...' : 'Eliminar cuenta'}
                    </button>
                    <button
                      onClick={() => {
                        setIsDeletingAccount(false);
                        setDeletePassword("");
                      }}
                      className="px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setIsDeletingAccount(true)}
                  className="w-full inline-flex items-center justify-center px-4 py-2 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Eliminar cuenta
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}