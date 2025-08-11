require('dotenv').config();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

async function generateAdminToken() {
    try {
        // Conectar a MongoDB
        const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://DCPUser:m0bex47d7rLeGpTj@cluster0.mmx82lq.mongodb.net/DCP-ITCR?retryWrites=true&w=majority&appName=Cluster0';
        
        await mongoose.connect(mongoURI);
        console.log('✅ Conectado a MongoDB');
        
        // Buscar usuario admin
        const adminUser = await User.findOne({ role: 'admin' });
        
        if (!adminUser) {
            console.log('❌ No se encontró usuario admin');
            return;
        }
        
        console.log(`✅ Usuario admin encontrado: ${adminUser.username}`);
        
        // Generar token
        const token = jwt.sign(
            { 
                userId: adminUser._id,
                username: adminUser.username,
                role: adminUser.role
            },
            process.env.JWT_SECRET || 'dcp_itcr_super_secret_key_2025_muy_segura_para_tokens',
            { expiresIn: '1h' }
        );
        
        console.log('🔑 Token generado:');
        console.log(token);
        console.log('\n📋 Para usar con curl:');
        console.log(`curl -H "Authorization: Bearer ${token}" http://localhost:5000/api/admin/labels`);
        
    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await mongoose.connection.close();
        console.log('🔌 Conexión cerrada');
    }
}

generateAdminToken();
