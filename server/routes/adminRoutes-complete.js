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
    deleteDataset
} = require('../controllers/adminController-fixed');
const { verifyToken } = require('../middlewares/auth');

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(verifyToken);

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

module.exports = router;
