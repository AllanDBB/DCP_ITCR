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
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
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
const mongoURI = process.env.MONGODB_URI;

mongoose.connect(mongoURI)
.then(() => {
  console.log('MongoDB conectado');
})
.catch((err) => {
  console.error('Error de conexión a MongoDB:', err);  process.exit(1);
});

// Importar rutas
const authRoutes = require('./routes/authRoutes');

// Usar rutas
app.use('/api/auth', authRoutes);

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
