const express = require('express');
const { body } = require('express-validator');
const { register, login, getProfile, logout, forgotPassword, resetPassword, updateProfilePhoto, updateProfile, changePassword, deleteAccount, completeTraining } = require('../controllers/authController');
const { verifyToken } = require('../middlewares/auth');

const router = express.Router();

// Validaciones para registro
const registerValidation = [
    body('username')
        .trim()
        .isLength({ min: 3, max: 30 })
        .withMessage('El nombre de usuario debe tener entre 3 y 30 caracteres')
        .matches(/^[a-zA-Z0-9_]+$/)
        .withMessage('El nombre de usuario solo puede contener letras, números y guiones bajos'),
    
    body('email')
        .custom((value) => {
            console.log('Email en validación express-validator (registro):', value);
            // Validación personalizada de email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                throw new Error('Debe proporcionar un correo electrónico válido');
            }
            return true;
        })
        .trim(),
    
    body('password')
        .isLength({ min: 6 })
        .withMessage('La contraseña debe tener al menos 6 caracteres')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('La contraseña debe contener al menos una letra minúscula, una mayúscula y un número'),
    
    // Solo universidad como campo opcional
    body('university')
        .optional()
        .trim()
        .isLength({ max: 100 })
        .withMessage('La universidad debe tener máximo 100 caracteres')
];

// Validaciones para login
const loginValidation = [
    body('email')
        .custom((value) => {
            console.log('Email en validación express-validator (login):', value);
            // Validación personalizada de email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                throw new Error('Debe proporcionar un correo electrónico válido');
            }
            return true;
        })
        .trim(),
    
    body('password')
        .notEmpty()
        .withMessage('La contraseña es obligatoria')
];

// Validaciones para recuperación de contraseña
const forgotPasswordValidation = [
    body('email')
        .custom((value) => {
            console.log('Email en validación express-validator (forgot password):', value);
            // Validación personalizada de email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                throw new Error('Debe proporcionar un correo electrónico válido');
            }
            return true;
        })
        .trim()
];

const resetPasswordValidation = [
    body('password')
        .isLength({ min: 6 })
        .withMessage('La contraseña debe tener al menos 6 caracteres')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('La contraseña debe contener al menos una letra minúscula, una mayúscula y un número')
];

const updatePhotoValidation = [
    body('photoUrl')
        .optional()
        .isURL()
        .withMessage('La URL de la foto debe ser válida')
];

const updateProfileValidation = [
    body('university')
        .optional()
        .trim()
        .isLength({ max: 100 })
        .withMessage('La universidad debe tener máximo 100 caracteres'),
    
    body('bio')
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage('La biografía debe tener máximo 500 caracteres'),
    
    body('phone')
        .optional()
        .trim()
        .isLength({ max: 20 })
        .withMessage('El teléfono debe tener máximo 20 caracteres'),
    
    body('website')
        .optional()
        .trim()
        .custom((value) => {
            if (value && value.trim() !== '') {
                // Validación personalizada de URL más flexible
                const urlRegex = /^https?:\/\/.+/;
                if (!urlRegex.test(value)) {
                    throw new Error('La URL del sitio web debe comenzar con http:// o https://');
                }
            }
            return true;
        }),
    
    body('location')
        .optional()
        .trim()
        .isLength({ max: 100 })
        .withMessage('La ubicación debe tener máximo 100 caracteres')
];

const changePasswordValidation = [
    body('currentPassword')
        .notEmpty()
        .withMessage('La contraseña actual es obligatoria'),
    
    body('newPassword')
        .isLength({ min: 6 })
        .withMessage('La nueva contraseña debe tener al menos 6 caracteres')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('La nueva contraseña debe contener al menos una letra minúscula, una mayúscula y un número')
];

// Rutas de autenticación

// POST /api/auth/register - Registrar nuevo usuario
router.post('/register', registerValidation, register);

// POST /api/auth/login - Iniciar sesión
router.post('/login', loginValidation, login);

// GET /api/auth/profile - Obtener perfil del usuario autenticado
router.get('/profile', verifyToken, getProfile);

// PUT /api/auth/profile - Actualizar perfil completo
router.put('/profile', verifyToken, updateProfileValidation, updateProfile);

// PUT /api/auth/profile/photo - Actualizar foto de perfil
router.put('/profile/photo', verifyToken, updatePhotoValidation, updateProfilePhoto);

// POST /api/auth/change-password - Cambiar contraseña
router.post('/change-password', verifyToken, changePasswordValidation, changePassword);

// DELETE /api/auth/account - Eliminar cuenta
router.delete('/account', verifyToken, deleteAccount);

// POST /api/auth/logout - Cerrar sesión
router.post('/logout', verifyToken, logout);

// POST /api/auth/forgot-password - Solicitar recuperación de contraseña
router.post('/forgot-password', forgotPasswordValidation, forgotPassword);

// POST /api/auth/reset-password/:token - Restablecer contraseña
router.post('/reset-password/:token', resetPasswordValidation, resetPassword);

// POST /api/auth/complete-training - Marcar capacitación como completada
router.post('/complete-training', verifyToken, completeTraining);

// POST /api/auth/update-profile-photo - Actualizar foto de perfil
router.post('/update-profile-photo', verifyToken, updatePhotoValidation, updateProfilePhoto);

// GET /api/auth/verify - Verificar si el token es válido
router.get('/verify', verifyToken, (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Token válido',
        user: {
            id: req.user._id,
            username: req.user.username,
            email: req.user.email,
            role: req.user.role,
            photoUrl: req.user.photoUrl,
            university: req.user.university,
            bio: req.user.bio,
            phone: req.user.phone,
            website: req.user.website,
            location: req.user.location,
            hasCompletedTraining: req.user.hasCompletedTraining,
            trainingCompletedAt: req.user.trainingCompletedAt,
            createdAt: req.user.createdAt,
            updatedAt: req.user.updatedAt
        }
    });
});

module.exports = router;
