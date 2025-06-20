const express = require('express');
const { body } = require('express-validator');
const { register, login, getProfile, logout } = require('../controllers/authController');
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
        .isEmail()
        .withMessage('Debe proporcionar un correo electrónico válido')
        .normalizeEmail(),
    
    body('password')
        .isLength({ min: 6 })
        .withMessage('La contraseña debe tener al menos 6 caracteres')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('La contraseña debe contener al menos una letra minúscula, una mayúscula y un número')
];

// Validaciones para login
const loginValidation = [
    body('email')
        .isEmail()
        .withMessage('Debe proporcionar un correo electrónico válido')
        .normalizeEmail(),
    
    body('password')
        .notEmpty()
        .withMessage('La contraseña es obligatoria')
];

// Rutas de autenticación

// POST /api/auth/register - Registrar nuevo usuario
router.post('/register', registerValidation, register);

// POST /api/auth/login - Iniciar sesión
router.post('/login', loginValidation, login);

// GET /api/auth/profile - Obtener perfil del usuario autenticado
router.get('/profile', verifyToken, getProfile);

// POST /api/auth/logout - Cerrar sesión
router.post('/logout', verifyToken, logout);

// GET /api/auth/verify - Verificar si el token es válido
router.get('/verify', verifyToken, (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Token válido',
        user: {
            id: req.user._id,
            username: req.user.username,
            email: req.user.email,
            createdAt: req.user.createdAt
        }
    });
});

module.exports = router;
