const mongoose = require('mongoose');

const forceUpdateRoles = async () => {
    try {
        console.log('🔧 Actualizando roles directamente en la base de datos...');
        
        // Conectar a MongoDB
        const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://DCPUser:m0bex47d7rLeGpTj@cluster0.mmx82lq.mongodb.net/DCP-ITCR?retryWrites=true&w=majority&appName=Cluster0';
        
        await mongoose.connect(mongoURI);
        console.log('✅ Conectado a MongoDB');
        
        // Actualizar directamente usando la colección
        const db = mongoose.connection.db;
        const usersCollection = db.collection('users');
        
        // Actualizar admin específicamente
        const adminResult = await usersCollection.updateOne(
            { email: 'admin@dcp-itcr.com' },
            { $set: { role: 'admin' } }
        );
        
        console.log(`✅ Admin actualizado: ${adminResult.modifiedCount} documentos`);
        
        // Actualizar todos los demás usuarios a 'user'
        const userResult = await usersCollection.updateMany(
            { email: { $ne: 'admin@dcp-itcr.com' } },
            { $set: { role: 'user' } }
        );
        
        console.log(`✅ Usuarios normales actualizados: ${userResult.modifiedCount} documentos`);
        
        // Verificar el resultado
        const allUsers = await usersCollection.find({}, { projection: { username: 1, email: 1, role: 1 } }).toArray();
        
        console.log('\n📋 Estado final de usuarios:');
        allUsers.forEach(user => {
            console.log(`- ${user.username} (${user.email}) - Rol: ${user.role || 'undefined'}`);
        });
        
        process.exit(0);
        
    } catch (error) {
        console.error('❌ Error al actualizar roles:', error);
        process.exit(1);
    }
};

// Ejecutar si se llama directamente
if (require.main === module) {
    forceUpdateRoles();
}

module.exports = { forceUpdateRoles }; 