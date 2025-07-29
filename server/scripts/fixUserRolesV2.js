const mongoose = require('mongoose');
const User = require('../models/user');

const fixUserRolesV2 = async () => {
    try {
        console.log('🔧 Arreglando roles de usuarios (v2)...');
        
        // Conectar a MongoDB
        const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://DCPUser:m0bex47d7rLeGpTj@cluster0.mmx82lq.mongodb.net/DCP-ITCR?retryWrites=true&w=majority&appName=Cluster0';
        
        await mongoose.connect(mongoURI);
        console.log('✅ Conectado a MongoDB');
        
        // Obtener todos los usuarios
        const users = await User.find({});
        console.log(`📋 Encontrados ${users.length} usuarios`);
        
        let updatedCount = 0;
        
        for (const user of users) {
            let needsUpdate = false;
            
            // Si no tiene rol o el rol es undefined
            if (!user.role || user.role === undefined) {
                if (user.email === 'admin@dcp-itcr.com') {
                    user.role = 'admin';
                    console.log(`✅ Usuario ${user.username} actualizado a rol "admin"`);
                } else {
                    user.role = 'user';
                    console.log(`✅ Usuario ${user.username} actualizado a rol "user"`);
                }
                needsUpdate = true;
            }
            
            if (needsUpdate) {
                await user.save();
                updatedCount++;
            }
        }
        
        console.log(`\n✅ Total de usuarios actualizados: ${updatedCount}`);
        
        // Mostrar estado final
        console.log('\n📋 Estado final de usuarios:');
        const finalUsers = await User.find({}, 'username email role createdAt');
        finalUsers.forEach(user => {
            console.log(`- ${user.username} (${user.email}) - Rol: ${user.role}`);
        });
        
        process.exit(0);
        
    } catch (error) {
        console.error('❌ Error al arreglar roles:', error);
        process.exit(1);
    }
};

// Ejecutar si se llama directamente
if (require.main === module) {
    fixUserRolesV2();
}

module.exports = { fixUserRolesV2 }; 