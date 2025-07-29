require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/user');

const makeUserAdmin = async () => {
    try {
        // Conectar a MongoDB
        const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://DCPUser:m0bex47d7rLeGpTj@cluster0.mmx82lq.mongodb.net/DCP-ITCR?retryWrites=true&w=majority&appName=Cluster0';
        
        await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        
        console.log('✅ Conectado a MongoDB');
        
        // Hacer admin al usuario testadmin
        const user = await User.findOneAndUpdate(
            { email: 'testadmin@test.com' },
            { 
                role: 'admin',
                updatedAt: new Date()
            },
            { new: true }
        );
        
        if (user) {
            console.log('✅ Usuario actualizado a admin:');
            console.log('📧 Email:', user.email);
            console.log('👤 Username:', user.username);
            console.log('🔐 Rol:', user.role);
        } else {
            console.log('❌ Usuario no encontrado con email: testadmin@test.com');
            
            // Mostrar todos los usuarios disponibles
            const allUsers = await User.find({}, 'username email role');
            console.log('\n📋 Usuarios disponibles:');
            allUsers.forEach(u => {
                console.log(`- ${u.username} (${u.email}) - Rol: ${u.role}`);
            });
        }
        
        process.exit(0);
        
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
};

makeUserAdmin();
