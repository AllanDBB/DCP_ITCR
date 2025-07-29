const mongoose = require('mongoose');
const User = require('../models/user');

const fixUserRoles = async () => {
    try {
        console.log('🔧 Arreglando roles de usuarios...');
        
        // Conectar a MongoDB
        const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://DCPUser:m0bex47d7rLeGpTj@cluster0.mmx82lq.mongodb.net/DCP-ITCR?retryWrites=true&w=majority&appName=Cluster0';
        
        await mongoose.connect(mongoURI);
        console.log('✅ Conectado a MongoDB');
        
        // Actualizar todos los usuarios que no tienen rol
        const result = await User.updateMany(
            { role: { $exists: false } },
            { $set: { role: 'user' } }
        );
        
        console.log(`✅ ${result.modifiedCount} usuarios actualizados con rol 'user'`);
        
        // Actualizar específicamente el admin
        const adminResult = await User.updateOne(
            { email: 'admin@dcp-itcr.com' },
            { $set: { role: 'admin' } }
        );
        
        if (adminResult.modifiedCount > 0) {
            console.log('✅ Usuario admin actualizado con rol "admin"');
        }
        
        // Mostrar todos los usuarios con sus roles
        console.log('\n📋 Estado final de usuarios:');
        const allUsers = await User.find({}, 'username email role createdAt');
        allUsers.forEach(user => {
            console.log(`- ${user.username} (${user.email}) - Rol: ${user.role || 'undefined'}`);
        });
        
        process.exit(0);
        
    } catch (error) {
        console.error('❌ Error al arreglar roles:', error);
        process.exit(1);
    }
};

// Ejecutar si se llama directamente
if (require.main === module) {
    fixUserRoles();
}

module.exports = { fixUserRoles }; 