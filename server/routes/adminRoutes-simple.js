const express = require('express');
const { 
    uploadDatasetFromCSV, 
    getAllDatasets, 
    updateDatasetStatus, 
    deleteDataset, 
    getAdminStats,
    getAllUsers,
    assignDatasetToUser,
    removeDatasetAssignment,
    updateUserRole,
    getUserStats
} = require('../controllers/adminController');
const { verifyToken } = require('../middlewares/auth');

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(verifyToken);

// Rutas básicas de administración
router.get('/datasets', getAllDatasets);
router.get('/stats', getAdminStats);
router.get('/users', getAllUsers);
router.get('/users/stats', getUserStats);
router.post('/users/assign', assignDatasetToUser);
router.delete('/users/:userId/assignments/:datasetId', removeDatasetAssignment);
router.put('/users/:userId/role', updateUserRole);
router.put('/datasets/:id', updateDatasetStatus);
router.delete('/datasets/:id', deleteDataset);

module.exports = router;
