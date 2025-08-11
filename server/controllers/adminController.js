const { validationResult } = require('express-validator');
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const Dataset = require('../models/dataset');
const User = require('../models/user');
const Label = require('../models/label');

// Configuración de multer para subir archivos
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = 'uploads/';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + '.csv');
    }
});

const upload = multer({ 
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
            cb(null, true);
        } else {
            cb(new Error('Solo se permiten archivos CSV'), false);
        }
    },
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB máximo
    }
});

// Subir dataset desde CSV
const uploadDatasetFromCSV = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No se proporcionó archivo CSV'
            });
        }

        const { name, description, source, category, difficulty, expectedChangePoints, tags } = req.body;
        
        // Leer y procesar el archivo CSV
        const results = [];
        const filePath = req.file.path;
        
        await new Promise((resolve, reject) => {
            fs.createReadStream(filePath)
                .pipe(csv())
                .on('data', (data) => {
                    // Esperar columnas 'x' y 'y' o 'index' y 'value'
                    const x = parseFloat(data.x || data.index || data.X || data.Index);
                    const y = parseFloat(data.y || data.value || data.Y || data.Value);
                    
                    if (!isNaN(x) && !isNaN(y)) {
                        results.push([x, y]);
                    }
                })
                .on('end', resolve)
                .on('error', reject);
        });

        // Limpiar archivo temporal
        fs.unlinkSync(filePath);

        if (results.length < 10) {
            return res.status(400).json({
                success: false,
                message: 'El archivo CSV debe contener al menos 10 puntos de datos válidos'
            });
        }

        // Calcular estadísticas
        const values = results.map(point => point[1]);
        const minValue = Math.min(...values);
        const maxValue = Math.max(...values);
        const meanValue = values.reduce((sum, val) => sum + val, 0) / values.length;
        const variance = values.reduce((sum, val) => sum + Math.pow(val - meanValue, 2), 0) / values.length;
        const stdValue = Math.sqrt(variance);

        // Crear el dataset
        const newDataset = new Dataset({
            name: name || `Dataset desde CSV - ${new Date().toLocaleDateString()}`,
            description: description || 'Dataset cargado desde archivo CSV',
            source: source || 'csv_upload',
            category: category || 'general',
            data: results,
            length: results.length,
            minValue,
            maxValue,
            meanValue,
            stdValue,
            difficulty: difficulty || 'medium',
            expectedChangePoints: parseInt(expectedChangePoints) || 0,
            tags: tags ? tags.split(',').map(tag => tag.trim()) : ['csv', 'uploaded']
        });

        await newDataset.save();

        res.status(201).json({
            success: true,
            message: 'Dataset cargado exitosamente desde CSV',
            data: {
                id: newDataset._id,
                name: newDataset.name,
                length: newDataset.length,
                points: results.length,
                stats: {
                    min: minValue,
                    max: maxValue,
                    mean: meanValue,
                    std: stdValue
                }
            }
        });

    } catch (error) {
        console.error('Error al cargar dataset desde CSV:', error);
        
        // Limpiar archivo si existe
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        
        res.status(500).json({
            success: false,
            message: 'Error al procesar el archivo CSV',
            error: error.message
        });
    }
};

// Obtener todos los datasets (para administradores)
const getAllDatasets = async (req, res) => {
    try {
        const { page = 1, limit = 20, status, difficulty, category } = req.query;
        const skip = (parseInt(page) - 1) * parseInt(limit);
        
        // Construir filtros
        const filters = {};
        if (status) filters.status = status;
        if (difficulty) filters.difficulty = difficulty;
        if (category) filters.category = category;
        
        const datasets = await Dataset.find(filters)
            .select('name description category difficulty length status expectedChangePoints createdAt updatedAt')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));
        
        const total = await Dataset.countDocuments(filters);
        
        res.status(200).json({
            success: true,
            data: {
                datasets,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total,
                    pages: Math.ceil(total / parseInt(limit))
                }
            }
        });
        
    } catch (error) {
        console.error('Error al obtener datasets:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};

// Actualizar estado de un dataset
const updateDatasetStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, difficulty, expectedChangePoints } = req.body;
        
        const updateData = {};
        if (status) updateData.status = status;
        if (difficulty) updateData.difficulty = difficulty;
        if (expectedChangePoints !== undefined) updateData.expectedChangePoints = expectedChangePoints;
        
        const dataset = await Dataset.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );
        
        if (!dataset) {
            return res.status(404).json({
                success: false,
                message: 'Dataset no encontrado'
            });
        }
        
        res.status(200).json({
            success: true,
            message: 'Dataset actualizado exitosamente',
            data: dataset
        });
        
    } catch (error) {
        console.error('Error al actualizar dataset:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};

// Eliminar dataset (solo superadmin)
const deleteDataset = async (req, res) => {
    try {
        const { id } = req.params;
        
        const dataset = await Dataset.findByIdAndDelete(id);
        
        if (!dataset) {
            return res.status(404).json({
                success: false,
                message: 'Dataset no encontrado'
            });
        }
        
        res.status(200).json({
            success: true,
            message: 'Dataset eliminado exitosamente'
        });
        
    } catch (error) {
        console.error('Error al eliminar dataset:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};

// Obtener estadísticas de administración
const getAdminStats = async (req, res) => {
    try {
        const stats = await Dataset.aggregate([
            {
                $group: {
                    _id: null,
                    total: { $sum: 1 },
                    byStatus: {
                        $push: {
                            status: '$status',
                            count: 1
                        }
                    },
                    byDifficulty: {
                        $push: {
                            difficulty: '$difficulty',
                            count: 1
                        }
                    },
                    byCategory: {
                        $push: {
                            category: '$category',
                            count: 1
                        }
                    },
                    avgLength: { $avg: '$length' },
                    avgExpectedCP: { $avg: '$expectedChangePoints' }
                }
            }
        ]);
        
        // Procesar estadísticas
        const result = stats[0] || {};
        const statusStats = { active: 0, inactive: 0, completed: 0 };
        const difficultyStats = { easy: 0, medium: 0, hard: 0 };
        const categoryStats = {};
        
        if (result.byStatus) {
            result.byStatus.forEach(item => {
                statusStats[item.status] = (statusStats[item.status] || 0) + item.count;
            });
        }
        
        if (result.byDifficulty) {
            result.byDifficulty.forEach(item => {
                difficultyStats[item.difficulty] = (difficultyStats[item.difficulty] || 0) + item.count;
            });
        }
        
        if (result.byCategory) {
            result.byCategory.forEach(item => {
                categoryStats[item.category] = (categoryStats[item.category] || 0) + item.count;
            });
        }
        
        res.status(200).json({
            success: true,
            data: {
                total: result.total || 0,
                byStatus: statusStats,
                byDifficulty: difficultyStats,
                byCategory: categoryStats,
                averageLength: Math.round(result.avgLength || 0),
                averageExpectedCP: Math.round(result.avgExpectedCP || 0)
            }
        });
        
    } catch (error) {
        console.error('Error al obtener estadísticas:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};

// Obtener todos los usuarios
const getAllUsers = async (req, res) => {
    try {
        const { page = 1, limit = 10, role } = req.query;
        
        // Construir filtros
        const filters = {};
        if (role && role !== 'all') {
            filters.role = role;
        }
        
        const skip = (parseInt(page) - 1) * parseInt(limit);
        
        const users = await User.find(filters)
            .select('-password -resetPasswordToken')
            .populate('assignedDatasets.dataset', 'name description difficulty category')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));
        
        const total = await User.countDocuments(filters);
        
        res.status(200).json({
            success: true,
            data: {
                users,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total,
                    pages: Math.ceil(total / parseInt(limit))
                }
            }
        });
        
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};

// Asignar dataset a usuario
const assignDatasetToUser = async (req, res) => {
    try {
        const { userId, datasetId } = req.body;
        
        if (!userId || !datasetId) {
            return res.status(400).json({
                success: false,
                message: 'Se requieren userId y datasetId'
            });
        }
        
        // Verificar que el usuario existe
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }
        
        // Verificar que el dataset existe
        const dataset = await Dataset.findById(datasetId);
        if (!dataset) {
            return res.status(404).json({
                success: false,
                message: 'Dataset no encontrado'
            });
        }
        
        // Verificar si ya está asignado
        const alreadyAssigned = user.assignedDatasets.some(
            assigned => assigned.dataset.toString() === datasetId
        );
        
        if (alreadyAssigned) {
            return res.status(400).json({
                success: false,
                message: 'El dataset ya está asignado a este usuario'
            });
        }
        
        // Asignar el dataset
        user.assignedDatasets.push({
            dataset: datasetId,
            assignedAt: new Date(),
            status: 'pending'
        });
        
        await user.save();
        
        // Poblar la información del dataset para la respuesta
        await user.populate('assignedDatasets.dataset', 'name description difficulty category');
        
        res.status(200).json({
            success: true,
            message: 'Dataset asignado exitosamente',
            data: user.assignedDatasets[user.assignedDatasets.length - 1]
        });
        
    } catch (error) {
        console.error('Error al asignar dataset:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};

// Remover asignación de dataset
const removeDatasetAssignment = async (req, res) => {
    try {
        const { userId, datasetId } = req.params;
        
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }
        
        // Remover la asignación
        user.assignedDatasets = user.assignedDatasets.filter(
            assigned => assigned.dataset.toString() !== datasetId
        );
        
        await user.save();
        
        res.status(200).json({
            success: true,
            message: 'Asignación removida exitosamente'
        });
        
    } catch (error) {
        console.error('Error al remover asignación:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};

// Actualizar rol de usuario
const updateUserRole = async (req, res) => {
    try {
        const { userId } = req.params;
        const { role } = req.body;
        
        if (!['user', 'admin'].includes(role)) {
            return res.status(400).json({
                success: false,
                message: 'Rol inválido. Debe ser "user" o "admin"'
            });
        }
        
        const user = await User.findByIdAndUpdate(
            userId,
            { role },
            { new: true }
        ).select('-password -resetPasswordToken');
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }
        
        res.status(200).json({
            success: true,
            message: 'Rol actualizado exitosamente',
            data: user
        });
        
    } catch (error) {
        console.error('Error al actualizar rol:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};

// Obtener estadísticas de usuarios
const getUserStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const adminUsers = await User.countDocuments({ role: 'admin' });
        const regularUsers = await User.countDocuments({ role: 'user' });
        
        // Estadísticas de asignaciones
        const usersWithAssignments = await User.countDocuments({
            'assignedDatasets.0': { $exists: true }
        });
        
        const assignmentStats = await User.aggregate([
            { $unwind: '$assignedDatasets' },
            {
                $group: {
                    _id: '$assignedDatasets.status',
                    count: { $sum: 1 }
                }
            }
        ]);
        
        const assignmentsByStatus = assignmentStats.reduce((acc, stat) => {
            acc[stat._id] = stat.count;
            return acc;
        }, { pending: 0, in_progress: 0, completed: 0 });
        
        res.status(200).json({
            success: true,
            data: {
                totalUsers,
                usersByRole: {
                    admin: adminUsers,
                    user: regularUsers
                },
                assignments: {
                    usersWithAssignments,
                    totalAssignments: assignmentStats.reduce((sum, stat) => sum + stat.count, 0),
                    byStatus: assignmentsByStatus
                }
            }
        });
        
    } catch (error) {
        console.error('Error al obtener estadísticas de usuarios:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};

// Función para obtener todas las evaluaciones (admin)
const getAllLabels = async (req, res) => {
    try {
        console.log('🔍 getAllLabels - Usuario que hace la request:', req.user?.username);
        console.log('🔍 getAllLabels - Role del usuario:', req.user?.role);
        console.log('🔍 getAllLabels - Query params:', req.query);
        
        const { limit = 50, page = 1, userId, datasetId, status } = req.query;
        
        // Construir filtros
        const filters = {};
        if (userId) filters.userId = userId;
        if (datasetId) filters.datasetId = datasetId;
        if (status) filters.status = status;
        
        console.log('🔍 getAllLabels - Filtros aplicados:', filters);
        
        // Calcular skip para paginación
        const skip = (parseInt(page) - 1) * parseInt(limit);
        
        // Obtener evaluaciones con información poblada
        const labels = await Label.find(filters)
            .populate({
                path: 'userId',
                select: 'username email'
            })
            .populate({
                path: 'datasetId',
                select: 'name description category difficulty'
            })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));
        
        // Contar total para paginación
        const total = await Label.countDocuments(filters);
        
        console.log('✅ getAllLabels - Evaluaciones encontradas:', labels.length);
        console.log('✅ getAllLabels - Total en BD:', total);
        
        const responseData = {
            success: true,
            data: {
                labels,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total,
                    pages: Math.ceil(total / parseInt(limit))
                }
            }
        };
        
        console.log('📤 getAllLabels - Enviando respuesta con estructura:', {
            success: responseData.success,
            dataKeys: Object.keys(responseData.data),
            labelsCount: responseData.data.labels.length,
            paginationKeys: Object.keys(responseData.data.pagination)
        });
        
        res.status(200).json(responseData);
        
    } catch (error) {
        console.error('❌ Error en getAllLabels:', error);
        console.error('❌ Stack trace:', error.stack);
        
        const errorResponse = {
            success: false,
            message: 'Error interno del servidor'
        };
        
        console.log('📤 getAllLabels - Enviando error:', errorResponse);
        res.status(500).json(errorResponse);
    }
};

module.exports = {
    upload,
    uploadDatasetFromCSV,
    getAllDatasets,
    updateDatasetStatus,
    deleteDataset,
    getAdminStats,
    getAllUsers,
    assignDatasetToUser,
    removeDatasetAssignment,
    updateUserRole,
    getUserStats,
    getAllLabels
}; 