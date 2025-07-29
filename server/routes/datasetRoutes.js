const express = require('express');
const { body } = require('express-validator');
const { 
    getAvailableDatasets, 
    getDatasetById, 
    createDataset, 
    updateDataset, 
    deleteDataset, 
    getDatasetStats 
} = require('../controllers/datasetController');
const { verifyToken } = require('../middlewares/auth');

const router = express.Router();

// Validaciones para crear/actualizar datasets
const datasetValidation = [
    body('name')
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
    
    body('data')
        .isArray({ min: 10 })
        .withMessage('Los datos deben ser un array con al menos 10 puntos'),
    
    body('data.*')
        .isArray({ min: 2, max: 2 })
        .withMessage('Cada punto debe ser un array con exactamente 2 valores [x, y]'),
    
    body('data.*.0')
        .isNumeric()
        .withMessage('El valor X debe ser numérico'),
    
    body('data.*.1')
        .isNumeric()
        .withMessage('El valor Y debe ser numérico'),
    
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
        .isArray()
        .withMessage('Las etiquetas deben ser un array'),
    
    body('tags.*')
        .optional()
        .trim()
        .isLength({ max: 30 })
        .withMessage('Cada etiqueta debe tener máximo 30 caracteres')
];

// Rutas públicas (sin autenticación)
router.get('/available', getAvailableDatasets);
router.get('/stats', getDatasetStats);

// Rutas protegidas (requieren autenticación)
router.get('/:id', verifyToken, getDatasetById);
router.post('/', verifyToken, datasetValidation, createDataset);
router.put('/:id', verifyToken, datasetValidation, updateDataset);
router.delete('/:id', verifyToken, deleteDataset);

module.exports = router; 