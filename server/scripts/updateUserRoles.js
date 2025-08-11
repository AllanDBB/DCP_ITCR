require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/user');

const updateUserRoles = async () => {
    try {
        // Conectar a MongoDB
        const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://DCPUser:m0bex47d7rLeGpTj@cluster0.mmx82lq.mongodb.net/DCP-ITCR?retryWrites=true&w=majority&appName=Cluster0';
        
        await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        
        console.log('✅ Conectado a MongoDB');
        
        // Actualizar todos los usuarios sin rol para que tengan rol 'user'
        const result = await User.updateMany(
            { role: { $exists: false } },
            { 
                $set: { 
                    role: 'user',
                    assignedDatasets: [],
                    updatedAt: new Date()
                }
            }
        );
        
        console.log(`✅ Se actualizaron ${result.modifiedCount} usuarios`);
        
        // Verificar si hay algún usuario que debería ser admin
        const totalUsers = await User.countDocuments();
        const adminUsers = await User.countDocuments({ role: 'admin' });
        
        console.log(`📊 Total de usuarios: ${totalUsers}`);
        console.log(`👑 Usuarios admin: ${adminUsers}`);
        
        if (adminUsers === 0) {
            console.log('⚠️  No hay usuarios admin. Puedes crear uno manualmente o usar el script createAdmin.js');
        }
        
        console.log('✅ Migración completada exitosamente');
        
    } catch (error) {
        console.error('❌ Error en migración:', error);
    } finally {
        await mongoose.disconnect();
        console.log('📤 Desconectado de MongoDB');
    }
};

updateUserRoles();
