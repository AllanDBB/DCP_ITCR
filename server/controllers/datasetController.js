const Dataset = require('../models/dataset');

// Obtener datasets disponibles
const getAvailableDatasets = async (req, res) => {
    try {
        const datasets = await Dataset.find({ status: 'active' })
            .sort({ createdAt: -1 });
        
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

// Obtener dataset por ID
const getDatasetById = async (req, res) => {
    try {
        console.log('🔍 getDatasetById llamado con ID:', req.params.id);
        console.log('🔍 Headers de la request:', req.headers.authorization ? 'Con auth' : 'Sin auth');
        
        const dataset = await Dataset.findById(req.params.id);
        
        if (!dataset) {
            console.log('❌ Dataset no encontrado para ID:', req.params.id);
            return res.status(404).json({
                success: false,
                message: 'Dataset no encontrado'
            });
        }
        
        console.log('✅ Dataset encontrado:', dataset.name);
        
        res.json({
            success: true,
            dataset
        });
    } catch (error) {
        console.error('❌ Error al obtener dataset:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};

// Crear dataset
const createDataset = async (req, res) => {
    try {
        const { name, description, source, category, timeSeries } = req.body;
        
        const dataset = new Dataset({
            name,
            description,
            source,
            category,
            timeSeries,
            uploadedBy: req.userId
        });
        
        await dataset.save();
        
        res.status(201).json({
            success: true,
            message: 'Dataset creado exitosamente',
            dataset
        });
    } catch (error) {
        console.error('Error al crear dataset:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};

// Actualizar dataset
const updateDataset = async (req, res) => {
    try {
        const dataset = await Dataset.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        
        if (!dataset) {
            return res.status(404).json({
                success: false,
                message: 'Dataset no encontrado'
            });
        }
        
        res.json({
            success: true,
            message: 'Dataset actualizado exitosamente',
            dataset
        });
    } catch (error) {
        console.error('Error al actualizar dataset:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};

// Eliminar dataset
const deleteDataset = async (req, res) => {
    try {
        const dataset = await Dataset.findByIdAndDelete(req.params.id);
        
        if (!dataset) {
            return res.status(404).json({
                success: false,
                message: 'Dataset no encontrado'
            });
        }
        
        res.json({
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

// Estadísticas básicas
const getDatasetStats = async (req, res) => {
    try {
        const totalDatasets = await Dataset.countDocuments();
        const activeDatasets = await Dataset.countDocuments({ status: 'active' });
        
        res.json({
            success: true,
            stats: {
                total: totalDatasets,
                active: activeDatasets
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
        const userId = req.userId;
        const { status } = req.query; // opcional: filtrar por estado

        if (!userId) {
            return res.status(401).json({ success: false, message: 'No autorizado' });
        }

        // Buscar el usuario y poblar assignedDatasets.dataset
        const user = await require('../models/user').findById(userId)
            .populate('assignedDatasets.dataset', 'name description category difficulty length expectedChangePoints data')
            .select('assignedDatasets');

        if (!user) {
            return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
        }

        let assignments = user.assignedDatasets || [];

        if (status) {
            assignments = assignments.filter(a => a.status === status);
        }

        // Normalizar estructura para el cliente
        const responseAssignments = assignments.map(a => ({
            dataset: a.dataset,
            assignedAt: a.assignedAt,
            status: a.status,
            completedAt: a.completedAt,
            evaluationCount: a.evaluationCount || 0
        }));

        res.json({ success: true, data: responseAssignments });
    } catch (error) {
        console.error('Error en getMyAssignedDatasets:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
};

// Actualizar el estado de una asignación del usuario autenticado
const updateAssignedDatasetStatus = async (req, res) => {
    try {
        const userId = req.userId;
        const { datasetId } = req.params;
        const { status } = req.body;

        if (!userId) {
            return res.status(401).json({ success: false, message: 'No autorizado' });
        }

        if (!datasetId) {
            return res.status(400).json({ success: false, message: 'DatasetId requerido' });
        }

        const User = require('../models/user');

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
        }

        const assignment = user.assignedDatasets.find(a => a.dataset.toString() === datasetId);
        if (!assignment) {
            return res.status(404).json({ success: false, message: 'Asignación no encontrada' });
        }

        // Validar status
        const allowed = ['pending', 'in_progress', 'completed'];
        if (!allowed.includes(status)) {
            return res.status(400).json({ success: false, message: 'Status inválido' });
        }

        assignment.status = status;
        if (status === 'completed') assignment.completedAt = new Date();

        await user.save();

        res.json({ success: true, message: 'Estado de asignación actualizado', assignment });
    } catch (error) {
        console.error('Error en updateAssignedDatasetStatus:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor' });
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
