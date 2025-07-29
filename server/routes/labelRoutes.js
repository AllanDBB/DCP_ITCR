const express = require('express');
const { body } = require('express-validator');
const { 
    createLabel, 
    getUserLabels, 
    getLabelById, 
    updateLabel, 
    deleteLabel, 
    getLabelStats 
} = require('../controllers/labelController');
const { verifyToken } = require('../middlewares/auth');

const router = express.Router();

// Validaciones para crear/actualizar etiquetas
const labelValidation = [
    body('datasetId')
        .isMongoId()
        .withMessage('ID de dataset inválido'),
    
    body('sessionId')
        .isMongoId()
        .withMessage('ID de sesión inválido'),
    
    body('changePoints')
        .isArray()
        .withMessage('Los change points deben ser un array'),
    
    body('changePoints.*.position')
        .isInt({ min: 0 })
        .withMessage('La posición debe ser un entero positivo'),
    
    body('changePoints.*.type')
        .isIn(['mean', 'trend', 'variance', 'level'])
        .withMessage('El tipo debe ser mean, trend, variance o level'),
    
    body('changePoints.*.confidence')
        .optional()
        .isFloat({ min: 0, max: 1 })
        .withMessage('La confianza debe ser un número entre 0 y 1'),
    
    body('changePoints.*.notes')
        .optional()
        .trim()
        .isLength({ max: 200 })
        .withMessage('Las notas deben tener máximo 200 caracteres'),
    
    body('noChangePoints')
        .optional()
        .isBoolean()
        .withMessage('noChangePoints debe ser un booleano'),
    
    body('confidence')
        .optional()
        .isFloat({ min: 0, max: 1 })
        .withMessage('La confianza debe ser un número entre 0 y 1'),
    
    body('timeSpent')
        .optional()
        .isInt({ min: 0 })
        .withMessage('El tiempo debe ser un entero positivo'),
    
    body('currentDatasetIndex')
        .optional()
        .isInt({ min: 0 })
        .withMessage('El índice del dataset debe ser un entero positivo')
];

// Validación para actualizar etiquetas
const updateLabelValidation = [
    body('changePoints')
        .optional()
        .isArray()
        .withMessage('Los change points deben ser un array'),
    
    body('changePoints.*.position')
        .optional()
        .isInt({ min: 0 })
        .withMessage('La posición debe ser un entero positivo'),
    
    body('changePoints.*.type')
        .optional()
        .isIn(['mean', 'trend', 'variance', 'level'])
        .withMessage('El tipo debe ser mean, trend, variance o level'),
    
    body('changePoints.*.confidence')
        .optional()
        .isFloat({ min: 0, max: 1 })
        .withMessage('La confianza debe ser un número entre 0 y 1'),
    
    body('changePoints.*.notes')
        .optional()
        .trim()
        .isLength({ max: 200 })
        .withMessage('Las notas deben tener máximo 200 caracteres'),
    
    body('noChangePoints')
        .optional()
        .isBoolean()
        .withMessage('noChangePoints debe ser un booleano'),
    
    body('confidence')
        .optional()
        .isFloat({ min: 0, max: 1 })
        .withMessage('La confianza debe ser un número entre 0 y 1'),
    
    body('notes')
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage('Las notas deben tener máximo 500 caracteres')
];

// Todas las rutas requieren autenticación
router.use(verifyToken);

// Rutas de etiquetas
router.post('/', labelValidation, createLabel);
router.get('/', getUserLabels);
router.get('/stats', getLabelStats);
router.get('/:id', getLabelById);
router.put('/:id', updateLabelValidation, updateLabel);
router.delete('/:id', deleteLabel);

module.exports = router; 