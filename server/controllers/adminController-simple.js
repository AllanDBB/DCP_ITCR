const User = require('../models/user');
const Dataset = require('../models/dataset');

// Obtener todos los usuarios
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}, '-password')
            .populate('assignedDatasets.dataset', 'title description')
            .sort({ createdAt: -1 });
        
        res.json({
            success: true,
            users
        });
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};

// Obtener todos los datasets
const getAllDatasets = async (req, res) => {
    try {
        const datasets = await Dataset.find({}).sort({ createdAt: -1 });
        
        res.json({
            success: true,
            datasets
        });
    } catch (error) {
        console.error('Error al obtener datasets:', error);
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

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }

        const dataset = await Dataset.findById(datasetId);
        if (!dataset) {
            return res.status(404).json({
                success: false,
                message: 'Dataset no encontrado'
            });
        }

        // Verificar si ya está asignado
        const existingAssignment = user.assignedDatasets.find(
            assignment => assignment.dataset.toString() === datasetId
        );

        if (existingAssignment) {
            return res.status(400).json({
                success: false,
                message: 'El dataset ya está asignado a este usuario'
            });
        }

        // Agregar asignación
        user.assignedDatasets.push({
            dataset: datasetId,
            status: 'pending',
            assignedAt: new Date()
        });

        await user.save();

        res.json({
            success: true,
            message: 'Dataset asignado exitosamente',
            assignment: user.assignedDatasets[user.assignedDatasets.length - 1]
        });
    } catch (error) {
        console.error('Error al asignar dataset:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};

// Estadísticas básicas
const getAdminStats = async (req, res) => {
    try {
        const userCount = await User.countDocuments();
        const datasetCount = await Dataset.countDocuments();
        const adminCount = await User.countDocuments({ role: 'admin' });

        res.json({
            success: true,
            stats: {
                totalUsers: userCount,
                totalDatasets: datasetCount,
                totalAdmins: adminCount
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

module.exports = {
    getAllUsers,
    getAllDatasets,
    assignDatasetToUser,
    getAdminStats
};
