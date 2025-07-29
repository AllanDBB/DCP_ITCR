const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { validationResult } = require('express-validator');
const User = require('../models/user');
const { sendPasswordResetEmail } = require('../utils/emailService');

// Función auxiliar para limpiar logs de debug
const cleanDebugLogs = () => {
    // Remover logs de debug después de un tiempo
    setTimeout(() => {
        console.log('Limpiando logs de debug...');
    }, 5000);
};

// Generar JWT
const generateToken = (userId) => {
    return jwt.sign(
        { userId },
        process.env.JWT_SECRET || 'tu_clave_secreta_muy_segura',
        { expiresIn: '7d' }
    );
};

// Registro de usuario
const register = async (req, res) => {
    try {
        // Verificar errores de validación
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Errores de validación',
                errors: errors.array()
            });
        }

        const { username, email, password, university } = req.body;

        console.log('Email recibido en req.body:', email);
        console.log('Tipo de email:', typeof email);
        console.log('Longitud del email:', email.length);

        // Verificar si el usuario ya existe
        const existingUserByEmail = await User.findOne({ email });
        if (existingUserByEmail) {
            return res.status(400).json({
                success: false,
                message: 'Ya existe un usuario con este correo electrónico'
            });
        }

        const existingUserByUsername = await User.findOne({ username });
        if (existingUserByUsername) {
            return res.status(400).json({
                success: false,
                message: 'Ya existe un usuario con este nombre de usuario'
            });
        }

        // Encriptar contraseña
        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Crear nuevo usuario
        console.log('Email antes de crear usuario:', email);
        
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            role: 'user', // Rol por defecto
            // Campo de perfil del registro (opcional)
            university: university || null,
            // Campos de perfil inicializados vacíos
            bio: null,
            phone: null,
            website: null,
            location: null,
            photoUrl: null,
            // Capacitación no completada inicialmente
            hasCompletedTraining: false,
            trainingCompletedAt: null
        });

        console.log('Email en el objeto newUser antes de save:', newUser.email);
        
        await newUser.save();
        
        console.log('Email después de save:', newUser.email);

        // Generar token
        const token = generateToken(newUser._id);        // Respuesta exitosa (sin enviar la contraseña)
        res.status(201).json({
            success: true,
            message: 'Usuario registrado exitosamente',
            token,
            user: {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email,
                role: newUser.role,
                photoUrl: newUser.photoUrl,
                university: newUser.university,
                bio: newUser.bio,
                phone: newUser.phone,
                website: newUser.website,
                location: newUser.location,
                hasCompletedTraining: newUser.hasCompletedTraining,
                trainingCompletedAt: newUser.trainingCompletedAt,
                createdAt: newUser.createdAt,
                updatedAt: newUser.updatedAt
            }
        });

    } catch (error) {
        console.error('Error en registro:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};

// Inicio de sesión
const login = async (req, res) => {
    try {
        // Verificar errores de validación
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Errores de validación',
                errors: errors.array()
            });
        }

        const { email, password } = req.body;

        // Buscar usuario por email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Credenciales inválidas'
            });
        }

        // Verificar contraseña
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Credenciales inválidas'
            });
        }

        // Generar token
        const token = generateToken(user._id);
        
        // Respuesta exitosa
        res.status(200).json({
            success: true,
            message: 'Inicio de sesión exitoso',
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                photoUrl: user.photoUrl,
                university: user.university,
                bio: user.bio,
                phone: user.phone,
                website: user.website,
                location: user.location,
                hasCompletedTraining: user.hasCompletedTraining,
                trainingCompletedAt: user.trainingCompletedAt,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            }
        });

    } catch (error) {
        console.error('Error en inicio de sesión:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};

// Obtener perfil del usuario autenticado
const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }        res.status(200).json({
            success: true,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                photoUrl: user.photoUrl,
                university: user.university,
                bio: user.bio,
                phone: user.phone,
                website: user.website,
                location: user.location,
                hasCompletedTraining: user.hasCompletedTraining,
                trainingCompletedAt: user.trainingCompletedAt,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            }
        });

    } catch (error) {
        console.error('Error al obtener perfil:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};

// Cerrar sesión (invalidar token - requiere implementar blacklist en producción)
const logout = async (req, res) => {
    try {
        // En una implementación completa, aquí se agregaría el token a una blacklist
        res.status(200).json({
            success: true,
            message: 'Sesión cerrada exitosamente'
        });
    } catch (error) {
        console.error('Error al cerrar sesión:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};

// Solicitar recuperación de contraseña
const forgotPassword = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Errores de validación',
                errors: errors.array()
            });
        }

        const { email } = req.body;

        // Buscar usuario por email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'No existe un usuario con este correo electrónico'
            });
        }        // Generar token de recuperación
        const resetToken = crypto.randomBytes(20).toString('hex');
        
        // Establecer token y expiración en el usuario
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hora
        
        await user.save();

        // Enviar correo usando el servicio de email
        const emailResult = await sendPasswordResetEmail(user.email, user.username, resetToken);
        
        if (!emailResult.success) {
            return res.status(500).json({
                success: false,
                message: 'Error al enviar el correo de recuperación'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Correo de recuperación enviado exitosamente'
        });

    } catch (error) {
        console.error('Error en forgot password:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};

// Restablecer contraseña
const resetPassword = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Errores de validación',
                errors: errors.array()
            });
        }

        const { token } = req.params;
        const { password } = req.body;

        // Buscar usuario con el token válido y no expirado
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Token de recuperación inválido o expirado'
            });
        }

        // Encriptar nueva contraseña
        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Actualizar contraseña y limpiar tokens
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();

        res.status(200).json({
            success: true,
            message: 'Contraseña restablecida exitosamente'
        });

    } catch (error) {
        console.error('Error en reset password:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};

// Actualizar foto de perfil
const updateProfilePhoto = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Errores de validación',
                errors: errors.array()
            });
        }

        const { photoUrl } = req.body;
        const userId = req.user._id;

        // Actualizar la foto del usuario
        const user = await User.findByIdAndUpdate(
            userId,
            { photoUrl },
            { new: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Foto de perfil actualizada exitosamente',
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                photoUrl: user.photoUrl,
                university: user.university,
                bio: user.bio,
                phone: user.phone,
                website: user.website,
                location: user.location,
                hasCompletedTraining: user.hasCompletedTraining,
                trainingCompletedAt: user.trainingCompletedAt,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            }
        });

    } catch (error) {
        console.error('Error al actualizar foto de perfil:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};

// Actualizar perfil completo
const updateProfile = async (req, res) => {
    try {
        console.log('=== DEBUG updateProfile ===');
        console.log('Datos recibidos en updateProfile:', req.body);
        console.log('Usuario ID:', req.user._id);
        
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log('Errores de validación:', errors.array());
            return res.status(400).json({
                success: false,
                message: 'Errores de validación',
                errors: errors.array()
            });
        }

        const {
            university,
            bio,
            phone,
            website,
            location
        } = req.body;

        console.log('Campos extraídos:', {
            university,
            bio,
            phone,
            website,
            location
        });

        const userId = req.user._id;

        // Actualizar el perfil del usuario
        const updateData = {
            university,
            bio,
            phone,
            website,
            location,
            updatedAt: new Date()
        };

        console.log('Datos para actualizar:', updateData);

        const user = await User.findByIdAndUpdate(
            userId,
            updateData,
            { new: true }
        ).select('-password');

        console.log('Usuario después de actualización:', user);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Perfil actualizado exitosamente',
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                photoUrl: user.photoUrl,
                university: user.university,
                bio: user.bio,
                phone: user.phone,
                website: user.website,
                location: user.location,
                hasCompletedTraining: user.hasCompletedTraining,
                trainingCompletedAt: user.trainingCompletedAt,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            }
        });

    } catch (error) {
        console.error('Error al actualizar perfil:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};

// Cambiar contraseña
const changePassword = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Errores de validación',
                errors: errors.array()
            });
        }

        const { currentPassword, newPassword } = req.body;
        const userId = req.user._id;

        // Obtener usuario con contraseña
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }

        // Verificar contraseña actual
        const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if (!isCurrentPasswordValid) {
            return res.status(400).json({
                success: false,
                message: 'La contraseña actual es incorrecta'
            });
        }

        // Encriptar nueva contraseña
        const saltRounds = 12;
        const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

        // Actualizar contraseña
        user.password = hashedNewPassword;
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Contraseña cambiada exitosamente'
        });

    } catch (error) {
        console.error('Error al cambiar contraseña:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};

// Eliminar cuenta
const deleteAccount = async (req, res) => {
    try {
        const { password } = req.body;
        const userId = req.user._id;

        // Obtener usuario con contraseña
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }

        // Verificar contraseña
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({
                success: false,
                message: 'La contraseña es incorrecta'
            });
        }

        // Eliminar usuario
        await User.findByIdAndDelete(userId);

        res.status(200).json({
            success: true,
            message: 'Cuenta eliminada exitosamente'
        });

    } catch (error) {
        console.error('Error al eliminar cuenta:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};

// Marcar capacitación como completada
const completeTraining = async (req, res) => {
    try {
        const userId = req.user._id;

        // Actualizar el usuario para marcar la capacitación como completada
        const user = await User.findByIdAndUpdate(
            userId,
            {
                hasCompletedTraining: true,
                trainingCompletedAt: new Date()
            },
            { new: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Capacitación marcada como completada exitosamente',
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                photoUrl: user.photoUrl,
                university: user.university,
                bio: user.bio,
                phone: user.phone,
                website: user.website,
                location: user.location,
                hasCompletedTraining: user.hasCompletedTraining,
                trainingCompletedAt: user.trainingCompletedAt,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            }
        });

    } catch (error) {
        console.error('Error al marcar capacitación como completada:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};

module.exports = {
    register,
    login,
    getProfile,
    logout,
    forgotPassword,
    resetPassword,
    updateProfilePhoto,
    updateProfile,
    changePassword,
    deleteAccount,
    completeTraining
};
