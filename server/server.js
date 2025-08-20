require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');


const app = express();

// Permitir que Express confíe en el header X-Forwarded-For (necesario para proxies y rate-limit)
app.set('trust proxy', 1);

// Middleware de seguridad
app.use(helmet());

const allowedOrigins = [
  'http://localhost:3000',
  'http://203.161.47.109:3000',
  'https://dcp-itcr.space',
  'https://www.dcp-itcr.space',
  'https://backend.dcp-itcr.com'
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, origin);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// Middleware para forzar los headers CORS en todas las respuestas (depuración)
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  }
  // Log para depuración de CORS
  console.log('[CORS] Request:', {
    url: req.originalUrl,
    method: req.method,
    origin,
    'Access-Control-Allow-Origin': res.getHeader('Access-Control-Allow-Origin'),
    'Access-Control-Allow-Credentials': res.getHeader('Access-Control-Allow-Credentials')
  });
  // Responder a preflight OPTIONS
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});

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


