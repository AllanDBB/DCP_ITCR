const express = require('express');
const { 
    getAllUsers,
    getAllDatasets,
    assignDatasetToUser,
    getAdminStats
} = require('../controllers/adminController-simple');
const { verifyToken } = require('../middlewares/auth');

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(verifyToken);

// Rutas básicas de administración
router.get('/users', getAllUsers);
router.get('/datasets', getAllDatasets);
router.get('/stats', getAdminStats);
router.post('/users/assign', assignDatasetToUser);

module.exports = router;
