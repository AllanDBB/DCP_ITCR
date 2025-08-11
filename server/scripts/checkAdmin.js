const mongoose = require('mongoose');
const User = require('../models/user');

const checkAdminUser = async () => {
    try {
        console.log('🔍 Verificando usuario administrador...');
        
        // Conectar a MongoDB
        const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://DCPUser:m0bex47d7rLeGpTj@cluster0.mmx82lq.mongodb.net/DCP-ITCR?retryWrites=true&w=majority&appName=Cluster0';
        
        await mongoose.connect(mongoURI);
        console.log('✅ Conectado a MongoDB');
        
        // Buscar usuario admin
        const adminUser = await User.findOne({ email: 'admin@dcp-itcr.com' });
        
        if (!adminUser) {
            console.log('❌ No se encontró el usuario administrador');
            console.log('💡 Ejecuta: npm run create-admin');
            process.exit(1);
        }
        
        console.log('✅ Usuario administrador encontrado:');
        console.log('📧 Email:', adminUser.email);
        console.log('👤 Usuario:', adminUser.username);
        console.log('🔐 Rol:', adminUser.role);
        console.log('📅 Creado:', adminUser.createdAt);
        
        // Verificar si el rol es correcto
        if (adminUser.role !== 'admin' && adminUser.role !== 'superadmin') {
            console.log('⚠️ El usuario no tiene rol de administrador');
            console.log('🔄 Actualizando rol...');
            
            adminUser.role = 'admin';
            await adminUser.save();
            console.log('✅ Rol actualizado a "admin"');
        } else {
            console.log('✅ El rol es correcto');
        }
        
        // Mostrar todos los usuarios
        console.log('\n📋 Todos los usuarios en el sistema:');
        const allUsers = await User.find({}, 'username email role createdAt');
        allUsers.forEach(user => {
            console.log(`- ${user.username} (${user.email}) - Rol: ${user.role}`);
        });
        
        process.exit(0);
        
    } catch (error) {
        console.error('❌ Error al verificar usuario administrador:', error);
        process.exit(1);
    }
};

// Ejecutar si se llama directamente
if (require.main === module) {
    checkAdminUser();
}

module.exports = { checkAdminUser }; 