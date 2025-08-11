const mongoose = require('mongoose');

const userProgressSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    totalSessions: {
        type: Number,
        default: 0
    },
    totalDatasetsLabeled: {
        type: Number,
        default: 0
    },
    totalChangePointsLabeled: {
        type: Number,
        default: 0
    },
    totalTimeSpent: {
        type: Number, // en segundos
        default: 0
    },
    averageTimePerDataset: {
        type: Number, // en segundos
        default: 0
    },
    accuracy: {
        type: Number,
        min: 0,
        max: 1,
        default: 0
    },
    consistency: {
        type: Number,
        min: 0,
        max: 1,
        default: 0
    },
    level: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced', 'expert'],
        default: 'beginner'
    },
    experience: {
        type: Number, // puntos de experiencia
        default: 0
    },
    badges: [{
        name: {
            type: String,
            required: true
        },
        description: String,
        earnedAt: {
            type: Date,
            default: Date.now
        },
        icon: String
    }],
    statistics: {
        byDifficulty: {
            easy: {
                datasets: { type: Number, default: 0 },
                changePoints: { type: Number, default: 0 },
                accuracy: { type: Number, default: 0 }
            },
            medium: {
                datasets: { type: Number, default: 0 },
                changePoints: { type: Number, default: 0 },
                accuracy: { type: Number, default: 0 }
            },
            hard: {
                datasets: { type: Number, default: 0 },
                changePoints: { type: Number, default: 0 },
                accuracy: { type: Number, default: 0 }
            }
        },
        byType: {
            mean: { type: Number, default: 0 },
            trend: { type: Number, default: 0 },
            variance: { type: Number, default: 0 },
            level: { type: Number, default: 0 }
        },
        dailyActivity: [{
            date: {
                type: Date,
                required: true
            },
            datasets: {
                type: Number,
                default: 0
            },
            timeSpent: {
                type: Number,
                default: 0
            }
        }]
    },
    preferences: {
        defaultDifficulty: {
            type: String,
            enum: ['easy', 'medium', 'hard', 'mixed'],
            default: 'mixed'
        },
        sessionLength: {
            type: Number, // en minutos
            default: 30
        },
        notifications: {
            type: Boolean,
            default: true
        }
    },
    lastActivity: {
        type: Date,
        default: Date.now
    },
    streak: {
        current: {
            type: Number,
            default: 0
        },
        longest: {
            type: Number,
            default: 0
        },
        lastDate: {
            type: Date
        }
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
userProgressSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
});

// Índices para mejorar el rendimiento
userProgressSchema.index({ userId: 1 });
userProgressSchema.index({ level: 1 });
userProgressSchema.index({ experience: -1 });
userProgressSchema.index({ lastActivity: -1 });

// Método para calcular el nivel basado en la experiencia
userProgressSchema.methods.calculateLevel = function() {
    if (this.experience >= 1000) return 'expert';
    if (this.experience >= 500) return 'advanced';
    if (this.experience >= 100) return 'intermediate';
    return 'beginner';
};

// Método para actualizar el streak
userProgressSchema.methods.updateStreak = function() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (!this.streak.lastDate) {
        this.streak.current = 1;
        this.streak.lastDate = today;
        return;
    }
    
    const lastDate = new Date(this.streak.lastDate);
    lastDate.setHours(0, 0, 0, 0);
    
    const diffTime = today - lastDate;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
        // Día consecutivo
        this.streak.current += 1;
    } else if (diffDays > 1) {
        // Streak roto
        this.streak.current = 1;
    }
    // Si diffDays === 0, es el mismo día, no hacer nada
    
    this.streak.lastDate = today;
    
    if (this.streak.current > this.streak.longest) {
        this.streak.longest = this.streak.current;
    }
};

// Método para agregar experiencia
userProgressSchema.methods.addExperience = function(points) {
    this.experience += points;
    this.level = this.calculateLevel();
};

module.exports = mongoose.model('UserProgress', userProgressSchema); 