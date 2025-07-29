const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/user');

const createAdminUser = async () => {
    try {
        console.log('🔧 Creando usuario administrador...');
        
        // Conectar a MongoDB
        const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://DCPUser:m0bex47d7rLeGpTj@cluster0.mmx82lq.mongodb.net/DCP-ITCR?retryWrites=true&w=majority&appName=Cluster0';
        
        await mongoose.connect(mongoURI);
        console.log('✅ Conectado a MongoDB');
        
        // Verificar si ya existe un admin
        const existingAdmin = await User.findOne({ role: 'admin' });
        if (existingAdmin) {
            console.log('⚠️ Ya existe un usuario administrador:', existingAdmin.email);
            process.exit(0);
        }
        
        // Crear usuario administrador
        const adminData = {
            username: 'admin',
            email: 'admin@dcp-itcr.com',
            password: 'Admin123!',
            role: 'admin',
            firstName: 'Administrador',
            lastName: 'DCP ITCR',
            university: 'ITCR',
            bio: 'Administrador del sistema DCP ITCR'
        };
        
        // Encriptar contraseña
        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(adminData.password, saltRounds);
        
        const adminUser = new User({
            ...adminData,
            password: hashedPassword
        });
        
        await adminUser.save();
        
        console.log('✅ Usuario administrador creado exitosamente');
        console.log('📧 Email:', adminData.email);
        console.log('🔑 Contraseña:', adminData.password);
        console.log('👤 Usuario:', adminData.username);
        console.log('🔐 Rol:', adminData.role);
        
        process.exit(0);
        
    } catch (error) {
        console.error('❌ Error al crear usuario administrador:', error);
        process.exit(1);
    }
};

// Ejecutar si se llama directamente
if (require.main === module) {
    createAdminUser();
}

module.exports = { createAdminUser }; 