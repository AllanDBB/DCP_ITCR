const express = require('express');
const { 
    getAvailableDatasets, 
    getDatasetById, 
    createDataset, 
    updateDataset, 
    deleteDataset, 
    getDatasetStats
} = require('../controllers/datasetController-simple');

// Importar métodos adicionales del controlador completo
const { 
    getMyAssignedDatasets,
    updateAssignedDatasetStatus
} = require('../controllers/datasetController');

const { verifyToken } = require('../middlewares/auth');

const router = express.Router();

// Rutas públicas (sin autenticación)
router.get('/available', getAvailableDatasets);
router.get('/stats', getDatasetStats);

// Middleware de autenticación para todas las rutas siguientes
router.use(verifyToken);

// Rutas protegidas que requieren autenticación
router.get('/:id', getDatasetById);

// Rutas para datasets asignados a usuarios
router.get('/my/assigned', getMyAssignedDatasets);
router.put('/my/assigned/:datasetId/status', updateAssignedDatasetStatus);

// Rutas administrativas
router.post('/', createDataset);
router.put('/:id', updateDataset);
router.delete('/:id', deleteDataset);

module.exports = router;
