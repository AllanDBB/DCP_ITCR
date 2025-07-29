const express = require('express');
const { 
    getAvailableDatasets, 
    getDatasetById, 
    createDataset, 
    updateDataset, 
    deleteDataset, 
    getDatasetStats
} = require('../controllers/datasetController-simple');
const { verifyToken } = require('../middlewares/auth');

const router = express.Router();

// Rutas básicas de datasets
router.get('/available', getAvailableDatasets);
router.get('/stats', getDatasetStats);
router.get('/:id', getDatasetById);

// Rutas protegidas
router.use(verifyToken);
router.post('/', createDataset);
router.put('/:id', updateDataset);
router.delete('/:id', deleteDataset);

module.exports = router;
