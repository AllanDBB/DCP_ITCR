const { validationResult } = require('express-validator');
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const Dataset = require('../models/dataset');
const User = require('../models/user');

// Configuración de multer para subir archivos
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = 'uploads/';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + '.csv');
    }
});

const upload = multer({ 
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
            cb(null, true);
        } else {
            cb(new Error('Solo se permiten archivos CSV'), false);
        }
    },
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB máximo
    }
});

// Middleware para upload - NO exportar directamente
const uploadMiddleware = upload.single('csvFile');

// Subir dataset desde CSV
const uploadDatasetFromCSV = (req, res) => {
    uploadMiddleware(req, res, async (err) => {
        if (err) {
            console.error('Error en upload:', err);
            return res.status(400).json({
                success: false,
                message: err.message || 'Error al subir archivo'
            });
        }

        try {
            if (!req.file) {
                return res.status(400).json({
                    success: false,
                    message: 'No se proporcionó archivo CSV'
                });
            }

            const { name, description, source, category, difficulty, expectedChangePoints, tags, selectedColumn } = req.body;
            
            // Leer y procesar el archivo CSV
            const results = [];
            const filePath = req.file.path;

            return new Promise((resolve) => {
                fs.createReadStream(filePath)
                    .pipe(csv())
                    .on('data', (data) => results.push(data))
                    .on('end', async () => {
                        try {
                            // Procesar los datos del CSV
                            console.log('📊 Procesando CSV con', results.length, 'filas');
                            console.log('🔍 Primera fila:', results[0]);
                            
                            // Obtener las columnas (excluyendo la primera que suele ser el índice)
                            const firstRow = results[0];
                            const columns = Object.keys(firstRow);
                            console.log('📋 Columnas encontradas:', columns);
                            
                            // Determinar cuál columna usar como timestamp y cuáles como valores
                            const indexColumn = columns[0]; // Primera columna (índice)
                            const valueColumns = columns.slice(1); // Resto de columnas
                            
                            console.log('📍 Columna de índice:', indexColumn);
                            console.log('📈 Columnas de valores:', valueColumns);
                            
                            // Si no se especificó una columna, usar la primera serie de valores
                            const columnToUse = selectedColumn || valueColumns[0] || columns[1] || 'value';
                            console.log('✅ Usando columna para valores:', columnToUse);
                            
                            // Validar que la columna seleccionada existe
                            if (!columns.includes(columnToUse)) {
                                throw new Error(`La columna seleccionada "${columnToUse}" no existe en el archivo`);
                            }
                            
                            // Procesar datos en formato [[x, y]]
                            const data = results.map((row, index) => {
                                // Usar el índice de la fila como x
                                const x = parseInt(row[indexColumn]) || index;
                                
                                // Obtener el valor de la columna seleccionada como y
                                let y = row[columnToUse];
                                
                                // Convertir a número
                                if (typeof y === 'string') {
                                    y = parseFloat(y);
                                }
                                
                                // Validar que es un número válido
                                if (isNaN(y)) {
                                    console.warn(`⚠️ Valor inválido en fila ${index}:`, row[columnToUse]);
                                    y = 0;
                                }
                                
                                return [x, y];
                            }).filter(point => !isNaN(point[1]));
                            
                            console.log('📊 Datos procesados:');
                            console.log('- Total de puntos:', data.length);
                            console.log('- Primeros 3 puntos:', data.slice(0, 3));
                            console.log('- Últimos 3 puntos:', data.slice(-3));

                            // Calcular estadísticas requeridas
                            const values = data.map(point => point[1]);
                            const length = data.length;
                            const minValue = Math.min(...values);
                            const maxValue = Math.max(...values);
                            const meanValue = values.reduce((sum, val) => sum + val, 0) / length;
                            const variance = values.reduce((sum, val) => sum + Math.pow(val - meanValue, 2), 0) / length;
                            const stdValue = Math.sqrt(variance);

                            console.log('� Estadísticas calculadas:');
                            console.log('- Longitud:', length);
                            console.log('- Mínimo:', minValue);
                            console.log('- Máximo:', maxValue);
                            console.log('- Media:', meanValue);
                            console.log('- Desviación estándar:', stdValue);

                            // Crear el dataset con el esquema correcto
                            const dataset = new Dataset({
                                name: name || `${req.file.originalname.replace('.csv', '')}-${columnToUse}`,
                                description: description || `Dataset subido desde CSV. Serie: ${columnToUse}. ${length} puntos de datos.`,
                                source: source || 'CSV Upload',
                                category: category || 'general',
                                difficulty: difficulty || 'medium',
                                data: data,
                                length: length,
                                minValue: minValue,
                                maxValue: maxValue,
                                meanValue: meanValue,
                                stdValue: stdValue,
                                expectedChangePoints: expectedChangePoints ? 
                                    parseInt(expectedChangePoints) || 0 : 
                                    0,
                                tags: tags ? tags.split(',').map(tag => tag.trim()) : [columnToUse],
                                status: 'active'
                            });

                            await dataset.save();
                            console.log('✅ Dataset guardado con ID:', dataset._id);

                            // Limpiar archivo temporal
                            fs.unlinkSync(filePath);

                            res.json({
                                success: true,
                                message: 'Dataset creado exitosamente desde CSV',
                                dataset: {
                                    id: dataset._id,
                                    name: dataset.name,
                                    description: dataset.description,
                                    dataPoints: dataset.length,
                                    category: dataset.category,
                                    columnUsed: columnToUse,
                                    availableColumns: valueColumns,
                                    stats: {
                                        min: dataset.minValue,
                                        max: dataset.maxValue,
                                        mean: dataset.meanValue,
                                        std: dataset.stdValue
                                    }
                                }
                            });

                        } catch (error) {
                            console.error('❌ Error al procesar CSV:', error);
                            // Limpiar archivo en caso de error
                            if (fs.existsSync(filePath)) {
                                fs.unlinkSync(filePath);
                            }
                            res.status(500).json({
                                success: false,
                                message: `Error al procesar el archivo CSV: ${error.message}`
                            });
                        }
                    });
            });

        } catch (error) {
            console.error('Error en uploadDatasetFromCSV:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor'
            });
        }
    });
};

// Subir múltiples datasets desde CSV (uno por cada columna)
const uploadMultipleDatasetsFromCSV = (req, res) => {
    uploadMiddleware(req, res, async (err) => {
        if (err) {
            console.error('Error en upload:', err);
            return res.status(400).json({
                success: false,
                message: err.message || 'Error al subir archivo'
            });
        }

        try {
            if (!req.file) {
                return res.status(400).json({
                    success: false,
                    message: 'No se proporcionó archivo CSV'
                });
            }

            const { name, description, source, category, difficulty, expectedChangePoints, tags } = req.body;
            
            // Leer y procesar el archivo CSV
            const results = [];
            const filePath = req.file.path;

            return new Promise((resolve) => {
                fs.createReadStream(filePath)
                    .pipe(csv())
                    .on('data', (data) => results.push(data))
                    .on('end', async () => {
                        try {
                            console.log('📊 Procesando CSV con múltiples series:', results.length, 'filas');
                            
                            // Obtener las columnas
                            const firstRow = results[0];
                            const columns = Object.keys(firstRow);
                            const indexColumn = columns[0];
                            const valueColumns = columns.slice(1);
                            
                            console.log('📈 Creando datasets para columnas:', valueColumns);
                            
                            const createdDatasets = [];
                            
                            // Crear un dataset para cada columna de valores
                            for (const column of valueColumns) {
                                try {
                                    // Procesar datos para esta columna
                                    const data = results.map((row, index) => {
                                        const x = parseInt(row[indexColumn]) || index;
                                        let y = parseFloat(row[column]);
                                        if (isNaN(y)) y = 0;
                                        return [x, y];
                                    }).filter(point => !isNaN(point[1]));

                                    // Calcular estadísticas
                                    const values = data.map(point => point[1]);
                                    const length = data.length;
                                    const minValue = Math.min(...values);
                                    const maxValue = Math.max(...values);
                                    const meanValue = values.reduce((sum, val) => sum + val, 0) / length;
                                    const variance = values.reduce((sum, val) => sum + Math.pow(val - meanValue, 2), 0) / length;
                                    const stdValue = Math.sqrt(variance);

                                    // Crear dataset
                                    const dataset = new Dataset({
                                        name: `${name || req.file.originalname.replace('.csv', '')}-${column}`,
                                        description: `${description || 'Dataset subido desde CSV'}. Serie: ${column}. ${length} puntos.`,
                                        source: source || 'CSV Upload',
                                        category: category || 'general',
                                        difficulty: difficulty || 'medium',
                                        data: data,
                                        length: length,
                                        minValue: minValue,
                                        maxValue: maxValue,
                                        meanValue: meanValue,
                                        stdValue: stdValue,
                                        expectedChangePoints: expectedChangePoints ? parseInt(expectedChangePoints) || 0 : 0,
                                        tags: tags ? tags.split(',').map(tag => tag.trim()).concat([column]) : [column],
                                        status: 'active'
                                    });

                                    await dataset.save();
                                    
                                    createdDatasets.push({
                                        id: dataset._id,
                                        name: dataset.name,
                                        column: column,
                                        dataPoints: length,
                                        stats: {
                                            min: minValue,
                                            max: maxValue,
                                            mean: meanValue,
                                            std: stdValue
                                        }
                                    });
                                    
                                    console.log(`✅ Dataset creado para columna ${column}:`, dataset._id);
                                    
                                } catch (error) {
                                    console.error(`❌ Error creando dataset para columna ${column}:`, error);
                                }
                            }

                            // Limpiar archivo temporal
                            fs.unlinkSync(filePath);

                            res.json({
                                success: true,
                                message: `Se crearon ${createdDatasets.length} datasets exitosamente`,
                                datasets: createdDatasets,
                                totalColumns: valueColumns.length,
                                columnsProcessed: valueColumns
                            });

                        } catch (error) {
                            console.error('❌ Error al procesar CSV múltiple:', error);
                            if (fs.existsSync(filePath)) {
                                fs.unlinkSync(filePath);
                            }
                            res.status(500).json({
                                success: false,
                                message: `Error al procesar el archivo CSV: ${error.message}`
                            });
                        }
                    });
            });

        } catch (error) {
            console.error('Error en uploadMultipleDatasetsFromCSV:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor'
            });
        }
    });
};

// Obtener todos los usuarios
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}, '-password')
            .populate('assignedDatasets.dataset', 'name description')
            .sort({ createdAt: -1 });
        
        res.json({
            success: true,
            data: {
                users
            }
        });
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};

// Obtener todos los datasets
const getAllDatasets = async (req, res) => {
    try {
        const datasets = await Dataset.find({}).sort({ createdAt: -1 });
        
        res.json({
            success: true,
            data: {
                datasets
            }
        });
    } catch (error) {
        console.error('Error al obtener datasets:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};

// Asignar dataset a usuario
const assignDatasetToUser = async (req, res) => {
    try {
        const { userId, datasetId } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }

        const dataset = await Dataset.findById(datasetId);
        if (!dataset) {
            return res.status(404).json({
                success: false,
                message: 'Dataset no encontrado'
            });
        }

        // Verificar si ya está asignado
        const existingAssignment = user.assignedDatasets.find(
            assignment => assignment.dataset.toString() === datasetId
        );

        if (existingAssignment) {
            return res.status(400).json({
                success: false,
                message: 'El dataset ya está asignado a este usuario'
            });
        }

        // Agregar asignación
        user.assignedDatasets.push({
            dataset: datasetId,
            status: 'pending',
            assignedAt: new Date()
        });

        await user.save();

        res.json({
            success: true,
            message: 'Dataset asignado exitosamente',
            assignment: user.assignedDatasets[user.assignedDatasets.length - 1]
        });
    } catch (error) {
        console.error('Error al asignar dataset:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};

// Eliminar asignación de dataset
const removeDatasetAssignment = async (req, res) => {
    try {
        const { userId, datasetId } = req.params;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }

        user.assignedDatasets = user.assignedDatasets.filter(
            assignment => assignment.dataset.toString() !== datasetId
        );

        await user.save();

        res.json({
            success: true,
            message: 'Asignación eliminada exitosamente'
        });
    } catch (error) {
        console.error('Error al eliminar asignación:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};

// Actualizar rol de usuario
const updateUserRole = async (req, res) => {
    try {
        const { userId } = req.params;
        const { role } = req.body;

        const user = await User.findByIdAndUpdate(
            userId,
            { role },
            { new: true, runValidators: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }

        res.json({
            success: true,
            message: 'Rol actualizado exitosamente',
            user
        });
    } catch (error) {
        console.error('Error al actualizar rol:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};

// Estadísticas del admin
const getAdminStats = async (req, res) => {
    try {
        const userCount = await User.countDocuments();
        const datasetCount = await Dataset.countDocuments();
        const adminCount = await User.countDocuments({ role: 'admin' });
        const assignmentCount = await User.aggregate([
            { $unwind: '$assignedDatasets' },
            { $count: 'total' }
        ]);

        res.json({
            success: true,
            stats: {
                totalUsers: userCount,
                totalDatasets: datasetCount,
                totalAdmins: adminCount,
                totalAssignments: assignmentCount[0]?.total || 0
            }
        });
    } catch (error) {
        console.error('Error al obtener estadísticas:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};

// Estadísticas de usuarios
const getUserStats = async (req, res) => {
    try {
        const users = await User.find({}, 'username email role assignedDatasets')
            .populate('assignedDatasets.dataset', 'name');

        const totalUsers = users.length;
        const usersByRole = {
            admin: users.filter(u => u.role === 'admin').length,
            user: users.filter(u => u.role === 'user').length
        };

        const usersWithAssignments = users.filter(u => u.assignedDatasets.length > 0).length;
        const totalAssignments = users.reduce((total, user) => total + user.assignedDatasets.length, 0);
        
        const byStatus = {
            pending: 0,
            in_progress: 0,
            completed: 0
        };

        users.forEach(user => {
            user.assignedDatasets.forEach(assignment => {
                if (byStatus[assignment.status] !== undefined) {
                    byStatus[assignment.status]++;
                }
            });
        });

        res.json({
            success: true,
            data: {
                totalUsers,
                usersByRole,
                assignments: {
                    usersWithAssignments,
                    totalAssignments,
                    byStatus
                }
            }
        });
    } catch (error) {
        console.error('Error al obtener estadísticas de usuarios:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};

// Actualizar estado de dataset
const updateDatasetStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const dataset = await Dataset.findByIdAndUpdate(
            id,
            { status },
            { new: true, runValidators: true }
        );

        if (!dataset) {
            return res.status(404).json({
                success: false,
                message: 'Dataset no encontrado'
            });
        }

        res.json({
            success: true,
            message: 'Estado del dataset actualizado',
            dataset
        });
    } catch (error) {
        console.error('Error al actualizar dataset:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};

// Eliminar dataset
const deleteDataset = async (req, res) => {
    try {
        const { id } = req.params;

        const dataset = await Dataset.findByIdAndDelete(id);

        if (!dataset) {
            return res.status(404).json({
                success: false,
                message: 'Dataset no encontrado'
            });
        }

        // Eliminar referencias en usuarios
        await User.updateMany(
            { 'assignedDatasets.dataset': id },
            { $pull: { assignedDatasets: { dataset: id } } }
        );

        res.json({
            success: true,
            message: 'Dataset eliminado exitosamente'
        });
    } catch (error) {
        console.error('Error al eliminar dataset:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};

module.exports = {
    uploadDatasetFromCSV,
    uploadMultipleDatasetsFromCSV,
    getAllDatasets,
    updateDatasetStatus,
    deleteDataset,
    getAdminStats,
    getAllUsers,
    assignDatasetToUser,
    removeDatasetAssignment,
    updateUserRole,
    getUserStats
};
