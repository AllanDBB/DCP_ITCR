const { validationResult } = require('express-validator');
const Dataset = require('../models/dataset');
const User = require('../models/user');

// Obtener todos los datasets disponibles para etiquetado
const getAvailableDatasets = async (req, res) => {
    try {
        const { difficulty, category, limit = 10, page = 1 } = req.query;
        
        // Construir filtros
        const filters = { status: 'active' };
        if (difficulty && difficulty !== 'all') {
            filters.difficulty = difficulty;
        }
        if (category && category !== 'all') {
            filters.category = category;
        }
        
        // Calcular skip para paginación
        const skip = (parseInt(page) - 1) * parseInt(limit);
        
        // Obtener datasets
        const datasets = await Dataset.find(filters)
            .select('name description category difficulty length expectedChangePoints tags createdAt')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));
        
        // Contar total para paginación
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

// Obtener un dataset específico por ID
const getDatasetById = async (req, res) => {
    try {
        const { id } = req.params;
        
        const dataset = await Dataset.findById(id);
        
        if (!dataset) {
            return res.status(404).json({
                success: false,
                message: 'Dataset no encontrado'
            });
        }
        
        res.status(200).json({
            success: true,
            data: dataset
        });
        
    } catch (error) {
        console.error('Error al obtener dataset:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};

// Crear un nuevo dataset
const createDataset = async (req, res) => {
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
            name,
            description,
            source,
            category,
            data,
            difficulty,
            expectedChangePoints,
            tags
        } = req.body;
        
        // Calcular estadísticas de los datos
        const values = data.map(point => point[1]);
        const minValue = Math.min(...values);
        const maxValue = Math.max(...values);
        const meanValue = values.reduce((sum, val) => sum + val, 0) / values.length;
        const variance = values.reduce((sum, val) => sum + Math.pow(val - meanValue, 2), 0) / values.length;
        const stdValue = Math.sqrt(variance);
        
        const newDataset = new Dataset({
            name,
            description,
            source,
            category,
            data,
            length: data.length,
            minValue,
            maxValue,
            meanValue,
            stdValue,
            difficulty,
            expectedChangePoints,
            tags
        });
        
        await newDataset.save();
        
        res.status(201).json({
            success: true,
            message: 'Dataset creado exitosamente',
            data: newDataset
        });
        
    } catch (error) {
        console.error('Error al crear dataset:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};

// Actualizar un dataset
const updateDataset = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        
        // No permitir actualizar ciertos campos
        delete updateData.data;
        delete updateData.length;
        delete updateData.minValue;
        delete updateData.maxValue;
        delete updateData.meanValue;
        delete updateData.stdValue;
        
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

// Eliminar un dataset
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

// Obtener estadísticas de datasets
const getDatasetStats = async (req, res) => {
    try {
        const stats = await Dataset.aggregate([
            {
                $group: {
                    _id: null,
                    total: { $sum: 1 },
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
        const difficultyStats = {};
        const categoryStats = {};
        
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

// Obtener datasets asignados al usuario autenticado
const getMyAssignedDatasets = async (req, res) => {
    try {
        const userId = req.user.id;
        const { status } = req.query;
        
        const user = await User.findById(userId)
            .populate({
                path: 'assignedDatasets.dataset',
                select: 'name description category difficulty length expectedChangePoints tags createdAt data'
            });
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }
        
        let assignedDatasets = user.assignedDatasets;
        
        // Filtrar por status si se especifica
        if (status && status !== 'all') {
            assignedDatasets = assignedDatasets.filter(assigned => assigned.status === status);
        }
        
        res.status(200).json({
            success: true,
            data: assignedDatasets
        });
        
    } catch (error) {
        console.error('Error al obtener datasets asignados:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};

// Actualizar status de un dataset asignado
const updateAssignedDatasetStatus = async (req, res) => {
    try {
        const userId = req.user.id;
        const { datasetId } = req.params;
        const { status } = req.body;
        
        if (!['pending', 'in_progress', 'completed'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Status inválido'
            });
        }
        
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }
        
        const assignedDataset = user.assignedDatasets.find(
            assigned => assigned.dataset.toString() === datasetId
        );
        
        if (!assignedDataset) {
            return res.status(404).json({
                success: false,
                message: 'Dataset no asignado a este usuario'
            });
        }
        
        assignedDataset.status = status;
        if (status === 'completed') {
            assignedDataset.completedAt = new Date();
        }
        
        await user.save();
        
        res.status(200).json({
            success: true,
            message: 'Status actualizado exitosamente',
            data: assignedDataset
        });
        
    } catch (error) {
        console.error('Error al actualizar status:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};

module.exports = {
    getAvailableDatasets,
    getDatasetById,
    createDataset,
    updateDataset,
    deleteDataset,
    getDatasetStats,
    getMyAssignedDatasets,
    updateAssignedDatasetStatus
}; 