const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true, trim: true },
    email:    { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    photoUrl: { type: String, trim: true, default: null },
    role: { 
        type: String, 
        enum: ['user', 'admin'], 
        default: 'user' 
    },
    assignedDatasets: [{
        dataset: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Dataset'
        },
        assignedAt: {
            type: Date,
            default: Date.now
        },
        status: {
            type: String,
            enum: ['pending', 'in_progress', 'completed'],
            default: 'pending'
        },
        completedAt: Date,
        evaluationCount: {
            type: Number,
            default: 0
        }
    }],
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
    createdAt:{ type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Middleware para actualizar automáticamente updatedAt
userSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
});

// Índices para mejorar el rendimiento
userSchema.index({ role: 1 });
userSchema.index({ 'assignedDatasets.dataset': 1 });

module.exports = mongoose.model('User', userSchema);