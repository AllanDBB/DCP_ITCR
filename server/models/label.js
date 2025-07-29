const mongoose = require('mongoose');

const labelSchema = new mongoose.Schema({
    datasetId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Dataset',
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    sessionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'LabelingSession',
        required: true
    },
    changePoints: [{
        position: {
            type: Number,
            required: true,
            min: 0
        },
        type: {
            type: String,
            enum: ['mean', 'trend', 'variance', 'level'],
            required: true
        },
        confidence: {
            type: Number,
            min: 0,
            max: 1,
            default: 1.0
        },
        notes: {
            type: String,
            trim: true,
            default: ''
        },
        timestamp: {
            type: Date,
            default: Date.now
        }
    }],
    noChangePoints: {
        type: Boolean,
        default: false
    },
    confidence: {
        type: Number,
        min: 0,
        max: 1,
        default: 1.0
    },
    timeSpent: {
        type: Number, // en segundos
        min: 0,
        default: 0
    },
    status: {
        type: String,
        enum: ['draft', 'completed', 'reviewed', 'rejected'],
        default: 'draft'
    },
    reviewerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    reviewNotes: {
        type: String,
        trim: true,
        default: ''
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
labelSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
});

// Índices para mejorar el rendimiento
labelSchema.index({ datasetId: 1, userId: 1 });
labelSchema.index({ sessionId: 1 });
labelSchema.index({ status: 1 });
labelSchema.index({ createdAt: -1 });

// Validación: no puede tener change points y noChangePoints = true
labelSchema.pre('save', function(next) {
    if (this.noChangePoints && this.changePoints.length > 0) {
        return next(new Error('No puede tener change points cuando noChangePoints es true'));
    }
    next();
});

module.exports = mongoose.model('Label', labelSchema); 