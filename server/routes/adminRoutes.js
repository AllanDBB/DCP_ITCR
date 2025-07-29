const express = require('express');
const { body } = require('express-validator');
const { 
    upload, 
    uploadDatasetFromCSV, 
    getAllDatasets, 
    updateDatasetStatus, 
    deleteDataset, 
    getAdminStats 
} = require('../controllers/adminController');
const { verifyToken } = require('../middlewares/auth');
const { requireAdmin, requireSuperAdmin } = require('../middlewares/adminAuth');

const router = express.Router();

// Todas las rutas requieren autenticación y permisos de administrador
router.use(verifyToken);
router.use(requireAdmin);

// Validaciones para subir dataset desde CSV
const csvUploadValidation = [
    body('name')
        .optional()
        .trim()
        .isLength({ min: 1, max: 100 })
        .withMessage('El nombre debe tener entre 1 y 100 caracteres'),
    
    body('description')
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage('La descripción debe tener máximo 500 caracteres'),
    
    body('source')
        .optional()
        .trim()
        .isLength({ max: 100 })
        .withMessage('La fuente debe tener máximo 100 caracteres'),
    
    body('category')
        .optional()
        .trim()
        .isLength({ max: 50 })
        .withMessage('La categoría debe tener máximo 50 caracteres'),
    
    body('difficulty')
        .optional()
        .isIn(['easy', 'medium', 'hard'])
        .withMessage('La dificultad debe ser easy, medium o hard'),
    
    body('expectedChangePoints')
        .optional()
        .isInt({ min: 0 })
        .withMessage('El número esperado de change points debe ser un entero positivo'),
    
    body('tags')
        .optional()
        .trim()
        .isLength({ max: 200 })
        .withMessage('Las etiquetas deben tener máximo 200 caracteres')
];

// Validaciones para actualizar dataset
const updateDatasetValidation = [
    body('status')
        .optional()
        .isIn(['active', 'inactive', 'completed'])
        .withMessage('El estado debe ser active, inactive o completed'),
    
    body('difficulty')
        .optional()
        .isIn(['easy', 'medium', 'hard'])
        .withMessage('La dificultad debe ser easy, medium o hard'),
    
    body('expectedChangePoints')
        .optional()
        .isInt({ min: 0 })
        .withMessage('El número esperado de change points debe ser un entero positivo')
];

// Rutas de administración
router.post('/upload-csv', upload.single('csvFile'), csvUploadValidation, uploadDatasetFromCSV);
router.get('/datasets', getAllDatasets);
router.get('/stats', getAdminStats);
router.put('/datasets/:id', updateDatasetValidation, updateDatasetStatus);

// Rutas que requieren superadmin
router.delete('/datasets/:id', requireSuperAdmin, deleteDataset);

module.exports = router; 