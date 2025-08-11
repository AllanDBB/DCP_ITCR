# Documentación de las rutas de recuperación de contraseña

## Rutas añadidas para recuperación de contraseña

### 1. Solicitar recuperación de contraseña

**POST** `/api/auth/forgot-password`

**Body:**

```json
{
  "email": "usuario@ejemplo.com"
}
```

**Respuesta exitosa:**

```json
{
  "success": true,
  "message": "Correo de recuperación enviado exitosamente"
}
```

**Respuesta de error:**

```json
{
  "success": false,
  "message": "No existe un usuario con este correo electrónico"
}
```

### 2. Restablecer contraseña

**POST** `/api/auth/reset-password/:token`

**Parámetros:**

- `token`: Token de recuperación recibido por correo

**Body:**

```json
{
  "password": "nuevaContraseña123"
}
```

**Respuesta exitosa:**

```json
{
  "success": true,
  "message": "Contraseña restablecida exitosamente"
}
```

**Respuesta de error:**

```json
{
  "success": false,
  "message": "Token de recuperación inválido o expirado"
}
```

### 3. Actualizar foto de perfil

**PUT** `/api/auth/profile/photo`

**Headers:**

```text
Authorization: Bearer {token}
```

**Body:**

```json
{
  "photoUrl": "https://ejemplo.com/mi-foto.jpg"
}
```

**Respuesta exitosa:**

```json
{
  "success": true,
  "message": "Foto de perfil actualizada exitosamente",
  "user": {
    "id": "user_id",
    "username": "usuario",
    "email": "usuario@ejemplo.com",
    "photoUrl": "https://ejemplo.com/mi-foto.jpg",
    "createdAt": "2025-06-20T..."
  }
}
```

## Configuración necesaria

Para que funcione el envío de correos, debes configurar las siguientes variables de entorno en tu archivo `.env`:

```env
EMAIL_USER=tu_email@gmail.com
EMAIL_PASS=tu_contraseña_de_aplicacion
FRONTEND_URL=http://localhost:3000
```

**Nota:** La configuración de correo ahora está modularizada en `utils/emailService.js` para mejor organización del código.

### Configuración de Gmail

1. Habilita la verificación en 2 pasos en tu cuenta de Gmail
2. Genera una contraseña de aplicación específica
3. Usa esa contraseña en la variable `EMAIL_PASS`

## Cambios en el modelo de Usuario

Se añadieron los siguientes campos al modelo `User`:

- `photoUrl`: String opcional para almacenar URL de foto de perfil
- `resetPasswordToken`: String para el token de recuperación
- `resetPasswordExpires`: Date para la expiración del token

## Flujo de recuperación de contraseña

1. Usuario solicita recuperación en `/forgot-password`
2. Se genera un token único y se almacena en la base de datos
3. Se envía un correo con un enlace que contiene el token
4. Usuario hace clic en el enlace y es dirigido a una página de reset
5. Usuario envía nueva contraseña a `/reset-password/:token`
6. Se valida el token y se actualiza la contraseña

## Estructura del código

### Archivos modificados/creados

- **`models/user.js`**: Modelo actualizado con campos para foto y recuperación de contraseña
- **`controllers/authController.js`**: Controladores de autenticación con nuevas funcionalidades
- **`routes/authRoutes.js`**: Rutas para recuperación de contraseña y actualización de foto
- **`utils/emailService.js`**: ✨ **NUEVO** - Servicio modular para manejo de correos electrónicos

### Servicio de Email (`utils/emailService.js`)

El nuevo servicio incluye:

- `sendPasswordResetEmail()`: Envía correo de recuperación de contraseña
- `sendEmail()`: Función genérica para enviar cualquier correo
- `createTransporter()`: Configura el transporter de nodemailer
- `createPasswordResetEmail()`: Plantilla para correos de recuperación

Este servicio es reutilizable y puede expandirse para otros tipos de notificaciones por correo.
