const mongoose = require('mongoose');
const User = require('../models/user');

// Cargar variables de entorno
require('dotenv').config();

// Script para actualizar usuarios existentes con los nuevos campos del esquema
const updateExistingUsers = async () => {
    try {
        // Conectar a la base de datos usando la misma configuración que el servidor
        const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/dcp_itcr';
        await mongoose.connect(mongoUri);
        console.log('📊 Conectado a MongoDB para actualización de esquema');

        // Encontrar usuarios que no tengan los nuevos campos
        const usersToUpdate = await User.find({
            $or: [
                { role: { $exists: false } },
                { hasCompletedTraining: { $exists: false } },
                { trainingCompletedAt: { $exists: false } },
                { firstName: { $exists: false } },
                { lastName: { $exists: false } },
                { university: { $exists: false } },
                { bio: { $exists: false } },
                { phone: { $exists: false } },
                { website: { $exists: false } },
                { location: { $exists: false } },
                { updatedAt: { $exists: false } }
            ]
        });

        console.log(`📋 Encontrados ${usersToUpdate.length} usuarios para actualizar`);

        if (usersToUpdate.length === 0) {
            console.log('✅ Todos los usuarios ya tienen el esquema actualizado');
            return;
        }

        // Actualizar usuarios uno por uno para mayor control
        let updatedCount = 0;
        for (const user of usersToUpdate) {
            try {
                await User.findByIdAndUpdate(
                    user._id,
                    {
                        $set: {
                            role: user.role || 'user',
                            hasCompletedTraining: user.hasCompletedTraining !== undefined ? user.hasCompletedTraining : false,
                            trainingCompletedAt: user.trainingCompletedAt || null,
                            firstName: user.firstName || null,
                            lastName: user.lastName || null,
                            university: user.university || null,
                            bio: user.bio || null,
                            phone: user.phone || null,
                            website: user.website || null,
                            location: user.location || null,
                            updatedAt: new Date()
                        }
                    }
                );
                updatedCount++;
                console.log(`  ✓ Usuario actualizado: ${user.username}`);
            } catch (error) {
                console.log(`  ✗ Error actualizando usuario ${user.username}:`, error.message);
            }
        }

        console.log(`✅ Actualización completada:`);
        console.log(`   - Usuarios procesados: ${usersToUpdate.length}`);
        console.log(`   - Usuarios actualizados exitosamente: ${updatedCount}`);

        // Verificar la actualización
        const verifyCount = await User.countDocuments({
            role: { $exists: true },
            hasCompletedTraining: { $exists: true }
        });

        const totalCount = await User.countDocuments();
        
        console.log(`🔍 Verificación:`);
        console.log(`   - Total de usuarios: ${totalCount}`);
        console.log(`   - Usuarios con esquema actualizado: ${verifyCount}`);

        if (verifyCount === totalCount) {
            console.log('🎉 ¡Todos los usuarios tienen el esquema actualizado correctamente!');
        } else {
            console.log('⚠️  Algunos usuarios pueden necesitar actualización manual');
        }

    } catch (error) {
        console.error('❌ Error durante la actualización del esquema:', error);
    } finally {
        // Cerrar conexión
        await mongoose.connection.close();
        console.log('📊 Conexión a MongoDB cerrada');
        process.exit(0);
    }
};

// Ejecutar script solo si se llama directamente
if (require.main === module) {
    console.log('🚀 Iniciando actualización de esquema de usuarios...');
    updateExistingUsers();
}

module.exports = updateExistingUsers;
