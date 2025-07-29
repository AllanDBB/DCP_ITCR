const mongoose = require('mongoose');
const Dataset = require('../models/dataset');

// Función para generar datos de series temporales sintéticas
const generateTimeSeriesData = (length, type = 'random') => {
    const data = [];
    let baseValue = Math.random() * 50 + 25; // Valor base entre 25-75
    
    for (let i = 0; i < length; i++) {
        let value;
        
        switch (type) {
            case 'trend':
                // Serie con tendencia
                value = baseValue + (i * 0.5) + (Math.random() - 0.5) * 5;
                break;
            case 'mean_shift':
                // Serie con cambio en la media
                value = baseValue + (Math.random() - 0.5) * 5;
                if (i > length / 2) {
                    value += 20; // Cambio en la media
                }
                break;
            case 'variance_change':
                // Serie con cambio en la varianza
                const noise = Math.random() - 0.5;
                if (i < length / 2) {
                    value = baseValue + noise * 3;
                } else {
                    value = baseValue + noise * 10;
                }
                break;
            case 'level_shift':
                // Serie con cambio de nivel
                value = baseValue + (Math.random() - 0.5) * 5;
                if (i > length * 0.7) {
                    value += 15;
                }
                break;
            default:
                // Serie aleatoria
                value = baseValue + (Math.random() - 0.5) * 10;
        }
        
        data.push([i, Math.round(value * 100) / 100]);
    }
    
    return data;
};

// Datos de ejemplo para los datasets
const sampleDatasets = [
    {
        name: 'Serie Temporal Económica A',
        description: 'Datos económicos simulados con cambios en la tendencia',
        source: 'simulated',
        category: 'economics',
        difficulty: 'easy',
        expectedChangePoints: 2,
        tags: ['economía', 'tendencia', 'simulado'],
        data: generateTimeSeriesData(100, 'trend')
    },
    {
        name: 'Serie Temporal Médica B',
        description: 'Datos médicos simulados con cambios en la media',
        source: 'simulated',
        category: 'medical',
        difficulty: 'medium',
        expectedChangePoints: 1,
        tags: ['medicina', 'media', 'simulado'],
        data: generateTimeSeriesData(120, 'mean_shift')
    },
    {
        name: 'Serie Temporal Climática C',
        description: 'Datos climáticos simulados con cambios en la varianza',
        source: 'simulated',
        category: 'climate',
        difficulty: 'hard',
        expectedChangePoints: 1,
        tags: ['clima', 'varianza', 'simulado'],
        data: generateTimeSeriesData(150, 'variance_change')
    },
    {
        name: 'Serie Temporal Industrial D',
        description: 'Datos industriales simulados con cambios de nivel',
        source: 'simulated',
        category: 'industrial',
        difficulty: 'medium',
        expectedChangePoints: 1,
        tags: ['industrial', 'nivel', 'simulado'],
        data: generateTimeSeriesData(80, 'level_shift')
    },
    {
        name: 'Serie Temporal Financiera E',
        description: 'Datos financieros simulados con múltiples cambios',
        source: 'simulated',
        category: 'finance',
        difficulty: 'hard',
        expectedChangePoints: 3,
        tags: ['finanzas', 'múltiple', 'simulado'],
        data: generateTimeSeriesData(200, 'random')
    },
    {
        name: 'Serie Temporal Simple F',
        description: 'Serie temporal simple sin cambios significativos',
        source: 'simulated',
        category: 'general',
        difficulty: 'easy',
        expectedChangePoints: 0,
        tags: ['simple', 'sin cambios', 'simulado'],
        data: generateTimeSeriesData(60, 'random')
    }
];

// Función para poblar la base de datos
const seedDatabase = async () => {
    try {
        console.log('🌱 Iniciando población de base de datos...');
        
        // Conectar a MongoDB
        const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://DCPUser:m0bex47d7rLeGpTj@cluster0.mmx82lq.mongodb.net/DCP-ITCR?retryWrites=true&w=majority&appName=Cluster0';
        
        await mongoose.connect(mongoURI);
        console.log('✅ Conectado a MongoDB');
        
        // Limpiar datasets existentes
        await Dataset.deleteMany({});
        console.log('🧹 Datasets existentes eliminados');
        
        // Crear nuevos datasets
        const createdDatasets = [];
        for (const datasetData of sampleDatasets) {
            // Calcular estadísticas de los datos
            const values = datasetData.data.map(point => point[1]);
            const minValue = Math.min(...values);
            const maxValue = Math.max(...values);
            const meanValue = values.reduce((sum, val) => sum + val, 0) / values.length;
            const variance = values.reduce((sum, val) => sum + Math.pow(val - meanValue, 2), 0) / values.length;
            const stdValue = Math.sqrt(variance);
            
            const dataset = new Dataset({
                ...datasetData,
                length: datasetData.data.length,
                minValue,
                maxValue,
                meanValue,
                stdValue
            });
            
            await dataset.save();
            createdDatasets.push(dataset);
            console.log(`✅ Dataset creado: ${dataset.name}`);
        }
        
        console.log(`🎉 Base de datos poblada exitosamente con ${createdDatasets.length} datasets`);
        
        // Mostrar resumen
        console.log('\n📊 Resumen de datasets creados:');
        createdDatasets.forEach(dataset => {
            console.log(`  - ${dataset.name} (${dataset.difficulty}, ${dataset.expectedChangePoints} CP esperados)`);
        });
        
        process.exit(0);
        
    } catch (error) {
        console.error('❌ Error al poblar la base de datos:', error);
        process.exit(1);
    }
};

// Ejecutar si se llama directamente
if (require.main === module) {
    seedDatabase();
}

module.exports = { seedDatabase, generateTimeSeriesData }; 