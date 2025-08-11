const mongoose = require('mongoose');

const labelingSessionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    startTime: {
        type: Date,
        default: Date.now
    },
    endTime: {
        type: Date
    },
    status: {
        type: String,
        enum: ['active', 'paused', 'completed', 'abandoned'],
        default: 'active'
    },
    datasets: [{
        datasetId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Dataset',
            required: true
        },
        status: {
            type: String,
            enum: ['pending', 'in_progress', 'completed', 'skipped'],
            default: 'pending'
        },
        startTime: Date,
        endTime: Date,
        timeSpent: {
            type: Number, // en segundos
            default: 0
        }
    }],
    currentDatasetIndex: {
        type: Number,
        default: 0
    },
    totalDatasets: {
        type: Number,
        required: true
    },
    completedDatasets: {
        type: Number,
        default: 0
    },
    totalTimeSpent: {
        type: Number, // en segundos
        default: 0
    },
    sessionType: {
        type: String,
        enum: ['training', 'evaluation', 'production'],
        default: 'production'
    },
    difficulty: {
        type: String,
        enum: ['easy', 'medium', 'hard', 'mixed'],
        default: 'mixed'
    },
    notes: {
        type: String,
        trim: true,
        default: ''
    },
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
labelingSessionSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
});

// Índices para mejorar el rendimiento
labelingSessionSchema.index({ userId: 1, status: 1 });
labelingSessionSchema.index({ startTime: -1 });
labelingSessionSchema.index({ sessionType: 1 });

// Método para calcular el progreso
labelingSessionSchema.methods.getProgress = function() {
    return {
        total: this.totalDatasets,
        completed: this.completedDatasets,
        percentage: Math.round((this.completedDatasets / this.totalDatasets) * 100),
        currentIndex: this.currentDatasetIndex
    };
};

// Método para obtener el tiempo total de la sesión
labelingSessionSchema.methods.getTotalTime = function() {
    if (this.endTime) {
        return Math.floor((this.endTime - this.startTime) / 1000); // en segundos
    }
    return Math.floor((new Date() - this.startTime) / 1000);
};

module.exports = mongoose.model('LabelingSession', labelingSessionSchema); 