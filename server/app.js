
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import './config/firebase.js';
import admin from 'firebase-admin';

import authRoutes from './routes/auth.js';
import noteRoutes from './routes/notes.js';
import memeRoutes from './routes/memes.js';
import adminRoutes from './routes/admin.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Security & Robustness middleware
app.use(helmet({
  crossOriginResourcePolicy: false, // For local image serving
}));
app.use(compression());
app.use(morgan(NODE_ENV === 'production' ? 'combined' : 'dev'));

// CORS Configuration 
const allowedOrigins = [
    process.env.FRONTEND_URL?.replace(/\/$/, '').trim(),
    'http://localhost:5173',
    'http://localhost:3000',
    'https://studyhubnigam.netlify.app'
].filter(Boolean);

// Ensure we only have unique values
const uniqueAllowedOrigins = [...new Set(allowedOrigins)];

const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps, postman, or same-origin)
        if (!origin) return callback(null, true);
        
        // Remove trailing slash for comparison
        const normalizedOrigin = origin.replace(/\/$/, '');
        
        if (uniqueAllowedOrigins.some(ao => ao.replace(/\/$/, '') === normalizedOrigin) || NODE_ENV === 'development') {
            callback(null, true);
        } else {
            callback(new Error(`CORS error: Domain ${origin} is not allowed.`));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    optionsSuccessStatus: 200 // Some legacy browsers crash on 204
};
app.use(cors(corsOptions));
app.use(express.json());

// Serving Static Files (Careful: ephemeral on Vercel/Render)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/memes', memeRoutes);
app.use('/api/admin', adminRoutes);

// Health Check
app.get('/health', (req, res) => {
    res.status(200).json({ 
        status: 'UP', 
        timestamp: new Date().toISOString(),
        environment: NODE_ENV,
        firebase: admin.apps.length > 0 ? 'connected' : 'disconnected'
    });
});

app.get('/', (req, res) => {
  res.send('StudyHub API is running');
});

// 404 Handler
app.use((req, res) => {
    res.status(404).json({ message: 'Requested resource not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('--- SERVER ERROR ---');
  console.error('Time:', new Date().toISOString());
  console.error('URL:', req.url);
  console.error('Method:', req.method);
  
  if (NODE_ENV !== 'production') {
    if (err.stack) console.error(err.stack);
    else console.error('Error Object:', err);
  } else {
    console.error('Error Message:', err.message || 'An unexpected error occurred');
  }
  
  console.error('----------------------------');
  
  res.status(err.status || 500).json({ 
    message: 'Internal Server Error',
    details: NODE_ENV === 'production' ? 'An unexpected error occurred' : (err.message || 'No details available')
  });
});

app.listen(PORT, () => {
  console.log(`Server is running in ${NODE_ENV} mode on port ${PORT}`);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});



