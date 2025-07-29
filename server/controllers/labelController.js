const { validationResult } = require('express-validator');
const mongoose = require('mongoose');
const Label = require('../models/label');
const LabelingSession = require('../models/labelingSession');
const UserProgress = require('../models/userProgress');

// Crear una nueva etiqueta
const createLabel = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Errores de validación',
                errors: errors.array()
            });
        }
        
        const {
            datasetId,
            sessionId,
            changePoints,
            noChangePoints,
            confidence,
            timeSpent
        } = req.body;
        
        // Verificar que no exista ya una etiqueta para este usuario y dataset
        const existingLabel = await Label.findOne({
            datasetId,
            userId: req.userId,
            sessionId
        });
        
        if (existingLabel) {
            return res.status(400).json({
                success: false,
                message: 'Ya existe una etiqueta para este dataset en esta sesión'
            });
        }
        
        const newLabel = new Label({
            datasetId,
            userId: req.userId,
            sessionId,
            changePoints,
            noChangePoints,
            confidence,
            timeSpent,
            status: 'completed'
        });
        
        await newLabel.save();
        
        // Actualizar la sesión de etiquetado
        await LabelingSession.findByIdAndUpdate(sessionId, {
            $inc: { completedDatasets: 1, totalTimeSpent: timeSpent },
            $set: { 
                [`datasets.${req.body.currentDatasetIndex}.status`]: 'completed',
                [`datasets.${req.body.currentDatasetIndex}.endTime`]: new Date(),
                [`datasets.${req.body.currentDatasetIndex}.timeSpent`]: timeSpent
            }
        });
        
        // Actualizar progreso del usuario
        await updateUserProgress(req.userId, {
            datasetsLabeled: 1,
            changePointsLabeled: changePoints.length,
            timeSpent: timeSpent
        });
        
        res.status(201).json({
            success: true,
            message: 'Etiqueta creada exitosamente',
            data: newLabel
        });
        
    } catch (error) {
        console.error('Error al crear etiqueta:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};

// Obtener etiquetas de un usuario
const getUserLabels = async (req, res) => {
    try {
        const { page = 1, limit = 10, status } = req.query;
        const skip = (parseInt(page) - 1) * parseInt(limit);
        
        const filters = { userId: req.userId };
        if (status) {
            filters.status = status;
        }
        
        const labels = await Label.find(filters)
            .populate('datasetId', 'name description category difficulty')
            .populate('sessionId', 'startTime endTime sessionType')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));
        
        const total = await Label.countDocuments(filters);
        
        res.status(200).json({
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
        });
        
    } catch (error) {
        console.error('Error al obtener etiquetas:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};

// Obtener una etiqueta específica
const getLabelById = async (req, res) => {
    try {
        const { id } = req.params;
        
        const label = await Label.findById(id)
            .populate('datasetId', 'name description category difficulty data')
            .populate('sessionId', 'startTime endTime sessionType')
            .populate('userId', 'username email');
        
        if (!label) {
            return res.status(404).json({
                success: false,
                message: 'Etiqueta no encontrada'
            });
        }
        
        // Verificar que el usuario puede ver esta etiqueta
        if (label.userId.toString() !== req.userId && !req.user.isAdmin) {
            return res.status(403).json({
                success: false,
                message: 'No tienes permisos para ver esta etiqueta'
            });
        }
        
        res.status(200).json({
            success: true,
            data: label
        });
        
    } catch (error) {
        console.error('Error al obtener etiqueta:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};

// Actualizar una etiqueta
const updateLabel = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        
        const label = await Label.findById(id);
        
        if (!label) {
            return res.status(404).json({
                success: false,
                message: 'Etiqueta no encontrada'
            });
        }
        
        // Verificar que el usuario puede editar esta etiqueta
        if (label.userId.toString() !== req.userId && !req.user.isAdmin) {
            return res.status(403).json({
                success: false,
                message: 'No tienes permisos para editar esta etiqueta'
            });
        }
        
        // Solo permitir actualizar ciertos campos
        const allowedUpdates = ['changePoints', 'noChangePoints', 'confidence', 'notes'];
        const filteredUpdates = {};
        
        allowedUpdates.forEach(field => {
            if (updateData[field] !== undefined) {
                filteredUpdates[field] = updateData[field];
            }
        });
        
        const updatedLabel = await Label.findByIdAndUpdate(
            id,
            filteredUpdates,
            { new: true, runValidators: true }
        );
        
        res.status(200).json({
            success: true,
            message: 'Etiqueta actualizada exitosamente',
            data: updatedLabel
        });
        
    } catch (error) {
        console.error('Error al actualizar etiqueta:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};

// Eliminar una etiqueta
const deleteLabel = async (req, res) => {
    try {
        const { id } = req.params;
        
        const label = await Label.findById(id);
        
        if (!label) {
            return res.status(404).json({
                success: false,
                message: 'Etiqueta no encontrada'
            });
        }
        
        // Verificar que el usuario puede eliminar esta etiqueta
        if (label.userId.toString() !== req.userId && !req.user.isAdmin) {
            return res.status(403).json({
                success: false,
                message: 'No tienes permisos para eliminar esta etiqueta'
            });
        }
        
        await Label.findByIdAndDelete(id);
        
        res.status(200).json({
            success: true,
            message: 'Etiqueta eliminada exitosamente'
        });
        
    } catch (error) {
        console.error('Error al eliminar etiqueta:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};

// Obtener estadísticas de etiquetas
const getLabelStats = async (req, res) => {
    try {
        const userId = req.query.userId || req.userId;
        
        const stats = await Label.aggregate([
            { $match: { userId: mongoose.Types.ObjectId(userId) } },
            {
                $group: {
                    _id: null,
                    totalLabels: { $sum: 1 },
                    totalChangePoints: { $sum: { $size: '$changePoints' } },
                    avgConfidence: { $avg: '$confidence' },
                    avgTimeSpent: { $avg: '$timeSpent' },
                    byType: {
                        $push: {
                            types: '$changePoints.type'
                        }
                    },
                    byStatus: {
                        $push: '$status'
                    }
                }
            }
        ]);
        
        // Procesar estadísticas
        const result = stats[0] || {};
        const typeStats = { mean: 0, trend: 0, variance: 0, level: 0 };
        const statusStats = { draft: 0, completed: 0, reviewed: 0, rejected: 0 };
        
        if (result.byType) {
            result.byType.forEach(item => {
                item.types.forEach(type => {
                    typeStats[type] = (typeStats[type] || 0) + 1;
                });
            });
        }
        
        if (result.byStatus) {
            result.byStatus.forEach(status => {
                statusStats[status] = (statusStats[status] || 0) + 1;
            });
        }
        
        res.status(200).json({
            success: true,
            data: {
                totalLabels: result.totalLabels || 0,
                totalChangePoints: result.totalChangePoints || 0,
                averageConfidence: Math.round((result.avgConfidence || 0) * 100) / 100,
                averageTimeSpent: Math.round(result.avgTimeSpent || 0),
                byType: typeStats,
                byStatus: statusStats
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

// Función auxiliar para actualizar progreso del usuario
const updateUserProgress = async (userId, updates) => {
    try {
        const progress = await UserProgress.findOneAndUpdate(
            { userId },
            {
                $inc: {
                    totalDatasetsLabeled: updates.datasetsLabeled || 0,
                    totalChangePointsLabeled: updates.changePointsLabeled || 0,
                    totalTimeSpent: updates.timeSpent || 0
                },
                $set: { lastActivity: new Date() }
            },
            { upsert: true, new: true }
        );
        
        // Actualizar promedio de tiempo por dataset
        if (progress.totalDatasetsLabeled > 0) {
            progress.averageTimePerDataset = Math.round(progress.totalTimeSpent / progress.totalDatasetsLabeled);
            await progress.save();
        }
        
        // Actualizar streak
        progress.updateStreak();
        await progress.save();
        
    } catch (error) {
        console.error('Error al actualizar progreso del usuario:', error);
    }
};

module.exports = {
    createLabel,
    getUserLabels,
    getLabelById,
    updateLabel,
    deleteLabel,
    getLabelStats
}; 