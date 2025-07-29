const mongoose = require('mongoose');

const datasetSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true, 
        trim: true 
    },
    description: { 
        type: String, 
        trim: true, 
        default: '' 
    },
    source: { 
        type: String, 
        trim: true, 
        default: 'unknown' 
    },
    category: { 
        type: String, 
        trim: true, 
        default: 'general' 
    },
    data: {
        type: [[Number]], // Array de arrays [x, y] para los puntos de la serie
        required: true
    },
    length: { 
        type: Number, 
        required: true 
    },
    minValue: { 
        type: Number, 
        required: true 
    },
    maxValue: { 
        type: Number, 
        required: true 
    },
    meanValue: { 
        type: Number, 
        required: true 
    },
    stdValue: { 
        type: Number, 
        required: true 
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'completed'],
        default: 'active'
    },
    difficulty: {
        type: String,
        enum: ['easy', 'medium', 'hard'],
        default: 'medium'
    },
    expectedChangePoints: {
        type: Number,
        default: 0
    },
    tags: [{
        type: String,
        trim: true
    }],
    metadata: {
        type: Map,
        of: String,
        default: new Map()
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    },
    updatedAt: { 
        type: Date, 
        default: Date.now 
    }
});

// Middleware para actualizar automáticamente updatedAt
datasetSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
});

// Índices para mejorar el rendimiento de las consultas
datasetSchema.index({ status: 1, difficulty: 1 });
datasetSchema.index({ category: 1 });
datasetSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Dataset', datasetSchema); 