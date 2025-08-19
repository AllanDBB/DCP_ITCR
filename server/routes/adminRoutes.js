const express = require('express');
const { 
    uploadDatasetFromCSV,
    uploadMultipleDatasetsFromCSV,
    getAllUsers,
    getAllDatasets,
    assignDatasetToUser,
    removeDatasetAssignment,
    updateUserRole,
    getAdminStats,
    getUserStats,
    updateDatasetStatus,
    deleteDataset,
    getAllLabels,
    downloadLabelsCSV,
    downloadLabeledSeriesCSV
} = require('../controllers/adminController-fixed');
const { verifyToken } = require('../middlewares/auth');
const { requireAdmin } = require('../middlewares/adminAuth');

const router = express.Router();

// Todas las rutas requieren autenticación y permisos de admin
router.use(verifyToken);
router.use(requireAdmin);

// Rutas de datasets
router.post('/upload-csv', uploadDatasetFromCSV);
router.post('/upload-csv-multiple', uploadMultipleDatasetsFromCSV);
router.get('/datasets', getAllDatasets);
router.put('/datasets/:id', updateDatasetStatus);
router.delete('/datasets/:id', deleteDataset);

// Rutas de usuarios
router.get('/users', getAllUsers);
router.get('/users/stats', getUserStats);
router.put('/users/:userId/role', updateUserRole);

// Rutas de asignaciones
router.post('/users/assign', assignDatasetToUser);
router.delete('/users/:userId/assignments/:datasetId', removeDatasetAssignment);

// Estadísticas
router.get('/stats', getAdminStats);

// Rutas de evaluaciones
router.get('/labels', getAllLabels);
router.get('/labels/download-csv', downloadLabelsCSV);
router.get('/labels/:labelId/download-series-csv', downloadLabeledSeriesCSV);

module.exports = router;
