const jwt = require('jsonwebtoken');
const User = require('../models/user');

// Middleware para verificar JWT
const verifyToken = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '') || 
                     req.header('x-auth-token') ||
                     req.cookies?.token;

        console.log('🔍 Verificando token para endpoint:', req.path);

        if (!token) {
            console.log('❌ No se proporcionó token');
            return res.status(401).json({
                success: false,
                message: 'No se proporcionó token de acceso'
            });
        }

        // Verificar el token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'tu_clave_secreta_muy_segura');
        
        // Verificar que el usuario existe
        const user = await User.findById(decoded.userId).select('-password');
        
        if (!user) {
            console.log('❌ Usuario no encontrado en la base de datos. ID:', decoded.userId);
            return res.status(401).json({
                success: false,
                message: 'Token inválido - usuario no encontrado'
            });
        }

        console.log('✅ Usuario autenticado:', user.username);
        
        // Agregar userId a la request
        req.userId = decoded.userId;
        req.user = user;
        next();

    } catch (error) {
        console.log('ERROR en verificación de token:', error.message);
        
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: 'Token inválido'
            });
        }
        
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token expirado'
            });
        }

        console.error('Error en verificación de token:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};

module.exports = { verifyToken };
