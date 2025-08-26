const express = require('express');
const { 
    getAvailableDatasets, 
    getDatasetById, 
    createDataset, 
    updateDataset, 
    deleteDataset, 
    getDatasetStats,
    getMyAssignedDatasets,
    updateAssignedDatasetStatus
} = require('../controllers/datasetController');

// Importar métodos adicionales del controlador completo

const { verifyToken } = require('../middlewares/auth');

const router = express.Router();

// Rutas públicas (sin autenticación)
router.get('/available', getAvailableDatasets);
router.get('/stats', getDatasetStats);

// Middleware de autenticación para todas las rutas siguientes
router.use(verifyToken);

// Rutas protegidas que requieren autenticación
// Routes específicas de usuario (deben ir antes de '/:id' para evitar que 'my' sea interpretado como id)
router.get('/my/assigned', getMyAssignedDatasets);
router.put('/my/assigned/:datasetId/status', updateAssignedDatasetStatus);

// Rutas protegidas para obtener un dataset por ID
router.get('/:id', getDatasetById);

// Rutas administrativas
router.post('/', createDataset);
router.put('/:id', updateDataset);
router.delete('/:id', deleteDataset);

module.exports = router;