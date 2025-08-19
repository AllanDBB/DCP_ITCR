require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');

const app = express();

// Middleware de seguridad
app.use(helmet());
app.use(cors({
  origin: [
    process.env.CLIENT_URL || 'http://localhost:3000',
    'https://dcp-itcr-ashen.vercel.app'
  ],
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo 100 requests por ventana
  message: {
    success: false,
    message: 'Demasiadas solicitudes, intente de nuevo más tarde'
  }
});
app.use('/api/', limiter);

// Middleware básico
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Conexión a MongoDB
const mongoURI = 'mongodb+srv://DCPUser:m0bex47d7rLeGpTj@cluster0.mmx82lq.mongodb.net/DCP-ITCR?retryWrites=true&w=majority&appName=Cluster0';

console.log('Intentando conectar a MongoDB con URI:', mongoURI);

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ MongoDB conectado exitosamente');
  console.log('Base de datos:', mongoose.connection.name);
  console.log('Host:', mongoose.connection.host);
  console.log('Puerto:', mongoose.connection.port);
})
.catch((err) => {
  console.error('❌ Error de conexión a MongoDB:', err.message);
  console.log('💡 Asegúrate de que MongoDB esté instalado y corriendo');
  console.log('💡 O usa MongoDB Atlas: https://www.mongodb.com/atlas');
  
  // En desarrollo, no salir del proceso para permitir debugging
  if (process.env.NODE_ENV === 'production') {
    process.exit(1);
  }
});

// Importar rutas
const authRoutes = require('./routes/authRoutes');
const datasetRoutes = require('./routes/datasetRoutes');
const labelRoutes = require('./routes/labelRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Usar rutas
app.use('/api/auth', authRoutes);
app.use('/api/datasets', datasetRoutes);
app.use('/api/labels', labelRoutes);
app.use('/api/admin', adminRoutes);

// Ruta de ping
app.get('/ping', (req, res) => {
  res.json({ 
    status: 'success',
    message: 'pong',
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'conectada' : 'desconectada'
  });
});

// Ruta principal
app.get('/', (req, res) => {
  res.json({ 
    status: 'success',
    message: 'Servidor DCP-ITCR funcionando',
    endpoints: {
      ping: '/ping',
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        profile: 'GET /api/auth/profile',
        logout: 'POST /api/auth/logout',
        verify: 'GET /api/auth/verify'
      }
    }
  });
});

// Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
