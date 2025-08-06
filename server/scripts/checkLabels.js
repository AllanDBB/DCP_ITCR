require('dotenv').config();
const mongoose = require('mongoose');
const Label = require('../models/label');

async function checkLabels() {
    try {
        // Conectar a MongoDB
        const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://DCPUser:m0bex47d7rLeGpTj@cluster0.mmx82lq.mongodb.net/DCP-ITCR?retryWrites=true&w=majority&appName=Cluster0';
        
        await mongoose.connect(mongoURI);
        console.log('✅ Conectado a MongoDB');
        
        // Contar total de labels
        const totalLabels = await Label.countDocuments();
        console.log(`📊 Total de evaluaciones en BD: ${totalLabels}`);
        
        if (totalLabels > 0) {
            // Obtener algunas muestras
            const sampleLabels = await Label.find()
                .populate('userId', 'username email')
                .populate('datasetId', 'name category')
                .limit(5)
                .sort({ createdAt: -1 });
            
            console.log('\n📋 Últimas 5 evaluaciones:');
            sampleLabels.forEach((label, index) => {
                console.log(`${index + 1}. ID: ${label._id}`);
                console.log(`   Usuario: ${label.userId?.username || 'N/A'}`);
                console.log(`   Dataset: ${label.datasetId?.name || 'N/A'}`);
                console.log(`   Status: ${label.status}`);
                console.log(`   Change Points: ${label.changePoints?.length || 0}`);
                console.log(`   Creado: ${label.createdAt}`);
                console.log('');
            });
            
            // Estadísticas por status
            const statsByStatus = await Label.aggregate([
                {
                    $group: {
                        _id: '$status',
                        count: { $sum: 1 }
                    }
                }
            ]);
            
            console.log('📈 Estadísticas por status:');
            statsByStatus.forEach(stat => {
                console.log(`   ${stat._id}: ${stat.count}`);
            });
        }
        
    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await mongoose.connection.close();
        console.log('🔌 Conexión cerrada');
    }
}

checkLabels();
