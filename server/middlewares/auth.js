const jwt = require('jsonwebtoken');
const User = require('../models/user');

// Middleware para verificar JWT
const verifyToken = async (req, res, next) => {
    try {
        const authHeader = req.header('Authorization');
        const xAuthToken = req.header('x-auth-token');
        const cookieToken = req.cookies?.token;
        
        console.log('🔍 Verificando token para endpoint:', req.path);
        console.log('🔍 Authorization header:', authHeader ? authHeader.substring(0, 30) + '...' : 'NO HEADER');
        console.log('🔍 x-auth-token header:', xAuthToken ? xAuthToken.substring(0, 30) + '...' : 'NO X-AUTH-TOKEN');
        console.log('🔍 Cookie token:', cookieToken ? cookieToken.substring(0, 30) + '...' : 'NO COOKIE');
        
        const token = authHeader?.replace('Bearer ', '') || 
                     xAuthToken ||
                     cookieToken;

        if (!token) {
            console.log('❌ No se proporcionó token');
            return res.status(401).json({
                success: false,
                message: 'No se proporcionó token de acceso'
            });
        }

        console.log('🔍 Token extraído:', token ? token.substring(0, 20) + '...' + token.substring(token.length - 10) : 'NO TOKEN');
        console.log('🔍 Token length:', token.length);
        console.log('🔍 Token completo:', token);

        // Verificar el token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'tu_clave_secreta_muy_segura');
        
        console.log('✅ Token decodificado exitosamente:', decoded);
        
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
        console.log('❌ ERROR en verificación de token:', error.message);
        console.log('❌ Error name:', error.name);
        console.log('❌ Error stack:', error.stack);
        
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
