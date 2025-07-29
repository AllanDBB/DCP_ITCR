const requireAdmin = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: 'Acceso denegado - autenticación requerida'
        });
    }
    
    if (!['admin', 'superadmin'].includes(req.user.role)) {
        return res.status(403).json({
            success: false,
            message: 'Acceso denegado - permisos de administrador requeridos'
        });
    }
    
    next();
};

const requireSuperAdmin = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: 'Acceso denegado - autenticación requerida'
        });
    }
    
    if (req.user.role !== 'superadmin') {
        return res.status(403).json({
            success: false,
            message: 'Acceso denegado - permisos de super administrador requeridos'
        });
    }
    
    next();
};

module.exports = { requireAdmin, requireSuperAdmin }; 