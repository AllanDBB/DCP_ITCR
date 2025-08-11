const requireAdmin = (req, res, next) => {
    console.log('🔐 requireAdmin - Verificando permisos de admin...');
    console.log('🔐 requireAdmin - Usuario en req:', req.user?.username);
    console.log('🔐 requireAdmin - Role del usuario:', req.user?.role);
    console.log('🔐 requireAdmin - Endpoint:', req.originalUrl);
    
    if (!req.user) {
        console.log('❌ requireAdmin - No hay usuario autenticado');
        return res.status(401).json({
            success: false,
            message: 'Acceso denegado - autenticación requerida'
        });
    }
    
    if (req.user.role !== 'admin') {
        console.log('❌ requireAdmin - Usuario no es admin:', req.user.role);
        return res.status(403).json({
            success: false,
            message: 'Acceso denegado - permisos de administrador requeridos'
        });
    }
    
    console.log('✅ requireAdmin - Usuario verificado como admin');
    next();
};

const requireSuperAdmin = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: 'Acceso denegado - autenticación requerida'
        });
    }
    
    if (req.user.role !== 'admin') {
        return res.status(403).json({
            success: false,
            message: 'Acceso denegado - permisos de super administrador requeridos'
        });
    }
    
    next();
};

module.exports = { requireAdmin, requireSuperAdmin }; 