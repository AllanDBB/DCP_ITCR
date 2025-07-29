"use client";

import { useState, useEffect, ChangeEvent } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function ProfilePage() {
  const { user, updateProfile, changePassword, deleteAccount, showToast } = useAuth();
  const router = useRouter();

  // Estados para los datos del usuario (solo campos simplificados)
  const [email, setEmail] = useState("");
  const [university, setUniversity] = useState("");
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState("");
  const [location, setLocation] = useState("");
  
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

  // Cargar datos del usuario al montar el componente
  useEffect(() => {
    if (user) {
      setEmail(user.email || "");
      setUniversity(user.university || "");
      setPhone(user.phone || "");
      setWebsite(user.website || "");
      setLocation(user.location || "");
    }
  }, [user]);

  // Redirigir si no está autenticado
  useEffect(() => {
    if (!user) {
      router.push('/iniciar-sesion');
    }
  }, [user, router]);

  // Manejar la actualización del perfil
  const handleUpdateProfile = async () => {
    setLoading(true);
    setError("");
    
    try {
      await updateProfile({
        university,
        phone,
        website,
        location
      });
      
      setIsEditingProfile(false);
    } catch (err: any) {
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

                {/* Email (solo lectura) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    value={email}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 text-gray-700 cursor-not-allowed"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    El correo electrónico no puede ser modificado
                  </p>
                </div>

                {/* Información de contacto */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      placeholder="Tu ubicación"
                    />
                  </div>
                </div>

                {/* Sitio web */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sitio Web
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

                {/* Botones de acción */}
                <div className="flex gap-3 pt-4">
                  {!isEditingProfile ? (
                    <button
                      onClick={() => setIsEditingProfile(true)}
                      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                    >
                      Editar Perfil
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={handleUpdateProfile}
                        disabled={loading}
                        className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors disabled:opacity-50"
                      >
                        {loading ? (
                          <div className="flex items-center">
                            <LoadingSpinner size="sm" />
                            <span className="ml-2">Guardando...</span>
                          </div>
                        ) : (
                          'Guardar Cambios'
                        )}
                      </button>
                      <button
                        onClick={() => {
                          setIsEditingProfile(false);
                          setError("");
                          // Restaurar valores originales
                          if (user) {
                            setUniversity(user.university || "");
                            setPhone(user.phone || "");
                            setWebsite(user.website || "");
                            setLocation(user.location || "");
                          }
                        }}
                        className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                      >
                        Cancelar
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Sección de cambio de contraseña */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Cambiar Contraseña</h2>
              
              {!isChangingPassword ? (
                <button
                  onClick={() => setIsChangingPassword(true)}
                  className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 transition-colors"
                >
                  Cambiar Contraseña
                </button>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contraseña Actual
                    </label>
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Ingresa tu contraseña actual"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nueva Contraseña
                    </label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Ingresa tu nueva contraseña"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirmar Nueva Contraseña
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Confirma tu nueva contraseña"
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={handleUpdatePassword}
                      disabled={loading}
                      className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors disabled:opacity-50"
                    >
                      {loading ? (
                        <div className="flex items-center">
                          <LoadingSpinner size="sm" />
                          <span className="ml-2">Actualizando...</span>
                        </div>
                      ) : (
                        'Actualizar Contraseña'
                      )}
                    </button>
                    <button
                      onClick={() => {
                        setIsChangingPassword(false);
                        setCurrentPassword("");
                        setNewPassword("");
                        setConfirmPassword("");
                        setError("");
                      }}
                      className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Sección de eliminar cuenta */}
            <div className="bg-white rounded-lg shadow-sm border border-red-200 p-6 mt-6">
              <h2 className="text-xl font-semibold text-red-600 mb-6">Zona Peligrosa</h2>
              
              {!isDeletingAccount ? (
                <div>
                  <p className="text-gray-600 mb-4">
                    Una vez que elimines tu cuenta, no podrás recuperarla. Esta acción es permanente.
                  </p>
                  <button
                    onClick={() => setIsDeletingAccount(true)}
                    className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
                  >
                    Eliminar Cuenta
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-red-600 font-medium">
                    ⚠️ ¿Estás seguro de que quieres eliminar tu cuenta?
                  </p>
                  <p className="text-gray-600 text-sm">
                    Esta acción no se puede deshacer. Todos tus datos serán eliminados permanentemente.
                  </p>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirma tu contraseña para continuar
                    </label>
                    <input
                      type="password"
                      value={deletePassword}
                      onChange={(e) => setDeletePassword(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      placeholder="Ingresa tu contraseña"
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={handleDeleteAccount}
                      disabled={loading}
                      className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors disabled:opacity-50"
                    >
                      {loading ? (
                        <div className="flex items-center">
                          <LoadingSpinner size="sm" />
                          <span className="ml-2">Eliminando...</span>
                        </div>
                      ) : (
                        'Sí, Eliminar Mi Cuenta'
                      )}
                    </button>
                    <button
                      onClick={() => {
                        setIsDeletingAccount(false);
                        setDeletePassword("");
                        setError("");
                      }}
                      className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Columna derecha - Información de la cuenta */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-6">Información de la Cuenta</h2>
              
              {/* Información del usuario */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500">Usuario</label>
                  <p className="text-gray-900 font-medium">{user.username}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Rol</label>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    user.role === 'admin' 
                      ? 'bg-purple-100 text-purple-800' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {user.role === 'admin' ? 'Administrador' : 'Usuario'}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Miembro desde</label>
                  <p className="text-gray-900">
                    {new Date(user.createdAt).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                {user.hasCompletedTraining && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Capacitación completada</label>
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-green-600 font-medium">Completada</span>
                    </div>
                    {user.trainingCompletedAt && (
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(user.trainingCompletedAt).toLocaleDateString('es-ES')}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
